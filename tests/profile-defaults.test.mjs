import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('1. profile-switcher.js defines smart defaults for Seby and Ale', () => {
  const profileJs = fs.readFileSync(path.join(ROOT_DIR, 'profile-switcher.js'), 'utf8');
  assert.match(profileJs, /getFrenchProfileDefaults/, 'Must export getFrenchProfileDefaults()');
  assert.match(profileJs, /user === 'seby'/, 'Must check for seby user');
  assert.match(profileJs, /difficulty:\s*['"]facile['"]/, 'Seby must default to facile');
  assert.match(profileJs, /accentsStrict:\s*false/, 'Seby must not be penalized for missing accents');
  assert.match(profileJs, /verbQuizMode:\s*['"]choice['"]/, 'Seby must default to multiple choice');

  assert.match(profileJs, /user === 'ale'/, 'Must check for ale user');
  assert.match(profileJs, /difficulty:\s*['"]moyen['"]/, 'Ale must default to moyen');
  assert.match(profileJs, /accentsStrict:\s*true/, 'Ale must require proper accents');
  assert.match(profileJs, /verbQuizMode:\s*['"]typing['"]/, 'Ale must default to typing');
});

test('2. index.html has dual exercise mode selectors and loads telemetry.js', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  assert.match(indexHtml, /id="btn-verb-choice"/, 'Must have easy choice button');
  assert.match(indexHtml, /id="btn-verb-typing"/, 'Must have typing button');
  assert.match(indexHtml, /id="quiz-choice-options"/, 'Must have choice options container');
  assert.match(indexHtml, /<script src="telemetry\.js"><\/script>/, 'Must load telemetry.js');
  assert.match(indexHtml, /<script src="profile-switcher\.js"><\/script>/, 'Must load profile-switcher.js');
  assert.match(indexHtml, /setVerbExerciseMode\('choice'\)/, 'Must have handler for choice mode');
});

test('3. cards.html, quiz.html, and seby.html all include telemetry.js and profile-switcher.js', () => {
  const pages = ['cards.html', 'quiz.html', 'seby.html'];
  for (const page of pages) {
    const content = fs.readFileSync(path.join(ROOT_DIR, page), 'utf8');
    assert.match(content, /<script src="telemetry\.js"><\/script>/, `${page} must load telemetry.js`);
    assert.match(content, /<script src="profile-switcher\.js"><\/script>/, `${page} must load profile-switcher.js`);
  }
});
