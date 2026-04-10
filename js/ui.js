/* ============================================
   CodePetit - UI Controller
   Handles instruction palette, program editing,
   tap-to-add, and game screen interactions.
   ============================================ */

const UI = (() => {
  // Current program
  let mainProgram = [];
  let f1Program = [];
  let f2Program = [];
  let activeTab = 'main'; // 'main', 'f1', 'f2'
  let loopBuildState = null; // null or { pending: true }

  // DOM refs
  let palette, programSlots, programArea;
  let btnRun, btnStop, btnReset, btnClear, btnSpeed, speedIcon;
  let functionArea, loopConfig;
  let tabMain, tabF1, tabF2;
  let gameHint;

  // Available tools for current level
  let availableTools = [];
  let hasLoops = false;
  let hasF1 = false;
  let hasF2 = false;

  // Instruction definitions
  const INSTRUCTIONS = {
    forward: { icon: '\u2B06', label: 'Avancer', css: 'forward' },
    left:    { icon: '\u21A9', label: 'Gauche', css: 'turn_left' },
    right:   { icon: '\u21AA', label: 'Droite', css: 'turn_right' },
    loop:    { icon: '\u{1F504}', label: 'Boucle', css: 'loop' },
    f1:      { icon: 'F1', label: 'F1', css: 'call-f1' },
    f2:      { icon: 'F2', label: 'F2', css: 'call-f2' },
  };

  function init() {
    palette = document.getElementById('palette');
    programSlots = document.getElementById('program-slots');
    programArea = document.getElementById('program-area');
    btnRun = document.getElementById('btn-run');
    btnStop = document.getElementById('btn-stop');
    btnReset = document.getElementById('btn-reset');
    btnClear = document.getElementById('btn-clear');
    btnSpeed = document.getElementById('btn-speed');
    speedIcon = document.getElementById('speed-icon');
    functionArea = document.getElementById('function-area');
    loopConfig = document.getElementById('loop-config');
    tabMain = document.getElementById('tab-main');
    tabF1 = document.getElementById('tab-f1');
    tabF2 = document.getElementById('tab-f2');
    gameHint = document.getElementById('game-hint');

    // Controls
    btnRun.addEventListener('click', runProgram);
    btnStop.addEventListener('click', stopProgram);
    btnReset.addEventListener('click', resetGame);
    btnClear.addEventListener('click', clearProgram);
    btnSpeed.addEventListener('click', changeSpeed);

    // Loop config
    document.getElementById('loop-cancel').addEventListener('click', () => {
      loopConfig.style.display = 'none';
      loopBuildState = null;
    });
    document.querySelectorAll('.loop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const count = parseInt(btn.dataset.count);
        loopConfig.style.display = 'none';
        addLoopToProgram(count);
        loopBuildState = null;
      });
    });

    // Function tabs
    tabMain.addEventListener('click', () => switchTab('main'));
    tabF1.addEventListener('click', () => switchTab('f1'));
    if (tabF2) tabF2.addEventListener('click', () => switchTab('f2'));
  }

  function setupLevel(level) {
    mainProgram = [];
    f1Program = [];
    f2Program = [];
    activeTab = 'main';
    loopBuildState = null;

    availableTools = level.tools || ['forward'];
    hasLoops = availableTools.includes('loop');
    hasF1 = availableTools.includes('f1');
    hasF2 = availableTools.includes('f2');

    // Show/hide function area
    if (hasF1 || hasF2) {
      functionArea.style.display = '';
      tabF1.style.display = hasF1 ? '' : 'none';
      tabF2.style.display = hasF2 ? '' : 'none';
      switchTab('main');
    } else {
      functionArea.style.display = 'none';
    }

    // Hint
    if (level.hint) {
      gameHint.textContent = level.hint;
      gameHint.style.display = '';
    } else {
      gameHint.style.display = 'none';
    }

    // Handle prefilled programs (for 'fix' type levels)
    if (level.type === 'fix' && level.prefill) {
      mainProgram = level.prefill.map(t => ({ type: t, id: uid() }));
    }

    buildPalette();
    renderProgram();

    // Show run, hide stop
    btnRun.style.display = '';
    btnStop.style.display = 'none';
  }

  function buildPalette() {
    palette.innerHTML = '';

    availableTools.forEach(tool => {
      if (tool === 'loop' || tool === 'f1' || tool === 'f2') {
        // Special handling
      }
      const def = INSTRUCTIONS[tool];
      if (!def) return;

      const btn = document.createElement('button');
      btn.className = 'palette-btn ' + def.css;
      btn.innerHTML = `<span>${def.icon}</span>`;
      btn.setAttribute('aria-label', def.label);
      btn.addEventListener('click', () => onPaletteTap(tool));
      palette.appendChild(btn);
    });
  }

  function onPaletteTap(tool) {
    Sounds.tap();
    const prog = getActiveProgram();

    if (tool === 'loop') {
      // Show loop count picker
      loopConfig.style.display = '';
      return;
    }

    if (prog.length >= 20) return; // Max program length

    prog.push({ type: tool, id: uid() });
    setActiveProgram(prog);
    renderProgram();
  }

  function addLoopToProgram(count) {
    const prog = getActiveProgram();
    if (prog.length >= 20) return;

    prog.push({
      type: 'loop',
      count: count,
      body: [],
      id: uid(),
      editing: true, // Flag to show we're adding to this loop
    });
    setActiveProgram(prog);
    renderProgram();
  }

  function getActiveProgram() {
    switch (activeTab) {
      case 'f1': return f1Program;
      case 'f2': return f2Program;
      default: return mainProgram;
    }
  }

  function setActiveProgram(prog) {
    switch (activeTab) {
      case 'f1': f1Program = prog; break;
      case 'f2': f2Program = prog; break;
      default: mainProgram = prog; break;
    }
  }

  function switchTab(tab) {
    activeTab = tab;
    tabMain.classList.toggle('active', tab === 'main');
    tabF1.classList.toggle('active', tab === 'f1');
    if (tabF2) tabF2.classList.toggle('active', tab === 'f2');
    renderProgram();
  }

  function renderProgram() {
    const prog = getActiveProgram();
    programSlots.innerHTML = '';
    programSlots.classList.remove('running');

    if (prog.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'program-empty';
      empty.textContent = activeTab === 'main' ? 'Ajoute des instructions !' :
                          `Definis ${activeTab.toUpperCase()} ici`;
      programSlots.appendChild(empty);
      return;
    }

    prog.forEach((instr, idx) => {
      if (instr.type === 'loop') {
        renderLoopBlock(instr, idx, prog);
      } else {
        const block = createBlock(instr, idx, prog);
        programSlots.appendChild(block);
      }
    });
  }

  function createBlock(instr, idx, prog) {
    const def = INSTRUCTIONS[instr.type];
    if (!def) return document.createElement('div');

    const block = document.createElement('button');
    block.className = 'program-block ' + def.css;
    block.innerHTML = `<span>${def.icon}</span><span class="block-remove">\u00D7</span>`;
    block.dataset.index = idx;
    block.dataset.id = instr.id;

    block.addEventListener('click', (e) => {
      if (Game.getState().running) return;
      // Remove this instruction
      Sounds.remove();
      prog.splice(idx, 1);
      setActiveProgram(prog);
      renderProgram();
    });

    return block;
  }

  function renderLoopBlock(loopInstr, loopIdx, prog) {
    // Loop start block
    const startBlock = document.createElement('button');
    startBlock.className = 'program-block loop-start';
    startBlock.innerHTML = `<span>\u{1F504}${loopInstr.count}</span><span class="block-remove">\u00D7</span>`;

    startBlock.addEventListener('click', () => {
      if (Game.getState().running) return;
      Sounds.remove();
      prog.splice(loopIdx, 1);
      setActiveProgram(prog);
      renderProgram();
    });

    programSlots.appendChild(startBlock);

    // Loop body
    if (loopInstr.body) {
      loopInstr.body.forEach((bodyInstr, bodyIdx) => {
        const def = INSTRUCTIONS[bodyInstr.type];
        if (!def) return;

        const block = document.createElement('button');
        block.className = 'program-block loop-body ' + def.css;
        block.innerHTML = `<span>${def.icon}</span><span class="block-remove">\u00D7</span>`;

        block.addEventListener('click', () => {
          if (Game.getState().running) return;
          Sounds.remove();
          loopInstr.body.splice(bodyIdx, 1);
          renderProgram();
        });

        programSlots.appendChild(block);
      });
    }

    // If loop is in editing mode, show add-to-loop indicator
    if (loopInstr.editing) {
      const addBtn = document.createElement('button');
      addBtn.className = 'program-block loop-body';
      addBtn.style.background = '#e6fffa';
      addBtn.style.border = '2px dashed #68d391';
      addBtn.style.fontSize = '14px';
      addBtn.innerHTML = '+';
      addBtn.addEventListener('click', () => {
        loopInstr.editing = false;
        renderProgram();
      });
      programSlots.appendChild(addBtn);
    }

    // Loop end
    const endBlock = document.createElement('button');
    endBlock.className = 'program-block loop-end';
    endBlock.innerHTML = '\u23CE';
    endBlock.addEventListener('click', () => {
      // Toggle editing mode
      if (Game.getState().running) return;
      loopInstr.editing = !loopInstr.editing;
      renderProgram();
    });
    programSlots.appendChild(endBlock);
  }

  // Override onPaletteTap to handle loop editing
  const origPaletteTap = onPaletteTap;

  function onPaletteTapWrapped(tool) {
    // Check if there's an active loop being edited
    const prog = getActiveProgram();
    const editingLoop = prog.find(i => i.type === 'loop' && i.editing);

    if (editingLoop && tool !== 'loop') {
      // Add to loop body instead of main program
      if (editingLoop.body.length >= 8) return; // Max loop body
      Sounds.tap();
      editingLoop.body.push({ type: tool, id: uid() });
      renderProgram();
      return;
    }

    // Normal handling
    origPaletteTap.call(null, tool);
  }

  // Replace palette tap handler after init
  function rebindPalette() {
    palette.querySelectorAll('.palette-btn').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    let toolIdx = 0;
    availableTools.forEach(tool => {
      const btns = palette.querySelectorAll('.palette-btn');
      if (toolIdx < btns.length) {
        btns[toolIdx].addEventListener('click', () => onPaletteTapWrapped(tool));
        toolIdx++;
      }
    });
  }

  // Override buildPalette to use wrapped handler
  function buildPaletteWrapped() {
    palette.innerHTML = '';

    availableTools.forEach(tool => {
      const def = INSTRUCTIONS[tool];
      if (!def) return;

      const btn = document.createElement('button');
      btn.className = 'palette-btn ' + def.css;
      btn.innerHTML = `<span>${def.icon}</span>`;
      btn.setAttribute('aria-label', def.label);
      btn.addEventListener('click', () => onPaletteTapWrapped(tool));
      palette.appendChild(btn);
    });
  }

  // Replace original buildPalette
  const origBuildPalette = buildPalette;

  function runProgram() {
    const prog = getActiveProgram();
    if (activeTab !== 'main') {
      switchTab('main');
    }

    if (mainProgram.length === 0) return;

    // Disable editing
    btnRun.style.display = 'none';
    btnStop.style.display = '';
    programSlots.classList.add('running');

    // Reset game state before running
    Game.resetLevel();

    // Small delay for reset animation
    setTimeout(() => {
      Game.execute(
        mainProgram,
        hasF1 ? f1Program : null,
        hasF2 ? f2Program : null,
        {
          onStep: (idx, step) => {
            highlightStep(idx);
          },
          onComplete: (result) => {
            btnRun.style.display = '';
            btnStop.style.display = 'none';
            programSlots.classList.remove('running');
            App.onLevelComplete(result);
          },
          onFail: (reason) => {
            btnRun.style.display = '';
            btnStop.style.display = 'none';
            programSlots.classList.remove('running');
            App.onLevelFail(reason);
          }
        }
      );
    }, 100);
  }

  function stopProgram() {
    Game.stop();
    btnRun.style.display = '';
    btnStop.style.display = 'none';
    programSlots.classList.remove('running');
    Game.resetLevel();
  }

  function resetGame() {
    Game.stop();
    Game.resetLevel();
    btnRun.style.display = '';
    btnStop.style.display = 'none';
    programSlots.classList.remove('running');
  }

  function clearProgram() {
    if (Game.getState().running) return;
    const prog = getActiveProgram();
    prog.length = 0;
    setActiveProgram(prog);
    renderProgram();
    Sounds.remove();
  }

  function changeSpeed() {
    const speed = Game.cycleSpeed();
    speedIcon.textContent = speed + 'x';
  }

  function highlightStep(idx) {
    // Remove previous highlights
    programSlots.querySelectorAll('.executing').forEach(el => {
      el.classList.remove('executing');
    });
    // Note: highlighting the correct block in the program for expanded steps
    // is complex with loops. We do a simple pulse on the program area instead.
    programSlots.classList.add('running');
  }

  // Unique ID generator
  let uidCounter = 0;
  function uid() {
    return '_' + (uidCounter++) + '_' + Date.now();
  }

  // Public API override after init
  const publicAPI = {
    init() {
      init();
      // Override buildPalette with wrapped version
    },
    setupLevel(level) {
      mainProgram = [];
      f1Program = [];
      f2Program = [];
      activeTab = 'main';
      loopBuildState = null;

      availableTools = level.tools || ['forward'];
      hasLoops = availableTools.includes('loop');
      hasF1 = availableTools.includes('f1');
      hasF2 = availableTools.includes('f2');

      // Show/hide function area
      if (hasF1 || hasF2) {
        functionArea.style.display = '';
        tabF1.style.display = hasF1 ? '' : 'none';
        tabF2.style.display = hasF2 ? '' : 'none';
        switchTab('main');
      } else {
        functionArea.style.display = 'none';
      }

      // Hint
      if (level.hint) {
        gameHint.textContent = level.hint;
        gameHint.style.display = '';
      } else {
        gameHint.style.display = 'none';
      }

      // Handle prefilled programs (for 'fix' type levels)
      if (level.type === 'fix' && level.prefill) {
        mainProgram = level.prefill.map(t => ({ type: t, id: uid() }));
      }

      buildPaletteWrapped();
      renderProgram();

      // Show run, hide stop
      btnRun.style.display = '';
      btnStop.style.display = 'none';
    },
    renderProgram,
    getPrograms() {
      return { main: mainProgram, f1: f1Program, f2: f2Program };
    },
  };

  return publicAPI;
})();
