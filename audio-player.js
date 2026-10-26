(function (root) {
  let currentAudio = null;
  let cachedVoices = [];
  const availableMp3Slugs = new Set();

  if (typeof window !== 'undefined') {
    if ('speechSynthesis' in window) {
      try {
        cachedVoices = window.speechSynthesis.getVoices() || [];
        window.speechSynthesis.onvoiceschanged = function () {
          cachedVoices = window.speechSynthesis.getVoices() || [];
        };
      } catch (_) {}
    }

    if (typeof fetch === 'function') {
      fetch('audio/manifest.json')
        .then((res) => (res.ok ? res.json() : null))
        .then((manifest) => {
          if (manifest && manifest.clips && typeof manifest.clips === 'object') {
            Object.values(manifest.clips).forEach((entry) => {
              if (entry && entry.slug) {
                availableMp3Slugs.add(entry.slug);
              }
            });
          }
        })
        .catch(() => {});
    }
  }

  function phraseToSlug(text) {
    return String(text || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’']/g, '-')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function getAudioPathForPhrase(text) {
    const slug = phraseToSlug(text);
    return `audio/${slug}.mp3`;
  }

  function pickBestFrenchVoice(voices) {
    if (!Array.isArray(voices) || voices.length === 0) return null;

    const frVoices = voices.filter((v) => {
      const lang = String(v?.lang || '').replace('_', '-').toLowerCase();
      return lang === 'fr' || lang.startsWith('fr-');
    });

    if (frVoices.length === 0) return null;

    function scoreVoice(v) {
      let score = 0;
      const lang = String(v?.lang || '').replace('_', '-').toLowerCase();
      const name = String(v?.name || '').toLowerCase();

      if (lang === 'fr-fr') score += 100;
      else if (lang === 'fr-ca' || lang === 'fr-ch') score += 50;
      else if (lang.startsWith('fr-')) score += 20;

      if (
        name.includes('google') ||
        name.includes('thomas') ||
        name.includes('amelie') ||
        name.includes('amélie') ||
        name.includes('audrey') ||
        name.includes('marie') ||
        name.includes('denise') ||
        name.includes('eloise') ||
        name.includes('natural') ||
        name.includes('neural') ||
        name.includes('premium')
      ) {
        score += 40;
      }

      if (name.includes('espeak') || name.includes('+')) {
        score -= 30;
      }

      return score;
    }

    return [...frVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
  }

  function stopFrenchAudio(speechSynth) {
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (_) {}
      currentAudio = null;
    }
    const synth =
      speechSynth ||
      (typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis
        : null);
    if (synth && (synth.speaking || synth.pending)) {
      try {
        synth.cancel();
      } catch (_) {}
    }
  }

  function speakWithWebSpeech(text, opts) {
    const synth =
      opts.speechSynth ||
      (typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis
        : null);
    const UtteranceCtor =
      opts.UtteranceCtor ||
      (typeof SpeechSynthesisUtterance !== 'undefined'
        ? SpeechSynthesisUtterance
        : null);

    if (!synth || !UtteranceCtor) {
      if (typeof opts.onerror === 'function') {
        opts.onerror(new Error('No audio or speechSynthesis available'));
      }
      return Promise.resolve();
    }

    if (synth.speaking || synth.pending) {
      try {
        synth.cancel();
      } catch (_) {}
    }

    const utterance = new UtteranceCtor(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;

    const voices =
      (typeof synth.getVoices === 'function' ? synth.getVoices() : []) ||
      cachedVoices;
    const bestVoice = pickBestFrenchVoice(voices);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    return new Promise((resolve) => {
      utterance.onend = () => {
        if (typeof opts.onend === 'function') opts.onend();
        resolve();
      };
      utterance.onerror = (err) => {
        if (typeof opts.onerror === 'function') opts.onerror(err);
        resolve();
      };
      try {
        synth.speak(utterance);
      } catch (err) {
        if (typeof opts.onerror === 'function') opts.onerror(err);
        resolve();
      }
    });
  }

  function playFrenchAudio(text, options) {
    const opts = options || {};
    stopFrenchAudio(opts.speechSynth);

    const slug = phraseToSlug(text);
    const src = `audio/${slug}.mp3`;
    const AudioCtor =
      opts.AudioCtor || (typeof Audio !== 'undefined' ? Audio : null);

    const knownSlugs =
      opts.knownMp3Slugs !== undefined ? opts.knownMp3Slugs : availableMp3Slugs;
    const shouldTryMp3 =
      Boolean(AudioCtor) &&
      (opts.knownMp3Slugs !== undefined
        ? knownSlugs.has(slug)
        : knownSlugs.has(slug) || Boolean(opts.AudioCtor));

    if (!shouldTryMp3) {
      return speakWithWebSpeech(text, opts);
    }

    const audio = new AudioCtor(src);
    currentAudio = audio;
    let fallbackTriggered = false;

    function triggerFallback() {
      if (fallbackTriggered) return Promise.resolve();
      fallbackTriggered = true;
      if (currentAudio === audio) currentAudio = null;
      return speakWithWebSpeech(text, opts);
    }

    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      if (typeof opts.onend === 'function') opts.onend();
    };

    audio.onerror = () => {
      triggerFallback();
    };

    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        return playPromise.catch(() => triggerFallback());
      }
      return Promise.resolve();
    } catch (_) {
      return triggerFallback();
    }
  }

  if (typeof module === 'object' && module.exports) {
    exports.phraseToSlug = phraseToSlug;
    exports.getAudioPathForPhrase = getAudioPathForPhrase;
    exports.pickBestFrenchVoice = pickBestFrenchVoice;
    exports.playFrenchAudio = playFrenchAudio;
    exports.stopFrenchAudio = stopFrenchAudio;
  }
  if (root) {
    root.phraseToSlug = phraseToSlug;
    root.getAudioPathForPhrase = getAudioPathForPhrase;
    root.pickBestFrenchVoice = pickBestFrenchVoice;
    root.playFrenchAudio = playFrenchAudio;
    root.stopFrenchAudio = stopFrenchAudio;
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : this
);
