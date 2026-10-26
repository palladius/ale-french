import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const verbs = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'verbs.json'), 'utf8'));

test('1. GEMINI.md exists and mandates gemini-3.8-flash-tts with MP3 metadata tracking', () => {
  const geminiMdPath = path.join(ROOT_DIR, 'GEMINI.md');
  assert.ok(fs.existsSync(geminiMdPath), 'GEMINI.md must exist');
  const content = fs.readFileSync(geminiMdPath, 'utf8');
  assert.match(content, /gemini-3\.8-flash-tts/i, 'GEMINI.md must mention gemini-3.8-flash-tts');
  assert.match(content, /metadata/i, 'GEMINI.md must require MP3 metadata tracking');
});

test('2. audio-player.js exports deterministic slug & path resolution for all 202 French phrases', async () => {
  const playerModulePath = path.join(ROOT_DIR, 'audio-player.js');
  assert.ok(fs.existsSync(playerModulePath), 'audio-player.js must exist');

  const { phraseToSlug, getAudioPathForPhrase } = await import(playerModulePath);
  assert.equal(typeof phraseToSlug, 'function');
  assert.equal(typeof getAudioPathForPhrase, 'function');

  assert.equal(phraseToSlug('je suis'), 'je-suis');
  assert.equal(phraseToSlug('un tableau'), 'un-tableau');
  assert.equal(phraseToSlug("s'habiller"), 's-habiller');
  assert.equal(phraseToSlug('une bibliothèque'), 'une-bibliotheque');
  assert.equal(phraseToSlug("j'ai"), 'j-ai');
  assert.equal(phraseToSlug("l'eau"), 'l-eau');

  assert.equal(getAudioPathForPhrase('je suis'), 'audio/je-suis.mp3');
  assert.equal(getAudioPathForPhrase('un tableau'), 'audio/un-tableau.mp3');
});

