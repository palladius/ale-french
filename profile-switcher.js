// profile-switcher.js - Gestione profilo attivo (Ale vs Seby) e login "Chi sei?"

(function() {
  const STORAGE_KEY = 'french_active_user';

  function getActiveUser() {
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
    // Rimuovi eventuale modal esistente
    const existing = document.getElementById('profile-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'profile-modal-overlay';
    overlay.className = 'profile-modal-overlay';

    overlay.innerHTML = `
      <div class="profile-modal-card">
        ${canClose && getActiveUser() ? '<button class="profile-modal-close" onclick="closeProfileModal()">✕</button>' : ''}
        <div class="profile-modal-title">
          <span>👋</span> Chi sei? / <i>Qui es-tu ?</i>
        </div>
        <p class="profile-modal-sub">Scegli il tuo profilo per iniziare la lezione di Francese!</p>

        <div class="profile-choices">
          <!-- ALE -->
          <div class="profile-choice-btn ale-choice" onclick="selectUserProfile('ale')">
            <div class="profile-choice-img-wrap">
              <img src="images/avatar-ale.png" alt="Alessandro" class="profile-choice-img" onerror="this.src='images/s-habiller.jpg'">
              <div class="profile-choice-badge">🦁</div>
            </div>
            <div class="profile-choice-name">Alessandro</div>
            <span class="profile-choice-grade ale-grade">Primary 3 • 8 ans</span>
            <p class="profile-choice-desc">
              Verbi al presente, desinenze mute, vocabolario P3, carte 3D e quiz di coniugazione.
            </p>
            <button class="profile-choice-cta ale-cta">Entra come Ale 🚀</button>
          </div>

          <!-- SEBY -->
          <div class="profile-choice-btn seby-choice" onclick="selectUserProfile('seby')">
            <div class="profile-choice-img-wrap">
              <img src="images/avatar-seby.png" alt="Sebastian" class="profile-choice-img" onerror="this.src='images/aller.jpg'">
              <div class="profile-choice-badge">🎈</div>
            </div>
            <div class="profile-choice-name">Sebastian</div>
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
    closeProfileModal();
    setActiveUser(user, true);
  }

  function updateBadge() {
    const user = getActiveUser() || 'ale';
    const badges = document.querySelectorAll('.user-profile-badge');
    badges.forEach(badge => {
      badge.className = `user-profile-badge ${user === 'ale' ? 'ale-active' : 'seby-active'}`;
      const avatarSrc = user === 'ale' ? 'images/avatar-ale.png' : 'images/avatar-seby.png';
      const name = user === 'ale' ? 'Ale (P3)' : 'Seby (P1)';
      badge.innerHTML = `
        <img src="${avatarSrc}" alt="${name}" class="user-profile-avatar" onerror="this.style.display='none'">
        <span>${name}</span>
        <span class="user-profile-change-hint">🔄 Cambia</span>
      `;
    });
  }

  function initProfileSwitcher() {
    const currentUser = getActiveUser();
    const currentPath = window.location.pathname;
    const isSebyPage = currentPath.endsWith('seby.html');

    // Se non ha mai scelto il profilo e non è specificato nell'URL
    if (!currentUser) {
      // Se si trova già su seby.html, imposta seby di default
      if (isSebyPage) {
        localStorage.setItem(STORAGE_KEY, 'seby');
      } else {
        // Mostra il modal al primo avvio
        showProfileModal(false);
      }
    }

    updateBadge();
  }

  // Esponi funzioni globali
  window.showProfileModal = showProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.selectUserProfile = selectUserProfile;
  window.getActiveFrenchUser = getActiveUser;
  window.setActiveFrenchUser = setActiveUser;

  // Auto-init al caricamento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileSwitcher);
  } else {
    initProfileSwitcher();
  }
})();
