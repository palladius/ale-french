import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const GERMAN_DATA = require('../german-data.js');
const { germanPhraseToSlug } = require('../audio-player.js');

test('1. german-data.js contains all worksheet nouns plus der Uhu and das Auto with valid articles and categories', () => {
  const { GERMAN_NOUNS, GERMAN_CATEGORIES, GERMAN_ARTICLES } = GERMAN_DATA;
  assert.ok(GERMAN_NOUNS.length >= 45, `Expected >= 45 German nouns, got ${GERMAN_NOUNS.length}`);

  const ids = new Set(GERMAN_NOUNS.map((n) => n.id));
  for (const required of [
    'der-apfel', 'das-haus', 'die-maus', 'der-igel', 'das-blatt', 'die-wolke',
    'der-kuerbis', 'das-kind', 'das-pferd', 'der-loewe', 'der-schrank', 'der-fuss', 'die-ampel',
    'der-uhu', 'das-auto', 'der-vogel', 'die-schildkroete', 'die-eule',
    'der-drache', 'der-papageientaucher'
  ]) {
    assert.ok(ids.has(required), `Missing required noun: ${required}`);
  }

  for (const n of GERMAN_NOUNS) {
    assert.ok(GERMAN_ARTICLES[n.article], `Invalid article ${n.article} for ${n.id}`);
    assert.ok(GERMAN_CATEGORIES[n.category], `Invalid category ${n.category} for ${n.id}`);
    assert.ok(n.singular && n.plural, `Missing singular/plural for ${n.id}`);
  }
});

test('2. tokenizeGermanPhonics correctly identifies Vokale, Umlaute, Zwielaute, and Konsonanten', () => {
  const { tokenizeGermanPhonics } = GERMAN_DATA;

  const eule = tokenizeGermanPhonics('Eule');
  assert.equal(eule[0].text, 'Eu');
  assert.equal(eule[0].type, 'zwielaut');

  const maus = tokenizeGermanPhonics('Maus');
  assert.ok(maus.some((t) => t.text === 'au' && t.type === 'zwielaut'));

  const schild = tokenizeGermanPhonics('Schildkröte');
  assert.ok(schild.some((t) => t.text === 'ö' && t.type === 'umlaut'));
});

test('3. evaluateGermanTyping enforces Großschreibung, Umlaut/ß, and accepts singular/plural forms', () => {
  const { GERMAN_NOUNS, evaluateGermanTyping } = GERMAN_DATA;
  const vogel = GERMAN_NOUNS.find((n) => n.id === 'der-vogel');
  const haus = GERMAN_NOUNS.find((n) => n.id === 'das-haus');
  const wolke = GERMAN_NOUNS.find((n) => n.id === 'die-wolke');

  assert.equal(evaluateGermanTyping('Vogel', vogel, 'singular').ok, true);
  assert.equal(evaluateGermanTyping('der Vogel', vogel, 'singular').ok, true);

  const lowerRes = evaluateGermanTyping('wolke', wolke, 'singular');
  assert.equal(lowerRes.ok, false);
  assert.equal(lowerRes.reason, 'capitalization');

  assert.equal(evaluateGermanTyping('Häuser', haus, 'plural').ok, true);
  assert.equal(evaluateGermanTyping('viele Häuser', haus, 'plural').ok, true);
  assert.equal(evaluateGermanTyping('die Häuser', haus, 'plural').ok, true);

  const noUmlaut = evaluateGermanTyping('Hauser', haus, 'plural');
  assert.equal(noUmlaut.ok, false);
  assert.equal(noUmlaut.reason, 'umlaut');
});

test('4. All Nano Banana German illustrations exist in images/de/', () => {
  const illustrated = GERMAN_DATA.GERMAN_NOUNS.filter((n) => Boolean(n.image));
  assert.ok(illustrated.length >= 20, `Expected >= 20 illustrated nouns, got ${illustrated.length}`);
  for (const n of illustrated) {
    const imgPath = path.join(ROOT_DIR, n.image);
    assert.ok(fs.existsSync(imgPath), `Missing image ${n.image}`);
    assert.ok(fs.statSync(imgPath).size > 5000, `Image ${n.image} is unexpectedly small`);
  }
});

test('5. All German nouns (singular & plural) have static gemini-3.8-flash-tts MP3s with ID3 metadata', () => {
  const manifestPath = path.join(ROOT_DIR, 'audio', 'de', 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'audio/de/manifest.json must exist');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.model, 'gemini-3.8-flash-tts');

  for (const n of GERMAN_DATA.GERMAN_NOUNS) {
    for (const phrase of [`${n.article} ${n.singular}`, `die ${n.plural}`]) {
      const slug = germanPhraseToSlug(phrase);
      const mp3Path = path.join(ROOT_DIR, 'audio', 'de', `${slug}.mp3`);
      assert.ok(fs.existsSync(mp3Path), `Missing German MP3 for "${phrase}" (${mp3Path})`);
      const raw = fs.readFileSync(mp3Path).toString('latin1').toLowerCase();
      assert.ok(
        raw.includes('created with gemini 3.8') || raw.includes('gemini-3.8-flash-tts'),
        `Missing gemini-3.8-flash-tts ID3 metadata in ${mp3Path}`
      );
      assert.ok(manifest.clips[slug], `Missing manifest entry for "${phrase}" (${slug})`);
    }
  }
});

test('6. german.html integrates shared scripts, contextual nav, top-left FR/DE slider, and right-side Ring button', () => {
  const germanHtml = fs.readFileSync(path.join(ROOT_DIR, 'german.html'), 'utf8');
  for (const reqScript of ['audio-player.js', 'telemetry.js', 'profile-switcher.js', 'german-data.js', 'puffin-login.js']) {
    assert.ok(germanHtml.includes(reqScript), `german.html must load ${reqScript}`);
  }
  assert.ok(germanHtml.includes('umlaut-pad'), 'german.html must include clickable Umlaut pad');
  assert.ok(germanHtml.includes('id="germanNavTabs"'), 'german.html must render contextual German nav tabs');

  for (const page of ['index.html', 'cards.html', 'grid.html', 'quiz.html', 'seby.html']) {
    const html = fs.readFileSync(path.join(ROOT_DIR, page), 'utf8');
    assert.ok(html.includes('profile-switcher.js'), `${page} must load profile-switcher.js for the top-left FR/DE slider`);
    assert.ok(!html.includes('href="ring.html"'), `${page} should not keep Ring inside center nav-tabs (moved right of login)`);
  }

  const switcherJs = fs.readFileSync(path.join(ROOT_DIR, 'profile-switcher.js'), 'utf8');
  const switcherCss = fs.readFileSync(path.join(ROOT_DIR, 'profile-switcher.css'), 'utf8');
  const puffinJs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'puffin-login.js'), 'utf8');
  assert.ok(switcherJs.includes('ensureLangSlider'), 'profile-switcher.js must inject the top-left FR/DE sliding switcher');
  assert.ok(switcherJs.includes('upgradeNavIcons'), 'profile-switcher.js must upgrade header nav tabs to monochrome SVG icons');
  assert.ok(switcherCss.includes('.lang-slider-thumb'), 'profile-switcher.css must style the sliding language switcher');
  assert.ok(switcherCss.includes('.nav-svg-icon'), 'profile-switcher.css must style monochrome SVG nav icons');
  assert.ok(puffinJs.includes('puffin-quick-group'), 'src/puffin-login.js must group trophy/cards/ring in a unified pill');
});
