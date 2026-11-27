#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { germanPhraseToSlug } from '../audio-player.js';

const require = createRequire(import.meta.url);
const { GERMAN_NOUNS } = require('../german-data.js');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT_DIR, 'audio', 'de');
const MANIFEST_PATH = path.join(AUDIO_DIR, 'manifest.json');

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const MODEL = 'gemini-3.8-flash-tts';
const DEFAULT_VOICE = process.env.GEMINI_TTS_VOICE || 'Aoede';
const STYLE_PROMPT =
  'Warm, clear, articulate native German primary school teacher (de-DE / Hochdeutsch) pronouncing German nouns and articles slowly, distinctly, and naturally for an 8-year-old child learning German';

function hasGeminiMetadata(mp3Path) {
  if (!fs.existsSync(mp3Path)) return false;
  const stat = fs.statSync(mp3Path);
  if (stat.size <= 1000) return false;
  const buf = fs.readFileSync(mp3Path);
  const text = buf.toString('latin1').toLowerCase();
  return text.includes('created with gemini 3.8') || text.includes('created with gemini-3.8-flash-tts');
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

async function synthesizePhrase(phrase, voiceName) {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY or GOOGLE_API_KEY is required.');
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const payload = {
    contents: [
      {
        parts: [
          {
            text: phrase,
            speech_metadata: { style: STYLE_PROMPT }
          }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } }
      }
    }
  };

  let lastErr = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 250)}`);
      }
      const data = await res.json();
      const part = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
      if (!part) throw new Error('No audio inlineData in response');
      return {
        buffer: Buffer.from(part.inlineData.data, 'base64'),
        mimeType: part.inlineData.mimeType || 'audio/wav'
      };
    } catch (err) {
      lastErr = err;
      const delayMs = attempt * 1200;
      console.warn(`  [Retry ${attempt}/4] "${phrase}": ${err.message}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

function convertToMp3WithMetadata(rawBuffer, mimeType, mp3Path, phrase, voiceName) {
  const tmpWav = `${mp3Path}.tmp.wav`;
  fs.writeFileSync(tmpWav, rawBuffer);
  try {
    const isRawPcm = mimeType.includes('l16') || mimeType.includes('pcm');
    const inputArgs = isRawPcm
      ? ['-f', 's16le', '-ar', '24000', '-ac', '1', '-i', tmpWav]
      : ['-i', tmpWav];
    const commentTag = `Created with gemini 3.8 (${MODEL}, voice=${voiceName})`;
    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-v',
        'error',
        ...inputArgs,
        '-codec:a',
        'libmp3lame',
        '-b:a',
        '64k',
        '-metadata',
        `title=${phrase}`,
        '-metadata',
        `artist=${MODEL}`,
        '-metadata',
        `comment=${commentTag}`,
        mp3Path
      ],
      { stdio: 'inherit' }
    );
  } finally {
    if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
  }
}

async function main() {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const phrasesMap = new Map();
  for (const n of GERMAN_NOUNS) {
    const sg = `${n.article} ${n.singular}`;
    const pl = `die ${n.plural}`;
    phrasesMap.set(germanPhraseToSlug(sg), sg);
    phrasesMap.set(germanPhraseToSlug(pl), pl);
  }

  let manifest = { model: MODEL, voiceName: DEFAULT_VOICE, lang: 'de-DE', clips: {} };
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (_) {}
  }

  const entries = [...phrasesMap.entries()];
  let skipped = 0;
  let generated = 0;
  const CONCURRENCY = 5;
  let idx = 0;

  async function worker() {
    while (idx < entries.length) {
      const [slug, phrase] = entries[idx++];
      const mp3Path = path.join(AUDIO_DIR, `${slug}.mp3`);
      if (hasGeminiMetadata(mp3Path)) {
        skipped++;
        if (!manifest.clips[slug]) {
          manifest.clips[slug] = {
            slug,
            text: phrase,
            file: `audio/de/${slug}.mp3`,
            model: MODEL,
            voiceName: DEFAULT_VOICE,
            sha256: sha256File(mp3Path)
          };
        }
        continue;
      }
      const { buffer, mimeType } = await synthesizePhrase(phrase, DEFAULT_VOICE);
      convertToMp3WithMetadata(buffer, mimeType, mp3Path, phrase, DEFAULT_VOICE);
      manifest.clips[slug] = {
        slug,
        text: phrase,
        file: `audio/de/${slug}.mp3`,
        model: MODEL,
        voiceName: DEFAULT_VOICE,
        createdAt: new Date().toISOString(),
        sha256: sha256File(mp3Path)
      };
      generated++;
      if (generated % 10 === 0 || generated === entries.length) {
        console.log(`  🔊 Generated ${generated} German MP3s so far (${phrase})...`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  manifest.updatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`✅ German TTS done: ${generated} generated, ${skipped} skipped (total ${entries.length}).`);
}

main().catch((err) => {
  console.error('❌ German TTS error:', err);
  process.exit(1);
});
