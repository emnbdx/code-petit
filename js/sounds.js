/* ============================================
   CodePetit - Sound System (Web Audio API)
   ============================================ */

const Sounds = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
  }

  function play(freq, duration, type, volume) {
    if (!enabled) return;
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.value = volume || 0.15;
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + duration);
    } catch (e) { /* silent fail */ }
  }

  function playSequence(notes, interval) {
    notes.forEach((n, i) => {
      setTimeout(() => play(n[0], n[1], n[2], n[3]), i * interval);
    });
  }

  return {
    init() {
      // Try to init on first user interaction
      document.addEventListener('touchstart', () => getCtx(), { once: true });
      document.addEventListener('click', () => getCtx(), { once: true });
    },

    toggle() {
      enabled = !enabled;
      return enabled;
    },

    step() {
      play(440, 0.1, 'sine', 0.08);
    },

    turn() {
      play(330, 0.08, 'triangle', 0.08);
    },

    collect() {
      playSequence([
        [880, 0.15, 'sine', 0.12],
        [1100, 0.2, 'sine', 0.12],
      ], 100);
    },

    switchOn() {
      playSequence([
        [300, 0.1, 'square', 0.08],
        [500, 0.15, 'square', 0.08],
      ], 80);
    },

    victory() {
      playSequence([
        [523, 0.15, 'sine', 0.15],
        [659, 0.15, 'sine', 0.15],
        [784, 0.15, 'sine', 0.15],
        [1047, 0.3, 'sine', 0.18],
      ], 150);
    },

    fail() {
      playSequence([
        [300, 0.2, 'sawtooth', 0.1],
        [200, 0.3, 'sawtooth', 0.1],
      ], 200);
    },

    bump() {
      play(150, 0.15, 'square', 0.1);
    },

    tap() {
      play(600, 0.05, 'sine', 0.06);
    },

    remove() {
      play(250, 0.08, 'sine', 0.06);
    }
  };
})();

Sounds.init();
