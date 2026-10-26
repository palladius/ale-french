(function (root) {
  const VOWEL_MAP = {
    a: { 1: 'a', 2: 'á', 3: 'à', 4: 'â' },
    e: { 1: 'e', 2: 'é', 3: 'è', 4: 'ê' },
    i: { 1: 'i', 2: 'í', 3: 'ì', 4: 'î' },
    o: { 1: 'o', 2: 'ó', 3: 'ò', 4: 'ô' },
    u: { 1: 'u', 2: 'ú', 3: 'ù', 4: 'û' }
  };

  const GOOGLE_COLORS = {
    1: { color: '#4285F4', name: 'Normale', symbol: '—' },
    2: { color: '#EA4335', name: 'Acuto ´', symbol: '´' },
    3: { color: '#FBBC05', name: 'Grave `', symbol: '`' },
    4: { color: '#34A853', name: 'Cappellino ^', symbol: '^' }
  };

  function stripAccent(ch) {
    return String(ch || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function isBaseVowel(ch) {
    const base = stripAccent(ch);
    return Boolean(VOWEL_MAP[base]);
  }

  function extractEditableSlots(infinitive) {
    const inf = String(infinitive || '').trim();
    const words = inf.split(' ');
    const slots = [];
    let slotIndex = 0;

    words.forEach((word, wordIdx) => {
      if (word === 'se' || word === 'un' || word === 'une' || word === 'des') {
        return;
      }
      let sliceToProcess = word;
      if (word.startsWith("s'") || word.startsWith("l'")) {
        sliceToProcess = word.slice(2);
      }
      for (let i = 0; i < sliceToProcess.length; i++) {
        const ch = sliceToProcess[i];
        if (ch === "'" || ch === '-') continue;
        const targetChar = ch.toLowerCase();
        const baseChar = stripAccent(targetChar);
        slots.push({
          index: slotIndex++,
          wordIndex: wordIdx,
          targetChar,
          baseChar,
          isVowel: Boolean(VOWEL_MAP[baseChar]),
          hasAccent: targetChar !== baseChar
        });
      }
    });

    return slots;
  }

  function applyGoogleAccent(vowelChar, code) {
    const base = stripAccent(vowelChar);
    const entry = VOWEL_MAP[base];
    if (!entry) return String(vowelChar || '').toLowerCase();
    return entry[code] || entry[1];
  }

  function getGoogleAccentOptions(vowelChar) {
    const base = stripAccent(vowelChar) || 'e';
    const entry = VOWEL_MAP[base] || VOWEL_MAP.e;
    return [1, 2, 3, 4].map((code) => ({
      code,
      char: entry[code],
      color: GOOGLE_COLORS[code].color,
      name: GOOGLE_COLORS[code].name,
      symbol: GOOGLE_COLORS[code].symbol
    }));
  }

  function evaluateLetterFacile(slot, typedChar) {
    const cleanTyped = stripAccent(typedChar);
    if (!slot || !cleanTyped) {
      return { isCorrect: false, displayChar: String(typedChar || '').toLowerCase() };
    }
    const isCorrect = cleanTyped === slot.baseChar;
    return {
      isCorrect,
      displayChar: isCorrect ? slot.targetChar : String(typedChar).toLowerCase()
    };
  }

  function evaluateWord(slots, typedChars, mode) {
    const diffMode = mode || 'moyen';
    const results = [];
    const resolvedChars = [];
    let allCorrect = slots.length > 0;

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const rawTyped = String(typedChars?.[i] || '').toLowerCase();

      if (diffMode === 'difficile') {
        const exactMatch = rawTyped === slot.targetChar;
        results.push(exactMatch ? 'correct' : 'wrong');
        resolvedChars.push(rawTyped);
        if (!exactMatch) allCorrect = false;
      } else {
        // 'moyen' or 'facile': base character comparison, auto-upgrade to targetChar when correct
        const baseMatch = stripAccent(rawTyped) === slot.baseChar;
        results.push(baseMatch ? 'correct' : 'wrong');
        resolvedChars.push(baseMatch ? slot.targetChar : rawTyped);
        if (!baseMatch) allCorrect = false;
      }
    }

    return {
      allCorrect,
      results,
      resolvedChars
    };
  }

  const api = {
    stripAccent,
    isBaseVowel,
    extractEditableSlots,
    applyGoogleAccent,
    getGoogleAccentOptions,
    evaluateLetterFacile,
    evaluateWord
  };

  if (typeof module === 'object' && module.exports) {
    exports.stripAccent = stripAccent;
    exports.isBaseVowel = isBaseVowel;
    exports.extractEditableSlots = extractEditableSlots;
    exports.applyGoogleAccent = applyGoogleAccent;
    exports.getGoogleAccentOptions = getGoogleAccentOptions;
    exports.evaluateLetterFacile = evaluateLetterFacile;
    exports.evaluateWord = evaluateWord;
  }
  if (root) {
    Object.assign(root, api);
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : this
);
