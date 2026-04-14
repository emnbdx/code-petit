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

  // Hero select state
  let heroSelectId     = 'bird';
  let heroSelectPreset = 0;

  let currentWorld = 1;
  let currentLevel = 1;

  const screens = {};
  let worldsGrid, levelsGrid, levelsTitle;
  let victoryStars, victoryTitle, victoryMsg;

  // Tile order for the snake path (4 rows × 4 tiles)
  // For reversed rows, DOM order is reversed so visual order reads correctly.
  // Each entry: { wId, t } — wId = world 1-8, t = 0 (icon tile) or 1 (stars tile)
  const TILE_ROWS = [
    // Row 0 (LTR): W1 W1 W2 W2
    [{wId:1,t:0},{wId:1,t:1},{wId:2,t:0},{wId:2,t:1}],
    // Row 1 (RTL, reversed DOM): visual order W3 W3 W4 W4
    [{wId:4,t:1},{wId:4,t:0},{wId:3,t:1},{wId:3,t:0}],
    // Row 2 (LTR): W5 W5 W6 W6
    [{wId:5,t:0},{wId:5,t:1},{wId:6,t:0},{wId:6,t:1}],
    // Row 3 (RTL, reversed DOM): visual order W7 W7 W8 W8
    [{wId:8,t:1},{wId:8,t:0},{wId:7,t:1},{wId:7,t:0}],
  ];

  function init() {
    ['home', 'hero', 'worlds', 'levels', 'game'].forEach(id => {
      screens[id] = document.getElementById('screen-' + id);
    });

    worldsGrid   = document.getElementById('worlds-grid');
    levelsGrid   = document.getElementById('levels-grid');
    levelsTitle  = document.getElementById('levels-title');
    victoryStars = document.getElementById('victory-stars');
    victoryTitle = document.getElementById('victory-title');
    victoryMsg   = document.getElementById('victory-msg');

    Game.init();
    UI.init();
    loadSave();

    // Restore hero config
    if (save.hero) {
      heroSelectId     = save.hero.id;
      heroSelectPreset = save.hero.preset || 0;
      applyHeroConfig();
    }

    // Navigation
    document.getElementById('btn-start').addEventListener('click', () => {
      if (!save.hero) showScreen('hero');
      else showScreen('worlds');
    });
    document.getElementById('btn-continue').addEventListener('click', () => {
      loadAndPlayLevel(save.lastWorld, save.lastLevel);
    });
    document.getElementById('btn-hero-change').addEventListener('click', () => showScreen('hero'));
    document.getElementById('btn-worlds-back').addEventListener('click', () => showScreen('home'));
    document.getElementById('btn-levels-back').addEventListener('click', () => showScreen('worlds'));
    document.getElementById('btn-game-back').addEventListener('click', () => {
      Game.stop();
      showScreen('levels');
      showLevels(currentWorld);
    });

    // Hero confirm
    document.getElementById('btn-hero-confirm').addEventListener('click', () => {
      save.hero = { id: heroSelectId, preset: heroSelectPreset };
      saveToDisk();
      applyHeroConfig();
      updateHomeButtons();
      buildPathScene();
      showScreen('worlds');
    });

    // Victory
    document.getElementById('btn-replay').addEventListener('click', () => {
      hideModal('modal-victory');
      Game.resetLevel();
      UI.setupLevel(getLevel(currentWorld, currentLevel));
    });
    document.getElementById('btn-next').addEventListener('click', () => {
      hideModal('modal-victory');
      goToNextLevel();
    });

    // Fail
    document.getElementById('btn-retry').addEventListener('click', () => {
      hideModal('modal-fail');
      Game.resetLevel();
    });

    // Reset
    document.getElementById('btn-reset-progress').addEventListener('click', () => showModal('modal-reset'));
    document.getElementById('btn-reset-cancel').addEventListener('click', () => hideModal('modal-reset'));
    document.getElementById('btn-reset-confirm').addEventListener('click', () => {
      hideModal('modal-reset');
      resetSave();
      heroSelectId     = 'bird';
      heroSelectPreset = 0;
      applyHeroConfig();
      updateHomeButtons();
      buildPathScene();
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
        if (screens.hero   && screens.hero.classList.contains('active'))   buildHeroScreen();
        if (screens.home   && screens.home.classList.contains('active'))   buildPathScene();
      });
    });

    updateHomeButtons();
    buildPathScene();
    showScreen('home');
  }

  function applyHeroConfig() {
    Sprites.setHeroConfig(heroSelectId, heroSelectPreset);
    Game.refreshHero();
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
    const hasHero = !!save.hero;
    document.getElementById('btn-continue').style.display       = hasProgress ? '' : 'none';
    document.getElementById('btn-reset-progress').style.display = hasProgress ? '' : 'none';
    document.getElementById('btn-hero-change').style.display    = hasHero     ? '' : 'none';
  }

  function showScreen(name) {
    Object.values(screens).forEach(s => s && s.classList.remove('active'));
    if (screens[name]) screens[name].classList.add('active');

    if (name === 'worlds') buildWorldsScreen();
    if (name === 'levels') showLevels(currentWorld);
    if (name === 'home')   { updateHomeButtons(); buildPathScene(); }
    if (name === 'hero')   buildHeroScreen();
  }

  // ---- Home Path Scene ----
  function buildPathScene() {
    const scene = document.getElementById('home-path-scene');
    scene.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'path-grid';

    // Which row each hero walks on (0-indexed)
    // Bird on row 0, Cat on row 1, Robot on row 3
    const heroRows = [0, 1, 3];
    // LTR rows use wander-lr, RTL rows use wander-rl
    const isRTL = [false, true, false, true];

    TILE_ROWS.forEach((tiles, rowIdx) => {
      // Bend connector between rows
      if (rowIdx > 0) {
        const bend = document.createElement('div');
        bend.className = 'path-bend-h ' + (rowIdx % 2 === 1 ? 'bend-right-h' : 'bend-left-h');
        grid.appendChild(bend);
      }

      const rowEl = document.createElement('div');
      rowEl.className = 'path-row' + (isRTL[rowIdx] ? ' reverse' : '');

      tiles.forEach(({ wId, t }) => {
        const world    = WORLDS.find(w => w.id === wId);
        const unlocked = isWorldUnlocked(wId);
        const progress = getWorldProgress(wId);

        const tile = document.createElement('div');
        tile.className = 'path-tile ' + (unlocked ? 'unlocked' : 'tile-locked');
        tile.dataset.world = wId;
        tile.style.setProperty('--tile-bg',   `var(--w${wId}-light)`);
        tile.style.setProperty('--tile-dark',  `var(--w${wId}-dark)`);

        if (t === 0) {
          // Icon tile
          const icon = document.createElement('span');
          icon.className = 'path-tile-icon';
          icon.textContent = world.icon;
          tile.appendChild(icon);
        } else {
          // Stars tile
          let html = '<div class="path-tile-stars">';
          for (let s = 1; s <= 3; s++) {
            const filled = s <= Math.round((progress.totalStars / Math.max(progress.completed * 3, 1)) * 3);
            html += `<span class="${(unlocked && filled) ? 'path-ts-on' : 'path-ts-off'}">\u2605</span>`;
          }
          html += '</div>';
          tile.innerHTML = html;
        }


        rowEl.appendChild(tile);
      });

      // Add walking heroes for this row
      const heroIdx = heroRows.indexOf(rowIdx);
      if (heroIdx !== -1) {
        const def    = Sprites.HERO_DEFS[heroIdx];
        const preset = (def.id === heroSelectId) ? heroSelectPreset : 0;

        const outer = document.createElement('div');
        outer.className = `path-walker-outer path-walker-outer-${heroIdx}`;

        const walker = document.createElement('div');
        walker.className = 'path-walker';
        Sprites.initHero(walker, def.id, preset);

        outer.appendChild(walker);
        rowEl.appendChild(outer);
      }

      grid.appendChild(rowEl);
    });

    scene.appendChild(grid);
  }

  // ---- Hero Select Screen ----
  function buildHeroScreen() {
    heroSelectId     = save.hero ? save.hero.id     : 'bird';
    heroSelectPreset = save.hero ? save.hero.preset : 0;
    renderHeroCards();
    renderColorSwatches();
  }

  function renderHeroCards() {
    const container = document.getElementById('hero-cards');
    container.innerHTML = '';
    Sprites.HERO_DEFS.forEach(def => {
      const card = document.createElement('div');
      card.className = 'hero-card' + (def.id === heroSelectId ? ' selected' : '');
      card.dataset.heroId = def.id;
      const presetIdx = def.id === heroSelectId ? heroSelectPreset : 0;
      const previewSVG = Sprites.getPreviewSVG(def.id, presetIdx);
      card.innerHTML = `
        <div class="hero-card-preview">${previewSVG}</div>
        <div class="hero-card-name">${def.name}</div>
      `;
      card.addEventListener('click', () => {
        heroSelectId     = def.id;
        heroSelectPreset = 0;
        renderHeroCards();
        renderColorSwatches();
      });
      container.appendChild(card);
    });
  }

  function renderColorSwatches() {
    const container = document.getElementById('hero-color-swatches');
    container.innerHTML = '';
    const def = Sprites.getHeroDef(heroSelectId);
    def.presets.forEach((preset, idx) => {
      const swatch = document.createElement('div');
      swatch.className = 'hero-color-swatch' + (idx === heroSelectPreset ? ' selected' : '');
      swatch.innerHTML = `
        <div class="swatch-preview">${Sprites.getPreviewSVG(heroSelectId, idx)}</div>
        <div class="swatch-name">${I18n.t(preset.nameKey)}</div>
      `;
      swatch.addEventListener('click', () => {
        heroSelectPreset = idx;
        renderColorSwatches();
        renderHeroCards();
      });
      container.appendChild(swatch);
    });
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
    levelsTitle.textContent = world ? I18n.t(world.nameKey) : '';
    levelsGrid.innerHTML = '';

    const unlockedLevel = save.unlocked[worldId] || 1;

    for (let l = 1; l <= 20; l++) {
      const btn = document.createElement('button');
      const key = worldId + '-' + l;
      const earned      = save.stars[key] || 0;
      const isUnlocked  = l <= unlockedLevel || isWorldFullyUnlocked(worldId);
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

      if (isUnlocked) btn.addEventListener('click', () => loadAndPlayLevel(worldId, l));
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
      if (state.totalStars > 0 && state.collected < state.totalStars) msg = I18n.t('fail_msg_stars');
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
      ? I18n.t('btn_finish') : I18n.t('btn_next');

    showModal('modal-victory');
  }

  function goToNextLevel() {
    if (currentLevel < 20) {
      loadAndPlayLevel(currentWorld, currentLevel + 1);
    } else if (currentWorld < 8 && isWorldUnlocked(currentWorld + 1)) {
      loadAndPlayLevel(currentWorld + 1, 1);
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
