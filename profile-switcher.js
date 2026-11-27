// profile-switcher.js - Gestione profilo attivo (Ale vs Seby) e bridge con PuffinLogin

(function() {
  const STORAGE_KEY = 'french_active_user';

  function getActiveUser() {
    // 1. Check PuffinLogin session if available
    try {
      const puffinAuth = localStorage.getItem('puffin_auth_v2');
      if (puffinAuth) {
        const parsed = JSON.parse(puffinAuth);
        const uid = parsed?.player_id || parsed?.userId;
        if (uid) return uid;
      }
    } catch {}
    return localStorage.getItem(STORAGE_KEY);
  }

  function setActiveUser(user, redirectIfNeeded = false) {
    localStorage.setItem(STORAGE_KEY, user);
    updateBadge();

    const defaults = getFrenchProfileDefaults();
    window.dispatchEvent(new CustomEvent('french-profile-updated', { detail: { user, defaults } }));

    const currentPath = window.location.pathname;
    const isSebyPage = currentPath.endsWith('seby.html');

    if (redirectIfNeeded) {
      if (user === 'seby' && !isSebyPage) {
        window.location.href = 'seby.html';
        return;
      }
      if (user === 'ale' && isSebyPage) {
        window.location.href = 'index.html';
        return;
      }
    }
  }

  function getFrenchProfileDefaults() {
    const user = getActiveUser() || 'ale';
    if (user === 'seby') {
      return {
        user: 'seby',
        name: 'Sebastian',
        grade: 'Primary 1 • 6 ans',
        difficulty: 'facile',
        accentsStrict: false, // "per Seby l'accento chi se ne frega"
        verbQuizMode: 'choice', // Scelta multipla con audio
        numberMode: 'game'
      };
    } else if (user === 'ale') {
      return {
        user: 'ale',
        name: 'Alessandro',
        grade: 'Primary 3 • 8 ans',
        difficulty: 'moyen',
        accentsStrict: true, // "per l'Ale l'accento importa"
        verbQuizMode: 'typing', // Scrittura desinenze
        numberMode: 'game'
      };
    } else {
      return {
        user: user,
        name: user === 'riccardo' ? 'Papà Riccardo' : (user === 'kate' ? 'Mamma Kate' : user),
        grade: 'Genitori / Super',
        difficulty: 'moyen',
        accentsStrict: true,
        verbQuizMode: 'typing',
        numberMode: 'game'
      };
    }
  }

  function showProfileModal(canClose = true) {
    // Prefer PuffinLogin modal if available on page
    const puffin = document.querySelector('puffin-login');
    if (puffin && typeof puffin.openModal === 'function') {
      puffin.openModal();
      return;
    }

    // Fallback modal
    const existing = document.getElementById('profile-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'profile-modal-overlay';
    overlay.className = 'profile-modal-overlay';

    overlay.innerHTML = `
      <div class="profile-modal-card">
        ${canClose && getActiveUser() ? '<button class="profile-modal-close" onclick="closeProfileModal()">✕</button>' : ''}
        <div class="profile-modal-title">
          <span>🐧</span> Chi gioca? / <i>Qui es-tu ?</i>
        </div>
        <p class="profile-modal-sub">Accedi con PuffinLogin per iniziare la lezione di Francese!</p>

        <div class="profile-choices">
          <!-- ALE -->
          <div class="profile-choice-btn ale-choice" onclick="selectUserProfile('ale')">
            <div class="profile-choice-img-wrap">
              <img src="assets/avatars/ale.png" alt="Alessandro" class="profile-choice-img" onerror="this.src='images/avatar-ale.png'">
              <div class="profile-choice-badge">🐉</div>
            </div>
            <div class="profile-choice-name">
              Alessandro
              <span class="profile-name-speaker" onclick="event.stopPropagation(); if (typeof playFrenchAudio === 'function') playFrenchAudio('Alessandro');" title="Ascolta Alessandro in francese">🔊</span>
            </div>
            <span class="profile-choice-grade ale-grade">Primary 3 • 8 ans</span>
            <p class="profile-choice-desc">
              Verbi al presente, desinenze mute, vocabolario P3, carte 3D e quiz di coniugazione.
            </p>
            <button class="profile-choice-cta ale-cta">Entra come Ale 🚀</button>
          </div>

          <!-- SEBY -->
          <div class="profile-choice-btn seby-choice" onclick="selectUserProfile('seby')">
            <div class="profile-choice-img-wrap">
              <img src="assets/avatars/seby.png" alt="Sebastian" class="profile-choice-img" onerror="this.src='images/avatar-seby.png'">
              <div class="profile-choice-badge">🎈</div>
            </div>
            <div class="profile-choice-name">
              Sebastian
              <span class="profile-name-speaker" onclick="event.stopPropagation(); if (typeof playFrenchAudio === 'function') playFrenchAudio('Sebastian');" title="Ascolta Sebastian in francese">🔊</span>
            </div>
            <span class="profile-choice-grade seby-grade">Primary 1 • 6 ans • A1</span>
            <p class="profile-choice-desc">
              Saluti, Numeri da 0 a 12, Presentazione ("Je m'appelle Seby"), Colori e Forme per l'esame P1!
            </p>
            <button class="profile-choice-cta seby-cta">Entra come Seby 🥐</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  function closeProfileModal() {
    const overlay = document.getElementById('profile-modal-overlay');
    if (overlay) overlay.remove();
  }

  function selectUserProfile(user) {
    const spokenName = user === 'ale' ? 'Alessandro' : 'Sebastian';
    closeProfileModal();

    const puffin = document.querySelector('puffin-login');
    if (puffin && typeof puffin.openModal === 'function') {
      puffin.openModal(user);
      return;
    }

    const currentPath = window.location.pathname;
    const isSebyPage = currentPath.endsWith('seby.html');
    const willRedirect =
      (user === 'seby' && !isSebyPage) || (user === 'ale' && isSebyPage);

    if (typeof window.playFrenchAudio === 'function') {
      if (willRedirect) {
        localStorage.setItem(STORAGE_KEY, user);
        updateBadge();
        let redirected = false;
        const doRedirect = () => {
          if (redirected) return;
          redirected = true;
          window.location.href = user === 'seby' ? 'seby.html' : 'index.html';
        };
        setTimeout(doRedirect, 950);
        window.playFrenchAudio(spokenName, { onend: doRedirect, onerror: doRedirect });
        return;
      }
      window.playFrenchAudio(spokenName);
    }

    setActiveUser(user, true);
  }

  function applyProfileChrome(user) {
    const active = user || getActiveUser() || 'ale';
    const isSeby = active === 'seby';

    if (document.body) {
      document.body.classList.toggle('profile-seby', isSeby);
    }

    // Update "Pour Alessandro 🦁" badge & title dynamically when Seby logs in
    document.querySelectorAll('.badge-ale').forEach(el => {
      if (isSeby) {
        el.textContent = 'Pour Sebastian 🎈';
        el.style.background = '#dcfce7';
        el.style.color = '#166534';
        el.style.borderColor = '#86efac';
      } else {
        el.textContent = 'Pour Alessandro 🦁';
        el.style.background = '';
        el.style.color = '';
        el.style.borderColor = '';
      }
    });

    const isSebyPage = window.location.pathname.endsWith('seby.html');
    if (!isSebyPage) {
      document.querySelectorAll('.brand h1').forEach(h1 => {
        if (h1.textContent.trim() === 'Ale French' || h1.textContent.trim() === 'Seby French') {
          h1.textContent = isSeby ? 'Seby French' : 'Ale French';
        }
      });
    }

    // Hide verb/conjugation-only tabs (index.html & quiz.html) when Seby is logged in
    document.querySelectorAll('.nav-tabs a.nav-tab').forEach(link => {
      const href = (link.getAttribute('href') || '').trim();
      const isAleVerbTab = href === 'index.html' || href === 'quiz.html' || href.startsWith('index.html#') || href.startsWith('quiz.html?');
      if (isAleVerbTab) {
        link.style.display = isSeby ? 'none' : '';
      }
    });
  }

  function updateBadge() {
    const user = getActiveUser() || 'ale';
    applyProfileChrome(user);
    const badges = document.querySelectorAll('.user-profile-badge');
    badges.forEach(badge => {
      badge.className = `user-profile-badge ${user === 'ale' ? 'ale-active' : user === 'seby' ? 'seby-active' : ''}`;
      const avatarSrc = user === 'ale' ? 'assets/avatars/ale.png' : user === 'seby' ? 'assets/avatars/seby.png' : `assets/avatars/${user}.png`;
      const fallbackSrc = user === 'ale' ? 'images/avatar-ale.png' : 'images/avatar-seby.png';
      const name = user === 'ale' ? 'Ale (P3)' : user === 'seby' ? 'Seby (P1)' : user;
      badge.innerHTML = `
        <img src="${avatarSrc}" alt="${name}" class="user-profile-avatar" onerror="this.src='${fallbackSrc}'; this.onerror=null;">
        <span>${name}</span>
        <span class="user-profile-change-hint">🔄 Puffin</span>
      `;
    });
  }

  const APP_VERSION = '2.0.7';
  const GITHUB_REPO_URL = 'https://github.com/palladius/ale-french';

  function ensureLoveFooter() {
    let footer = document.querySelector('footer');
    if (!footer) {
      footer = document.createElement('footer');
      document.body.appendChild(footer);
    }
    footer.classList.add('site-love-footer');
    footer.innerHTML = `
      <span class="love-footer-phrase" onclick="if (typeof playFrenchAudio === 'function') playFrenchAudio('Fait avec amour par mon papa');" title="Ascolta in francese">
        🇫🇷 Fait avec ❤️ par
      </span>
      <button type="button" class="papa-audio-btn" onclick="event.stopPropagation(); if (typeof playFrenchAudio === 'function') playFrenchAudio('mon papa');">
        🔊 mon papa
      </button>
      <span class="footer-meta-sep" aria-hidden="true">•</span>
      <span class="footer-version-badge" title="Versione corrente dell'app">v${APP_VERSION}</span>
      <a class="footer-github-link" href="${GITHUB_REPO_URL}" target="_blank" rel="noopener noreferrer" title="Codice sorgente su GitHub">
        <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
        <span>GitHub</span>
      </a>
    `;
  }

  // Hook into PuffinLogin events
  window.addEventListener('puffin-user-changed', (e) => {
    const user = e.detail?.user;
    if (user && user.id) {
      localStorage.setItem(STORAGE_KEY, user.id);
      updateBadge();

      const defaults = getFrenchProfileDefaults();
      window.dispatchEvent(new CustomEvent('french-profile-updated', { detail: { user: user.id, defaults } }));

      // If Seby logs in while on a verb/conjugation-only page, take him straight to Spazio Seby!
      const p = window.location.pathname;
      const isVerbOnlyPage = p.endsWith('index.html') || p.endsWith('quiz.html') || p.endsWith('/') || p.endsWith('/ale-french');
      if (user.id === 'seby' && isVerbOnlyPage) {
        window.location.href = 'seby.html';
      }
    }
  });

  function ensureLangSlider() {
    if (document.getElementById('lang-slider-control')) return;
    const brand = document.querySelector('header .brand') || document.querySelector('header');
    if (!brand) return;

    const isGerman = window.location.pathname.endsWith('german.html');
    const slider = document.createElement('div');
    slider.id = 'lang-slider-control';
    slider.className = `lang-slider ${isGerman ? 'is-de' : 'is-fr'}`;
    slider.setAttribute('role', 'group');
    slider.setAttribute('aria-label', 'Scegli lingua: Francese o Tedesco');
    slider.innerHTML = `
      <span class="lang-slider-thumb" aria-hidden="true"></span>
      <button type="button" class="lang-slider-btn ${!isGerman ? 'active' : ''}" data-lang="fr" title="Passa al Francese 🇫🇷">
        <span class="lang-slider-flag">🇫🇷</span><span>FR</span>
      </button>
      <button type="button" class="lang-slider-btn ${isGerman ? 'active' : ''}" data-lang="de" title="Passa al Tedesco 🇩🇪">
        <span class="lang-slider-flag">🇩🇪</span><span>DE</span>
      </button>
    `;

    slider.querySelectorAll('.lang-slider-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetLang = btn.dataset.lang;
        if (targetLang === 'de' && !isGerman) {
          slider.classList.remove('is-fr');
          slider.classList.add('is-de');
          slider.querySelectorAll('.lang-slider-btn').forEach((b) => b.classList.toggle('active', b.dataset.lang === 'de'));
          setTimeout(() => {
            window.location.href = 'german.html';
          }, 180);
        } else if (targetLang === 'fr' && isGerman) {
          slider.classList.remove('is-de');
          slider.classList.add('is-fr');
          slider.querySelectorAll('.lang-slider-btn').forEach((b) => b.classList.toggle('active', b.dataset.lang === 'fr'));
          const dest = getActiveUser() === 'seby' ? 'seby.html' : 'index.html';
          setTimeout(() => {
            window.location.href = dest;
          }, 180);
        }
      });
    });

    brand.insertBefore(slider, brand.firstChild);
  }

  const NAV_MONOCHROME_ICONS = {
    'index.html': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    'cards.html': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="18" x="5" y="3" rx="2"/><path d="M9 7h6"/><path d="M9 11h6"/></svg>',
    'grid.html': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
    'quiz.html': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
    'seby.html': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M6 20a6 6 0 0 1 12 0"/></svg>',
    'nav-0': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    'nav-1': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>',
    'nav-2': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    'nav-3': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>',
    'nav-4': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    'nav-5': '<svg class="nav-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M6 9h.01"/><path d="M10 9h.01"/><path d="M14 9h.01"/><path d="M18 9h.01"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M7 16h10"/></svg>'
  };

  function upgradeNavIcons() {
    document.querySelectorAll('header .nav-tab').forEach((el) => {
      if (el.querySelector('svg.nav-svg-icon')) return;
      const href = el.getAttribute('href');
      const navLevel = el.dataset.navLevel;
      const svg = href ? NAV_MONOCHROME_ICONS[href] : (navLevel !== undefined ? NAV_MONOCHROME_ICONS[`nav-${navLevel}`] : null);
      if (!svg) return;
      // Strip leading polychrome emojis from tab label so only crisp monochrome SVG + clean text remain
      const cleanLabel = el.textContent.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, '').trim();
      el.innerHTML = `${svg}<span>${cleanLabel}</span>`;
    });
  }

  function initProfileSwitcher() {
    const currentUser = getActiveUser();
    const currentPath = window.location.pathname;
    const isSebyPage = currentPath.endsWith('seby.html');

    if (!currentUser) {
      if (isSebyPage) {
        localStorage.setItem(STORAGE_KEY, 'seby');
      }
    }

    ensureLangSlider();
    upgradeNavIcons();
    updateBadge();
    ensureLoveFooter();
    const defaults = getFrenchProfileDefaults();
    window.dispatchEvent(new CustomEvent('french-profile-updated', { detail: { user: getActiveUser(), defaults } }));
  }

  // Expose global methods
  window.ALE_FRENCH_VERSION = APP_VERSION;
  window.ALE_FRENCH_GITHUB_URL = GITHUB_REPO_URL;
  window.showProfileModal = showProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.selectUserProfile = selectUserProfile;
  window.getActiveFrenchUser = getActiveUser;
  window.isSebyProfile = () => getActiveUser() === 'seby';
  window.setActiveFrenchUser = setActiveUser;
  window.getFrenchProfileDefaults = getFrenchProfileDefaults;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileSwitcher);
  } else {
    initProfileSwitcher();
  }
})();
