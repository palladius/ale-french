import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('1. extractEditableSlots extracts non-prefix letters and identifies base chars & vowels', async () => {
  const modPath = path.join(ROOT_DIR, 'card-spelling.js');
  assert.ok(fs.existsSync(modPath), 'card-spelling.js must exist');
  const { extractEditableSlots } = await import(modPath);

  const ordSlots = extractEditableSlots('un ordinateur');
  assert.equal(ordSlots.map((s) => s.targetChar).join(''), 'ordinateur');
  assert.equal(ordSlots.length, 10);
  assert.equal(ordSlots[0].isVowel, true); // 'o'
  assert.equal(ordSlots[1].isVowel, false); // 'r'

  const fenSlots = extractEditableSlots('une fenêtre');
  assert.equal(fenSlots.map((s) => s.targetChar).join(''), 'fenêtre');
  assert.equal(fenSlots.map((s) => s.baseChar).join(''), 'fenetre');
  assert.equal(fenSlots[3].targetChar, 'ê');
  assert.equal(fenSlots[3].baseChar, 'e');
  assert.equal(fenSlots[3].isVowel, true);

  const habSlots = extractEditableSlots("s'habiller");
  assert.equal(habSlots.map((s) => s.targetChar).join(''), 'habiller');

  const eauSlots = extractEditableSlots("l'eau");
  assert.equal(eauSlots.map((s) => s.targetChar).join(''), 'eau');

  const dentsSlots = extractEditableSlots('se brosser les dents');
  assert.equal(dentsSlots.map((s) => s.targetChar).join(''), 'brosserlesdents');
});

test('2. applyGoogleAccent & getGoogleAccentOptions map any vowel (a, e, i, o, u) across the 4 Google colors', async () => {
  const modPath = path.join(ROOT_DIR, 'card-spelling.js');
  const { applyGoogleAccent, getGoogleAccentOptions } = await import(modPath);

  // 1 = Blue (normal), 2 = Red (acute ´), 3 = Yellow (grave `), 4 = Green (circumflex ^)
  assert.equal(applyGoogleAccent('e', 1), 'e');
  assert.equal(applyGoogleAccent('e', 2), 'é');
  assert.equal(applyGoogleAccent('e', 3), 'è');
  assert.equal(applyGoogleAccent('e', 4), 'ê');

  // Re-applying on an already-accented vowel switches its accent cleanly
  assert.equal(applyGoogleAccent('é', 4), 'ê');
  assert.equal(applyGoogleAccent('ê', 1), 'e');
  assert.equal(applyGoogleAccent('ô', 1), 'o');
  assert.equal(applyGoogleAccent('o', 4), 'ô');
  assert.equal(applyGoogleAccent('a', 3), 'à');
  assert.equal(applyGoogleAccent('u', 4), 'û');

  const eOpts = getGoogleAccentOptions('ê');
  assert.equal(eOpts.length, 4);
  assert.deepEqual(
    eOpts.map((o) => ({ code: o.code, char: o.char, color: o.color })),
    [
      { code: 1, char: 'e', color: '#4285F4' },
      { code: 2, char: 'é', color: '#EA4335' },
      { code: 3, char: 'è', color: '#FBBC05' },
      { code: 4, char: 'ê', color: '#34A853' }
    ]
  );
});

test('3. Facile mode (evaluateLetterFacile) validates letter-by-letter immediately and auto-fills accents', async () => {
  const modPath = path.join(ROOT_DIR, 'card-spelling.js');
  const { extractEditableSlots, evaluateLetterFacile } = await import(modPath);

  const fenSlots = extractEditableSlots('une fenêtre');
  // Slot 3 is 'ê' (base 'e')
  const resOk = evaluateLetterFacile(fenSlots[3], 'e');
  assert.equal(resOk.isCorrect, true);
  assert.equal(resOk.displayChar, 'ê', 'Facile mode should auto-upgrade plain e to ê when correct');

  const resWrong = evaluateLetterFacile(fenSlots[3], 'a');
  assert.equal(resWrong.isCorrect, false);
  assert.equal(resWrong.displayChar, 'a');
});

test('4. Medio vs Difficile end-of-word evaluation (evaluateWord)', async () => {
  const modPath = path.join(ROOT_DIR, 'card-spelling.js');
  const { extractEditableSlots, evaluateWord } = await import(modPath);

  const fenSlots = extractEditableSlots('une fenêtre');

  // MEDIO ('moyen'): plain "fenetre" is 100% accepted and auto-upgrades 'e' -> 'ê'
  const moyenOk = evaluateWord(fenSlots, ['f', 'e', 'n', 'e', 't', 'r', 'e'], 'moyen');
  assert.equal(moyenOk.allCorrect, true);
  assert.deepEqual(moyenOk.results, ['correct', 'correct', 'correct', 'correct', 'correct', 'correct', 'correct']);
  assert.equal(moyenOk.resolvedChars.join(''), 'fenêtre');

  // MEDIO ('moyen') with typo "fenatre": only index 3 is 'wrong'
  const moyenTypo = evaluateWord(fenSlots, ['f', 'e', 'n', 'a', 't', 'r', 'e'], 'moyen');
  assert.equal(moyenTypo.allCorrect, false);
  assert.equal(moyenTypo.results[2], 'correct');
  assert.equal(moyenTypo.results[3], 'wrong');
  assert.equal(moyenTypo.results[4], 'correct');

  // DIFFICILE ('difficile'): plain "fenetre" fails on index 3 because 'e' !== 'ê'
  const diffPlain = evaluateWord(fenSlots, ['f', 'e', 'n', 'e', 't', 'r', 'e'], 'difficile');
  assert.equal(diffPlain.allCorrect, false);
  assert.equal(diffPlain.results[1], 'correct'); // 1st e is plain 'e' -> correct!
  assert.equal(diffPlain.results[3], 'wrong');   // 2nd e is 'ê' -> plain 'e' is wrong in difficile!
  assert.equal(diffPlain.results[6], 'correct'); // 3rd e is plain 'e' -> correct!

  // DIFFICILE ('difficile'): exact "fenêtre" passes 100%
  const diffExact = evaluateWord(fenSlots, ['f', 'e', 'n', 'ê', 't', 'r', 'e'], 'difficile');
  assert.equal(diffExact.allCorrect, true);
  assert.deepEqual(diffExact.results, ['correct', 'correct', 'correct', 'correct', 'correct', 'correct', 'correct']);
});

test('5. cards.html loads card-spelling.js, renders 3 difficulty modes, and includes the 4-color Google Accent Pad', () => {
  const cardsHtml = fs.readFileSync(path.join(ROOT_DIR, 'cards.html'), 'utf8');
  assert.match(cardsHtml, /<script\s+src=["']card-spelling\.js["']><\/script>/);
  assert.match(cardsHtml, /setSpellingDifficulty\s*\(\s*['"]facile['"]/);
  assert.match(cardsHtml, /setSpellingDifficulty\s*\(\s*['"]moyen['"]/);
  assert.match(cardsHtml, /setSpellingDifficulty\s*\(\s*['"]difficile['"]/);
  assert.match(cardsHtml, /id=["']google-accent-pad["']/);
  assert.match(cardsHtml, /#4285F4/i);
  assert.match(cardsHtml, /#EA4335/i);
  assert.match(cardsHtml, /#FBBC05/i);
  assert.match(cardsHtml, /#34A853/i);
});
