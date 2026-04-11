/* ============================================
   CodePetit - Level Data (160 levels)
   8 worlds x 20 levels each
   ============================================ */

const WORLDS = [
  { id: 1, name: 'La Prairie',   icon: '\u{1F33F}', desc: 'Premiers pas',       color: 'w1' },
  { id: 2, name: 'La For\u00eat',icon: '\u{1F332}', desc: 'S\u00e9quences',     color: 'w2' },
  { id: 3, name: 'La Plage',     icon: '\u{1F3D6}',  desc: 'Tourner',            color: 'w3' },
  { id: 4, name: 'La Montagne',  icon: '\u{26F0}',   desc: 'Obstacles',          color: 'w4' },
  { id: 5, name: 'Le D\u00e9sert',icon:'\u{1F3DC}',  desc: 'Patterns',           color: 'w5' },
  { id: 6, name: "L'Oc\u00e9an", icon: '\u{1F30A}',  desc: 'Boucles',            color: 'w6' },
  { id: 7, name: "L'Espace",     icon: '\u{1F680}',  desc: 'Fonctions',          color: 'w7' },
  { id: 8, name: 'Le Ch\u00e2teau',icon:'\u{1F3F0}', desc: 'Tout ensemble',      color: 'w8' },
];

/*
  Grid legend:
    . = path (walkable)
    # = wall
    * = star (collectible)
    G = goal
    S = switch
    D = door (closed, opens when switch stepped on)

  hero: [x, y, direction]  x=col, y=row, dir: 0=up 1=right 2=down 3=left
  tools: available instructions
  optimal: minimum instruction blocks for 3 stars
  type: normal | guided | fix | challenge | collect | switch
*/

