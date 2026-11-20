import { themes } from '../themes/index.js';

export function renderPlaygroundHtml(): string {
  const themeList = Object.entries(themes);

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Experience Suite • Next-Gen Profile Engine</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>">
  
  <!-- Modern Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  
  <!-- CDN Libraries: Three.js for 3D Motion, Canvas Confetti for Celebration -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

  <style>
    :root {
      --bg: #030712;
      --surface: rgba(17, 24, 39, 0.7);
      --surface-elevated: rgba(31, 41, 55, 0.75);
      --border: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(99, 102, 241, 0.4);
      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.35);
      --accent: #10b981;
      --cyan: #06b6d4;
      --rose: #f43f5e;
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --code-bg: rgba(3, 7, 18, 0.95);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* 3D WebGL Background Canvas */
    #webgl-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      opacity: 0.85;
    }

    /* Subtle ambient radial glow orbs */
    .ambient-glow {
      position: fixed;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      filter: blur(140px);
      opacity: 0.15;
    }
    .glow-1 { top: -100px; left: -100px; background: radial-gradient(circle, #6366f1, transparent 70%); }
    .glow-2 { top: 40%; right: -150px; background: radial-gradient(circle, #06b6d4, transparent 70%); }
    .glow-3 { bottom: -100px; left: 30%; background: radial-gradient(circle, #8b5cf6, transparent 70%); }

    /* Main Container */
    .container {
      position: relative;
      z-index: 1;
      max-width: 1280px;
      margin: 0 auto;
      padding: 40px 24px 100px;
    }

    /* Header & Hero */
    header {
      text-align: center;
      margin-bottom: 50px;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--cyan);
      margin-bottom: 20px;
      box-shadow: 0 0 25px rgba(6, 182, 212, 0.15);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .badge-pill:hover {
      border-color: var(--cyan);
      transform: translateY(-2px);
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      background: var(--cyan);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--cyan);
      animation: pulseDot 2s infinite;
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }

    h1 {
      font-size: clamp(2.4rem, 5.5vw, 4.2rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      color: var(--text-muted);
      max-width: 720px;
      margin: 0 auto 30px;
      line-height: 1.6;
    }

    /* Glassmorphism Control Console */
    .studio-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      backdrop-filter: blur(24px) saturate(190%);
      border-radius: 24px;
      padding: 32px;
      margin-bottom: 50px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      transition: border-color 0.3s;
    }
    .studio-panel:hover {
      border-color: rgba(255, 255, 255, 0.14);
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .panel-title {
      font-size: 1.1rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
    }

    .grid-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 22px;
      margin-bottom: 28px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .input-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #e2e8f0;
      display: flex;
      justify-content: space-between;
    }
    .input-hint {
      color: var(--text-muted);
      font-weight: 400;
      font-size: 0.78rem;
    }

    .input-box {
      width: 100%;
      padding: 12px 16px;
      background: rgba(3, 7, 18, 0.6);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .input-box:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-glow);
      background: rgba(3, 7, 18, 0.85);
    }

    /* Preset User Buttons */
    .preset-row {
      display: flex;
      gap: 8px;
      margin-top: 6px;
      flex-wrap: wrap;
    }
    .preset-chip {
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.75rem;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .preset-chip:hover {
      background: rgba(99, 102, 241, 0.2);
      border-color: var(--primary);
      color: #fff;
    }

    /* Visual Theme Selector Pills */
    .theme-picker-container {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 2px 10px;
      scrollbar-width: thin;
    }
    .theme-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: rgba(3, 7, 18, 0.6);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.85rem;
      color: var(--text-muted);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .theme-chip:hover {
      border-color: rgba(255, 255, 255, 0.25);
      color: #fff;
    }
    .theme-chip.active {
      background: rgba(99, 102, 241, 0.2);
      border-color: var(--primary);
      color: #fff;
      box-shadow: 0 0 15px var(--primary-glow);
    }
    .theme-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    /* Toggle Switches */
    .toggles-row {
      display: flex;
      gap: 24px;
      align-items: center;
      flex-wrap: wrap;
      padding-top: 10px;
    }
    .toggle-item {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 0.9rem;
      color: #cbd5e1;
      user-select: none;
    }
    .toggle-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    /* Modern Action Button */
    .btn-update {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 32px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    .btn-update:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(99, 102, 241, 0.6);
      background: linear-gradient(135deg, #4f46e5, #4338ca);
    }
    .btn-update:active {
      transform: translateY(0);
    }

    /* Showcase Section with 3D Tilt Cards */
    .showcase-section {
      margin-bottom: 60px;
    }

    .showcase-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .tab-pills {
      display: flex;
      gap: 6px;
      background: rgba(3, 7, 18, 0.8);
      padding: 5px;
      border-radius: 14px;
      border: 1px solid var(--border);
    }
    .tab-pill-btn {
      padding: 8px 16px;
      background: transparent;
      border: none;
      border-radius: 10px;
      color: var(--text-muted);
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-pill-btn:hover {
      color: #fff;
    }
    .tab-pill-btn.active {
      background: var(--surface-elevated);
      color: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    /* Cards Grid */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
      gap: 28px;
    }
    @media (max-width: 600px) {
      .cards-grid { grid-template-columns: 1fr; }
    }

    /* 3D Tilt Card Wrapper */
    .tilt-wrapper {
      perspective: 1000px;
      transition: transform 0.1s;
    }

    .card-frame {
      position: relative;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 16px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(20px);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    .card-frame:hover {
      border-color: rgba(99, 102, 241, 0.5);
      box-shadow: 0 24px 60px rgba(99, 102, 241, 0.18);
      transform: translateY(-4px);
    }

    /* Specular Glare Overlay */
    .card-glare {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.08) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s;
      border-radius: 20px;
    }
    .card-frame:hover .card-glare {
      opacity: 1;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 0 6px;
    }
    .card-meta-title {
      font-size: 0.95rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge-live {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 8px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 999px;
    }

    .card-img-container {
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      background: #0d1117;
      min-height: 195px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-img-container img {
      width: 100%;
      height: auto;
      display: block;
      transition: opacity 0.3s;
    }

    .card-actions-bar {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 12px;
      padding: 0 4px;
    }
    .card-tool-btn {
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .card-tool-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* Export Drawer / Markdown Generator */
    .export-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px;
      backdrop-filter: blur(24px);
    }
    .export-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 14px;
    }
    .code-wrapper {
      position: relative;
    }
    pre {
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.88rem;
      color: #93c5fd;
      line-height: 1.6;
    }
    .copy-button {
      position: absolute;
      top: 14px;
      right: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      background: #1f2937;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #fff;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.2s;
    }
    .copy-button:hover {
      background: var(--primary);
      border-color: var(--primary);
      transform: translateY(-1px);
    }
  </style>
</head>
<body>

  <!-- Ambient Light Orbs -->
  <div class="ambient-glow glow-1"></div>
  <div class="ambient-glow glow-2"></div>
  <div class="ambient-glow glow-3"></div>

  <!-- Three.js Interactive Particle Canvas -->
  <canvas id="webgl-canvas"></canvas>

  <div class="container">
    <!-- Header -->
    <header>
      <div class="badge-pill">
        <span class="badge-dot"></span>
        v2.0 • Ultra-Reliable GitHub Suite
      </div>
      <h1>Turn Your Code Into Legend.</h1>
      <p class="subtitle">Timezone-accurate streaks, gamified RPG character sheets, and verified account net-worth cards for your GitHub profile README.</p>
    </header>

    <!-- Studio Customization Panel -->
    <div class="studio-panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>⚙️</span> Interactive Studio Console
        </div>
        <button class="preset-chip" onclick="detectUserTimezone()">📍 Detect My Timezone</button>
      </div>

      <div class="grid-form">
        <!-- Username Field -->
        <div class="input-group">
          <label for="username">
            GitHub Username
            <span class="input-hint">Public Profile</span>
          </label>
          <input type="text" id="username" class="input-box" value="13507-IN" placeholder="e.g. 13507-IN">
          <div class="preset-row">
            <span class="preset-chip" onclick="setUsername('13507-IN')">@13507-IN</span>
            <span class="preset-chip" onclick="setUsername('torvalds')">@torvalds</span>
            <span class="preset-chip" onclick="setUsername('octocat')">@octocat</span>
          </div>
        </div>

        <!-- Timezone Field -->
        <div class="input-group">
          <label for="timezone">
            Timezone
            <span class="input-hint">For Accurate Rollover</span>
          </label>
          <input type="text" id="timezone" class="input-box" value="Asia/Kolkata" placeholder="e.g. Asia/Kolkata">
        </div>

        <!-- Grace Days Field -->
        <div class="input-group">
          <label for="graceDays">
            Streak Grace Days
            <span class="input-hint">Streak Freeze Tolerance</span>
          </label>
          <input type="number" id="graceDays" class="input-box" min="0" max="3" value="1">
        </div>

        <!-- Currency Field -->
        <div class="input-group">
          <label for="currency">
            Valuation Currency
            <span class="input-hint">Net Worth Symbol</span>
          </label>
          <select id="currency" class="input-box">
            <option value="$">$ USD (United States Dollar)</option>
            <option value="₹">₹ INR (Indian Rupee)</option>
            <option value="€">€ EUR (Euro)</option>
            <option value="£">£ GBP (British Pound)</option>
          </select>
        </div>
      </div>

      <!-- Theme Selection Pills -->
      <div class="input-group" style="margin-bottom: 24px;">
        <label>Theme Palette</label>
        <div class="theme-picker-container" id="theme-chips">
          ${themeList.map(([key, t]) => `
            <div class="theme-chip ${key === 'github-dark' ? 'active' : ''}" onclick="selectTheme('${key}', this)">
              <span class="theme-dot" style="background: ${t.titleColor}"></span>
              ${key}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Toggles -->
      <div class="toggles-row">
        <label class="toggle-item">
          <input type="checkbox" id="hideBorder">
          <span>Hide Card Border</span>
        </label>
        <label class="toggle-item">
          <input type="checkbox" id="hideRank">
          <span>Hide Rank Badge</span>
        </label>
        <button class="btn-update" onclick="updateAllCards()">
          <span>⚡ Update Live Cards</span>
        </button>
      </div>
    </div>

    <!-- Live 3D Tilt Showcase -->
    <div class="showcase-section">
      <div class="showcase-header">
        <h2 style="font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
          <span>🔥</span> Live Vector Cards Showcase
        </h2>
        <div class="tab-pills">
          <button class="tab-pill-btn active" onclick="filterCards('all', this)">All Cards</button>
          <button class="tab-pill-btn" onclick="filterCards('rpg', this)">🎮 RPG</button>
          <button class="tab-pill-btn" onclick="filterCards('worth', this)">💰 Worth</button>
          <button class="tab-pill-btn" onclick="filterCards('streak', this)">🔥 Streak</button>
          <button class="tab-pill-btn" onclick="filterCards('stats', this)">📊 Stats</button>
          <button class="tab-pill-btn" onclick="filterCards('languages', this)">💻 Languages</button>
        </div>
      </div>

      <div class="cards-grid" id="cards-container">
        <!-- 1. RPG Card -->
        <div class="tilt-wrapper" data-category="rpg">
          <div class="card-frame">
            <div class="card-glare"></div>
            <div class="card-meta">
              <span class="card-meta-title">🎮 RPG Developer Character Sheet</span>
              <span class="badge-live">● Vector</span>
            </div>
            <div class="card-img-container">
              <img id="card-rpg" src="/api/rpg?username=13507-IN&theme=github-dark&grace_days=1" alt="RPG Card">
            </div>
            <div class="card-actions-bar">
              <button class="card-tool-btn" onclick="downloadSvg('card-rpg', 'rpg.svg')">⬇ Download SVG</button>
              <button class="card-tool-btn" onclick="copyCardUrl('card-rpg')">🔗 Copy URL</button>
            </div>
          </div>
        </div>

        <!-- 2. Worth Card -->
        <div class="tilt-wrapper" data-category="worth">
          <div class="card-frame">
            <div class="card-glare"></div>
            <div class="card-meta">
              <span class="card-meta-title">💰 Account Net Worth / Valuation</span>
              <span class="badge-live">● Vector</span>
            </div>
            <div class="card-img-container">
              <img id="card-worth" src="/api/worth?username=13507-IN&theme=github-dark&grace_days=1" alt="Worth Card">
            </div>
            <div class="card-actions-bar">
              <button class="card-tool-btn" onclick="downloadSvg('card-worth', 'worth.svg')">⬇ Download SVG</button>
              <button class="card-tool-btn" onclick="copyCardUrl('card-worth')">🔗 Copy URL</button>
            </div>
          </div>
        </div>

        <!-- 3. Streak Card -->
        <div class="tilt-wrapper" data-category="streak">
          <div class="card-frame">
            <div class="card-glare"></div>
            <div class="card-meta">
              <span class="card-meta-title">🔥 Contribution Streak (Grace Day Aware)</span>
              <span class="badge-live">● Vector</span>
            </div>
            <div class="card-img-container">
              <img id="card-streak" src="/api/streak?username=13507-IN&theme=github-dark&grace_days=1" alt="Streak Card">
            </div>
            <div class="card-actions-bar">
              <button class="card-tool-btn" onclick="downloadSvg('card-streak', 'streak.svg')">⬇ Download SVG</button>
              <button class="card-tool-btn" onclick="copyCardUrl('card-streak')">🔗 Copy URL</button>
            </div>
          </div>
        </div>

        <!-- 4. Stats Card -->
        <div class="tilt-wrapper" data-category="stats">
          <div class="card-frame">
            <div class="card-glare"></div>
            <div class="card-meta">
              <span class="card-meta-title">📊 General Developer Stats</span>
              <span class="badge-live">● Vector</span>
            </div>
            <div class="card-img-container">
              <img id="card-stats" src="/api/stats?username=13507-IN&theme=github-dark" alt="Stats Card">
            </div>
            <div class="card-actions-bar">
              <button class="card-tool-btn" onclick="downloadSvg('card-stats', 'stats.svg')">⬇ Download SVG</button>
              <button class="card-tool-btn" onclick="copyCardUrl('card-stats')">🔗 Copy URL</button>
            </div>
          </div>
        </div>

        <!-- 5. Languages Card -->
        <div class="tilt-wrapper" data-category="languages">
          <div class="card-frame">
            <div class="card-glare"></div>
            <div class="card-meta">
              <span class="card-meta-title">💻 Top Programming Languages</span>
              <span class="badge-live">● Vector</span>
            </div>
            <div class="card-img-container">
              <img id="card-languages" src="/api/languages?username=13507-IN&theme=github-dark" alt="Languages Card">
            </div>
            <div class="card-actions-bar">
              <button class="card-tool-btn" onclick="downloadSvg('card-languages', 'languages.svg')">⬇ Download SVG</button>
              <button class="card-tool-btn" onclick="copyCardUrl('card-languages')">🔗 Copy URL</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Code Export Center -->
    <div class="export-box">
      <div class="export-header">
        <h2 style="font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
          <span>📦</span> Ready-to-Paste Profile Markdown
        </h2>
        <div class="tab-pills">
          <button class="tab-pill-btn active" onclick="switchExportTab('action', this)">GitHub Action (100% Uptime)</button>
          <button class="tab-pill-btn" onclick="switchExportTab('dynamic', this)">Dynamic Markdown URL</button>
        </div>
      </div>

      <div id="export-action" class="code-wrapper">
        <button class="copy-button" onclick="copyActionCode(this)">📋 Copy Workflow YAML</button>
        <pre id="action-yaml-code">name: Update GitHub Stats & RPG Cards

on:
  schedule:
    - cron: '0 */2 * * *' # Updates every 2 hours
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-stats:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Generate Cards
        run: npx github-stats-cards --username \${{ github.repository_owner }} --timezone Asia/Kolkata --grace-days 1 --theme github-dark --output ./stats
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      - name: Commit and Push
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add stats/
          git commit -m "Update profile cards [skip ci]" || exit 0
          git push</pre>
      </div>

      <div id="export-dynamic" class="code-wrapper" style="display: none;">
        <button class="copy-button" onclick="copyDynamicCode(this)">📋 Copy Markdown</button>
        <pre id="dynamic-md-code"></pre>
      </div>
    </div>
  </div>

  <!-- Interactive Three.js Background & Client Scripts -->
  <script>
    let activeTheme = 'github-dark';

    // 1. Initialize Interactive Three.js Particles
    function initThreeBg() {
      const canvas = document.getElementById('webgl-canvas');
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 80;

      // Create particle geometry
      const particleCount = 140;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const color1 = new THREE.Color(0x6366f1);
      const color2 = new THREE.Color(0x06b6d4);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 160;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

        const mixed = color1.clone().lerp(color2, Math.random());
        colors[i * 3] = mixed.r;
        colors[i * 3 + 1] = mixed.g;
        colors[i * 3 + 2] = mixed.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // Mouse tracking
      let mouseX = 0, mouseY = 0;
      let targetX = 0, targetY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
      });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      function animate() {
        requestAnimationFrame(animate);
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;

        camera.position.x = targetX * 0.3;
        camera.position.y = -targetY * 0.3;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }
      animate();
    }

    // 2. 3D Perspective Tilt on Mouse Movement
    function init3DTilt() {
      const cards = document.querySelectorAll('.card-frame');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
          card.style.setProperty('--mouse-x', (x / rect.width * 100) + '%');
          card.style.setProperty('--mouse-y', (y / rect.height * 100) + '%');
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
      });
    }

    // 3. Audio synthesis for tactile clicks
    function playClickSound() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch(e) {}
    }

    // 4. Update Cards
    function updateAllCards() {
      playClickSound();
      const username = document.getElementById('username').value.trim() || '13507-IN';
      const timezone = document.getElementById('timezone').value.trim() || 'Asia/Kolkata';
      const graceDays = document.getElementById('graceDays').value || '1';
      const currency = document.getElementById('currency').value || '$';
      const hideBorder = document.getElementById('hideBorder').checked;
      const hideRank = document.getElementById('hideRank').checked;

      const base = window.location.origin;
      const commonQuery = '?username=' + encodeURIComponent(username) +
        '&theme=' + activeTheme +
        '&timezone=' + encodeURIComponent(timezone) +
        '&grace_days=' + graceDays +
        '&currency=' + encodeURIComponent(currency) +
        (hideBorder ? '&hide_border=true' : '');

      const rpgUrl = base + '/api/rpg' + commonQuery;
      const worthUrl = base + '/api/worth' + commonQuery;
      const streakUrl = base + '/api/streak' + commonQuery;
      const statsUrl = base + '/api/stats' + commonQuery + (hideRank ? '&hide_rank=true' : '');
      const langsUrl = base + '/api/languages' + commonQuery;

      document.getElementById('card-rpg').src = rpgUrl;
      document.getElementById('card-worth').src = worthUrl;
      document.getElementById('card-streak').src = streakUrl;
      document.getElementById('card-stats').src = statsUrl;
      document.getElementById('card-languages').src = langsUrl;

      const md = '<p align="center">\\n' +
        '  <img src="' + rpgUrl + '" alt="RPG Character Sheet" width="480" />\\n' +
        '  <img src="' + worthUrl + '" alt="Account Valuation" width="480" />\\n' +
        '</p>\\n' +
        '<p align="center">\\n' +
        '  <img src="' + streakUrl + '" alt="Streak Card" width="480" />\\n' +
        '  <img src="' + statsUrl + '" alt="Stats Card" width="480" />\\n' +
        '</p>';
      document.getElementById('dynamic-md-code').textContent = md;
    }

    function selectTheme(themeName, el) {
      playClickSound();
      activeTheme = themeName;
      document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      updateAllCards();
    }

    function setUsername(name) {
      document.getElementById('username').value = name;
      updateAllCards();
    }

    function detectUserTimezone() {
      playClickSound();
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      document.getElementById('timezone').value = tz;
      updateAllCards();
    }

    function filterCards(category, btn) {
      playClickSound();
      document.querySelectorAll('.tab-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cards = document.querySelectorAll('.tilt-wrapper');
      cards.forEach(c => {
        if (category === 'all' || c.getAttribute('data-category') === category) {
          c.style.display = 'block';
        } else {
          c.style.display = 'none';
        }
      });
    }

    function switchExportTab(type, btn) {
      playClickSound();
      btn.parentElement.querySelectorAll('.tab-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('export-action').style.display = type === 'action' ? 'block' : 'none';
      document.getElementById('export-dynamic').style.display = type === 'dynamic' ? 'block' : 'none';
    }

    function copyActionCode(btn) {
      const code = document.getElementById('action-yaml-code').innerText;
      navigator.clipboard.writeText(code);
      triggerConfetti();
      btn.innerHTML = '✅ Copied!';
      setTimeout(() => btn.innerHTML = '📋 Copy Workflow YAML', 2000);
    }

    function copyDynamicCode(btn) {
      const code = document.getElementById('dynamic-md-code').innerText;
      navigator.clipboard.writeText(code);
      triggerConfetti();
      btn.innerHTML = '✅ Copied!';
      setTimeout(() => btn.innerHTML = '📋 Copy Markdown', 2000);
    }

    function copyCardUrl(imgId) {
      const url = document.getElementById(imgId).src;
      navigator.clipboard.writeText(url);
      triggerConfetti();
      alert('Card URL copied to clipboard!');
    }

    function downloadSvg(imgId, filename) {
      const url = document.getElementById(imgId).src;
      fetch(url)
        .then(r => r.blob())
        .then(blob => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          a.click();
        });
    }

    function triggerConfetti() {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']
        });
      } catch(e) {}
    }

    window.addEventListener('DOMContentLoaded', () => {
      initThreeBg();
      init3DTilt();
      updateAllCards();
    });
  </script>
</body>
</html>`;
}
