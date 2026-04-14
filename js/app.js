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
      buildHomeScreen();
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
      buildHomeScreen();
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
        if (screens.home   && screens.home.classList.contains('active'))   buildHomeScreen();
      });
    });

    updateHomeButtons();
    buildHomeScreen();
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
    if (name === 'home')   { updateHomeButtons(); buildHomeScreen(); }
    if (name === 'hero')   buildHeroScreen();
  }

  // ---- Home Screen ----
  function buildHomeScreen() {
    buildWorldsStrip();
  }

  function buildWorldsStrip() {
    const strip = document.getElementById('home-worlds-strip');
    strip.innerHTML = '';

    // NODE_W adapts to screen: ~3.5 nodes visible on any width, max 90px on desktop
    const NODE_W  = Math.round(Math.min(90, window.innerWidth / 3.5));
    const R       = 26;    // circle radius (52px diameter)
    const Y_TOP   = 38;    // circle center y — top nodes
    const Y_BOT   = 116;   // circle center y — bottom nodes
    const H       = 162;   // row height (labels + hero anim headroom)
    const TOTAL_W = NODE_W * WORLDS.length;

    // x centers align exactly with flex item midpoints
    const xPos = WORLDS.map((_, i) => NODE_W * i + NODE_W / 2);
    const yPos = WORLDS.map((_, i) => i % 2 === 0 ? Y_TOP : Y_BOT);

    const row = document.createElement('div');
    row.className = 'worlds-nodes-row';
    row.style.cssText = `width:${TOTAL_W}px;height:${H}px;`;

    // SVG sinuous path overlay (sized to match row exactly)
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg   = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${TOTAL_W} ${H}`);
    svg.classList.add('worlds-path-svg');

    let d = `M ${xPos[0]},${yPos[0]}`;
    for (let i = 1; i < WORLDS.length; i++) {
      const mx = (xPos[i-1] + xPos[i]) / 2;
      d += ` C ${mx},${yPos[i-1]} ${mx},${yPos[i]} ${xPos[i]},${yPos[i]}`;
    }

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'rgba(0,0,0,0.12)');
    path.setAttribute('stroke-width', '6');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-dasharray', '12 8');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
    row.appendChild(svg);

    // Flex nodes — padding-top positions circle center at Y_TOP or Y_BOT
    WORLDS.forEach((world, idx) => {
      const node = document.createElement('div');
      node.className        = 'worlds-node';
      node.style.width      = NODE_W + 'px';
      node.style.paddingTop = (yPos[idx] - R) + 'px';

      const circle = document.createElement('div');
      circle.className = 'home-world-circle';
      circle.style.background = `var(--w${world.id})`;
      circle.textContent = world.icon;

      const label = document.createElement('div');
      label.className = 'home-world-label';
      label.textContent = I18n.t(world.nameKey);

      node.appendChild(circle);
      node.appendChild(label);
      row.appendChild(node);
    });

    // Heroes: top-left, bottom-mid, top-right (absolute over row)
    [
      { xIdx: 1.5, y: Y_TOP - 10, anim: 'anim-float',       defIdx: 0 },
      { xIdx: 3.5, y: Y_BOT + 10, anim: 'anim-bounce-slow', defIdx: 1 },
      { xIdx: 5.5, y: Y_TOP - 10, anim: 'anim-wiggle',      defIdx: 2 },
    ].forEach(({ xIdx, y, anim, defIdx }) => {
      const def    = Sprites.HERO_DEFS[defIdx];
      const preset = def.id === heroSelectId ? heroSelectPreset : 0;
      const heroEl = document.createElement('div');
      heroEl.className  = 'map-hero-float ' + anim;
      heroEl.style.left = (xIdx * NODE_W) + 'px';
      heroEl.style.top  = y + 'px';
      heroEl.innerHTML  = Sprites.getPreviewSVG(def.id, preset);
      row.appendChild(heroEl);
    });

    strip.appendChild(row);
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
