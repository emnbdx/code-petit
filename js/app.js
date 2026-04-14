/* ============================================
   Tiny Logic - App Controller
   Navigation, save system, progression.
   ============================================ */

const App = (() => {
  // Save data
  let save = {
    unlocked: { 1: 1 },  // worldId: highest unlocked level
    stars: {},            // "w-l": stars earned (1-3)
    lastWorld: 1,
    lastLevel: 1,
    hero: null,           // { id, preset }
  };

  // Hero selection state (home showcase)
  let showcaseHeroIdx = 0;
  let showcasePreset = 0;

  let currentWorld = 1;
  let currentLevel = 1;

  // DOM refs
  const screens = {};
  let victoryStars, victoryTitle, victoryMsg;

  function init() {
    ['home', 'map', 'game'].forEach(id => {
      screens[id] = document.getElementById('screen-' + id);
    });

    victoryStars = document.getElementById('victory-stars');
    victoryTitle = document.getElementById('victory-title');
    victoryMsg   = document.getElementById('victory-msg');

    // Init subsystems
    Game.init();
    UI.init();

    // Load save
    loadSave();

    // Restore hero selection state from save
    if (save.hero) {
      const idx = Sprites.HERO_DEFS.findIndex(d => d.id === save.hero.id);
      showcaseHeroIdx = idx >= 0 ? idx : 0;
      showcasePreset  = save.hero.preset || 0;
    }
    applyHeroConfig();

    // Navigation buttons
    document.getElementById('btn-start').addEventListener('click', () => showScreen('map'));
    document.getElementById('btn-continue').addEventListener('click', () => {
      loadAndPlayLevel(save.lastWorld, save.lastLevel);
    });
    document.getElementById('btn-map-back').addEventListener('click', () => showScreen('home'));
    document.getElementById('btn-game-back').addEventListener('click', () => {
      Game.stop();
      showScreen('map');
    });

    // Victory modal
    document.getElementById('btn-replay').addEventListener('click', () => {
      hideModal('modal-victory');
      Game.resetLevel();
      UI.setupLevel(getLevel(currentWorld, currentLevel));
    });
    document.getElementById('btn-next').addEventListener('click', () => {
      hideModal('modal-victory');
      goToNextLevel();
    });

    // Fail modal
    document.getElementById('btn-retry').addEventListener('click', () => {
      hideModal('modal-fail');
      Game.resetLevel();
    });

    // Reset progress
    document.getElementById('btn-reset-progress').addEventListener('click', () => showModal('modal-reset'));
    document.getElementById('btn-reset-cancel').addEventListener('click', () => hideModal('modal-reset'));
    document.getElementById('btn-reset-confirm').addEventListener('click', () => {
      hideModal('modal-reset');
      resetSave();
      showcaseHeroIdx = 0;
      showcasePreset  = 0;
      applyHeroConfig();
      updateHomeButtons();
      buildHomeShowcase();
    });

    // Language
    I18n.detect();
    I18n.applyAll();
    updateLangButtons();

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        I18n.setLang(btn.dataset.lang);
        updateLangButtons();
        // Rebuild map if visible (world names may have changed)
        if (screens.map && screens.map.classList.contains('active')) buildMap();
      });
    });

    updateHomeButtons();
    buildHomeShowcase();
    showScreen('home');
  }

  function applyHeroConfig() {
    const def = Sprites.HERO_DEFS[showcaseHeroIdx];
    if (def) {
      Sprites.setHeroConfig(def.id, showcasePreset);
      Game.refreshHero();
    }
  }

  function saveHeroChoice() {
    const def = Sprites.HERO_DEFS[showcaseHeroIdx];
    if (def) {
      save.hero = { id: def.id, preset: showcasePreset };
      saveToDisk();
      applyHeroConfig();
    }
  }

  function updateLangButtons() {
    const lang = I18n.getLang();
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
  }

  function updateHomeButtons() {
    const hasProgress = save.lastWorld > 1 || save.lastLevel > 1 ||
      Object.keys(save.stars).length > 0;
    document.getElementById('btn-continue').style.display      = hasProgress ? '' : 'none';
    document.getElementById('btn-reset-progress').style.display = hasProgress ? '' : 'none';
  }

  function showScreen(name) {
    Object.values(screens).forEach(s => s && s.classList.remove('active'));
    if (screens[name]) screens[name].classList.add('active');

    if (name === 'map')  buildMap();
    if (name === 'home') { updateHomeButtons(); buildHomeShowcase(); }
  }

  // ---- Home Hero Showcase ----
  function buildHomeShowcase() {
    const showcaseEl = document.getElementById('hero-showcase');
    const colorsEl   = document.getElementById('showcase-colors');
    showcaseEl.innerHTML = '';
    colorsEl.innerHTML   = '';

    Sprites.HERO_DEFS.forEach((def, idx) => {
      const slot = document.createElement('div');
      slot.className = 'showcase-slot' + (idx === showcaseHeroIdx ? ' active' : '');

      const wrap = document.createElement('div');
      wrap.className = 'showcase-hero-wrap';
      // initHero injects all 4 direction SVGs; CSS shows only data-dir-svg="2" (front)
      Sprites.initHero(wrap, def.id, idx === showcaseHeroIdx ? showcasePreset : 0);

      const name = document.createElement('div');
      name.className = 'showcase-name';
      name.textContent = def.name;

      slot.appendChild(wrap);
      slot.appendChild(name);

      slot.addEventListener('click', () => {
        if (idx === showcaseHeroIdx) return; // already selected
        showcaseHeroIdx = idx;
        showcasePreset  = 0;
        saveHeroChoice();
        buildHomeShowcase();
      });

      showcaseEl.appendChild(slot);
    });

    // Color dots for the selected hero
    const def = Sprites.HERO_DEFS[showcaseHeroIdx];
    if (def) {
      def.presets.forEach((preset, idx) => {
        const dot = document.createElement('div');
        dot.className = 'color-dot' + (idx === showcasePreset ? ' active' : '');
        dot.style.background   = preset.p;
        dot.style.borderColor  = preset.pd;
        dot.title = I18n.t(preset.nameKey);

        dot.addEventListener('click', () => {
          if (idx === showcasePreset) return;
          showcasePreset = idx;
          saveHeroChoice();
          buildHomeShowcase();
        });

        colorsEl.appendChild(dot);
      });
    }
  }

  function setWorldTheme(worldId) {
    const root = document.documentElement;
    root.style.setProperty('--world-color', `var(--w${worldId})`);
    root.style.setProperty('--world-light', `var(--w${worldId}-light)`);
    root.style.setProperty('--world-dark',  `var(--w${worldId}-dark)`);
  }

  // ---- Map Screen ----
  function buildMap() {
    const mapScroll = document.getElementById('map-scroll');
    mapScroll.innerHTML = '';

    let currentNodeEl = null;

    WORLDS.forEach(world => {
      const worldUnlocked = isWorldUnlocked(world.id);
      const progress      = getWorldProgress(world.id);

      const worldEl = document.createElement('div');
      worldEl.className = 'map-world' + (worldUnlocked ? '' : ' world-locked');

      // World header
      const header = document.createElement('div');
      header.className = 'map-world-header';
      header.innerHTML = `
        <div class="map-world-icon">${world.icon}</div>
        <div class="map-world-info">
          <div class="map-world-name">${I18n.t(world.nameKey)}</div>
          <div class="map-world-desc">${I18n.t(world.descKey)}</div>
          <div class="map-world-progress">${worldUnlocked ? progress.completed + '/20' : '\uD83D\uDD12'}</div>
        </div>
      `;
      worldEl.appendChild(header);

      if (!worldUnlocked) {
        mapScroll.appendChild(worldEl);
        return;
      }

      // Build snake path: 5 rows of 4 nodes = 20 levels
      const pathEl   = document.createElement('div');
      pathEl.className = 'map-path';

      const unlockedLevel = save.unlocked[world.id] || 1;

      for (let row = 0; row < 5; row++) {
        // Bend connector between rows
        if (row > 0) {
          const bend = document.createElement('div');
          bend.className = 'map-bend ' + (row % 2 === 1 ? 'bend-left' : 'bend-right');
          pathEl.appendChild(bend);
        }

        const rowEl = document.createElement('div');
        rowEl.className = 'map-row' + (row % 2 === 1 ? ' reverse' : '');

        for (let col = 0; col < 4; col++) {
          const levelNum   = row * 4 + col + 1;
          const key        = world.id + '-' + levelNum;
          const earned     = save.stars[key] || 0;
          const isCompleted = earned > 0;
          const isUnlocked  = levelNum <= unlockedLevel;
          const isCurrent   = levelNum === unlockedLevel && !isCompleted;

          const nodeEl = document.createElement('div');
          nodeEl.className = 'map-node' +
            (isCompleted ? ' done'    : '') +
            (isCurrent   ? ' current' : '') +
            (!isUnlocked ? ' locked'  : '');

          let starsHTML = '';
          for (let s = 1; s <= 3; s++) {
            starsHTML += `<span class="${s <= earned ? 'map-star-on' : 'map-star-off'}">\u2605</span>`;
          }

          const circle = document.createElement('div');
          circle.className = 'map-node-circle';
          circle.textContent = isUnlocked ? levelNum : '\uD83D\uDD12';

          const stars = document.createElement('div');
          stars.className = 'map-node-stars';
          stars.innerHTML = starsHTML;

          nodeEl.appendChild(circle);
          nodeEl.appendChild(stars);

          if (isUnlocked) {
            nodeEl.addEventListener('click', () => loadAndPlayLevel(world.id, levelNum));
          }

          if (isCurrent) currentNodeEl = nodeEl;

          rowEl.appendChild(nodeEl);
        }

        pathEl.appendChild(rowEl);
      }

      worldEl.appendChild(pathEl);
      mapScroll.appendChild(worldEl);
    });

    // Scroll to current level node
    if (currentNodeEl) {
      setTimeout(() => {
        currentNodeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }
  }

  function isWorldUnlocked(worldId) {
    if (worldId === 1) return true;
    return getWorldProgress(worldId - 1).completed >= 10;
  }

  function getWorldProgress(worldId) {
    let completed = 0, totalStars = 0;
    for (let l = 1; l <= 20; l++) {
      const key = worldId + '-' + l;
      if (save.stars[key]) { completed++; totalStars += save.stars[key]; }
    }
    return { completed, totalStars };
  }

  // ---- Game ----
  function loadAndPlayLevel(worldId, levelNum) {
    currentWorld = worldId;
    currentLevel = levelNum;
    setWorldTheme(worldId);

    const level = getLevel(worldId, levelNum);
    if (!level) return;

    showScreen('game');

    const world = WORLDS.find(w => w.id === worldId);
    document.getElementById('game-world-name').textContent = world ? I18n.t(world.nameKey) : '';
    document.getElementById('game-level-num').textContent  = 'Level ' + levelNum;

    requestAnimationFrame(() => {
      Game.loadLevel(worldId, levelNum);
      UI.setupLevel(level);
      updateStarsDisplay();
    });

    save.lastWorld = worldId;
    save.lastLevel = levelNum;
    saveToDisk();
  }

  function updateStarsDisplay() {
    const key    = currentWorld + '-' + currentLevel;
    const earned = save.stars[key] || 0;
    const display = document.getElementById('game-stars-display');
    let html = '';
    for (let s = 1; s <= 3; s++) {
      html += `<span style="color:${s <= earned ? '#ecc94b' : '#e2e8f0'}">\u2605</span>`;
    }
    display.innerHTML = html;
  }

  // Called by UI when level is completed
  function onLevelComplete(result) {
    const key       = currentWorld + '-' + currentLevel;
    const prevStars = save.stars[key] || 0;

    if (result.stars > prevStars) save.stars[key] = result.stars;

    if (!save.unlocked[currentWorld] || currentLevel >= save.unlocked[currentWorld]) {
      save.unlocked[currentWorld] = currentLevel + 1;
    }

    for (let w = 1; w <= 8; w++) {
      if (!save.unlocked[w] && isWorldUnlocked(w)) save.unlocked[w] = 1;
    }

    saveToDisk();
    showVictoryModal(result);
  }

  function onLevelFail(reason) {
    let msg = I18n.t('fail_msg_default');
    if (reason === 'empty') {
      msg = I18n.t('fail_msg_empty');
    } else if (reason === 'not_at_goal') {
      const state = Game.getState();
      if (state.totalStars > 0 && state.collected < state.totalStars) {
        msg = I18n.t('fail_msg_stars');
      }
    }
    document.getElementById('fail-msg').textContent = msg;
    showModal('modal-fail');
  }

  function showVictoryModal(result) {
    let starsHTML = '';
    for (let s = 1; s <= 3; s++) {
      starsHTML += `<span class="victory-star ${s <= result.stars ? 'earned' : 'empty'}">\u2605</span>`;
    }
    victoryStars.innerHTML = starsHTML;

    const titles = ['victory_title_1','victory_title_2','victory_title_3','victory_title_4','victory_title_5'];
    victoryTitle.textContent = I18n.t(titles[Math.floor(Math.random() * titles.length)]);

    let msg = result.stars === 3 ? I18n.t('victory_perfect')
            : result.stars === 2 ? I18n.t('victory_good')
            : I18n.t('victory_ok');
    if (result.actions) msg += ' ' + I18n.t('victory_actions', result.actions);
    victoryMsg.textContent = msg;

    const btnNext = document.getElementById('btn-next');
    btnNext.textContent = (currentWorld === 8 && currentLevel === 20)
      ? I18n.t('btn_finish')
      : I18n.t('btn_next');

    showModal('modal-victory');
  }

  function goToNextLevel() {
    if (currentLevel < 20) {
      loadAndPlayLevel(currentWorld, currentLevel + 1);
    } else if (currentWorld < 8 && isWorldUnlocked(currentWorld + 1)) {
      loadAndPlayLevel(currentWorld + 1, 1);
    } else {
      showScreen('map');
    }
  }

  function showModal(id) { document.getElementById(id).style.display = ''; }
  function hideModal(id) { document.getElementById(id).style.display = 'none'; }

  // ---- Save System ----
  function loadSave() {
    try {
      const data = localStorage.getItem('tinylogic_save');
      if (data) save = { ...save, ...JSON.parse(data) };
    } catch (e) { console.warn('Could not load save:', e); }
  }

  function saveToDisk() {
    try {
      localStorage.setItem('tinylogic_save', JSON.stringify(save));
    } catch (e) { console.warn('Could not save:', e); }
  }

  function resetSave() {
    save = { unlocked: { 1: 1 }, stars: {}, lastWorld: 1, lastLevel: 1, hero: null };
    saveToDisk();
  }

  return { init, onLevelComplete, onLevelFail, resetSave };
})();

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