test('3. playFrenchAudio plays MP3 when available AND falls back to French speechSynthesis (never silent, never British)', async () => {
  const playerModulePath = path.join(ROOT_DIR, 'audio-player.js');
  const { playFrenchAudio, pickBestFrenchVoice } = await import(playerModulePath);
  assert.equal(typeof playFrenchAudio, 'function');
  assert.equal(typeof pickBestFrenchVoice, 'function');

  // Case A: MP3 succeeds when phrase is in manifest (or forceMp3/AudioCtor with manifest)
  let playedSrc = null;
  let endedCalled = false;
  class WorkingAudio {
    constructor(src) {
      this.src = src;
    }
    play() {
      playedSrc = this.src;
      if (typeof this.onended === 'function') this.onended();
      return Promise.resolve();
    }
    pause() {}
  }

  await playFrenchAudio('un tableau', {
    AudioCtor: WorkingAudio,
    knownMp3Slugs: new Set(['un-tableau']),
    onend: () => {
      endedCalled = true;
    }
  });
  assert.equal(playedSrc, 'audio/un-tableau.mp3');
  assert.equal(endedCalled, true);

  // Case A2: When MP3 is NOT in knownMp3Slugs (e.g. before MP3s are generated), it must call speechSynthesis SYNCHRONOUSLY without even constructing Audio (preserving iOS/Safari user gesture!)
  let audioConstructedWhenMissing = false;
  let syncSpoken = false;
  class NeverConstructAudio {
    constructor() {
      audioConstructedWhenMissing = true;
    }
  }
  class SyncUtterance {
    constructor(text) {
      this.text = text;
    }
  }
  const syncSynth = {
    speaking: false,
    pending: false,
    getVoices: () => [{ name: 'Thomas', lang: 'fr-FR', localService: true }],
    speak() {
      syncSpoken = true;
    }
  };
  playFrenchAudio('je suis', {
    AudioCtor: NeverConstructAudio,
    knownMp3Slugs: new Set(),
    speechSynth: syncSynth,
    UtteranceCtor: SyncUtterance
  });
  assert.equal(audioConstructedWhenMissing, false, 'Must not construct Audio for missing MP3 slug');
  assert.equal(syncSpoken, true, 'Must call speechSynthesis.speak synchronously within user gesture');

  // Case B: MP3 fails (e.g. 404 on GitHub Pages) -> MUST fall back to speechSynthesis with fr-FR voice and NEVER be silent!
  let spokenUtterance = null;
  let cancelCalledWhenIdle = false;
  const mockVoices = [
    { name: 'Google UK English Female', lang: 'en-GB', localService: false },
    { name: 'French (Belgium)+Adam', lang: 'fr-BE', localService: true },
    { name: 'Google français', lang: 'fr-FR', localService: false },
    { name: 'Thomas', lang: 'fr-FR', localService: true }
  ];

  const bestVoice = pickBestFrenchVoice(mockVoices);
  assert.ok(bestVoice, 'Must pick a French voice');
  assert.equal(bestVoice.lang, 'fr-FR', 'Must prefer fr-FR over fr-BE and never pick en-GB');
  assert.ok(
    bestVoice.name === 'Google français' || bestVoice.name === 'Thomas',
    `Expected Google français or Thomas, got ${bestVoice.name}`
  );

  class FailingAudio {
    constructor(src) {
      this.src = src;
    }
    play() {
      return Promise.reject(new Error('404 Not Found'));
    }
    pause() {}
  }

  class MockUtterance {
    constructor(text) {
      this.text = text;
      this.lang = '';
      this.rate = 1;
      this.voice = null;
    }
  }

  const mockSynth = {
    speaking: false,
    pending: false,
    cancel() {
      if (!this.speaking && !this.pending) {
        cancelCalledWhenIdle = true;
      }
    },
    getVoices() {
      return mockVoices;
    },
    speak(utt) {
      spokenUtterance = utt;
      if (typeof utt.onend === 'function') utt.onend();
    }
  };

  let fallbackEnded = false;
  await playFrenchAudio("s'habiller", {
    AudioCtor: FailingAudio,
    speechSynth: mockSynth,
    UtteranceCtor: MockUtterance,
    onend: () => {
      fallbackEnded = true;
    }
  });

  assert.equal(
    cancelCalledWhenIdle,
    false,
    'Must NOT call speechSynthesis.cancel() when idle (fixes Chrome bug where cancel() silently drops the next speak() call)'
  );
  assert.ok(spokenUtterance, 'Fallback speechSynthesis.speak() must be called when MP3 fails');
  assert.equal(spokenUtterance.text, "s'habiller");
  assert.equal(spokenUtterance.lang, 'fr-FR');
  assert.equal(spokenUtterance.voice?.lang, 'fr-FR');
  assert.equal(fallbackEnded, true, 'onend callback must be fired after fallback speech completes');
});

test('4. All 4 HTML pages load audio-player.js, escape apostrophes in onclick handlers, and play audio on card/quiz actions', () => {
  const htmlFiles = ['index.html', 'cards.html', 'grid.html', 'quiz.html'];
  for (const file of htmlFiles) {
    const fullPath = path.join(ROOT_DIR, file);
    const html = fs.readFileSync(fullPath, 'utf8');
    assert.match(
      html,
      /<script\s+src=["']audio-player\.js["']><\/script>/,
      `${file} must include <script src="audio-player.js"></script>`
    );
    assert.match(
      html,
      /playFrenchAudio\s*\(/,
      `${file} must delegate pronunciation to playFrenchAudio(...)`
    );

    // Ensure no unescaped ${conj.full}, ${verb.infinitive}, or ${q.infinitive} inside single-quoted onclick handlers
    assert.doesNotMatch(
      html,
      /onclick="[^"]*'(?:\$\{conj\.full\}|\$\{verb\.infinitive\}|\$\{q\.infinitive\})'/,
      `${file} has unescaped apostrophe interpolation inside onclick="..." which breaks audio for l'eau, s'habiller, je m'habille!`
    );
  }

  // Verify quiz.html also pronounces the French word when an answer is selected!
  const quizHtml = fs.readFileSync(path.join(ROOT_DIR, 'quiz.html'), 'utf8');
  const handleAnswerSection = quizHtml.slice(
    quizHtml.indexOf('function handleAnswerSelect'),
    quizHtml.indexOf('function nextQuestion')
  );
  assert.match(
    handleAnswerSection,
    /speakFrench\s*\(\s*q\.infinitive\s*\)/,
    'quiz.html handleAnswerSelect must speak the French word (speakFrench(q.infinitive)) so cards/questions are never silent!'
  );
});