const LEVELS = [

  // =============================================
  // WORLD 1 - LA PRAIRIE (forward only)
  // =============================================
  // 1-1
  { grid: ['.G'], hero: [0,0,1], tools: ['forward'], optimal: 1, hint: 'Appuie sur Avancer !', type: 'guided' },
  // 1-2
  { grid: ['..G'], hero: [0,0,1], tools: ['forward'], optimal: 2, hint: 'Avance 2 fois', type: 'guided' },
  // 1-3
  { grid: ['...G'], hero: [0,0,1], tools: ['forward'], optimal: 3, hint: 'Avance encore !', type: 'guided' },
  // 1-4
  { grid: ['G','.','.'], hero: [0,2,0], tools: ['forward'], optimal: 2, hint: 'Le robot monte', type: 'normal' },
  // 1-5
  { grid: ['G','.','.','.'], hero: [0,3,0], tools: ['forward'], optimal: 3, type: 'normal' },
  // 1-6
  { grid: ['.','.','.','G'], hero: [0,0,2], tools: ['forward'], optimal: 3, type: 'normal' },
  // 1-7
  { grid: ['G..','...','...'], hero: [2,0,3], tools: ['forward'], optimal: 2, type: 'normal' },
  // 1-8
  { grid: ['....G'], hero: [0,0,1], tools: ['forward'], optimal: 4, type: 'normal' },
  // 1-9
  { grid: ['G','.','.','.','.'], hero: [0,4,0], tools: ['forward'], optimal: 4, type: 'normal' },
  // 1-10
  { grid: ['.....G'], hero: [0,0,1], tools: ['forward'], optimal: 5, type: 'normal' },
  // 1-11
  { grid: ['.','.','G'], hero: [0,0,2], tools: ['forward'], optimal: 2, type: 'normal' },
  // 1-12
  { grid: ['.','.','.','G'], hero: [0,0,2], tools: ['forward'], optimal: 3, type: 'normal' },
  // 1-13
  { grid: ['G.....'], hero: [5,0,3], tools: ['forward'], optimal: 5, type: 'normal' },
  // 1-14
  { grid: ['.','.','G'], hero: [0,0,2], tools: ['forward'], optimal: 2, type: 'normal' },
  // 1-15
  { grid: ['.*G'], hero: [0,0,1], tools: ['forward'], optimal: 2, hint: 'Ramasse les etoiles !', type: 'collect' },
  // 1-16
  { grid: ['.*.*G'], hero: [0,0,1], tools: ['forward'], optimal: 4, type: 'collect' },
  // 1-17
  { grid: ['G','*','.','.'], hero: [0,3,0], tools: ['forward'], optimal: 3, type: 'collect' },
  // 1-18
  { grid: ['.','*','.','*','G'], hero: [0,0,2], tools: ['forward'], optimal: 4, type: 'collect' },
  // 1-19
  { grid: ['.*.*.*G'], hero: [0,0,1], tools: ['forward'], optimal: 6, type: 'challenge' },
  // 1-20
  { grid: ['G','*','.','*','.','*','.'], hero: [0,6,0], tools: ['forward'], optimal: 6, type: 'challenge' },

  // =============================================
  // WORLD 2 - LA FORET (longer sequences, forward only)
  // =============================================
  // 2-1
  { grid: ['...G','....','....'], hero: [0,0,1], tools: ['forward'], optimal: 3, type: 'normal' },
  // 2-2
  { grid: ['G...','....','....'], hero: [3,0,3], tools: ['forward'], optimal: 3, type: 'normal' },
  // 2-3
  { grid: ['...','...','.G.','...','...'], hero: [1,0,2], tools: ['forward'], optimal: 2, type: 'normal' },
  // 2-4
  { grid: ['....','....','...G','....'], hero: [3,0,2], tools: ['forward'], optimal: 2, type: 'normal' },
  // 2-5
  { grid: ['.....G'], hero: [0,0,1], tools: ['forward'], optimal: 5, type: 'normal' },
  // 2-6
  { grid: ['.*..G'], hero: [0,0,1], tools: ['forward'], optimal: 4, type: 'collect' },
  // 2-7
  { grid: ['G','*','.','.','*','.'], hero: [0,5,0], tools: ['forward'], optimal: 5, type: 'collect' },
  // 2-8
  { grid: ['.*.*.G'], hero: [0,0,1], tools: ['forward'], optimal: 5, type: 'collect' },
  // 2-9
  { grid: ['G*.*..'], hero: [5,0,3], tools: ['forward'], optimal: 5, type: 'collect' },
  // 2-10
  { grid: ['...*..G'], hero: [0,0,1], tools: ['forward'], optimal: 6, type: 'collect' },
  // 2-11
  { grid: ['G','*','.','.','*','.','.'], hero: [0,6,0], tools: ['forward'], optimal: 6, type: 'collect' },
  // 2-12
  { grid: ['..*.*.G'], hero: [0,0,1], tools: ['forward'], optimal: 6, type: 'collect' },
  // 2-13
  { grid: ['.','.','*','.','G'], hero: [0,0,2], tools: ['forward'], optimal: 4, type: 'collect' },
  // 2-14
  { grid: ['.*.*.*..G'], hero: [0,0,1], tools: ['forward'], optimal: 8, type: 'collect' },
  // 2-15
  { grid: ['......G'], hero: [0,0,1], tools: ['forward'], optimal: 6, type: 'normal' },
  // 2-16
  { grid: ['G','.','.','.','.','.','.'], hero: [0,6,0], tools: ['forward'], optimal: 6, type: 'normal' },
  // 2-17
  { grid: ['.......G'], hero: [0,0,1], tools: ['forward'], optimal: 7, type: 'normal' },
  // 2-18
  { grid: ['.*.*.*.*G'], hero: [0,0,1], tools: ['forward'], optimal: 8, type: 'collect' },
  // 2-19
  { grid: ['G','*','*','.','*','*','.','.'], hero: [0,7,0], tools: ['forward'], optimal: 7, type: 'challenge' },
  // 2-20
  { grid: ['.*.*.*.*.*G'], hero: [0,0,1], tools: ['forward'], optimal: 10, type: 'challenge' },

  // =============================================
  // WORLD 3 - LA PLAGE (turning)
  // =============================================
  // 3-1
  { grid: ['.G','..'], hero: [0,1,0], tools: ['forward','right'], optimal: 3, hint: 'Avance, tourne, avance !', type: 'guided' },
  // 3-2
  { grid: ['..','G.'], hero: [1,0,2], tools: ['forward','right'], optimal: 3, hint: 'Avance, tourne droite, avance', type: 'guided' },
  // 3-3
  { grid: ['..G','...','...'], hero: [0,2,0], tools: ['forward','right'], optimal: 4, type: 'normal' },
  // 3-4
  { grid: ['...','...','.G.'], hero: [2,0,2], tools: ['forward','right'], optimal: 4, type: 'normal' },
  // 3-5
  { grid: ['...','..G','...'], hero: [0,0,1], tools: ['forward','right'], optimal: 4, type: 'normal' },
  // 3-6
  { grid: ['...G','....','....','....'], hero: [0,3,0], tools: ['forward','right'], optimal: 6, type: 'normal' },
  // 3-7
  { grid: ['G...','....','....','....'], hero: [3,3,0], tools: ['forward','right'], optimal: 6, type: 'normal' },
  // 3-8
  { grid: ['...*','..G.','....'], hero: [0,2,0], tools: ['forward','right'], optimal: 5, type: 'collect' },
  // 3-9
  { grid: ['....','..G.','....','*...'], hero: [0,3,0], tools: ['forward','right'], optimal: 5, type: 'collect' },
  // 3-10
  { grid: ['....','.G..','....','....','....'], hero: [0,4,0], tools: ['forward','right'], optimal: 6, type: 'normal' },
  // 3-11 (introduce left turn)
  { grid: ['G.','..'], hero: [1,1,0], tools: ['forward','right','left'], optimal: 3, hint: 'Essaie tourne gauche !', type: 'guided' },
  // 3-12
  { grid: ['G..','...','...'], hero: [2,2,3], tools: ['forward','right','left'], optimal: 4, type: 'normal' },
  // 3-13
  { grid: ['...','...','..G'], hero: [0,0,2], tools: ['forward','right','left'], optimal: 4, type: 'normal' },
  // 3-14
  { grid: ['G...','....','....'], hero: [3,2,3], tools: ['forward','right','left'], optimal: 5, type: 'normal' },
  // 3-15
  { grid: ['.G..','....','....','....'], hero: [0,3,0], tools: ['forward','right','left'], optimal: 5, type: 'normal' },
  // 3-16
  { grid: ['....','..*.','..G.','....'], hero: [0,3,0], tools: ['forward','right','left'], optimal: 6, type: 'collect' },
  // 3-17
  { grid: ['*...','....','...G','....'], hero: [0,0,2], tools: ['forward','right','left'], optimal: 6, type: 'collect' },
  // 3-18
  { grid: ['....','.*..','....','G...'], hero: [3,0,2], tools: ['forward','right','left'], optimal: 7, type: 'collect' },
  // 3-19
  { grid: ['G....','.....','*....','.....','.....'], hero: [4,4,3], tools: ['forward','right','left'], optimal: 8, type: 'challenge' },
  // 3-20
  { grid: ['....*','.....','.....','.....','.G...'], hero: [0,0,2], tools: ['forward','right','left'], optimal: 8, type: 'challenge' },

  // =============================================
  // WORLD 4 - LA MONTAGNE (obstacles / walls)
  // =============================================
  // 4-1
  { grid: ['..G.','.#..','....'], hero: [0,2,0], tools: ['forward','left','right'], optimal: 4, hint: 'Contourne le mur !', type: 'guided' },
  // 4-2
  { grid: ['....','..#.','..G.'], hero: [0,0,2], tools: ['forward','left','right'], optimal: 5, type: 'normal' },
  // 4-3
  { grid: ['G...','##..','....'], hero: [0,2,0], tools: ['forward','left','right'], optimal: 5, type: 'normal' },
  // 4-4
  { grid: ['.G..','....','.#..','....'], hero: [0,3,0], tools: ['forward','left','right'], optimal: 5, type: 'normal' },
  // 4-5
  { grid: ['....','#.#.','..G.','....'], hero: [0,0,2], tools: ['forward','left','right'], optimal: 5, type: 'normal' },
  // 4-6
  { grid: ['.G...','.#...','..#..','...#.','....#'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 6, type: 'normal' },
  // 4-7
  { grid: ['...G.','..#..','.....','..#..','.....'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 7, type: 'normal' },
  // 4-8
  { grid: ['.....','..##.','..G..','.....','..#..'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 7, type: 'normal' },
  // 4-9
  { grid: ['G....','###..','.....','.####','.....'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 8, type: 'normal' },
  // 4-10
  { grid: ['.....','.###.','...G.','.#...','.....'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 7, type: 'normal' },
  // 4-11
  { grid: ['.....','#.##.','.....','.##.#','G....'], hero: [4,0,2], tools: ['forward','left','right'], optimal: 8, type: 'normal' },
  // 4-12
  { grid: ['....G','..##.','.....','.##..','.....'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 8, type: 'normal' },
  // 4-13
  { grid: ['G.....','.####.','......','####..','......'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 10, type: 'normal' },
  // 4-14
  { grid: ['.....','..#..','G.#..','..#..','..#..','.....'], hero: [4,5,0], tools: ['forward','left','right'], optimal: 9, type: 'normal' },
  // 4-15
  { grid: ['*..G.','.##..','.....','.##..','.....'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 7, type: 'collect' },
  // 4-16
  { grid: ['....G','.###.','*....','.###.','.....'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 9, type: 'collect' },
  // 4-17
  { grid: ['..*..','.#.#.','.....','.#.#.','G..*.'], hero: [4,0,2], tools: ['forward','left','right'], optimal: 10, type: 'collect' },
  // 4-18
  { grid: ['*....','####.','..G..','####.','*....'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 10, type: 'collect' },
  // 4-19
  { grid: ['G.....','######','......','######','......','......'], hero: [0,5,0], tools: ['forward','left','right'], optimal: 11, type: 'challenge' },
  // 4-20
  { grid: ['G.....','.####.','......','.####.','......','.####.','......'], hero: [5,6,3], tools: ['forward','left','right'], optimal: 13, type: 'challenge' },

  // =============================================
  // WORLD 5 - LE DESERT (patterns / pre-loops)
  // Repetitive sequences: forward+right, zigzags, spirals
  // =============================================
  // 5-1: Staircase right 2 steps (fwd,fwd,right, fwd,fwd,right pattern)
  { grid: ['..G','...','.#.','...'], hero: [0,3,0], tools: ['forward','left','right'], optimal: 5, hint: 'Repete le meme motif !', type: 'guided' },
  // 5-2: Staircase left
  { grid: ['G..','...','.#.','...'], hero: [2,3,0], tools: ['forward','left','right'], optimal: 5, type: 'normal' },
  // 5-3: 3-step staircase right
  { grid: ['...G','#...','.#..','....'], hero: [0,3,0], tools: ['forward','left','right'], optimal: 7, type: 'normal' },
  // 5-4: Zigzag right-left
  { grid: ['..G.','..#.','....','....'], hero: [0,3,0], tools: ['forward','left','right'], optimal: 7, type: 'normal' },
  // 5-5: Long staircase
  { grid: ['.....','....G','....#','...#.','..#..','.....','.....'], hero: [0,6,0], tools: ['forward','left','right'], optimal: 9, type: 'normal' },
  // 5-6: Zigzag down
  { grid: ['.....','.#.#.','.....','#.#..','....G'], hero: [0,0,1], tools: ['forward','left','right'], optimal: 9, type: 'normal' },
  // 5-7: S-curve
  { grid: ['....','.##.','....','.##.','G...'], hero: [3,0,2], tools: ['forward','left','right'], optimal: 9, type: 'normal' },
  // 5-8: Reverse S-curve
  { grid: ['.....','.###.','.....','.###.','G....'], hero: [0,0,2], tools: ['forward','left','right'], optimal: 9, type: 'normal' },
  // 5-9: Spiral small CW
  { grid: ['G....','.###.','.....','.....','....#'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 9, type: 'normal' },
  // 5-10: Box pattern
  { grid: ['.G...','.#...','.....','...#.','.....'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 9, type: 'normal' },
  // 5-11: Double zigzag with star
  { grid: ['*....','####.','.....','.####','G....'], hero: [4,0,2], tools: ['forward','left','right'], optimal: 9, type: 'collect' },
  // 5-12: Long S-curve
  { grid: ['......','.####.','......','......','.####.','G.....'], hero: [5,0,2], tools: ['forward','left','right'], optimal: 11, type: 'normal' },
  // 5-13: Triple zigzag
  { grid: ['......','#####.','......','.#####','......','G.....'], hero: [5,0,2], tools: ['forward','left','right'], optimal: 11, type: 'normal' },
  // 5-14: Staircase with stars
  { grid: ['....G','*..#.','..#..','*#...','.....'], hero: [0,4,0], tools: ['forward','left','right'], optimal: 9, type: 'collect' },
  // 5-15: Spiral medium
  { grid: ['.....G','..###.','..#...','..#.#.','....#.','......'], hero: [0,5,0], tools: ['forward','left','right'], optimal: 11, type: 'normal' },
  // 5-16: Serpentine
  { grid: ['.......','######.','.......','.######','G......'], hero: [6,0,2], tools: ['forward','left','right'], optimal: 13, type: 'normal' },
  // 5-17: Long zigzag with stars
  { grid: ['*......','######.','.......','.######','*......','######.','G......'], hero: [6,0,2], tools: ['forward','left','right'], optimal: 13, type: 'collect' },
  // 5-18: Complex S-pattern
  { grid: ['........','.######.','........','........','.######.','........','........','G.......'], hero: [7,0,2], tools: ['forward','left','right'], optimal: 15, type: 'normal' },
  // 5-19: Full serpentine challenge
  { grid: ['*......','######.','.......','.######','......*','######.','G......'], hero: [6,0,2], tools: ['forward','left','right'], optimal: 13, type: 'challenge' },
  // 5-20: Grand spiral
  { grid: ['G.......','########','.......#','######.#','.....#.#','####.#.#','...#...#','...#####'], hero: [0,7,0], tools: ['forward','left','right'], optimal: 17, type: 'challenge' },

  // =============================================
  // WORLD 6 - L'OCEAN (loops)
  // =============================================
  // 6-1: Simple loop forward x4
  { grid: ['....G'], hero: [0,0,1], tools: ['forward','left','right','loop'], optimal: 2, hint: 'Boucle: avancer x4 !', type: 'guided' },
  // 6-2: Loop forward x6
  { grid: ['......G'], hero: [0,0,1], tools: ['forward','left','right','loop'], optimal: 2, type: 'normal' },
  // 6-3: Loop up x5
  { grid: ['G','.','.','.','.','.','.'], hero: [0,6,0], tools: ['forward','left','right','loop'], optimal: 2, type: 'normal' },
  // 6-4: Loop left x6
  { grid: ['G......'], hero: [6,0,3], tools: ['forward','left','right','loop'], optimal: 2, type: 'normal' },
  // 6-5: Loop forward with star
  { grid: ['.*.*.*G'], hero: [0,0,1], tools: ['forward','left','right','loop'], optimal: 2, type: 'collect' },
  // 6-6: Loop staircase (fwd+right) x3
  { grid: ['..G','..#','.#.','...'], hero: [0,3,0], tools: ['forward','left','right','loop'], optimal: 3, hint: 'Boucle: avancer+droite !', type: 'guided' },
  // 6-7: Loop staircase left x3
  { grid: ['G..','#..','...','.#.','...'], hero: [2,4,0], tools: ['forward','left','right','loop'], optimal: 3, type: 'normal' },
  // 6-8: Loop L-shape x2
  { grid: ['.....','....G','....#','..#..','.....','.....'], hero: [0,5,0], tools: ['forward','left','right','loop'], optimal: 4, type: 'normal' },
  // 6-9: Zigzag loop (fwd,right,fwd,left) x2
  { grid: ['....G','.##..','.....','..##.','.....'], hero: [0,4,0], tools: ['forward','left','right','loop'], optimal: 5, type: 'normal' },
  // 6-10: Serpentine with loop
  { grid: ['.....','.###.','.....','.###.','G....'], hero: [4,0,2], tools: ['forward','left','right','loop'], optimal: 5, type: 'normal' },
  // 6-11: Loop forward x3 + turn + loop fwd x3
  { grid: ['...G','...#','...#','....'], hero: [0,3,0], tools: ['forward','left','right','loop'], optimal: 4, type: 'normal' },
  // 6-12: Double staircase
  { grid: ['....G','...#.','..#..','.#...','.....','.....'], hero: [0,5,0], tools: ['forward','left','right','loop'], optimal: 3, type: 'normal' },
  // 6-13: Square loop (fwd,right) x4
  { grid: ['G....','.###.','.#.#.','.#...','.....'], hero: [0,4,0], tools: ['forward','left','right','loop'], optimal: 3, type: 'normal' },
  // 6-14: Star collection with loop
  { grid: ['*.*.*.*G'], hero: [0,0,1], tools: ['forward','left','right','loop'], optimal: 2, type: 'collect' },
  // 6-15: Zigzag stars
  { grid: ['*....','.###.','.....','.###.','G*...'], hero: [4,0,2], tools: ['forward','left','right','loop'], optimal: 5, type: 'collect' },
  // 6-16: Long corridor
  { grid: ['..........G'], hero: [0,0,1], tools: ['forward','left','right','loop'], optimal: 2, type: 'normal' },
  // 6-17: Staircase x5
  { grid: ['.....G','....#.','...#..','.#....','#.....','......'], hero: [0,5,0], tools: ['forward','left','right','loop'], optimal: 3, type: 'normal' },
  // 6-18: Nested pattern feel
  { grid: ['G.....','.####.','......','......','.####.','......'], hero: [5,0,2], tools: ['forward','left','right','loop'], optimal: 5, type: 'normal' },
  // 6-19: Big square challenge
  { grid: ['G......','.#####.','.#...#.','.#.#.#.','.#...#.','.#####.','.......'], hero: [0,6,0], tools: ['forward','left','right','loop'], optimal: 3, type: 'challenge' },
  // 6-20: Spiral challenge
  { grid: ['G.......','#######.','........','.#######','........','#######.','........','G.......'], hero: [7,0,2], tools: ['forward','left','right','loop'], optimal: 5, type: 'challenge' },

  // =============================================
  // WORLD 7 - L'ESPACE (functions F1)
  // F1 = reusable sub-program
  // =============================================
  // 7-1: F1 = forward,forward - call F1 twice
  { grid: ['....G'], hero: [0,0,1], tools: ['forward','left','right','loop','f1'], optimal: 4, hint: 'F1 = avancer+avancer', type: 'guided' },
  // 7-2: F1 = fwd,fwd,fwd - use to cross
  { grid: ['......G'], hero: [0,0,1], tools: ['forward','left','right','loop','f1'], optimal: 5, type: 'normal' },
  // 7-3: F1 = fwd,right - staircase
  { grid: ['..G','..#','.#.','...'], hero: [0,3,0], tools: ['forward','left','right','loop','f1'], optimal: 4, type: 'normal' },
  // 7-4: F1 = fwd,fwd,right - L-shapes
  { grid: ['...G','...#','...#','....'], hero: [0,3,0], tools: ['forward','left','right','loop','f1'], optimal: 5, type: 'normal' },
  // 7-5: F1 called in loop
  { grid: ['....G','...#.','..#..','.#...','.....'], hero: [0,4,0], tools: ['forward','left','right','loop','f1'], optimal: 4, type: 'normal' },
  // 7-6: F1 = fwd,left - left staircase
  { grid: ['G..','#..','...','.#.','...'], hero: [2,4,0], tools: ['forward','left','right','loop','f1'], optimal: 4, type: 'normal' },
  // 7-7: F1 = fwd,fwd - long corridor
  { grid: ['..........G'], hero: [0,0,1], tools: ['forward','left','right','loop','f1'], optimal: 4, type: 'normal' },
  // 7-8: F1 = right,fwd,left,fwd - zigzag
  { grid: ['.....','####.','.....','.####','G....'], hero: [4,0,2], tools: ['forward','left','right','loop','f1'], optimal: 6, type: 'normal' },
  // 7-9: F1 with stars
  { grid: ['*.*.*G'], hero: [0,0,1], tools: ['forward','left','right','loop','f1'], optimal: 4, type: 'collect' },
  // 7-10: F1 in loop for zigzag
  { grid: ['......','#####.','......','.#####','......','#####.','G.....'], hero: [5,0,2], tools: ['forward','left','right','loop','f1'], optimal: 6, type: 'normal' },
  // 7-11: F1 = fwd,right,fwd,right (square side)
  { grid: ['G....','.###.','.#.#.','.#...','.....'], hero: [0,4,0], tools: ['forward','left','right','loop','f1'], optimal: 4, type: 'normal' },
  // 7-12: F1 = complex pattern
  { grid: ['......','#####.','......','.#####','G.....'], hero: [5,0,2], tools: ['forward','left','right','loop','f1'], optimal: 6, type: 'normal' },
  // 7-13: F1 staircase with collection
  { grid: ['....G*','....#.','...#..','..#...','.#....','......'], hero: [0,5,0], tools: ['forward','left','right','loop','f1'], optimal: 4, type: 'collect' },
  // 7-14: F1 = fwd,fwd,left called in loop
  { grid: ['G.....','.####.','....#.','..###.','......'], hero: [0,4,0], tools: ['forward','left','right','loop','f1'], optimal: 6, type: 'normal' },
  // 7-15: F1 serpentine
  { grid: ['*......','######.','.......','.######','*......','######.','G......'], hero: [6,0,2], tools: ['forward','left','right','loop','f1'], optimal: 6, type: 'collect' },
  // 7-16: F1 big staircase
  { grid: ['......G','......#','.....#.','....#..','...#...','..#....','..#....'], hero: [0,6,0], tools: ['forward','left','right','loop','f1'], optimal: 4, type: 'normal' },
  // 7-17: F1 = pattern reuse x4
  { grid: ['........G','........#','.......#.','......#..','.....#...','....#....','...#.....','..#......','.........'], hero: [0,8,0], tools: ['forward','left','right','loop','f1'], optimal: 4, type: 'normal' },
  // 7-18: F1 collect all
  { grid: ['*...*','####.','.....','.####','*...*','####.','G....'], hero: [4,0,2], tools: ['forward','left','right','loop','f1'], optimal: 6, type: 'collect' },
  // 7-19: F1 challenge maze
  { grid: ['G.......','########','........','.#######','........','########','........'], hero: [7,0,2], tools: ['forward','left','right','loop','f1'], optimal: 6, type: 'challenge' },
  // 7-20: F1 grand spiral challenge
  { grid: ['G.......','######..','........','.#######','........','######..','........','........'], hero: [7,7,0], tools: ['forward','left','right','loop','f1'], optimal: 6, type: 'challenge' },

  // =============================================
  // WORLD 8 - LE CHATEAU (F1 + F2 + loops + switches)
  // =============================================
  // 8-1: Review - F1 = fwd,fwd in loop
  { grid: ['..........G'], hero: [0,0,1], tools: ['forward','left','right','loop','f1','f2'], optimal: 4, hint: 'F1+F2+boucles !', type: 'guided' },
  // 8-2: F1 = fwd,right / F2 = fwd,left
  { grid: ['....G','...#.','.#...','.....','..#..'], hero: [0,4,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 6, type: 'normal' },
  // 8-3: F1 + F2 zigzag
  { grid: ['......','#####.','......','.#####','......','#####.','G.....'], hero: [5,0,2], tools: ['forward','left','right','loop','f1','f2'], optimal: 6, type: 'normal' },
  // 8-4: F1+F2 staircase
  { grid: ['....G','...#.','..#..','.#...','.....'], hero: [0,4,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 5, type: 'normal' },
  // 8-5: Stars with F1+F2
  { grid: ['*....*','#####.','......','.#####','......','G*....'], hero: [5,0,2], tools: ['forward','left','right','loop','f1','f2'], optimal: 6, type: 'collect' },
  // 8-6: F2 = new pattern
  { grid: ['G.......','.######.','........','........','.######.','........'], hero: [7,0,2], tools: ['forward','left','right','loop','f1','f2'], optimal: 6, type: 'normal' },
  // 8-7: Complex F1+F2 reuse
  { grid: ['........','#######.','........','.#######','........','#######.','........','G.......'], hero: [7,0,2], tools: ['forward','left','right','loop','f1','f2'], optimal: 6, type: 'normal' },
  // 8-8: F1+F2+loop combo
  { grid: ['......G','......#','.....#.','....#..','...#...','..#....','..#....'], hero: [0,6,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 5, type: 'normal' },
  // 8-9: Stars serpentine
  { grid: ['*......','######.','.......','.######','*......','######.','G.....*'], hero: [6,0,2], tools: ['forward','left','right','loop','f1','f2'], optimal: 6, type: 'collect' },
  // 8-10: Big loop+function maze
  { grid: ['G........','########.','.........','.########','.........','.########','.........'], hero: [8,0,2], tools: ['forward','left','right','loop','f1','f2'], optimal: 6, type: 'normal' },
  // 8-11: Switch intro
  { grid: ['..G..','..D..','.....','..S..','.....','.....'], hero: [2,5,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 4, hint: 'Active le bouton !', type: 'switch' },
  // 8-12: Switch + corridor
  { grid: ['G.....','.D....','......','......','.S....','......'], hero: [1,5,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 5, type: 'switch' },
  // 8-13: Switch + maze
  { grid: ['..G..','..D..','..#..','.....','..S..','.....','.....'], hero: [2,6,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 5, type: 'switch' },
  // 8-14: Switch + detour
  { grid: ['.G....','.D....','......','..###.','......','.S....','......'], hero: [1,6,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 7, type: 'switch' },
  // 8-15: Switch + star
  { grid: ['*....G','..D...','......','..S...','......','......'], hero: [2,5,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 7, type: 'switch' },
  // 8-16: Double switch
  { grid: ['....G.','..D...','......','..S...','.....D','......','....S.','......'], hero: [2,7,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 8, type: 'switch' },
  // 8-17: Complex switch maze
  { grid: ['G......','#D#....','.......','.......','..S....','.......','.......'], hero: [1,6,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 8, type: 'switch' },
  // 8-18: Full combo with stars
  { grid: ['*..G..','..D...','......','..S...','......','*....*','......'], hero: [2,6,0], tools: ['forward','left','right','loop','f1','f2'], optimal: 8, type: 'switch' },
  // 8-19: Grand puzzle
  { grid: ['G........','..######.','..#......','..#.####.','..#......','..######.','.........'], hero: [8,0,2], tools: ['forward','left','right','loop','f1','f2'], optimal: 7, type: 'challenge' },
  // 8-20: Final challenge
  { grid: ['G.........','..########','..........','########..','..........','..########','..........','########..','..........'], hero: [9,0,2], tools: ['forward','left','right','loop','f1','f2'], optimal: 6, type: 'challenge' },
];

// Helper functions
function getLevelsForWorld(worldId) {
  const start = (worldId - 1) * 20;
  return LEVELS.slice(start, start + 20);
}

function getLevel(worldId, levelNum) {
  return LEVELS[(worldId - 1) * 20 + (levelNum - 1)];
}
