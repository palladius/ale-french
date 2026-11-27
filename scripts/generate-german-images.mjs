#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { GERMAN_NOUNS } = require('../german-data.js');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT_DIR, 'images', 'de');

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview'];

const SUBJECT_PROMPTS = {
  'der-drache': {
    refImage: 'images/avatar-ale.png',
    prompt: 'The cheerful 8-year-old boy from the reference image (keep his exact face, hair, and joyful expression) happily riding on top of a majestic, friendly emerald-green storybook dragon soaring through soft sunlit clouds. Cute Pixar-inspired children\'s book illustration, vibrant friendly colors, centered subject, NO text, NO letters, NO words, NO labels.'
  },
  'der-papageientaucher': {
    prompt: 'A joyful friendly Italian father (Papino Riccardo) in his 40s with thick dark-brown salt-and-pepper hair and a neatly trimmed dark-brown salt-and-pepper beard (NEVER white hair), smiling warmly while sitting on a grassy coastal cliff surrounded by adorable colorful Atlantic puffins (Papageientaucher) with bright orange-striped beaks, one puffin perched playfully on his shoulder. Cute Pixar-inspired children\'s book illustration, vibrant friendly colors, centered subject, NO text, NO letters, NO words, NO labels.'
  },
  'der-apfel': 'A shiny crisp red apple with a little green leaf',
  'das-haus': 'A cozy Swiss-style storybook house with a red roof and warm glowing windows',
  'die-maus': 'A cute cheerful little grey mouse holding a tiny piece of cheese',
  'der-igel': 'An adorable smiling little hedgehog walking on soft grass',
  'das-blatt': 'A vibrant green autumn-kissed oak leaf with fine veins',
  'die-wolke': 'A fluffy happy white cloud floating in a soft blue sky',
  'der-kuerbis': 'A cheerful round orange pumpkin with a curly green vine',
  'das-kind': 'A happy 8-year-old boy with a colorful school backpack waving cheerfully',
  'das-pferd': 'A friendly brown horse with a flowing mane in a sunny meadow',
  'der-loewe': 'A cute friendly golden lion with a big fluffy mane smiling',
  'der-schrank': 'A charming painted wooden wardrobe cupboard slightly open',
  'der-uhu': 'A majestic yet adorable Eurasian eagle-owl (Uhu) with big orange eyes and ear tufts perched on a pine branch',
  'das-auto': 'A cheerful bright red compact cartoon car on a clean sunny road',
  'der-vogel': 'A colorful little blue and yellow songbird perched on a twig singing',
  'der-tiger': 'A cute friendly orange tiger cub with black stripes smiling',
  'der-wal': 'A friendly blue whale spouting a little fountain of water in a bright blue sea',
  'die-schnecke': 'A cute smiling garden snail with a colorful spiral shell',
  'das-flugzeug': 'A cheerful blue and white passenger airplane flying among tiny clouds',
  'der-schmetterling': 'A vibrant colorful butterfly with patterned wings',
  'die-giraffe': 'A friendly tall giraffe with warm spots smiling gently',
  'der-frosch': 'A cute cheerful green tree frog sitting on a lily pad',
  'die-schildkroete': 'A cute friendly green turtle with a patterned shell',
  'die-eule': 'A cute little brown barn owl with big bright eyes perched on a branch',
  'das-zebra': 'A cute friendly zebra with crisp black and white stripes smiling',
  'der-delfin': 'A playful smiling bottlenose dolphin jumping out of sparkling blue water',
  'der-clownfisch': 'A bright orange and white striped clownfish swimming happily near coral'
};

async function generateImageBuffer(prompt, refImagePath) {
  if (!API_KEY) throw new Error('GEMINI_API_KEY is required');
  let lastErr = null;
  const parts = [];
  if (refImagePath && fs.existsSync(refImagePath)) {
    const ext = path.extname(refImagePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    parts.push({
      inlineData: {
        mimeType,
        data: fs.readFileSync(refImagePath).toString('base64')
      }
    });
  }
  parts.push({ text: prompt });

  for (const model of IMAGE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    const payload = {
      contents: [{ parts }],
      generationConfig: { responseModalities: ['IMAGE'] }
    };
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`${model} HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const data = await res.json();
      const part = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
      if (!part) throw new Error(`${model} returned no image`);
      return {
        buffer: Buffer.from(part.inlineData.data, 'base64'),
        mimeType: part.inlineData.mimeType || 'image/png'
      };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

function saveAsJpg(buffer, outPath) {
  const tmpFile = `${outPath}.tmp.bin`;
  fs.writeFileSync(tmpFile, buffer);
  try {
    execFileSync(
      'ffmpeg',
      ['-y', '-v', 'error', '-i', tmpFile, '-vf', 'scale=512:512:force_original_aspect_ratio=increase,crop=512:512', '-q:v', '4', outPath],
      { stdio: 'inherit' }
    );
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}

async function main() {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const targets = GERMAN_NOUNS.filter((n) => n.image && SUBJECT_PROMPTS[n.id]);
  let skipped = 0;
  let generated = 0;
  let idx = 0;
  const CONCURRENCY = 4;

  async function worker() {
    while (idx < targets.length) {
      const noun = targets[idx++];
      const outPath = path.join(ROOT_DIR, noun.image);
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 5000) {
        skipped++;
        continue;
      }
      const entry = SUBJECT_PROMPTS[noun.id];
      const prompt =
        typeof entry === 'string'
          ? `Cute Pixar-inspired children's book illustration, vibrant friendly colors, soft clean light cream background, centered subject, NO text, NO letters, NO words, NO labels: ${entry}.`
          : entry.prompt;
      const refPath = typeof entry === 'object' && entry.refImage ? path.join(ROOT_DIR, entry.refImage) : null;
      const { buffer } = await generateImageBuffer(prompt, refPath);
      saveAsJpg(buffer, outPath);
      generated++;
      console.log(`  🍌 Generated ${noun.image} (${generated}/${targets.length - skipped})`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`✅ Nano Banana images done: ${generated} generated, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error('❌ Image generation error:', err);
  process.exit(1);
});
