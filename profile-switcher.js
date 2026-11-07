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

  function setActiveUser(user, redirectIfNeeded = true) {
    localStorage.setItem(STORAGE_KEY, user);
    updateBadge();

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

  function updateBadge() {
    const user = getActiveUser() || 'ale';
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
    `;
  }

  // Hook into PuffinLogin events
  window.addEventListener('puffin-user-changed', (e) => {
    const user = e.detail?.user;
    if (user && user.id) {
      localStorage.setItem(STORAGE_KEY, user.id);
      updateBadge();

      const currentPath = window.location.pathname;
      const isSebyPage = currentPath.endsWith('seby.html');
      if (user.id === 'seby' && !isSebyPage) {
        window.location.href = 'seby.html';
      } else if (user.id === 'ale' && isSebyPage) {
        window.location.href = 'index.html';
      }
    }
  });

  function initProfileSwitcher() {
    const currentUser = getActiveUser();
    const currentPath = window.location.pathname;
    const isSebyPage = currentPath.endsWith('seby.html');

    if (!currentUser) {
      if (isSebyPage) {
        localStorage.setItem(STORAGE_KEY, 'seby');
      }
    }

    updateBadge();
    ensureLoveFooter();
  }

  // Expose global methods
  window.showProfileModal = showProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.selectUserProfile = selectUserProfile;
  window.getActiveFrenchUser = getActiveUser;
  window.setActiveFrenchUser = setActiveUser;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileSwitcher);
  } else {
    initProfileSwitcher();
  }
})();
