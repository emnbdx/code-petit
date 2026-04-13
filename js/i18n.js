/* ============================================
   Tiny Logic - Internationalization
   Supported: en (default), fr, es
   ============================================ */

const I18n = (() => {

  const LANGS = ['en', 'fr', 'es'];

  const T = {
    // ---- App ----
    app_name:    { en: 'Tiny Logic', fr: 'Tiny Logic', es: 'Tiny Logic' },
    home_subtitle: {
      en: 'Learn logic by playing!',
      fr: 'Apprends la logique en jouant !',
      es: '¡Aprende lógica jugando!',
    },

    // ---- Home buttons ----
    btn_play:           { en: 'Play',           fr: 'Jouer',            es: 'Jugar' },
    btn_continue:       { en: 'Continue',       fr: 'Continuer',        es: 'Continuar' },
    btn_change_hero:    { en: 'Change hero',    fr: 'Changer de héros', es: 'Cambiar héroe' },
    btn_reset_progress: { en: 'Reset progress', fr: 'Tout recommencer', es: 'Reiniciar progreso' },

    // ---- Hero select ----
    hero_select_title: {
      en: 'Choose your hero!',
      fr: 'Choisis ton héros !',
      es: '¡Elige tu héroe!',
    },
    hero_select_sub: {
      en: 'Who will join you on the adventure?',
      fr: "Qui va t'accompagner dans l'aventure ?",
      es: '¿Quién te acompañará en la aventura?',
    },
    hero_colors_label: {
      en: 'Customize colors:',
      fr: 'Personnalise ses couleurs :',
      es: 'Personaliza sus colores:',
    },
    btn_hero_confirm: { en: "Let's go!", fr: "C'est parti !", es: '¡Vamos!' },

    // ---- Worlds screen ----
    worlds_title: { en: 'Worlds', fr: 'Les Mondes', es: 'Los Mundos' },

    // ---- World names ----
    world_1_name: { en: 'The Meadow',   fr: 'La Prairie',     es: 'La Pradera' },
    world_2_name: { en: 'The Forest',   fr: 'La Forêt',       es: 'El Bosque' },
    world_3_name: { en: 'The Beach',    fr: 'La Plage',       es: 'La Playa' },
    world_4_name: { en: 'The Mountain', fr: 'La Montagne',    es: 'La Montaña' },
    world_5_name: { en: 'The Desert',   fr: 'Le Désert',      es: 'El Desierto' },
    world_6_name: { en: 'The Ocean',    fr: "L'Océan",        es: 'El Océano' },
    world_7_name: { en: 'Space',        fr: "L'Espace",       es: 'El Espacio' },
    world_8_name: { en: 'The Castle',   fr: 'Le Château',     es: 'El Castillo' },

    // ---- World descriptions ----
    world_1_desc: { en: 'First steps',  fr: 'Premiers pas',   es: 'Primeros pasos' },
    world_2_desc: { en: 'Sequences',    fr: 'Séquences',      es: 'Secuencias' },
    world_3_desc: { en: 'Turning',      fr: 'Tourner',        es: 'Girar' },
    world_4_desc: { en: 'Obstacles',    fr: 'Obstacles',      es: 'Obstáculos' },
    world_5_desc: { en: 'Patterns',     fr: 'Patterns',       es: 'Patrones' },
    world_6_desc: { en: 'Loops',        fr: 'Boucles',        es: 'Bucles' },
    world_7_desc: { en: 'Functions',    fr: 'Fonctions',      es: 'Funciones' },
    world_8_desc: { en: 'All together', fr: 'Tout ensemble',  es: 'Todo junto' },

    // ---- Instructions ----
    instr_forward: { en: 'Forward',    fr: 'Avancer',    es: 'Avanzar' },
    instr_left:    { en: 'Left',       fr: 'Gauche',     es: 'Izquierda' },
    instr_right:   { en: 'Right',      fr: 'Droite',     es: 'Derecha' },
    instr_loop:    { en: 'Loop',       fr: 'Boucle',     es: 'Bucle' },
    instr_f1:      { en: 'F1',         fr: 'F1',         es: 'F1' },
    instr_f2:      { en: 'F2',         fr: 'F2',         es: 'F2' },

    // ---- Game UI ----
    program_label:   { en: 'My program:',        fr: 'Mon programme :',           es: 'Mi programa:' },
    program_empty:   { en: 'Add instructions!',  fr: 'Ajoute des instructions !', es: '¡Agrega instrucciones!' },
    tab_main:        { en: 'Main',               fr: 'Principal',                 es: 'Principal' },
    func_define:     { en: 'Define {0} here',    fr: 'Définis {0} ici',           es: 'Define {0} aquí' },
    loop_label:      { en: 'How many times?',    fr: 'Combien de fois ?',         es: '¿Cuántas veces?' },
    btn_cancel:      { en: 'Cancel',             fr: 'Annuler',                   es: 'Cancelar' },

    // ---- Victory ----
    victory_title_1: { en: 'Great!',     fr: 'Bravo !',      es: '¡Genial!' },
    victory_title_2: { en: 'Awesome!',   fr: 'Super !',      es: '¡Súper!' },
    victory_title_3: { en: 'Amazing!',   fr: 'Génial !',     es: '¡Increíble!' },
    victory_title_4: { en: 'Perfect!',   fr: 'Parfait !',    es: '¡Perfecto!' },
    victory_title_5: { en: 'Wonderful!', fr: 'Magnifique !', es: '¡Maravilloso!' },
    victory_perfect: { en: 'Perfect solution!',                   fr: 'Solution parfaite !',                   es: '¡Solución perfecta!' },
    victory_good:    { en: 'Well done! Can you do better?',       fr: 'Bien joué ! Peux-tu faire mieux ?',     es: '¡Bien hecho! ¿Puedes hacerlo mejor?' },
    victory_ok:      { en: 'You did it! Try with fewer instructions.', fr: "Tu as réussi ! Essaie avec moins d'instructions.", es: '¡Lo lograste! Intenta con menos instrucciones.' },
    victory_actions: { en: '({0} instructions)', fr: '({0} instructions)', es: '({0} instrucciones)' },
    btn_replay:      { en: 'Replay',      fr: 'Rejouer',    es: 'Repetir' },
    btn_next:        { en: 'Next \u25B6', fr: 'Suivant \u25B6', es: 'Siguiente \u25B6' },
    btn_finish:      { en: 'Finished!',   fr: 'Terminé !',  es: '¡Terminado!' },

    // ---- Fail ----
    fail_title:       { en: 'Oops!', fr: 'Oups !', es: '¡Ups!' },
    fail_msg_default: {
      en: "Your hero didn't reach the treasure.",
      fr: "Ton héros n'a pas atteint le trésor.",
      es: 'Tu héroe no llegó al tesoro.',
    },
    fail_msg_empty: {
      en: 'Add instructions before running!',
      fr: 'Ajoute des instructions avant de lancer !',
      es: '¡Agrega instrucciones antes de ejecutar!',
    },
    fail_msg_stars: {
      en: "Don't forget to collect all the stars!",
      fr: "N'oublie pas de ramasser toutes les étoiles !",
      es: '¡No olvides recoger todas las estrellas!',
    },
    btn_retry: { en: 'Retry', fr: 'Recommencer', es: 'Reintentar' },

    // ---- Reset confirm ----
    reset_title: { en: 'Reset everything?',                         fr: 'Tout recommencer ?',                          es: '¿Reiniciar todo?' },
    reset_msg:   { en: 'All your progress will be lost. Sure?',    fr: 'Toute ta progression sera effacée. Es-tu sûr ?', es: 'Todo tu progreso se perderá. ¿Estás seguro?' },
    btn_no:      { en: 'No',  fr: 'Non', es: 'No' },
    btn_yes:     { en: 'Yes', fr: 'Oui', es: 'Sí' },

    // ---- Level hints ----
    hint_press_forward:        { en: 'Press Forward!',              fr: 'Appuie sur Avancer !',            es: '¡Presiona Avanzar!' },
    hint_forward_2:            { en: 'Move forward 2 times',        fr: 'Avance 2 fois',                   es: 'Avanza 2 veces' },
    hint_forward_again:        { en: 'Keep going!',                 fr: 'Avance encore !',                 es: '¡Sigue avanzando!' },
    hint_hero_goes_up:         { en: 'Your hero goes up',           fr: 'Ton héros monte',                 es: 'Tu héroe sube' },
    hint_collect_stars:        { en: 'Collect the stars!',          fr: 'Ramasse les étoiles !',           es: '¡Recoge las estrellas!' },
    hint_forward_turn_forward: { en: 'Forward, turn, forward!',     fr: 'Avance, tourne, avance !',        es: '¡Avanza, gira, avanza!' },
    hint_forward_right_fwd:    { en: 'Forward, right, forward',     fr: 'Avance, tourne droite, avance',   es: 'Avanza, gira derecha, avanza' },
    hint_try_turn_left:        { en: 'Try turning left!',           fr: 'Essaie tourne gauche !',          es: '¡Prueba girar izquierda!' },
    hint_go_around_wall:       { en: 'Go around the wall!',         fr: 'Contourne le mur !',              es: '¡Rodea el muro!' },
    hint_repeat_pattern:       { en: 'Repeat the same pattern!',    fr: 'Répète le même motif !',          es: '¡Repite el mismo patrón!' },
    hint_loop_forward_4:       { en: 'Loop: forward x4!',           fr: 'Boucle : avancer x4 !',           es: '¡Bucle: avanzar x4!' },
    hint_loop_forward_right:   { en: 'Loop: forward + right!',      fr: 'Boucle : avancer+droite !',       es: '¡Bucle: avanzar+derecha!' },
    hint_f1_double_forward:    { en: 'F1 = forward + forward',      fr: 'F1 = avancer+avancer',            es: 'F1 = avanzar+avanzar' },
    hint_f1_f2_loops:          { en: 'F1 + F2 + loops!',            fr: 'F1+F2+boucles !',                 es: '¡F1+F2+bucles!' },
    hint_activate_button:      { en: 'Activate the button!',        fr: 'Active le bouton !',              es: '¡Activa el botón!' },

    // ---- Color preset names ----
    color_sun:     { en: 'Sun',     fr: 'Soleil',  es: 'Sol' },
    color_sky:     { en: 'Sky',     fr: 'Ciel',    es: 'Cielo' },
    color_pink:    { en: 'Pink',    fr: 'Rose',    es: 'Rosa' },
    color_caramel: { en: 'Caramel', fr: 'Caramel', es: 'Caramelo' },
    color_grey:    { en: 'Grey',    fr: 'Gris',    es: 'Gris' },
    color_purple:  { en: 'Purple',  fr: 'Violet',  es: 'Violeta' },
    color_roux:    { en: 'Auburn',  fr: 'Roux',    es: 'Rojizo' },
    color_steel:   { en: 'Steel',   fr: 'Acier',   es: 'Acero' },
    color_bronze:  { en: 'Bronze',  fr: 'Bronze',  es: 'Bronce' },
  };

  let _lang = 'en';

  function detect() {
    const stored = localStorage.getItem('tinylogic_lang');
    if (stored && LANGS.includes(stored)) { _lang = stored; return; }
    const nav = (navigator.language || 'en').split('-')[0].toLowerCase();
    _lang = LANGS.includes(nav) ? nav : 'en';
  }

  function t(key, ...args) {
    const entry = T[key];
    if (!entry) return key;
    let s = entry[_lang] || entry.en || key;
    args.forEach((a, i) => { s = s.replace(`{${i}}`, a); });
    return s;
  }

  function setLang(lang) {
    if (!LANGS.includes(lang)) return;
    _lang = lang;
    localStorage.setItem('tinylogic_lang', lang);
    applyAll();
  }

  function getLang() { return _lang; }

  function applyAll() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
  }

  return { detect, t, setLang, getLang, applyAll, LANGS };
})();
