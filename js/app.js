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

  // Hero showcase state (home screen)
  let showcaseHeroIdx = 0;
  let showcasePreset  = 0;

  let currentWorld = 1;
  let currentLevel = 1;

  // DOM refs
  const screens = {};
  let worldsGrid, levelsGrid, levelsTitle;
  let victoryStars, victoryTitle, victoryMsg;

  function init() {
    ['home', 'worlds', 'levels', 'game'].forEach(id => {
      screens[id] = document.getElementById('screen-' + id);
    });

    worldsGrid  = document.getElementById('worlds-grid');
    levelsGrid  = document.getElementById('levels-grid');
    levelsTitle = document.getElementById('levels-title');
    victoryStars = document.getElementById('victory-stars');
    victoryTitle = document.getElementById('victory-title');
    victoryMsg   = document.getElementById('victory-msg');

    Game.init();
    UI.init();
    loadSave();

    // Restore hero from save
    if (save.hero) {
      const idx = Sprites.HERO_DEFS.findIndex(d => d.id === save.hero.id);
      showcaseHeroIdx = idx >= 0 ? idx : 0;
      showcasePreset  = save.hero.preset || 0;
    }
    applyHeroConfig();

    // Navigation
    document.getElementById('btn-start').addEventListener('click', () => showScreen('worlds'));
    document.getElementById('btn-continue').addEventListener('click', () => {
      loadAndPlayLevel(save.lastWorld, save.lastLevel);
    });
    document.getElementById('btn-worlds-back').addEventListener('click', () => showScreen('home'));
    document.getElementById('btn-levels-back').addEventListener('click', () => showScreen('worlds'));
    document.getElementById('btn-game-back').addEventListener('click', () => {
      Game.stop();
      showScreen('levels');
      showLevels(currentWorld);
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
      buildWorldStrip();
    });

    // Language
    I18n.detect();
    I18n.applyAll();
    updateLangButtons();

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        I18n.setLang(btn.dataset.lang);
        updateLangButtons();
        if (screens.worlds && screens.worlds.classList.contains('active')) buildWorldsScreen();
        if (screens.home   && screens.home.classList.contains('active'))   { buildHomeShowcase(); buildWorldStrip(); }
      });
    });

    updateHomeButtons();
    buildHomeShowcase();
    buildWorldStrip();
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
    document.getElementById('btn-continue').style.display       = hasProgress ? '' : 'none';
    document.getElementById('btn-reset-progress').style.display = hasProgress ? '' : 'none';
  }

  function showScreen(name) {
    Object.values(screens).forEach(s => s && s.classList.remove('active'));
    if (screens[name]) screens[name].classList.add('active');

    if (name === 'worlds') buildWorldsScreen();
    if (name === 'levels') showLevels(currentWorld);
    if (name === 'home')   { updateHomeButtons(); buildHomeShowcase(); buildWorldStrip(); }
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
      Sprites.initHero(wrap, def.id, idx === showcaseHeroIdx ? showcasePreset : 0);

      const name = document.createElement('div');
      name.className = 'showcase-name';
      name.textContent = def.name;

      slot.appendChild(wrap);
      slot.appendChild(name);

      slot.addEventListener('click', () => {
        if (idx === showcaseHeroIdx) return;
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
        dot.style.background  = preset.p;
        dot.style.borderColor = preset.pd;
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

  // ---- World Progression Strip (home) ----
  function buildWorldStrip() {
    const strip = document.getElementById('world-strip');
    strip.innerHTML = '';

    const unlockedLevel = save.unlocked;
    let currentNodeEl = null;

    WORLDS.forEach((world, idx) => {
      // Connector between worlds
      if (idx > 0) {
        const conn = document.createElement('div');
        conn.className = 'world-strip-connector';
        strip.appendChild(conn);
      }

      const unlocked = isWorldUnlocked(world.id);
      const progress = getWorldProgress(world.id);
      const isCurrent = unlocked && getWorldProgress(world.id + 1).completed === 0 &&
                        (world.id === 8 || !isWorldUnlocked(world.id + 1));

      // World color CSS variable value
      const colorVal = getComputedStyle(document.documentElement)
        .getPropertyValue('--w' + world.id).trim();

      const node = document.createElement('div');
      node.className = 'world-strip-node' +
        (unlocked ? '' : ' locked') +
        (isCurrent ? ' current' : '');
      node.style.setProperty('--node-color', `var(--w${world.id})`);

      // Stars for this world
      let starsHTML = '';
      if (unlocked) {
        const maxStars = progress.completed * 3;
        const earned   = Math.min(progress.totalStars, maxStars);
        // Show filled/empty as ratio out of 3 dots
        const filledDots = progress.completed > 0 ? Math.round((progress.totalStars / (progress.completed * 3)) * 3) : 0;
        for (let s = 0; s < 3; s++) {
          starsHTML += `<span class="${s < filledDots ? 'world-strip-star-on' : 'world-strip-star-off'}">\u2605</span>`;
        }
      }

      node.innerHTML = `
        <div class="world-strip-circle">${unlocked ? world.icon : '\uD83D\uDD12'}</div>
        <div class="world-strip-label">${I18n.t(world.nameKey)}</div>
        <div class="world-strip-stars">${starsHTML}</div>
      `;

      if (unlocked) {
        node.addEventListener('click', () => {
          currentWorld = world.id;
          setWorldTheme(world.id);
          showScreen('levels');
        });
      }

      if (isCurrent) currentNodeEl = node;
      strip.appendChild(node);
    });

    // Scroll current world into view
    if (currentNodeEl) {
      setTimeout(() => {
        currentNodeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 100);
    }
  }

  function setWorldTheme(worldId) {
    const root = document.documentElement;
    root.style.setProperty('--world-color', `var(--w${worldId})`);
    root.style.setProperty('--world-light', `var(--w${worldId}-light)`);
    root.style.setProperty('--world-dark',  `var(--w${worldId}-dark)`);
  }

  // ---- Worlds Screen ----
  function buildWorldsScreen() {
    worldsGrid.innerHTML = '';

    WORLDS.forEach(world => {
      const unlocked = isWorldUnlocked(world.id);
      const progress = getWorldProgress(world.id);

      const card = document.createElement('div');
      card.className = 'world-card' + (unlocked ? '' : ' locked');
      card.style.setProperty('--card-color', `var(--w${world.id})`);
      card.style.setProperty('--card-light', `var(--w${world.id}-light)`);

      card.innerHTML = `
        <div class="world-card-icon">${world.icon}</div>
        <div class="world-card-info">
          <div class="world-card-name">${I18n.t(world.nameKey)}</div>
          <div class="world-card-desc">${I18n.t(world.descKey)}</div>
          <div class="world-card-progress">${unlocked ? progress.completed + '/20' : ''}</div>
        </div>
        ${unlocked ? '' : '<div class="world-card-lock">&#128274;</div>'}
      `;

      if (unlocked) {
        card.addEventListener('click', () => {
          currentWorld = world.id;
          setWorldTheme(world.id);
          showScreen('levels');
        });
      }

      worldsGrid.appendChild(card);
    });
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

  // ---- Levels Screen ----
  function showLevels(worldId) {
    setWorldTheme(worldId);
    const world = WORLDS.find(w => w.id === worldId);
    levelsTitle.textContent = world ? I18n.t(world.nameKey) : I18n.t('worlds_title') + ' ' + worldId;

    levelsGrid.innerHTML = '';

    const unlockedLevel = save.unlocked[worldId] || 1;

    for (let l = 1; l <= 20; l++) {
      const btn = document.createElement('button');
      const key = worldId + '-' + l;
      const earned     = save.stars[key] || 0;
      const isUnlocked = l <= unlockedLevel || isWorldFullyUnlocked(worldId);
      const isCompleted = earned > 0;
      const isCurrent   = l === unlockedLevel && !isCompleted;

      btn.className = 'level-btn' +
        (isCompleted ? ' completed' : '') +
        (isCurrent   ? ' current'   : '') +
        (!isUnlocked ? ' locked'    : '');

      let starsHTML = '';
      for (let s = 1; s <= 3; s++) {
        starsHTML += `<span class="level-star ${s <= earned ? 'earned' : ''}">\u2605</span>`;
      }

      btn.innerHTML = `${l}<div class="level-stars">${starsHTML}</div>`;

      if (isUnlocked) {
        btn.addEventListener('click', () => loadAndPlayLevel(worldId, l));
      }

      levelsGrid.appendChild(btn);
    }
  }

  function isWorldFullyUnlocked(worldId) {
    return (save.unlocked[worldId] || 1) > 20;
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
    } else if (currentWorld < 8) {
      if (isWorldUnlocked(currentWorld + 1)) {
        loadAndPlayLevel(currentWorld + 1, 1);
      } else {
        showScreen('worlds');
      }
    } else {
      showScreen('worlds');
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
