#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { phraseToSlug, getAudioPathForPhrase } from '../audio-player.js';

const require = createRequire(import.meta.url);
const SEBY_DATA = require('../seby-data.js');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT_DIR, 'audio');
const MANIFEST_PATH = path.join(AUDIO_DIR, 'manifest.json');

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const MODEL = 'gemini-3.8-flash-tts';
const DEFAULT_VOICE = process.env.GEMINI_TTS_VOICE || 'Aoede';
const STYLE_PROMPT =
  'Warm, clear, articulate native French primary school teacher from Paris (fr-FR) pronouncing French words slowly, distinctly, and naturally for an 8-year-old child learning French';

function hasGeminiMetadata(mp3Path) {
  if (!fs.existsSync(mp3Path)) return false;
  const stat = fs.statSync(mp3Path);
  if (stat.size <= 1000) return false;
  const buf = fs.readFileSync(mp3Path);
  const text = buf.toString('latin1').toLowerCase();
  return text.includes('created with gemini 3.8') || text.includes('created with gemini-3.8-flash-tts');
}

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function synthesizePhrase(phrase, voiceName) {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY or GOOGLE_API_KEY environment variable is required to generate new audio.');
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const payload = {
    contents: [
      {
        parts: [
          {
            text: phrase,
            speech_metadata: {
              style: STYLE_PROMPT
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName
          }
        }
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
        throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 300)}`);
      }
      const data = await res.json();
      const part = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
      if (!part) {
        throw new Error(`No audio inlineData in response: ${JSON.stringify(data).slice(0, 300)}`);
      }
      return {
        buffer: Buffer.from(part.inlineData.data, 'base64'),
        mimeType: part.inlineData.mimeType || 'audio/wav'
      };
    } catch (err) {
      lastErr = err;
      if (err.cause?.code === 'EAI_AGAIN' || err.cause?.code === 'ENOTFOUND') {
        throw err;
      }
      const delayMs = attempt * 1500;
      console.warn(`  [Retry ${attempt}/4] "${phrase}": ${err.message}. Waiting ${delayMs}ms...`);
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
        '-af',
        'silenceremove=stop_periods=-1:stop_duration=0.35:stop_threshold=-45dB',
        '-codec:a',
        'libmp3lame',
        '-qscale:a',
        '4',
        '-id3v2_version',
        '3',
        '-metadata',
        `title=${phrase}`,
        '-metadata',
        `artist=${MODEL}`,
        '-metadata',
        'album=Ale French',
        '-metadata',
        'language=fra',
        '-metadata',
        `comment=${commentTag}`,
        mp3Path
      ],
      { stdio: 'pipe' }
    );
  } finally {
    if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
  }
}

async function main() {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const verbs = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'verbs.json'), 'utf8'));
  const phrases = [];
  const seen = new Set();

  function addPhrase(p) {
    if (p && !seen.has(p)) {
      seen.add(p);
      phrases.push(p);
    }
  }

  // 1. P0: Seby's 13 numbers (0..12) + all Seby A1 vocabulary first!
  if (SEBY_DATA) {
    for (const n of SEBY_DATA.nombres || []) addPhrase(n.fr);
    for (const s of SEBY_DATA.salutations || []) addPhrase(s.fr);
    for (const c of SEBY_DATA.couleurs || []) addPhrase(c.fr);
    for (const f of SEBY_DATA.formes || []) addPhrase(f.fr);
  }

  // 2. Prioritize "je suis", "un tableau", and family/identity phrases ("Alessandro", "Sebastian", "mon papa")
  for (const p of ['je suis', 'un tableau', 'Alessandro', 'Sebastian', 'mon papa', 'Fait avec amour par mon papa']) {
    addPhrase(p);
  }

  // 3. All Ale verbs, school objects, and conjugations
  for (const item of verbs) {
    addPhrase(item.infinitive);
    if (Array.isArray(item.conjugation)) {
      for (const conj of item.conjugation) {
        addPhrase(conj.full);
      }
    }
  }

  let manifest = {
    generator: MODEL,
    note: 'Created with gemini 3.8 (gemini-3.8-flash-tts)',
    updatedAt: new Date().toISOString(),
    clips: {}
  };

  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      if (existing && typeof existing.clips === 'object') {
        manifest = existing;
      }
    } catch (_) {}
  }

  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const maxItems = limitArg ? parseInt(limitArg.split('=')[1], 10) : phrases.length;
  const forceAll = process.argv.includes('--force-all');
  const forceValues = process.argv
    .filter((a) => a.startsWith('--force='))
    .map((a) => a.slice('--force='.length).trim().toLowerCase());
  const verboseSkip = process.argv.includes('--verbose');
  const concurrency = parseInt(process.env.TTS_CONCURRENCY || '4', 10);

  const toProcess = phrases.slice(0, maxItems);
  let skipped = 0;
  let generated = 0;
  let manifestChanged = false;

  console.log(`🎙️ Checking ${toProcess.length} French phrases (model=${MODEL}, voice=${DEFAULT_VOICE}, concurrency=${concurrency})...`);

  let cursor = 0;
  async function worker() {
    while (cursor < toProcess.length) {
      const idx = cursor++;
      const phrase = toProcess[idx];
      const slug = phraseToSlug(phrase);
      const relFile = getAudioPathForPhrase(phrase);
      const absFile = path.join(ROOT_DIR, relFile);

      const isForced =
        forceAll ||
        forceValues.includes(phrase.toLowerCase()) ||
        forceValues.includes(slug);

      if (!isForced && hasGeminiMetadata(absFile)) {
        skipped++;
        if (verboseSkip) {
          console.log(`  ⏭️ [${idx + 1}/${toProcess.length}] Già c'è ("${phrase}" -> ${relFile}), non la rigenero`);
        }
        if (!manifest.clips[phrase] || manifest.clips[phrase].slug !== slug) {
          manifestChanged = true;
          manifest.clips[phrase] = {
            slug,
            text: phrase,
            file: relFile,
            model: MODEL,
            voiceName: manifest.clips[phrase]?.voiceName || DEFAULT_VOICE,
            comment: 'Created with gemini 3.8 (gemini-3.8-flash-tts)',
            sha256: sha256File(absFile),
            createdAt: manifest.clips[phrase]?.createdAt || new Date().toISOString()
          };
        }
        continue;
      }

      const { buffer, mimeType } = await synthesizePhrase(phrase, DEFAULT_VOICE);
      convertToMp3WithMetadata(buffer, mimeType, absFile, phrase, DEFAULT_VOICE);

      generated++;
      manifestChanged = true;
      manifest.clips[phrase] = {
        slug,
        text: phrase,
        file: relFile,
        model: MODEL,
        voiceName: DEFAULT_VOICE,
        comment: 'Created with gemini 3.8 (gemini-3.8-flash-tts)',
        sha256: sha256File(absFile),
        createdAt: new Date().toISOString()
      };

      manifest.updatedAt = new Date().toISOString();
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

      console.log(`  ✅ [${idx + 1}/${toProcess.length}] Generated "${phrase}" -> ${relFile}`);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, toProcess.length) }, () => worker());
  await Promise.all(workers);

  if (manifestChanged) {
    manifest.updatedAt = new Date().toISOString();
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  }
  console.log(
    `🎉 Done! Generated: ${generated}, Skipped (già c'è, non la rigenero): ${skipped}, Total in manifest: ${Object.keys(manifest.clips).length}`
  );
}

main().catch((err) => {
  console.error('Fatal error in generate-tts.mjs:', err);
  process.exit(1);
});
