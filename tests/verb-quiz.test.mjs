import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('1. verbs.json contains 26 conjugable verbs and 20 objects without conjugation', () => {
  const verbs = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'verbs.json'), 'utf8'));
  const conjugable = verbs.filter((v) => Array.isArray(v.conjugation) && v.conjugation.length === 6);
  const objects = verbs.filter((v) => v.category === 'objects');
  assert.equal(conjugable.length, 26);
  assert.equal(objects.length, 20);
});

test('2. index.html filters conjugable verbs for quiz & sidebar, wraps header, includes smart accent bar and 10-question progress bar', () => {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  assert.match(html, /function getConjugableVerbs\(\)/);
  assert.match(html, /const pool = getConjugableVerbs\(\);/);
  assert.doesNotMatch(html, /tu \+ s'habiller = \?/);
  assert.match(html, /id="accent-helper-bar"/);
  assert.match(html, /function renderAccentHelper\(/);
  assert.match(html, /function insertQuizChar\(/);
  assert.match(html, /header\s*\{[^}]*flex-wrap:\s*wrap;/s);
  assert.match(html, /const QUIZ_TOTAL_QUESTIONS = 10;/);
  assert.match(html, /id="quiz-progress-label"/);
  assert.match(html, /id="quiz-progress-fill"/);
  assert.match(html, /function updateQuizProgressUI\(/);
  assert.match(html, /function finishQuizRound\(/);
});

test('3. Footer displays consistent app version and GitHub source link across shared switcher and standalone pages', () => {
  const version = fs.readFileSync(path.join(ROOT_DIR, 'VERSION'), 'utf8').trim();
  assert.match(version, /^\d+\.\d+\.\d+$/);

  const profileJs = fs.readFileSync(path.join(ROOT_DIR, 'profile-switcher.js'), 'utf8');
  assert.ok(profileJs.includes(`APP_VERSION = '${version}'`), 'profile-switcher.js must match VERSION');
  assert.ok(profileJs.includes('https://github.com/palladius/ale-french'), 'profile-switcher.js footer must link to GitHub');

  for (const page of ['puffin-cards.html', 'ring.html']) {
    const content = fs.readFileSync(path.join(ROOT_DIR, page), 'utf8');
    assert.ok(content.includes(`v${version}`), `${page} footer must display v${version}`);
    assert.ok(content.includes('https://github.com/palladius/ale-french'), `${page} footer must link to GitHub`);
  }
});
