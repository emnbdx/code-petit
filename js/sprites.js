/* ============================================
   CodePetit - Hero + Goal SVG Generator
   Smooth cartoon style with idle + walk animations
   ============================================ */

const Sprites = (() => {

  // ----- Hero SVGs (one per direction) -----
  // dir 0=up (back view), 1=right (profile), 2=down (front), 3=left (profile)

  const HERO_DOWN = `
    <svg class="hero-svg" data-dir-svg="2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="43" rx="13" ry="2.2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <line x1="19" y1="37" x2="17" y2="43" stroke="#E05020" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="29" y1="37" x2="31" y2="43" stroke="#E05020" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="hero-main">
        <ellipse class="hero-wing hero-wing-l" cx="10" cy="26" rx="4.5" ry="8" fill="#F0C030" stroke="#C48A00" stroke-width="1.2" transform="rotate(-12 10 26)"/>
        <ellipse class="hero-wing hero-wing-r" cx="38" cy="26" rx="4.5" ry="8" fill="#F0C030" stroke="#C48A00" stroke-width="1.2" transform="rotate(12 38 26)"/>
        <ellipse class="hero-body" cx="24" cy="25" rx="15" ry="14" fill="#FFD966" stroke="#C48A00" stroke-width="1.5"/>
        <ellipse cx="24" cy="30" rx="10" ry="8" fill="#FFF3BF"/>
        <path class="hero-crest" d="M20 11 Q22 5 24 11 Q26 5 28 11" stroke="#FF6B35" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <g class="hero-eyes">
          <circle cx="19" cy="21" r="3.6" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="20" cy="21.5" r="1.9" fill="#1a1a2e"/>
          <circle cx="20.6" cy="20.8" r="0.7" fill="white"/>
          <circle cx="29" cy="21" r="3.6" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="30" cy="21.5" r="1.9" fill="#1a1a2e"/>
          <circle cx="30.6" cy="20.8" r="0.7" fill="white"/>
        </g>
        <polygon points="21,28 27,28 24,34" fill="#FF6B35" stroke="#E05020" stroke-width="0.9" stroke-linejoin="round"/>
      </g>
    </svg>`;

  const HERO_UP = `
    <svg class="hero-svg" data-dir-svg="0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="43" rx="13" ry="2.2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <line x1="19" y1="37" x2="17" y2="43" stroke="#E05020" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="29" y1="37" x2="31" y2="43" stroke="#E05020" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="hero-main">
        <ellipse class="hero-wing hero-wing-l" cx="10" cy="26" rx="4.5" ry="8" fill="#E6B800" stroke="#A07800" stroke-width="1.2" transform="rotate(-12 10 26)"/>
        <ellipse class="hero-wing hero-wing-r" cx="38" cy="26" rx="4.5" ry="8" fill="#E6B800" stroke="#A07800" stroke-width="1.2" transform="rotate(12 38 26)"/>
        <ellipse class="hero-body" cx="24" cy="25" rx="15" ry="14" fill="#E6B800" stroke="#A07800" stroke-width="1.5"/>
        <ellipse cx="24" cy="19" rx="11" ry="9" fill="#FFD966"/>
        <path class="hero-crest" d="M18 9 Q21 3 24 9 Q27 3 30 9" stroke="#FF6B35" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 34 Q24 39 29 34" stroke="#FF6B35" stroke-width="2.5" fill="#FF8C42" stroke-linejoin="round"/>
      </g>
    </svg>`;

  const HERO_RIGHT = `
    <svg class="hero-svg" data-dir-svg="1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="43" rx="13" ry="2.2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <line x1="21" y1="37" x2="19" y2="43" stroke="#E05020" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="27" y1="37" x2="29" y2="43" stroke="#E05020" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="hero-main">
        <path class="hero-tail" d="M6 22 Q2 24 5 30 Q10 28 10 25 Z" fill="#F0C030" stroke="#C48A00" stroke-width="1.2" stroke-linejoin="round"/>
        <ellipse class="hero-body" cx="24" cy="25" rx="14" ry="13" fill="#FFD966" stroke="#C48A00" stroke-width="1.5"/>
        <ellipse cx="26" cy="30" rx="9" ry="6" fill="#FFF3BF"/>
        <ellipse class="hero-wing hero-wing-r" cx="20" cy="26" rx="6" ry="8" fill="#F0C030" stroke="#C48A00" stroke-width="1.2"/>
        <path class="hero-crest" d="M20 11 Q22 5 24 11 Q26 5 28 11" stroke="#FF6B35" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <g class="hero-eyes">
          <circle cx="31" cy="20" r="3.6" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="32.3" cy="20.5" r="1.9" fill="#1a1a2e"/>
          <circle cx="32.9" cy="19.8" r="0.7" fill="white"/>
        </g>
        <polygon points="36,20 43,22 36,24" fill="#FF6B35" stroke="#E05020" stroke-width="0.9" stroke-linejoin="round"/>
      </g>
    </svg>`;

  const HERO_LEFT = `
    <svg class="hero-svg" data-dir-svg="3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="hero-shadow" cx="24" cy="43" rx="13" ry="2.2" fill="rgba(0,0,0,0.2)"/>
      <g class="hero-feet">
        <line x1="21" y1="37" x2="19" y2="43" stroke="#E05020" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="27" y1="37" x2="29" y2="43" stroke="#E05020" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="hero-main">
        <path class="hero-tail" d="M42 22 Q46 24 43 30 Q38 28 38 25 Z" fill="#F0C030" stroke="#C48A00" stroke-width="1.2" stroke-linejoin="round"/>
        <ellipse class="hero-body" cx="24" cy="25" rx="14" ry="13" fill="#FFD966" stroke="#C48A00" stroke-width="1.5"/>
        <ellipse cx="22" cy="30" rx="9" ry="6" fill="#FFF3BF"/>
        <ellipse class="hero-wing hero-wing-l" cx="28" cy="26" rx="6" ry="8" fill="#F0C030" stroke="#C48A00" stroke-width="1.2"/>
        <path class="hero-crest" d="M20 11 Q22 5 24 11 Q26 5 28 11" stroke="#FF6B35" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <g class="hero-eyes">
          <circle cx="17" cy="20" r="3.6" fill="white" stroke="#333" stroke-width="0.6"/>
          <circle cx="15.7" cy="20.5" r="1.9" fill="#1a1a2e"/>
          <circle cx="15.1" cy="19.8" r="0.7" fill="white"/>
        </g>
        <polygon points="12,20 5,22 12,24" fill="#FF6B35" stroke="#E05020" stroke-width="0.9" stroke-linejoin="round"/>
      </g>
    </svg>`;

  function initHero(heroEl) {
    // Inject all 4 SVGs; CSS will show only the active one via data-dir
    heroEl.innerHTML = HERO_UP + HERO_RIGHT + HERO_DOWN + HERO_LEFT;
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
  };
})();
