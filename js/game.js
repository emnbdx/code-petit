/* ============================================
   CodePetit - Game Engine
   Handles grid rendering, hero movement,
   instruction execution, and game state.
   ============================================ */

const Game = (() => {
  // Game state
  let state = {
    level: null,         // Current level data
    worldId: 1,
    levelNum: 1,
    heroX: 0,
    heroY: 0,
    heroDir: 0,          // 0=up, 1=right, 2=down, 3=left
    stars: [],           // Collected star positions
    switchesOn: [],      // Activated switch positions
    doorsOpen: [],       // Opened door positions
    running: false,
    stepIndex: 0,
    speed: 1,            // 1=normal, 2=fast, 3=very fast
    gridCols: 0,
    gridRows: 0,
    grid: [],            // 2D parsed grid
    collected: 0,
    totalStars: 0,
    goalReached: false,
    actionCount: 0,
  };

  // Direction vectors: up, right, down, left
  const DX = [0, 1, 0, -1];
  const DY = [-1, 0, 1, 0];
  const DIR_NAMES = ['up', 'right', 'down', 'left'];

  // DOM refs
  let gridContainer, heroEl, gameArea;

  // Animation
  let animTimeout = null;
  let onComplete = null;
  let onStep = null;
  let walkFrame = 0; // 0,1,2 for idle, walk_a, walk_b

  // Grid cell references
  let cellEls = [];

  function init() {
    gridContainer = document.getElementById('grid-container');
    heroEl = document.getElementById('hero');
    gameArea = document.getElementById('game-area');

    // Generate sprite sheet and set as hero background
    const sheetUrl = Sprites.generate();
    heroEl.style.backgroundImage = `url(${sheetUrl})`;

    // Generate goal (treasure chest) sprite and expose via CSS var
    const goalUrl = Sprites.generateGoal();
    document.documentElement.style.setProperty('--goal-sprite', `url(${goalUrl})`);
  }

  function loadLevel(worldId, levelNum) {
    const level = getLevel(worldId, levelNum);
    if (!level) return false;

    state.level = level;
    state.worldId = worldId;
    state.levelNum = levelNum;
    state.heroX = level.hero[0];
    state.heroY = level.hero[1];
    state.heroDir = level.hero[2];
    state.stars = [];
    state.switchesOn = [];
    state.doorsOpen = [];
    state.running = false;
    state.stepIndex = 0;
    state.collected = 0;
    state.goalReached = false;
    state.actionCount = 0;

    // Parse grid
    state.gridRows = level.grid.length;
    state.gridCols = level.grid[0].length;
    state.grid = level.grid.map(row => row.split(''));

    // Count stars
    walkFrame = 0;
    state.totalStars = 0;
    for (let y = 0; y < state.gridRows; y++) {
      for (let x = 0; x < state.gridCols; x++) {
        if (state.grid[y][x] === '*') state.totalStars++;
      }
    }

    renderGrid();
    positionHero(false);

    // Auto-collect star at starting position
    const startTile = state.grid[state.heroY][state.heroX];
    if (startTile === '*') {
      state.stars.push([state.heroX, state.heroY]);
      state.collected++;
      updateCell(state.heroX, state.heroY);
    }

    return true;
  }

  function renderGrid() {
    // Calculate cell size to fit the screen
    const areaRect = gameArea.getBoundingClientRect();
    const maxW = areaRect.width - 24;  // padding
    const maxH = areaRect.height - 16;
    const cellFromW = Math.floor((maxW - (state.gridCols - 1) * 2 - 8) / state.gridCols);
    const cellFromH = Math.floor((maxH - (state.gridRows - 1) * 2 - 8) / state.gridRows);
    let cellSize = Math.min(cellFromW, cellFromH, 64);
    cellSize = Math.max(cellSize, 28); // minimum
    document.documentElement.style.setProperty('--cell-size', cellSize + 'px');

    gridContainer.style.gridTemplateColumns = `repeat(${state.gridCols}, var(--cell-size))`;
    gridContainer.style.gridTemplateRows = `repeat(${state.gridRows}, var(--cell-size))`;

    gridContainer.innerHTML = '';
    cellEls = [];

    for (let y = 0; y < state.gridRows; y++) {
      cellEls[y] = [];
      for (let x = 0; x < state.gridCols; x++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell ' + getCellClass(x, y);
        cell.dataset.x = x;
        cell.dataset.y = y;
        gridContainer.appendChild(cell);
        cellEls[y][x] = cell;
      }
    }
  }

  function getCellClass(x, y) {
    const tile = state.grid[y][x];
    switch (tile) {
      case '#': return 'wall';
      case 'G': return 'goal';
      case '*': {
        const collected = state.stars.some(s => s[0] === x && s[1] === y);
        return collected ? 'star collected' : 'star';
      }
      case 'S': {
        const on = state.switchesOn.some(s => s[0] === x && s[1] === y);
        return on ? 'path switch-on' : 'path switch-off';
      }
      case 'D': {
        const open = state.doorsOpen.some(d => d[0] === x && d[1] === y);
        return open ? 'door-open' : 'door-closed';
      }
      default: return 'path';
    }
  }

  function updateCell(x, y) {
    if (cellEls[y] && cellEls[y][x]) {
      cellEls[y][x].className = 'grid-cell ' + getCellClass(x, y);
    }
  }

  function setSpriteFrame(frame, dir) {
    if (!heroEl) return;
    const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
    // Sprite sheet: 3 columns (frames), 4 rows (directions)
    // frame: 0=idle, 1=walk_a, 2=walk_b
    // dir: game direction (0=up,1=right,2=down,3=left) -> sprite row via DIR_TO_ROW
    const row = Sprites.DIR_TO_ROW[dir];
    const px = -(frame * cellSize);
    const py = -(row * cellSize);
    heroEl.style.backgroundPosition = `${px}px ${py}px`;
  }

  function positionHero(animate) {
    if (!heroEl || !gridContainer) return;

    const gridRect = gridContainer.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
    const gap = 2;
    const padding = 4;

    const cellX = padding + state.heroX * (cellSize + gap);
    const cellY = padding + state.heroY * (cellSize + gap);

    // Position relative to game-area
    const offsetX = gridRect.left - gameRect.left + cellX;
    const offsetY = gridRect.top - gameRect.top + cellY;

    if (!animate) {
      heroEl.style.transition = 'none';
    } else {
      const speed = state.speed;
      const dur = speed === 3 ? 0.12 : speed === 2 ? 0.2 : 0.35;
      heroEl.style.transition = `left ${dur}s ease, top ${dur}s ease`;
    }

    heroEl.style.left = offsetX + 'px';
    heroEl.style.top = offsetY + 'px';

    // Set sprite direction and frame
    setSpriteFrame(animate ? walkFrame : 0, state.heroDir);

    if (!animate) {
      // Force reflow then re-enable transitions
      heroEl.offsetHeight;
      heroEl.style.transition = '';
    }
  }

  function resetLevel() {
    if (animTimeout) {
      clearTimeout(animTimeout);
      animTimeout = null;
    }
    state.heroX = state.level.hero[0];
    state.heroY = state.level.hero[1];
    state.heroDir = state.level.hero[2];
    state.stars = [];
    state.switchesOn = [];
    state.doorsOpen = [];
    state.running = false;
    state.stepIndex = 0;
    state.collected = 0;
    state.goalReached = false;
    state.actionCount = 0;

    // Re-render grid to reset visual states
    walkFrame = 0;
    renderGrid();
    positionHero(false);
  }

  function isWalkable(x, y) {
    if (x < 0 || x >= state.gridCols || y < 0 || y >= state.gridRows) return false;
    const tile = state.grid[y][x];
    if (tile === '#') return false;
    if (tile === 'D') {
      return state.doorsOpen.some(d => d[0] === x && d[1] === y);
    }
    return true;
  }

  function moveForward() {
    const nx = state.heroX + DX[state.heroDir];
    const ny = state.heroY + DY[state.heroDir];

    if (!isWalkable(nx, ny)) {
      // Bump animation
      const bx = DX[state.heroDir] * 5;
      const by = DY[state.heroDir] * 5;
      heroEl.style.setProperty('--bump-x', bx + 'px');
      heroEl.style.setProperty('--bump-y', by + 'px');
      heroEl.classList.add('bump');
      setTimeout(() => heroEl.classList.remove('bump'), 300);
      Sounds.bump();
      return false;
    }

    state.heroX = nx;
    state.heroY = ny;
    // Cycle walk frame between 1 and 2 for animation
    walkFrame = (walkFrame === 1) ? 2 : 1;
    positionHero(true);
    Sounds.step();

    // Check cell content
    const tile = state.grid[ny][nx];
    if (tile === '*' && !state.stars.some(s => s[0] === nx && s[1] === ny)) {
      state.stars.push([nx, ny]);
      state.collected++;
      updateCell(nx, ny);
      Sounds.collect();
    }
    if (tile === 'S' && !state.switchesOn.some(s => s[0] === nx && s[1] === ny)) {
      state.switchesOn.push([nx, ny]);
      updateCell(nx, ny);
      Sounds.switchOn();
      // Open all doors
      for (let gy = 0; gy < state.gridRows; gy++) {
        for (let gx = 0; gx < state.gridCols; gx++) {
          if (state.grid[gy][gx] === 'D' && !state.doorsOpen.some(d => d[0] === gx && d[1] === gy)) {
            state.doorsOpen.push([gx, gy]);
            updateCell(gx, gy);
          }
        }
      }
    }

    return true;
  }

  function turnLeft() {
    state.heroDir = (state.heroDir + 3) % 4;
    positionHero(true);
    Sounds.turn();
    return true;
  }

  function turnRight() {
    state.heroDir = (state.heroDir + 1) % 4;
    positionHero(true);
    Sounds.turn();
    return true;
  }

  function checkWin() {
    const tile = state.grid[state.heroY][state.heroX];
    if (tile !== 'G') return false;

    // Check if all stars are collected (if any exist)
    if (state.totalStars > 0 && state.collected < state.totalStars) return false;

    // Check if all switches are activated (for switch levels)
    let hasSwitches = false;
    for (let y = 0; y < state.gridRows; y++) {
      for (let x = 0; x < state.gridCols; x++) {
        if (state.grid[y][x] === 'S') {
          hasSwitches = true;
          if (!state.switchesOn.some(s => s[0] === x && s[1] === y)) return false;
        }
      }
    }

    return true;
  }

  function getStarsEarned(actionCount) {
    const opt = state.level.optimal;
    if (actionCount <= opt) return 3;
    if (actionCount <= opt + 2) return 2;
    return 1;
  }

  // Expand program (resolve loops and function calls)
  function expandProgram(mainProg, f1Prog, f2Prog, maxSteps) {
    const steps = [];
    const max = maxSteps || 200;

    function expand(prog, depth) {
      if (depth > 10 || steps.length > max) return;
      for (let i = 0; i < prog.length; i++) {
        if (steps.length > max) return;
        const instr = prog[i];

        if (instr.type === 'forward' || instr.type === 'left' || instr.type === 'right') {
          steps.push({ type: instr.type, index: instr.index, source: instr.source || 'main' });
        } else if (instr.type === 'loop') {
          const count = instr.count || 2;
          const body = instr.body || [];
          for (let j = 0; j < count; j++) {
            expand(body, depth + 1);
          }
        } else if (instr.type === 'f1' && f1Prog && f1Prog.length > 0) {
          expand(f1Prog, depth + 1);
        } else if (instr.type === 'f2' && f2Prog && f2Prog.length > 0) {
          expand(f2Prog, depth + 1);
        }
      }
    }

    expand(mainProg, 0);
    return steps;
  }

  // Execute the program step by step
  function execute(mainProg, f1Prog, f2Prog, callbacks) {
    onComplete = callbacks.onComplete || (() => {});
    onStep = callbacks.onStep || (() => {});

    // Expand program into flat steps
    const steps = expandProgram(mainProg, f1Prog, f2Prog);

    if (steps.length === 0) {
      callbacks.onFail && callbacks.onFail('empty');
      return;
    }

    state.running = true;
    state.stepIndex = 0;
    state.actionCount = mainProg.length + (f1Prog ? f1Prog.length : 0) + (f2Prog ? f2Prog.length : 0);

    // Count actual instruction blocks placed (for star rating)
    let placedCount = 0;
    function countPlaced(prog) {
      for (const instr of prog) {
        if (instr.type === 'loop') {
          placedCount++; // The loop block itself
          if (instr.body) countPlaced(instr.body);
        } else {
          placedCount++;
        }
      }
    }
    countPlaced(mainProg);
    if (f1Prog) countPlaced(f1Prog);
    if (f2Prog) countPlaced(f2Prog);
    state.actionCount = placedCount;

    function executeStep(idx) {
      if (!state.running) return;
      if (idx >= steps.length) {
        // Program finished - check if won
        state.running = false;
        if (checkWin()) {
          state.goalReached = true;
          const starsEarned = getStarsEarned(state.actionCount);
          Sounds.victory();
          onComplete({
            success: true,
            stars: starsEarned,
            actions: state.actionCount,
            optimal: state.level.optimal,
            collected: state.collected,
            totalStars: state.totalStars,
          });
        } else {
          Sounds.fail();
          callbacks.onFail && callbacks.onFail('not_at_goal');
        }
        return;
      }

      const step = steps[idx];
      onStep(idx, step);

      let success = true;
      switch (step.type) {
        case 'forward':
          success = moveForward();
          break;
        case 'left':
          turnLeft();
          break;
        case 'right':
          turnRight();
          break;
      }

      // Check if hero walked into wall (moveForward handles bump)
      // Check win after each step
      if (checkWin()) {
        state.running = false;
        state.goalReached = true;
        const starsEarned = getStarsEarned(state.actionCount);
        setTimeout(() => {
          Sounds.victory();
          onComplete({
            success: true,
            stars: starsEarned,
            actions: state.actionCount,
            optimal: state.level.optimal,
            collected: state.collected,
            totalStars: state.totalStars,
          });
        }, getStepDelay());
        return;
      }

      // Next step
      animTimeout = setTimeout(() => executeStep(idx + 1), getStepDelay());
    }

    executeStep(0);
  }

  function getStepDelay() {
    switch (state.speed) {
      case 3: return 150;
      case 2: return 250;
      default: return 450;
    }
  }

  function stop() {
    state.running = false;
    if (animTimeout) {
      clearTimeout(animTimeout);
      animTimeout = null;
    }
  }

  function cycleSpeed() {
    state.speed = (state.speed % 3) + 1;
    return state.speed;
  }

  return {
    init,
    loadLevel,
    resetLevel,
    execute,
    stop,
    cycleSpeed,
    getState() { return state; },
    getStarsEarned,
    expandProgram,
    positionHero,
    renderGrid,
  };
})();
