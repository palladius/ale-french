// telemetry.js - Telemetria cognitiva per ale-french (SPEC.md §7)
// Traccia tempi di risposta, errori, tentativi e uso di hint audio (hesitation index)

(function (root) {
  const STORAGE_KEY = 'ale_french_telemetry_v1';
  const MAX_RECORDS = 500;
  let memoryStorage = [];

  function getStorageBackend() {
    if (typeof localStorage !== 'undefined') {
      return {
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k)
      };
    }
    return {
      getItem: () => JSON.stringify(memoryStorage),
      setItem: (_, v) => {
        try {
          memoryStorage = JSON.parse(v);
        } catch {
          memoryStorage = [];
        }
      },
      removeItem: () => {
        memoryStorage = [];
      }
    };
  }

  function getAllRecords() {
    try {
      const raw = getStorageBackend().getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveAllRecords(records) {
    try {
      const trimmed = records.slice(-MAX_RECORDS);
      getStorageBackend().setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('[telemetry] Could not persist telemetry:', e);
    }
  }

  function resolveUser(explicitUser) {
    if (explicitUser) return explicitUser;
    if (typeof root.getActiveFrenchUser === 'function') {
      const u = root.getActiveFrenchUser();
      if (u) return u;
    }
    try {
      const saved = getStorageBackend().getItem('french_active_user');
      if (saved) return saved;
    } catch {}
    return 'ale';
  }

  function recordFrenchTelemetry(data) {
    if (!data || typeof data !== 'object') return null;

    const user = resolveUser(data.user);
    const durationMs = Math.max(0, Math.round(Number(data.durationMs) || 0));
    const hintsUsed = Math.max(0, Math.round(Number(data.hintsUsed) || 0));
    // Hesitation score: seconds spent + 2 penalty points per hint
    const hesitationScore = Math.round((durationMs / 1000 + hintsUsed * 2) * 10) / 10;

    const record = {
      id: 'tel_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      timestamp: data.timestamp || new Date().toISOString(),
      user,
      page: data.page || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || 'index.html' : 'app'),
      exercise: String(data.exercise || 'generic'),
      mode: String(data.mode || 'standard'),
      target: String(data.target || ''),
      userInput: String(data.userInput !== undefined ? data.userInput : ''),
      correct: Boolean(data.correct),
      durationMs,
      hintsUsed,
      hesitationScore,
      details: data.details || {}
    };

    const current = getAllRecords();
    current.push(record);
    saveAllRecords(current);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('french-telemetry-logged', { detail: { record } }));
    }

    return record;
  }

  function startFrenchQuestionTelemetry(context = {}) {
    const startTime = (typeof performance !== 'undefined' && typeof performance.now === 'function')
      ? performance.now()
      : Date.now();
    let hints = 0;
    let finished = false;

    return {
      markHint: () => {
        hints++;
      },
      getHintsCount: () => hints,
      finish: (isCorrect, userInput, extra = {}) => {
        if (finished) return null;
        finished = true;
        const endTime = (typeof performance !== 'undefined' && typeof performance.now === 'function')
          ? performance.now()
          : Date.now();
        const durationMs = Math.round(endTime - startTime);

        return recordFrenchTelemetry({
          ...context,
          ...extra,
          userInput,
          correct: isCorrect,
          durationMs,
          hintsUsed: hints
        });
      }
    };
  }

  function getFrenchTelemetry(options = {}) {
    let list = getAllRecords();
    if (options.user) {
      list = list.filter(r => r.user === options.user);
    }
    if (options.exercise) {
      list = list.filter(r => r.exercise === options.exercise);
    }
    if (options.correct !== undefined) {
      list = list.filter(r => r.correct === options.correct);
    }
    if (typeof options.limit === 'number' && options.limit > 0) {
      list = list.slice(-options.limit);
    }
    return list;
  }

  function getFrenchTelemetrySummary(user) {
    const records = getFrenchTelemetry({ user });
    const total = records.length;
    if (total === 0) {
      return {
        user,
        total: 0,
        correctCount: 0,
        accuracyPct: 0,
        avgDurationMs: 0,
        totalHints: 0,
        hardestItems: []
      };
    }

    let correctCount = 0;
    let sumDuration = 0;
    let totalHints = 0;
    const itemStats = {};

    records.forEach(r => {
      if (r.correct) correctCount++;
      sumDuration += r.durationMs;
      totalHints += r.hintsUsed;

      if (!itemStats[r.target]) {
        itemStats[r.target] = { target: r.target, count: 0, errors: 0, sumDuration: 0 };
      }
      itemStats[r.target].count++;
      if (!r.correct) itemStats[r.target].errors++;
      itemStats[r.target].sumDuration += r.durationMs;
    });

    const hardestItems = Object.values(itemStats)
      .map(item => ({
        target: item.target,
        attempts: item.count,
        errors: item.errors,
        errorRatePct: Math.round((item.errors / item.count) * 100),
        avgDurationMs: Math.round(item.sumDuration / item.count)
      }))
      .filter(item => item.errors > 0 || item.avgDurationMs > 5000)
      .sort((a, b) => b.errors - a.errors || b.avgDurationMs - a.avgDurationMs)
      .slice(0, 5);

    return {
      user,
      total,
      correctCount,
      accuracyPct: Math.round((correctCount / total) * 100),
      avgDurationMs: Math.round(sumDuration / total),
      totalHints,
      hardestItems
    };
  }

  function clearFrenchTelemetry() {
    getStorageBackend().removeItem(STORAGE_KEY);
  }

  const api = {
    recordFrenchTelemetry,
    startFrenchQuestionTelemetry,
    getFrenchTelemetry,
    getFrenchTelemetrySummary,
    clearFrenchTelemetry
  };

  if (typeof module === 'object' && module.exports) {
    exports.recordFrenchTelemetry = recordFrenchTelemetry;
    exports.startFrenchQuestionTelemetry = startFrenchQuestionTelemetry;
    exports.getFrenchTelemetry = getFrenchTelemetry;
    exports.getFrenchTelemetrySummary = getFrenchTelemetrySummary;
    exports.clearFrenchTelemetry = clearFrenchTelemetry;
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
