/* ============================================
   CodePetit - Sprite Generator
   Pixel-art bird with 4 directions + walk anim
   SNES style (24x24 sprites, pixelated render)
   ============================================ */

const Sprites = (() => {
  const SIZE = 24;
  const COLS = 3; // frames: idle, walk_a, walk_b
  const ROWS = 4; // directions: down, left, right, up

  const C = {
    body:    '#FFD966',
    outline: '#B8960F',
    belly:   '#FFF5CC',
    eyeW:    '#FFFFFF',
    eyeB:    '#1A1A2E',
    beak:    '#FF6B35',
    beakDk:  '#CC4400',
    wing:    '#E8C020',
    wingDk:  '#C09800',
    crest1:  '#FF6B35',
    crest2:  '#FF4422',
    foot:    '#DD7020',
    shadow:  'rgba(0,0,0,0.10)',
  };

  let sheetUrl = null;

  function rect(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  function generate() {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE * COLS;
    canvas.height = SIZE * ROWS;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        drawBird(ctx, col * SIZE, row * SIZE, row, col);
      }
    }

    sheetUrl = canvas.toDataURL();
    return sheetUrl;
  }

  function drawBody(ctx, ox, oy, bob) {
    const by = oy + 5 + bob;
    const bx = ox + 6;

    // Shadow under body
    rect(ctx, ox + 7, oy + 19, 10, 2, C.shadow);

    // Outline
    rect(ctx, bx + 3, by,     6, 1, C.outline);
    rect(ctx, bx + 1, by + 1, 10, 1, C.outline);
    rect(ctx, bx,     by + 2, 12, 1, C.outline);
    rect(ctx, bx,     by + 10, 12, 1, C.outline);
    rect(ctx, bx + 1, by + 11, 10, 1, C.outline);
    rect(ctx, bx + 3, by + 12, 6, 1, C.outline);
    // sides
    for (let i = 2; i <= 9; i++) {
      rect(ctx, bx, by + i, 1, 1, C.outline);
      rect(ctx, bx + 11, by + i, 1, 1, C.outline);
    }

    // Fill body
    rect(ctx, bx + 3, by + 1, 6, 1, C.body);
    rect(ctx, bx + 1, by + 2, 10, 8, C.body);
    rect(ctx, bx + 1, by + 10, 10, 1, C.body);
    rect(ctx, bx + 3, by + 11, 6, 1, C.body);
  }

  function drawBird(ctx, ox, oy, dir, frame) {
    // dir: 0=down, 1=left, 2=right, 3=up
    // frame: 0=idle, 1=walk_a, 2=walk_b
    const bob = (frame === 1) ? -1 : 0;
    const by = oy + 5 + bob;
    const bx = ox + 6;

    drawBody(ctx, ox, oy, bob);

    if (dir === 0) drawDown(ctx, ox, oy, bx, by, frame);
    else if (dir === 1) drawLeft(ctx, ox, oy, bx, by, frame);
    else if (dir === 2) drawRight(ctx, ox, oy, bx, by, frame);
    else drawUp(ctx, ox, oy, bx, by, frame);
  }

  function drawDown(ctx, ox, oy, bx, by, frame) {
    // Crest
    rect(ctx, bx + 6, by - 3, 2, 1, C.crest2);
    rect(ctx, bx + 5, by - 2, 3, 1, C.crest1);
    rect(ctx, bx + 5, by - 1, 2, 1, C.crest1);

    // Eyes
    rect(ctx, bx + 2, by + 3, 3, 3, C.eyeW);
    rect(ctx, bx + 3, by + 4, 2, 2, C.eyeB);
    rect(ctx, bx + 4, by + 4, 1, 1, C.eyeW); // highlight

    rect(ctx, bx + 7, by + 3, 3, 3, C.eyeW);
    rect(ctx, bx + 8, by + 4, 2, 2, C.eyeB);
    rect(ctx, bx + 9, by + 4, 1, 1, C.eyeW);

    // Beak
    rect(ctx, bx + 4, by + 8, 4, 2, C.beak);
    rect(ctx, bx + 5, by + 10, 2, 2, C.beak);
    rect(ctx, bx + 5, by + 12, 1, 1, C.beakDk);

    // Belly
    rect(ctx, bx + 3, by + 6, 6, 3, C.belly);

    // Wings
    rect(ctx, bx - 2, by + 4, 2, 5, C.wing);
    rect(ctx, bx - 2, by + 4, 2, 1, C.wingDk);
    rect(ctx, bx + 12, by + 4, 2, 5, C.wing);
    rect(ctx, bx + 12, by + 4, 2, 1, C.wingDk);

    // Feet
    drawFeetDown(ctx, bx, by, frame);
  }

  function drawRight(ctx, ox, oy, bx, by, frame) {
    // Crest (on back of head)
    rect(ctx, bx + 4, by - 3, 2, 1, C.crest2);
    rect(ctx, bx + 3, by - 2, 3, 1, C.crest1);
    rect(ctx, bx + 3, by - 1, 2, 1, C.crest1);

    // Eye (right side)
    rect(ctx, bx + 7, by + 3, 3, 3, C.eyeW);
    rect(ctx, bx + 8, by + 4, 2, 2, C.eyeB);
    rect(ctx, bx + 9, by + 4, 1, 1, C.eyeW);

    // Beak (pointing right)
    rect(ctx, bx + 12, by + 5, 3, 2, C.beak);
    rect(ctx, bx + 15, by + 5, 2, 1, C.beak);
    rect(ctx, bx + 15, by + 6, 1, 1, C.beakDk);

    // Belly
    rect(ctx, bx + 3, by + 6, 5, 3, C.belly);

    // Wing (left side visible)
    rect(ctx, bx - 2, by + 4, 3, 5, C.wing);
    rect(ctx, bx - 2, by + 4, 3, 1, C.wingDk);

    // Tail
    rect(ctx, bx - 1, by + 8, 2, 3, C.crest1);

    // Feet
    drawFeetSide(ctx, bx, by, frame, 1);
  }

  function drawLeft(ctx, ox, oy, bx, by, frame) {
    // Crest
    rect(ctx, bx + 6, by - 3, 2, 1, C.crest2);
    rect(ctx, bx + 6, by - 2, 3, 1, C.crest1);
    rect(ctx, bx + 7, by - 1, 2, 1, C.crest1);

    // Eye (left side)
    rect(ctx, bx + 2, by + 3, 3, 3, C.eyeW);
    rect(ctx, bx + 2, by + 4, 2, 2, C.eyeB);
    rect(ctx, bx + 2, by + 4, 1, 1, C.eyeW);

    // Beak (pointing left)
    rect(ctx, bx - 3, by + 5, 3, 2, C.beak);
    rect(ctx, bx - 5, by + 5, 2, 1, C.beak);
    rect(ctx, bx - 4, by + 6, 1, 1, C.beakDk);

    // Belly
    rect(ctx, bx + 4, by + 6, 5, 3, C.belly);

    // Wing (right side visible)
    rect(ctx, bx + 11, by + 4, 3, 5, C.wing);
    rect(ctx, bx + 11, by + 4, 3, 1, C.wingDk);

    // Tail
    rect(ctx, bx + 11, by + 8, 2, 3, C.crest1);

    // Feet
    drawFeetSide(ctx, bx, by, frame, -1);
  }

  function drawUp(ctx, ox, oy, bx, by, frame) {
    // Crest (very visible from behind)
    rect(ctx, bx + 5, by - 4, 2, 1, C.crest2);
    rect(ctx, bx + 4, by - 3, 4, 1, C.crest2);
    rect(ctx, bx + 4, by - 2, 4, 1, C.crest1);
    rect(ctx, bx + 4, by - 1, 3, 1, C.crest1);

    // No eyes (back of head)
    // Back pattern
    rect(ctx, bx + 4, by + 3, 4, 2, C.wingDk);

    // Wings
    rect(ctx, bx - 2, by + 4, 3, 5, C.wing);
    rect(ctx, bx - 2, by + 4, 3, 1, C.wingDk);
    rect(ctx, bx + 11, by + 4, 3, 5, C.wing);
    rect(ctx, bx + 11, by + 4, 3, 1, C.wingDk);

    // Tail
    rect(ctx, bx + 4, by + 10, 4, 2, C.crest1);
    rect(ctx, bx + 5, by + 12, 2, 2, C.crest1);
    rect(ctx, bx + 5, by + 14, 1, 1, C.crest2);

    // Feet
    drawFeetDown(ctx, bx, by, frame);
  }

  function drawFeetDown(ctx, bx, by, frame) {
    const fy = by + 13;
    if (frame === 0) {
      rect(ctx, bx + 2, fy, 2, 3, C.foot);
      rect(ctx, bx + 1, fy + 2, 1, 1, C.foot);
      rect(ctx, bx + 8, fy, 2, 3, C.foot);
      rect(ctx, bx + 10, fy + 2, 1, 1, C.foot);
    } else if (frame === 1) {
      rect(ctx, bx + 1, fy - 1, 2, 3, C.foot);
      rect(ctx, bx + 0, fy + 1, 1, 1, C.foot);
      rect(ctx, bx + 9, fy, 2, 3, C.foot);
      rect(ctx, bx + 11, fy + 2, 1, 1, C.foot);
    } else {
      rect(ctx, bx + 2, fy, 2, 3, C.foot);
      rect(ctx, bx + 1, fy + 2, 1, 1, C.foot);
      rect(ctx, bx + 10, fy - 1, 2, 3, C.foot);
      rect(ctx, bx + 12, fy + 1, 1, 1, C.foot);
    }
  }

  function drawFeetSide(ctx, bx, by, frame, dir) {
    const fy = by + 13;
    const fx1 = bx + 3;
    const fx2 = bx + 7;
    if (frame === 0) {
      rect(ctx, fx1, fy, 2, 3, C.foot);
      rect(ctx, fx1 + dir, fy + 2, 1, 1, C.foot);
      rect(ctx, fx2, fy, 2, 3, C.foot);
      rect(ctx, fx2 + dir, fy + 2, 1, 1, C.foot);
    } else if (frame === 1) {
      rect(ctx, fx1 + dir * 2, fy - 1, 2, 3, C.foot);
      rect(ctx, fx1 + dir * 3, fy + 1, 1, 1, C.foot);
      rect(ctx, fx2 - dir, fy, 2, 3, C.foot);
      rect(ctx, fx2, fy + 2, 1, 1, C.foot);
    } else {
      rect(ctx, fx1 - dir, fy, 2, 3, C.foot);
      rect(ctx, fx1, fy + 2, 1, 1, C.foot);
      rect(ctx, fx2 + dir * 2, fy - 1, 2, 3, C.foot);
      rect(ctx, fx2 + dir * 3, fy + 1, 1, 1, C.foot);
    }
  }

  // Map game direction to sprite row
  // Game: 0=up, 1=right, 2=down, 3=left
  // Sprite rows: 0=down, 1=left, 2=right, 3=up
  const DIR_TO_ROW = [3, 2, 0, 1];

  return {
    generate,
    getSheetUrl() { return sheetUrl; },
    SIZE,
    COLS,
    DIR_TO_ROW,
  };
})();
