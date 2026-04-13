/* ============================================
   Chill Code - Hero + Goal SVG Generator
   3 heroes × 3 color presets × 4 directions
   ============================================ */

const Sprites = (() => {

  // Current hero config
  let _heroId = 'bird';
  let _presetIdx = 0;

  // ---- Helper ----
  function setHeroConfig(heroId, presetIdx) {
    _heroId = heroId || 'bird';
    _presetIdx = presetIdx != null ? presetIdx : 0;
  }

  // ==================== BIRD ====================
  function makeBirdSVGs(c) {
    const down = `
    <svg class="hero-svg" data-dir-svg="2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="43" rx="13" ry="2.2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <line x1="19" y1="37" x2="17" y2="43" stroke="${c.sd}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="29" y1="37" x2="31" y2="43" stroke="${c.sd}" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="hero-main">
        <ellipse class="hero-wing hero-wing-l" cx="10" cy="26" rx="4.5" ry="8" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2" transform="rotate(-12 10 26)"/>
        <ellipse class="hero-wing hero-wing-r" cx="38" cy="26" rx="4.5" ry="8" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2" transform="rotate(12 38 26)"/>
        <ellipse class="hero-body" cx="24" cy="25" rx="15" ry="14" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <ellipse cx="24" cy="30" rx="10" ry="8" fill="rgba(255,255,255,0.4)"/>
        <path class="hero-crest" d="M20 11 Q22 5 24 11 Q26 5 28 11" stroke="${c.s}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <g class="hero-eyes">
          <circle cx="19" cy="21" r="3.6" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="20" cy="21.5" r="1.9" fill="#1a1a2e"/>
          <circle cx="20.6" cy="20.8" r="0.7" fill="white"/>
          <circle cx="29" cy="21" r="3.6" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="30" cy="21.5" r="1.9" fill="#1a1a2e"/>
          <circle cx="30.6" cy="20.8" r="0.7" fill="white"/>
        </g>
        <polygon points="21,28 27,28 24,34" fill="${c.s}" stroke="${c.sd}" stroke-width="0.9" stroke-linejoin="round"/>
      </g>
    </svg>`;

    const up = `
    <svg class="hero-svg" data-dir-svg="0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="43" rx="13" ry="2.2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <line x1="19" y1="37" x2="17" y2="43" stroke="${c.sd}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="29" y1="37" x2="31" y2="43" stroke="${c.sd}" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="hero-main">
        <ellipse class="hero-wing hero-wing-l" cx="10" cy="26" rx="4.5" ry="8" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.2" transform="rotate(-12 10 26)"/>
        <ellipse class="hero-wing hero-wing-r" cx="38" cy="26" rx="4.5" ry="8" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.2" transform="rotate(12 38 26)"/>
        <ellipse class="hero-body" cx="24" cy="25" rx="15" ry="14" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.5"/>
        <ellipse cx="24" cy="19" rx="11" ry="9" fill="${c.p}"/>
        <path class="hero-crest" d="M18 9 Q21 3 24 9 Q27 3 30 9" stroke="${c.s}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 34 Q24 39 29 34" stroke="${c.s}" stroke-width="2.5" fill="${c.s}" stroke-linejoin="round"/>
      </g>
    </svg>`;

    const right = `
    <svg class="hero-svg" data-dir-svg="1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="43" rx="13" ry="2.2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <line x1="21" y1="37" x2="19" y2="43" stroke="${c.sd}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="27" y1="37" x2="29" y2="43" stroke="${c.sd}" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="hero-main">
        <path class="hero-tail" d="M6 22 Q2 24 5 30 Q10 28 10 25 Z" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2" stroke-linejoin="round"/>
        <ellipse class="hero-body" cx="24" cy="25" rx="14" ry="13" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <ellipse cx="26" cy="30" rx="9" ry="6" fill="rgba(255,255,255,0.4)"/>
        <ellipse class="hero-wing hero-wing-r" cx="20" cy="26" rx="6" ry="8" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <path class="hero-crest" d="M20 11 Q22 5 24 11 Q26 5 28 11" stroke="${c.s}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <g class="hero-eyes">
          <circle cx="31" cy="20" r="3.6" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="32.3" cy="20.5" r="1.9" fill="#1a1a2e"/>
          <circle cx="32.9" cy="19.8" r="0.7" fill="white"/>
        </g>
        <polygon points="36,20 43,22 36,24" fill="${c.s}" stroke="${c.sd}" stroke-width="0.9" stroke-linejoin="round"/>
      </g>
    </svg>`;

    const left = `
    <svg class="hero-svg" data-dir-svg="3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="43" rx="13" ry="2.2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <line x1="21" y1="37" x2="19" y2="43" stroke="${c.sd}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="27" y1="37" x2="29" y2="43" stroke="${c.sd}" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="hero-main">
        <path class="hero-tail" d="M42 22 Q46 24 43 30 Q38 28 38 25 Z" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2" stroke-linejoin="round"/>
        <ellipse class="hero-body" cx="24" cy="25" rx="14" ry="13" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <ellipse cx="22" cy="30" rx="9" ry="6" fill="rgba(255,255,255,0.4)"/>
        <ellipse class="hero-wing hero-wing-l" cx="28" cy="26" rx="6" ry="8" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <path class="hero-crest" d="M20 11 Q22 5 24 11 Q26 5 28 11" stroke="${c.s}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <g class="hero-eyes">
          <circle cx="17" cy="20" r="3.6" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="15.7" cy="20.5" r="1.9" fill="#1a1a2e"/>
          <circle cx="15.1" cy="19.8" r="0.7" fill="white"/>
        </g>
        <polygon points="12,20 5,22 12,24" fill="${c.s}" stroke="${c.sd}" stroke-width="0.9" stroke-linejoin="round"/>
      </g>
    </svg>`;

    return { up, right, down, left };
  }

  // ==================== CAT ====================
  function makeCatSVGs(c) {
    const down = `
    <svg class="hero-svg" data-dir-svg="2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="44" rx="12" ry="2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <ellipse cx="16" cy="41" rx="5" ry="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
        <ellipse cx="32" cy="41" rx="5" ry="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
      </g>
      <g class="hero-main">
        <path class="hero-tail" d="M35 37 Q43 28 39 18 Q37 14 35 19" fill="none" stroke="${c.p}" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse class="hero-body" cx="24" cy="30" rx="13" ry="10" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <ellipse cx="24" cy="32" rx="7" ry="6" fill="rgba(255,255,255,0.42)"/>
        <ellipse cx="24" cy="17" rx="11" ry="10" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <polygon class="hero-wing-l" points="13,9 10,2 19,9" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <polygon class="hero-wing-r" points="35,9 38,2 29,9" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <polygon points="14,9 12,4 18,9" fill="${c.s}" opacity="0.7"/>
        <polygon points="34,9 36,4 30,9" fill="${c.s}" opacity="0.7"/>
        <g class="hero-eyes">
          <circle cx="19" cy="17" r="3.5" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="19.8" cy="17.5" r="2" fill="#1a1a2e"/>
          <circle cx="20.5" cy="16.8" r="0.7" fill="white"/>
          <circle cx="29" cy="17" r="3.5" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="29.8" cy="17.5" r="2" fill="#1a1a2e"/>
          <circle cx="30.5" cy="16.8" r="0.7" fill="white"/>
        </g>
        <ellipse cx="24" cy="22" rx="2" ry="1.3" fill="${c.s}"/>
        <path d="M21.5 23.5 Q24 26.5 26.5 23.5" fill="none" stroke="${c.pd}" stroke-width="1" stroke-linecap="round"/>
        <line x1="12" y1="20.5" x2="20.5" y2="21.5" stroke="${c.pd}" stroke-width="0.7" opacity="0.5"/>
        <line x1="12" y1="23" x2="20.5" y2="23" stroke="${c.pd}" stroke-width="0.7" opacity="0.5"/>
        <line x1="36" y1="20.5" x2="27.5" y2="21.5" stroke="${c.pd}" stroke-width="0.7" opacity="0.5"/>
        <line x1="36" y1="23" x2="27.5" y2="23" stroke="${c.pd}" stroke-width="0.7" opacity="0.5"/>
      </g>
    </svg>`;

    const up = `
    <svg class="hero-svg" data-dir-svg="0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="44" rx="12" ry="2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <ellipse cx="16" cy="41" rx="5" ry="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
        <ellipse cx="32" cy="41" rx="5" ry="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
      </g>
      <g class="hero-main">
        <path class="hero-tail" d="M36 35 Q44 25 40 15" fill="none" stroke="${c.p}" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse class="hero-body" cx="24" cy="30" rx="13" ry="10" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.5"/>
        <ellipse cx="24" cy="27" rx="9" ry="7" fill="${c.p}"/>
        <ellipse cx="24" cy="17" rx="11" ry="10" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.5"/>
        <ellipse cx="24" cy="19" rx="8" ry="7" fill="${c.p}"/>
        <polygon class="hero-wing-l" points="13,9 10,2 19,9" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.2"/>
        <polygon class="hero-wing-r" points="35,9 38,2 29,9" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.2"/>
      </g>
    </svg>`;

    const right = `
    <svg class="hero-svg" data-dir-svg="1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="44" rx="12" ry="2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <ellipse cx="18" cy="41" rx="5" ry="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
        <ellipse cx="30" cy="41" rx="5" ry="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
      </g>
      <g class="hero-main">
        <path class="hero-tail" d="M8 34 Q2 24 6 16 Q8 11 10 16" fill="none" stroke="${c.p}" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse class="hero-body" cx="24" cy="30" rx="12" ry="10" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <ellipse cx="26" cy="32" rx="6" ry="5.5" fill="rgba(255,255,255,0.42)"/>
        <ellipse cx="25" cy="17" rx="10" ry="10" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <polygon class="hero-wing-r" points="33,9 37,2 30,9" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <polygon points="33,9 36,4 31,9" fill="${c.s}" opacity="0.7"/>
        <g class="hero-eyes">
          <circle cx="31" cy="16" r="3.5" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="32" cy="16.5" r="2" fill="#1a1a2e"/>
          <circle cx="32.7" cy="15.8" r="0.7" fill="white"/>
        </g>
        <ellipse cx="36" cy="21" rx="1.5" ry="1.2" fill="${c.s}"/>
        <line x1="37" y1="20" x2="29" y2="21" stroke="${c.pd}" stroke-width="0.7" opacity="0.5"/>
        <line x1="37" y1="22.5" x2="29" y2="22.5" stroke="${c.pd}" stroke-width="0.7" opacity="0.5"/>
      </g>
    </svg>`;

    const left = `
    <svg class="hero-svg" data-dir-svg="3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="44" rx="12" ry="2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <ellipse cx="18" cy="41" rx="5" ry="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
        <ellipse cx="30" cy="41" rx="5" ry="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
      </g>
      <g class="hero-main">
        <path class="hero-tail" d="M40 34 Q46 24 42 16 Q40 11 38 16" fill="none" stroke="${c.p}" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse class="hero-body" cx="24" cy="30" rx="12" ry="10" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <ellipse cx="22" cy="32" rx="6" ry="5.5" fill="rgba(255,255,255,0.42)"/>
        <ellipse cx="23" cy="17" rx="10" ry="10" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <polygon class="hero-wing-l" points="15,9 11,2 18,9" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <polygon points="15,9 12,4 17,9" fill="${c.s}" opacity="0.7"/>
        <g class="hero-eyes">
          <circle cx="17" cy="16" r="3.5" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="16" cy="16.5" r="2" fill="#1a1a2e"/>
          <circle cx="15.3" cy="15.8" r="0.7" fill="white"/>
        </g>
        <ellipse cx="12" cy="21" rx="1.5" ry="1.2" fill="${c.s}"/>
        <line x1="11" y1="20" x2="19" y2="21" stroke="${c.pd}" stroke-width="0.7" opacity="0.5"/>
        <line x1="11" y1="22.5" x2="19" y2="22.5" stroke="${c.pd}" stroke-width="0.7" opacity="0.5"/>
      </g>
    </svg>`;

    return { up, right, down, left };
  }

  // ==================== ROBOT ====================
  function makeRobotSVGs(c) {
    const down = `
    <svg class="hero-svg" data-dir-svg="2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="44" rx="13" ry="2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <rect x="13" y="38" width="9" height="5" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect x="26" y="38" width="9" height="5" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
      </g>
      <g class="hero-main">
        <rect class="hero-wing-l" x="5" y="22" width="6" height="10" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect class="hero-wing-r" x="37" y="22" width="6" height="10" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect class="hero-body" x="11" y="21" width="26" height="19" rx="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <rect x="16" y="25" width="16" height="10" rx="2" fill="${c.pd}" opacity="0.35"/>
        <circle cx="20" cy="30" r="2" fill="${c.s}" opacity="0.9"/>
        <circle cx="28" cy="30" r="2" fill="${c.s}" opacity="0.9"/>
        <rect x="20" y="17" width="8" height="5" rx="1" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
        <rect x="11" y="6" width="26" height="13" rx="4" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <path class="hero-crest" d="M24 6 L24 1" stroke="${c.pd}" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="24" cy="1" r="1.5" fill="${c.s}"/>
        <g class="hero-eyes">
          <rect x="15" y="9" width="7" height="5" rx="1.5" fill="${c.s}" opacity="0.9"/>
          <rect x="26" y="9" width="7" height="5" rx="1.5" fill="${c.s}" opacity="0.9"/>
          <rect x="16.5" y="10" width="4" height="3" rx="0.5" fill="white" opacity="0.5"/>
          <rect x="27.5" y="10" width="4" height="3" rx="0.5" fill="white" opacity="0.5"/>
        </g>
        <rect x="17" y="16" width="14" height="2.5" rx="1" fill="${c.pd}" opacity="0.5"/>
        <line x1="21" y1="16" x2="21" y2="18.5" stroke="${c.p}" stroke-width="0.8"/>
        <line x1="24" y1="16" x2="24" y2="18.5" stroke="${c.p}" stroke-width="0.8"/>
        <line x1="27" y1="16" x2="27" y2="18.5" stroke="${c.p}" stroke-width="0.8"/>
      </g>
    </svg>`;

    const up = `
    <svg class="hero-svg" data-dir-svg="0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="44" rx="13" ry="2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <rect x="13" y="38" width="9" height="5" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect x="26" y="38" width="9" height="5" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
      </g>
      <g class="hero-main">
        <rect class="hero-wing-l" x="5" y="22" width="6" height="10" rx="2" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect class="hero-wing-r" x="37" y="22" width="6" height="10" rx="2" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect class="hero-body" x="11" y="21" width="26" height="19" rx="3" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.5"/>
        <rect x="15" y="25" width="18" height="11" rx="2" fill="${c.p}" opacity="0.6"/>
        <rect x="20" y="17" width="8" height="5" rx="1" fill="${c.pd}" stroke="${c.pd}" stroke-width="1"/>
        <rect x="11" y="6" width="26" height="13" rx="4" fill="${c.pd}" stroke="${c.pd}" stroke-width="1.5"/>
        <rect x="15" y="9" width="18" height="7" rx="2" fill="${c.p}" opacity="0.6"/>
        <path class="hero-crest" d="M24 6 L24 1" stroke="${c.pd}" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="24" cy="1" r="1.5" fill="${c.s}"/>
      </g>
    </svg>`;

    const right = `
    <svg class="hero-svg" data-dir-svg="1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="44" rx="13" ry="2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <rect x="14" y="38" width="9" height="5" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect x="26" y="38" width="9" height="5" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
      </g>
      <g class="hero-main">
        <rect class="hero-wing-r" x="36" y="22" width="5" height="10" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect class="hero-body" x="13" y="21" width="24" height="19" rx="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <rect x="17" y="25" width="12" height="10" rx="2" fill="${c.pd}" opacity="0.3"/>
        <circle cx="23" cy="30" r="2" fill="${c.s}" opacity="0.9"/>
        <rect x="19" y="17" width="8" height="5" rx="1" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
        <rect x="13" y="6" width="24" height="13" rx="4" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <path class="hero-crest" d="M24 6 L24 1" stroke="${c.pd}" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="24" cy="1" r="1.5" fill="${c.s}"/>
        <g class="hero-eyes">
          <rect x="30" y="9" width="6" height="5" rx="1.5" fill="${c.s}" opacity="0.9"/>
          <rect x="31" y="10" width="4" height="3" rx="0.5" fill="white" opacity="0.5"/>
        </g>
        <rect x="29" y="16" width="7" height="2" rx="1" fill="${c.pd}" opacity="0.5"/>
      </g>
    </svg>`;

    const left = `
    <svg class="hero-svg" data-dir-svg="3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="44" rx="13" ry="2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <rect x="14" y="38" width="9" height="5" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect x="26" y="38" width="9" height="5" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
      </g>
      <g class="hero-main">
        <rect class="hero-wing-l" x="7" y="22" width="5" height="10" rx="2" fill="${c.p}" stroke="${c.pd}" stroke-width="1.2"/>
        <rect class="hero-body" x="11" y="21" width="24" height="19" rx="3" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <rect x="19" y="25" width="12" height="10" rx="2" fill="${c.pd}" opacity="0.3"/>
        <circle cx="25" cy="30" r="2" fill="${c.s}" opacity="0.9"/>
        <rect x="21" y="17" width="8" height="5" rx="1" fill="${c.p}" stroke="${c.pd}" stroke-width="1"/>
        <rect x="11" y="6" width="24" height="13" rx="4" fill="${c.p}" stroke="${c.pd}" stroke-width="1.5"/>
        <path class="hero-crest" d="M24 6 L24 1" stroke="${c.pd}" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="24" cy="1" r="1.5" fill="${c.s}"/>
        <g class="hero-eyes">
          <rect x="12" y="9" width="6" height="5" rx="1.5" fill="${c.s}" opacity="0.9"/>
          <rect x="13" y="10" width="4" height="3" rx="0.5" fill="white" opacity="0.5"/>
        </g>
        <rect x="12" y="16" width="7" height="2" rx="1" fill="${c.pd}" opacity="0.5"/>
      </g>
    </svg>`;

    return { up, right, down, left };
  }

  // ==================== HERO DEFINITIONS ====================
  const HERO_DEFS = [
    {
      id: 'bird',
      name: 'Piou',
      emoji: '🐣',
      makeSVGs: makeBirdSVGs,
      presets: [
        { name: 'Soleil', p: '#FFD966', pd: '#C48A00', s: '#FF6B35', sd: '#E05020' },
        { name: 'Ciel',   p: '#63b3ed', pd: '#2b6cb0', s: '#4fd1c5', sd: '#2c7a7b' },
        { name: 'Rose',   p: '#f687b3', pd: '#97266d', s: '#f6ad55', sd: '#c05621' },
      ],
    },
    {
      id: 'cat',
      name: 'Mimi',
      emoji: '🐱',
      makeSVGs: makeCatSVGs,
      presets: [
        { name: 'Caramel', p: '#f6ad55', pd: '#c05621', s: '#ed8936', sd: '#9c4221' },
        { name: 'Gris',    p: '#a0aec0', pd: '#4a5568', s: '#fc8181', sd: '#c53030' },
        { name: 'Violet',  p: '#b794f4', pd: '#553c9a', s: '#f687b3', sd: '#97266d' },
      ],
    },
    {
      id: 'robot',
      name: 'Robo',
      emoji: '🤖',
      makeSVGs: makeRobotSVGs,
      presets: [
        { name: 'Acier',  p: '#a0aec0', pd: '#4a5568', s: '#63b3ed', sd: '#2b6cb0' },
        { name: 'Bronze', p: '#d69e2e', pd: '#744210', s: '#68d391', sd: '#276749' },
        { name: 'Violet', p: '#b794f4', pd: '#553c9a', s: '#f687b3', sd: '#97266d' },
      ],
    },
  ];

  function getHeroDef(heroId) {
    return HERO_DEFS.find(h => h.id === heroId) || HERO_DEFS[0];
  }

  function getPreset(heroId, presetIdx) {
    const def = getHeroDef(heroId);
    return def.presets[presetIdx] || def.presets[0];
  }

  function initHero(heroEl, heroId, presetIdx) {
    const id = heroId != null ? heroId : _heroId;
    const idx = presetIdx != null ? presetIdx : _presetIdx;
    const def = getHeroDef(id);
    const c = def.presets[idx] || def.presets[0];
    const svgs = def.makeSVGs(c);
    heroEl.innerHTML = svgs.up + svgs.right + svgs.down + svgs.left;
  }

  function getPreviewSVG(heroId, presetIdx) {
    const def = getHeroDef(heroId);
    const c = def.presets[presetIdx] || def.presets[0];
    const svgs = def.makeSVGs(c);
    return svgs.down;
  }

  // ----- Goal: smooth cartoon treasure chest -----
  const GOAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <defs>
      <linearGradient id="lid-g" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#C48A3D"/>
        <stop offset="1" stop-color="#8B4513"/>
      </linearGradient>
      <linearGradient id="body-g" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#9B5A1F"/>
        <stop offset="1" stop-color="#5C2E0A"/>
      </linearGradient>
      <linearGradient id="gold-g" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#FFF3A0"/>
        <stop offset="0.5" stop-color="#FFD93D"/>
        <stop offset="1" stop-color="#B8860B"/>
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="42" rx="14" ry="2.2" fill="rgba(0,0,0,0.25)"/>
    <path d="M8 18 Q8 8 24 8 Q40 8 40 18 L40 22 L8 22 Z" fill="url(#lid-g)" stroke="#3A1A05" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M12 13 Q14 10 18 10" stroke="rgba(255,255,255,0.35)" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="8" y="21" width="32" height="20" rx="2" fill="url(#body-g)" stroke="#3A1A05" stroke-width="1.5"/>
    <rect x="8" y="27" width="32" height="3" fill="url(#gold-g)" stroke="#3A1A05" stroke-width="0.8"/>
    <rect x="8" y="37" width="32" height="3" fill="url(#gold-g)" stroke="#3A1A05" stroke-width="0.8"/>
    <rect x="8" y="20" width="32" height="3" fill="url(#gold-g)" stroke="#3A1A05" stroke-width="0.8"/>
    <circle cx="11" cy="24" r="0.8" fill="#FFD93D" stroke="#3A1A05" stroke-width="0.4"/>
    <circle cx="37" cy="24" r="0.8" fill="#FFD93D" stroke="#3A1A05" stroke-width="0.4"/>
    <circle cx="11" cy="34" r="0.8" fill="#FFD93D" stroke="#3A1A05" stroke-width="0.4"/>
    <circle cx="37" cy="34" r="0.8" fill="#FFD93D" stroke="#3A1A05" stroke-width="0.4"/>
    <rect x="20" y="17" width="8" height="10" rx="1.5" fill="url(#gold-g)" stroke="#3A1A05" stroke-width="1"/>
    <circle cx="24" cy="21" r="1.3" fill="#3A1A05"/>
    <rect x="23.3" y="21" width="1.4" height="3" fill="#3A1A05"/>
    <circle cx="30" cy="14" r="1" fill="#FFF9C4"><animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></circle>
    <circle cx="15" cy="16" r="0.8" fill="#FFF9C4"><animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="0.8s" repeatCount="indefinite"/></circle>
    <circle cx="34" cy="34" r="0.8" fill="#FFF9C4"><animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="1.6s" repeatCount="indefinite"/></circle>
  </svg>`;

  function getGoalUrl() {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(GOAL_SVG);
  }

  return {
    initHero,
    getGoalUrl,
    setHeroConfig,
    getPreviewSVG,
    getHeroDef,
    getPreset,
    HERO_DEFS,
  };
})();
