/* ============================================
   CodePetit - App Controller
   Navigation, save system, progression.
   ============================================ */

const App = (() => {
  // Save data
  let save = {
    unlocked: { 1: 1 },  // worldId: highest unlocked level
    stars: {},            // "w-l": stars earned (1-3)
    lastWorld: 1,
    lastLevel: 1,
  };

  let currentWorld = 1;
  let currentLevel = 1;

  // DOM refs
  const screens = {};
  let worldsGrid, levelsGrid, levelsTitle;
  let victoryStars, victoryTitle, victoryMsg;

  function init() {
    // Cache screens
    ['home', 'worlds', 'levels', 'game'].forEach(id => {
      screens[id] = document.getElementById('screen-' + id);
    });

    worldsGrid = document.getElementById('worlds-grid');
    levelsGrid = document.getElementById('levels-grid');
    levelsTitle = document.getElementById('levels-title');
    victoryStars = document.getElementById('victory-stars');
    victoryTitle = document.getElementById('victory-title');
    victoryMsg = document.getElementById('victory-msg');

    // Init subsystems
    Game.init();
    UI.init();

    // Load save
    loadSave();

    // Navigation buttons
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

    // Show continue button if there's progress
    if (save.lastWorld > 1 || save.lastLevel > 1) {
      document.getElementById('btn-continue').style.display = '';
    }

    // Show home
    showScreen('home');
  }

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');

    if (name === 'worlds') buildWorldsScreen();
    if (name === 'levels') showLevels(currentWorld);
  }

  function setWorldTheme(worldId) {
    const root = document.documentElement;
    root.style.setProperty('--world-color', `var(--w${worldId})`);
    root.style.setProperty('--world-light', `var(--w${worldId}-light)`);
    root.style.setProperty('--world-dark', `var(--w${worldId}-dark)`);
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
          <div class="world-card-name">${world.name}</div>
          <div class="world-card-desc">${world.desc}</div>
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
    // A world is unlocked if the previous world has at least 10 levels completed
    const prevProgress = getWorldProgress(worldId - 1);
    return prevProgress.completed >= 10;
  }

  function getWorldProgress(worldId) {
    let completed = 0;
    let totalStars = 0;
    for (let l = 1; l <= 20; l++) {
      const key = worldId + '-' + l;
      if (save.stars[key]) {
        completed++;
        totalStars += save.stars[key];
      }
    }
    return { completed, totalStars };
  }

  // ---- Levels Screen ----
  function showLevels(worldId) {
    setWorldTheme(worldId);
    const world = WORLDS.find(w => w.id === worldId);
    levelsTitle.textContent = world ? world.name : 'Monde ' + worldId;

    levelsGrid.innerHTML = '';

    const unlockedLevel = save.unlocked[worldId] || 1;

    for (let l = 1; l <= 20; l++) {
      const btn = document.createElement('button');
      const key = worldId + '-' + l;
      const earned = save.stars[key] || 0;
      const isUnlocked = l <= unlockedLevel || isWorldFullyUnlocked(worldId);
      const isCompleted = earned > 0;
      const isCurrent = l === unlockedLevel && !isCompleted;

      btn.className = 'level-btn' +
        (isCompleted ? ' completed' : '') +
        (isCurrent ? ' current' : '') +
        (!isUnlocked ? ' locked' : '');

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
    // If you've completed level 20, all levels are unlocked
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

    // Update header
    const world = WORLDS.find(w => w.id === worldId);
    document.getElementById('game-world-name').textContent = world ? world.name : '';
    document.getElementById('game-level-num').textContent = 'Niveau ' + levelNum;

    // Load level in game engine
    // Use requestAnimationFrame to ensure layout is computed
    requestAnimationFrame(() => {
      Game.loadLevel(worldId, levelNum);
      UI.setupLevel(level);

      // Update stars display
      updateStarsDisplay();
    });

    // Save last played
    save.lastWorld = worldId;
    save.lastLevel = levelNum;
    saveToDisk();
  }

  function updateStarsDisplay() {
    const key = currentWorld + '-' + currentLevel;
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
    const key = currentWorld + '-' + currentLevel;
    const prevStars = save.stars[key] || 0;

    // Update stars (keep best)
    if (result.stars > prevStars) {
      save.stars[key] = result.stars;
    }

    // Unlock next level
    if (!save.unlocked[currentWorld] || currentLevel >= save.unlocked[currentWorld]) {
      save.unlocked[currentWorld] = currentLevel + 1;
    }

    // Check if new world should unlock
    for (let w = 1; w <= 8; w++) {
      if (!save.unlocked[w] && isWorldUnlocked(w)) {
        save.unlocked[w] = 1;
      }
    }

    saveToDisk();

    // Show victory modal
    showVictoryModal(result);
  }

  function onLevelFail(reason) {
    let msg = 'Le robot n\'a pas atteint l\'objectif.';
    if (reason === 'empty') {
      msg = 'Ajoute des instructions avant de lancer !';
    } else if (reason === 'not_at_goal') {
      const state = Game.getState();
      if (state.totalStars > 0 && state.collected < state.totalStars) {
        msg = 'N\'oublie pas de ramasser toutes les etoiles !';
      }
    }

    document.getElementById('fail-msg').textContent = msg;
    showModal('modal-fail');
  }

  function showVictoryModal(result) {
    // Stars animation
    let starsHTML = '';
    for (let s = 1; s <= 3; s++) {
      starsHTML += `<span class="victory-star ${s <= result.stars ? 'earned' : 'empty'}">\u2605</span>`;
    }
    victoryStars.innerHTML = starsHTML;

    // Title
    const titles = ['Bravo !', 'Super !', 'Genial !', 'Parfait !', 'Magnifique !'];
    victoryTitle.textContent = titles[Math.floor(Math.random() * titles.length)];

    // Message
    let msg = '';
    if (result.stars === 3) {
      msg = 'Solution parfaite !';
    } else if (result.stars === 2) {
      msg = 'Bien joue ! Peux-tu faire mieux ?';
    } else {
      msg = 'Tu as reussi ! Essaie avec moins d\'instructions.';
    }
    if (result.actions) {
      msg += ` (${result.actions} instructions)`;
    }
    victoryMsg.textContent = msg;

    // Hide next button on last level of last world
    const btnNext = document.getElementById('btn-next');
    if (currentWorld === 8 && currentLevel === 20) {
      btnNext.textContent = 'Termine !';
    } else {
      btnNext.innerHTML = 'Suivant &#9654;';
    }

    showModal('modal-victory');
  }

  function goToNextLevel() {
    if (currentLevel < 20) {
      loadAndPlayLevel(currentWorld, currentLevel + 1);
    } else if (currentWorld < 8) {
      // Go to next world
      if (isWorldUnlocked(currentWorld + 1)) {
        loadAndPlayLevel(currentWorld + 1, 1);
      } else {
        showScreen('worlds');
      }
    } else {
      showScreen('worlds');
    }
  }

  function showModal(id) {
    document.getElementById(id).style.display = '';
  }

  function hideModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  // ---- Save System ----
  function loadSave() {
    try {
      const data = localStorage.getItem('codepetit_save');
      if (data) {
        const parsed = JSON.parse(data);
        save = { ...save, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load save:', e);
    }
  }

  function saveToDisk() {
    try {
      localStorage.setItem('codepetit_save', JSON.stringify(save));
    } catch (e) {
      console.warn('Could not save:', e);
    }
  }

  function resetSave() {
    save = { unlocked: { 1: 1 }, stars: {}, lastWorld: 1, lastLevel: 1 };
    saveToDisk();
  }

  return {
    init,
    onLevelComplete,
    onLevelFail,
    resetSave,
  };
})();

// Boot
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
