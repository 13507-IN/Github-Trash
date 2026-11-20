import { themes } from '../themes/index.js';

export function renderPlaygroundHtml(): string {
  const themeList = Object.entries(themes);

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Experience Suite â€¢ Next-Gen Profile Engine</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>âš¡</text></svg>">
  
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
      --surface: rgba(17, 24, 39, 0.72);
      --surface-elevated: rgba(31, 41, 55, 0.78);
      --border: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(99, 102, 241, 0.45);
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
      opacity: 0.9;
    }

    /* Subtle ambient radial glow orbs */
    .ambient-glow {
      position: fixed;
      border-radius: 50%;
      filter: blur(120px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.28;
      transition: all 1s ease;
    }
    .glow-1 { top: -10%; left: 10%; width: 550px; height: 550px; background: radial-gradient(circle, #4f46e5, transparent 70%); }
    .glow-2 { bottom: 15%; right: 5%; width: 600px; height: 600px; background: radial-gradient(circle, #06b6d4, transparent 70%); }
    .glow-3 { top: 45%; left: 35%; width: 450px; height: 450px; background: radial-gradient(circle, #10b981, transparent 70%); }

    /* Top Navigation Bar */
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      width: 100%;
      background: rgba(3, 7, 18, 0.75);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
      color: #fff;
      text-decoration: none;
    }
    .nav-brand-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, var(--primary), var(--cyan));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px var(--primary-glow);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .audio-toggle-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      border-radius: 20px;
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .audio-toggle-btn:hover {
      border-color: var(--cyan);
      color: #fff;
    }
    .audio-bars {
      display: inline-flex;
      align-items: flex-end;
      gap: 2px;
      height: 12px;
    }
    .audio-bar {
      width: 2.5px;
      background: var(--cyan);
      border-radius: 1px;
      animation: soundWave 1.2s ease-in-out infinite alternate;
    }
    .audio-bar:nth-child(1) { height: 4px; animation-delay: 0.1s; }
    .audio-bar:nth-child(2) { height: 10px; animation-delay: 0.3s; }
    .audio-bar:nth-child(3) { height: 7px; animation-delay: 0.2s; }
    .audio-muted .audio-bar { animation: none; height: 3px; background: var(--text-muted); }
    @keyframes soundWave {
      0% { height: 3px; }
      100% { height: 12px; }
    }

    .nav-link-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .nav-link-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .container {
      position: relative;
      z-index: 10;
      max-width: 1260px;
      margin: 0 auto;
      padding: 40px 24px 100px;
    }

    /* Hero Header */
    header {
      text-align: center;
      margin-bottom: 45px;
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
      margin-bottom: 18px;
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
      max-width: 760px;
      margin: 0 auto 30px;
      line-height: 1.6;
    }

    /* Glassmorphism Control Console */
    .studio-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      backdrop-filter: blur(24px) saturate(190%);
      border-radius: 24px;
      padding: 30px;
      margin-bottom: 45px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      transition: border-color 0.3s;
    }
    .studio-panel:hover {
      border-color: rgba(255, 255, 255, 0.16);
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 12px;
    }
    .panel-title {
      font-size: 1.15rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
    }

    .grid-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
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
      align-items: center;
    }
    .input-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 400;
    }
    .input-box, .select-box {
      width: 100%;
      background: rgba(3, 7, 18, 0.6);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 0.95rem;
      color: #fff;
      outline: none;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .input-box:focus, .select-box:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-glow);
      background: rgba(3, 7, 18, 0.85);
    }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 0;
    }
    .slider-input {
      flex: 1;
      accent-color: var(--primary);
      cursor: pointer;
    }
    .slider-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.08);
      padding: 4px 8px;
      border-radius: 6px;
      min-width: 44px;
      text-align: center;
    }

    .preset-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 6px;
    }
    .preset-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 5px 10px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .preset-chip:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      border-color: var(--primary);
    }

    /* Live Themes Horizontal Carousel Swatches */
    .theme-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }
    .theme-header {
      font-size: 0.9rem;
      font-weight: 700;
      color: #e2e8f0;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .theme-swatches {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px;
      max-height: 180px;
      overflow-y: auto;
      padding-right: 6px;
    }
    .theme-swatches::-webkit-scrollbar {
      width: 6px;
    }
    .theme-swatches::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    .theme-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 8px 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .theme-card:hover {
      background: rgba(30, 41, 59, 0.8);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .theme-card.active {
      border-color: var(--cyan);
      background: rgba(6, 182, 212, 0.12);
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
    }
    .theme-dots {
      display: flex;
      gap: 3px;
    }
    .theme-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.2);
    }
    .theme-name {
      font-size: 0.78rem;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Card Filter Tabs */
    .filter-tabs-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 14px;
    }
    .filter-tabs {
      display: flex;
      gap: 6px;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid var(--border);
      padding: 5px;
      border-radius: 14px;
      backdrop-filter: blur(16px);
      overflow-x: auto;
      max-width: 100%;
    }
    .filter-btn {
      background: transparent;
      border: none;
      padding: 7px 16px;
      border-radius: 10px;
      color: var(--text-muted);
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .filter-btn:hover {
      color: #fff;
    }
    .filter-btn.active {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    /* Top Spotlight Banner Card */
    .spotlight-banner-wrapper {
      margin-bottom: 32px;
    }

    /* 3D Cards Grid */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(490px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }

    @media (max-width: 600px) {
      .cards-grid {
        grid-template-columns: 1fr;
      }
    }

    /* 3D Perspective Tilt Card Container */
    .tilt-wrapper {
      perspective: 1200px;
      transform-style: preserve-3d;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .card-frame {
      position: relative;
      background: var(--surface-elevated);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      backdrop-filter: blur(20px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
      transform-style: preserve-3d;
      transition: transform 0.15s ease-out, border-color 0.25s, box-shadow 0.25s;
      overflow: hidden;
    }
    .card-frame:hover {
      border-color: var(--border-hover);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6), 0 0 25px var(--primary-glow);
    }

    /* Specular Glare Tracking */
    .card-glare {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: radial-gradient(circle 350px at 50% 50%, rgba(255, 255, 255, 0.12), transparent 75%);
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 2;
    }
    .card-frame:hover .card-glare {
      opacity: 1;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .card-meta-title {
      font-size: 0.92rem;
      font-weight: 700;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge-live {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .card-img-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 195px;
      background: rgba(0, 0, 0, 0.25);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }
    .card-img-container img {
      max-width: 100%;
      height: auto;
      display: block;
      transition: filter 0.3s;
    }

    .card-actions-bar {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .card-tool-btn {
      flex: 1;
      min-width: 100px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: #fff;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .card-tool-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: var(--primary);
      transform: translateY(-1px);
    }
    .card-tool-btn-primary {
      background: var(--primary);
      border-color: var(--primary);
    }
    .card-tool-btn-primary:hover {
      background: #4f46e5;
    }

    /* Code Export Center */
    .export-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px;
      backdrop-filter: blur(24px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }
    .export-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 14px;
    }
    .tab-pills {
      display: flex;
      gap: 6px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid var(--border);
      padding: 4px;
      border-radius: 12px;
      flex-wrap: wrap;
    }
    .tab-pill-btn {
      background: transparent;
      border: none;
      padding: 6px 14px;
      border-radius: 8px;
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-pill-btn:hover {
      color: #fff;
    }
    .tab-pill-btn.active {
      background: var(--primary);
      color: #fff;
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

  <!-- Three.js Interactive Particle & Wireframe Core Canvas -->
  <canvas id="webgl-canvas"></canvas>

  <!-- Sticky Modern Navbar -->
  <nav class="navbar">
    <a href="#" class="nav-brand">
      <div class="nav-brand-icon">âš¡</div>
      <span>GitHub Experience Suite</span>
    </a>
    <div class="nav-actions">
      <button id="sfx-toggle-btn" class="audio-toggle-btn" onclick="toggleAudio()">
        <span class="audio-bars">
          <span class="audio-bar"></span>
          <span class="audio-bar"></span>
          <span class="audio-bar"></span>
        </span>
        <span id="sfx-status-text">SFX: ON</span>
      </button>
      <a href="https://github.com/13507-IN/Github-Trash" target="_blank" class="nav-link-btn">
        <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
        </svg>
        GitHub Repo
      </a>
    </div>
  </nav>

  <div class="container">
    <!-- Header -->
    <header>
      <div class="badge-pill">
        <span class="badge-dot"></span>
        v2.5 â€¢ Full Suite: Stats, Banners, RPG &amp; Trophies
      </div>
      <h1>Turn Your Code Into Legend.</h1>
      <p class="subtitle">Next-gen dynamic profile header banners, timezone-accurate streaks, gamified RPG sheets, unlocked trophies, and verified account net-worth cards.</p>
    </header>

    <!-- Studio Customization Panel -->
    <div class="studio-panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>âš™ï¸ </span> Interactive Studio Console
        </div>
        <button class="preset-chip" onclick="detectUserTimezone()">ðŸ“  Detect My Timezone</button>
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
            <span class="preset-chip" onclick="setUsername('shadcn')">@shadcn</span>
            <span class="preset-chip" onclick="setUsername('antfu')">@antfu</span>
          </div>
        </div>

        <!-- Timezone Field -->
        <div class="input-group">
          <label for="timezone">
            Your Timezone
            <span class="input-hint">IANA Timezone</span>
          </label>
          <input type="text" id="timezone" class="input-box" value="Asia/Kolkata" placeholder="e.g. Asia/Kolkata">
        </div>

        <!-- Grace Days Field -->
        <div class="input-group">
          <label for="graceDays">
            Streak Grace Period
            <span class="input-hint">No dropped streak bug</span>
          </label>
          <select id="graceDays" class="select-box">
            <option value="1" selected>1 Day Grace (Recommended)</option>
            <option value="2">2 Days Grace (Flexible)</option>
            <option value="0">0 Days (Strict Streak)</option>
          </select>
        </div>

        <!-- Border Radius Slider -->
        <div class="input-group">
          <label for="borderRadius">
            Border Radius
            <span id="radiusValBadge" class="slider-badge">12px</span>
          </label>
          <div class="slider-container">
            <input type="range" id="borderRadius" class="slider-input" min="0" max="25" value="12" oninput="updateRadius(this.value)">
          </div>
        </div>
      </div>

      <!-- Live Themes Horizontal Carousel Swatches -->
      <div class="theme-section">
        <div class="theme-header">
          <span>Select Theme Preset</span>
          <span id="activeThemeBadge" class="input-hint" style="color: var(--cyan); font-weight: 700;">Active: github-dark</span>
        </div>
        <div class="theme-swatches">
          ${themeList
            .map(([key, t]) => {
              const bg = t.background;
              const title = t.titleColor;
              const accent = t.accentColor;
              const isDefault = key === 'github-dark';
              return `
          <div class="theme-card ${isDefault ? 'active' : ''}" data-theme="${key}" onclick="setTheme('${key}', this)">
            <div class="theme-dots">
              <span class="theme-dot" style="background: ${bg};"></span>
              <span class="theme-dot" style="background: ${title};"></span>
              <span class="theme-dot" style="background: ${accent};"></span>
            </div>
            <span class="theme-name">${key}</span>
          </div>`;
            })
            .join('')}
        </div>
      </div>
    </div>

    <!-- Card Filter Tabs -->
    <div class="filter-tabs-wrapper">
      <div class="filter-tabs">
        <button class="filter-btn active" onclick="filterCards('all', this)">All Cards (7)</button>
        <button class="filter-btn" onclick="filterCards('banner', this)">Header Banner</button>
        <button class="filter-btn" onclick="filterCards('rpg', this)">RPG Character</button>
        <button class="filter-btn" onclick="filterCards('worth', this)">Account Valuation</button>
        <button class="filter-btn" onclick="filterCards('trophies', this)">Achievements</button>
        <button class="filter-btn" onclick="filterCards('streak', this)">Streak</button>
        <button class="filter-btn" onclick="filterCards('stats', this)">Stats</button>
        <button class="filter-btn" onclick="filterCards('languages', this)">Languages</button>
      </div>
    </div>

    <!-- 1. Top Full-Width Profile Header Banner -->
    <div class="spotlight-banner-wrapper tilt-wrapper" data-category="banner">
      <div class="card-frame" style="padding: 20px;">
        <div class="card-glare"></div>
        <div class="card-meta">
          <span class="card-meta-title">ðŸ–¼ï¸  Dynamic Animated Profile Header Banner (800x220)</span>
          <span class="badge-live">â—  Vector Animated</span>
        </div>
        <div class="card-img-container" style="min-height: 220px; background: rgba(0,0,0,0.4);">
          <img id="card-banner" src="/api/banner?username=13507-IN&theme=github-dark&grace_days=1&border_radius=16" alt="Profile Banner">
        </div>
        <div class="card-actions-bar">
          <button class="card-tool-btn card-tool-btn-primary" onclick="downloadSvg('card-banner', 'banner.svg')">â¬‡ Download SVG</button>
          <button class="card-tool-btn" onclick="exportPng('card-banner', 'banner.png', 800, 220)">ðŸ–¼ Export PNG @2x</button>
          <button class="card-tool-btn" onclick="copyCardUrl('card-banner')">ðŸ”— Copy URL</button>
          <button class="card-tool-btn" onclick="copyCardMarkdown('banner', 'card-banner')">ðŸ“‹ Copy Markdown</button>
        </div>
      </div>
    </div>

    <!-- 2-Column Responsive Grid of Cards -->
    <div class="cards-grid">
      
      <!-- 2. RPG Developer Sheet -->
      <div class="tilt-wrapper" data-category="rpg">
        <div class="card-frame">
          <div class="card-glare"></div>
          <div class="card-meta">
            <span class="card-meta-title">âš”ï¸  RPG Developer Character Sheet</span>
            <span class="badge-live">â—  Gamified</span>
          </div>
          <div class="card-img-container">
            <img id="card-rpg" src="/api/rpg?username=13507-IN&theme=github-dark&grace_days=1" alt="RPG Card">
          </div>
          <div class="card-actions-bar">
            <button class="card-tool-btn" onclick="downloadSvg('card-rpg', 'rpg.svg')">â¬‡ SVG</button>
            <button class="card-tool-btn" onclick="exportPng('card-rpg', 'rpg.png', 495, 195)">ðŸ–¼ PNG @2x</button>
            <button class="card-tool-btn" onclick="copyCardUrl('card-rpg')">ðŸ”— URL</button>
            <button class="card-tool-btn" onclick="copyCardMarkdown('rpg', 'card-rpg')">ðŸ“‹ Markdown</button>
          </div>
        </div>
      </div>

      <!-- 3. Account Valuation / Worth Card -->
      <div class="tilt-wrapper" data-category="worth">
        <div class="card-frame">
          <div class="card-glare"></div>
          <div class="card-meta">
            <span class="card-meta-title">ðŸ’° Account Net Worth / Valuation</span>
            <span class="badge-live">â—  Fintech</span>
          </div>
          <div class="card-img-container">
            <img id="card-worth" src="/api/worth?username=13507-IN&theme=github-dark&grace_days=1" alt="Worth Card">
          </div>
          <div class="card-actions-bar">
            <button class="card-tool-btn" onclick="downloadSvg('card-worth', 'worth.svg')">â¬‡ SVG</button>
            <button class="card-tool-btn" onclick="exportPng('card-worth', 'worth.png', 495, 195)">ðŸ–¼ PNG @2x</button>
            <button class="card-tool-btn" onclick="copyCardUrl('card-worth')">ðŸ”— URL</button>
            <button class="card-tool-btn" onclick="copyCardMarkdown('worth', 'card-worth')">ðŸ“‹ Markdown</button>
          </div>
        </div>
      </div>

      <!-- 4. Developer Achievements & Trophies -->
      <div class="tilt-wrapper" data-category="trophies">
        <div class="card-frame">
          <div class="card-glare"></div>
          <div class="card-meta">
            <span class="card-meta-title">ðŸ † Developer Achievements &amp; Trophies</span>
            <span class="badge-live">â—  Unlocked</span>
          </div>
          <div class="card-img-container">
            <img id="card-trophies" src="/api/trophies?username=13507-IN&theme=github-dark&grace_days=1" alt="Trophies Card">
          </div>
          <div class="card-actions-bar">
            <button class="card-tool-btn" onclick="downloadSvg('card-trophies', 'trophies.svg')">â¬‡ SVG</button>
            <button class="card-tool-btn" onclick="exportPng('card-trophies', 'trophies.png', 495, 195)">ðŸ–¼ PNG @2x</button>
            <button class="card-tool-btn" onclick="copyCardUrl('card-trophies')">ðŸ”— URL</button>
            <button class="card-tool-btn" onclick="copyCardMarkdown('trophies', 'card-trophies')">ðŸ“‹ Markdown</button>
          </div>
        </div>
      </div>

      <!-- 5. Streak Card -->
      <div class="tilt-wrapper" data-category="streak">
        <div class="card-frame">
          <div class="card-glare"></div>
          <div class="card-meta">
            <span class="card-meta-title">ðŸ”¥ Contribution Streak (Grace Day Aware)</span>
            <span class="badge-live">â—  Accurate</span>
          </div>
          <div class="card-img-container">
            <img id="card-streak" src="/api/streak?username=13507-IN&theme=github-dark&grace_days=1" alt="Streak Card">
          </div>
          <div class="card-actions-bar">
            <button class="card-tool-btn" onclick="downloadSvg('card-streak', 'streak.svg')">â¬‡ SVG</button>
            <button class="card-tool-btn" onclick="exportPng('card-streak', 'streak.png', 495, 195)">ðŸ–¼ PNG @2x</button>
            <button class="card-tool-btn" onclick="copyCardUrl('card-streak')">ðŸ”— URL</button>
            <button class="card-tool-btn" onclick="copyCardMarkdown('streak', 'card-streak')">ðŸ“‹ Markdown</button>
          </div>
        </div>
      </div>

      <!-- 6. General Stats Card -->
      <div class="tilt-wrapper" data-category="stats">
        <div class="card-frame">
          <div class="card-glare"></div>
          <div class="card-meta">
            <span class="card-meta-title">ðŸ“Š General Developer Stats &amp; Rank</span>
            <span class="badge-live">â—  Ranked S+</span>
          </div>
          <div class="card-img-container">
            <img id="card-stats" src="/api/stats?username=13507-IN&theme=github-dark" alt="Stats Card">
          </div>
          <div class="card-actions-bar">
            <button class="card-tool-btn" onclick="downloadSvg('card-stats', 'stats.svg')">â¬‡ SVG</button>
            <button class="card-tool-btn" onclick="exportPng('card-stats', 'stats.png', 495, 195)">ðŸ–¼ PNG @2x</button>
            <button class="card-tool-btn" onclick="copyCardUrl('card-stats')">ðŸ”— URL</button>
            <button class="card-tool-btn" onclick="copyCardMarkdown('stats', 'card-stats')">ðŸ“‹ Markdown</button>
          </div>
        </div>
      </div>

      <!-- 7. Languages Card -->
      <div class="tilt-wrapper" data-category="languages">
        <div class="card-frame">
          <div class="card-glare"></div>
          <div class="card-meta">
            <span class="card-meta-title">ðŸ’» Top Programming Languages</span>
            <span class="badge-live">â—  Segmented</span>
          </div>
          <div class="card-img-container">
            <img id="card-languages" src="/api/languages?username=13507-IN&theme=github-dark" alt="Languages Card">
          </div>
          <div class="card-actions-bar">
            <button class="card-tool-btn" onclick="downloadSvg('card-languages', 'languages.svg')">â¬‡ SVG</button>
            <button class="card-tool-btn" onclick="exportPng('card-languages', 'languages.png', 495, 195)">ðŸ–¼ PNG @2x</button>
            <button class="card-tool-btn" onclick="copyCardUrl('card-languages')">ðŸ”— URL</button>
            <button class="card-tool-btn" onclick="copyCardMarkdown('languages', 'card-languages')">ðŸ“‹ Markdown</button>
          </div>
        </div>
      </div>

    </div>

    <!-- Code Export Center -->
    <div class="export-box">
      <div class="export-header">
        <h2 style="font-size: 1.35rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
          <span>ðŸ“¦</span> Ready-to-Paste Profile Embeds
        </h2>
        <div class="tab-pills">
          <button class="tab-pill-btn active" onclick="switchExportTab('picture', this)">Dual-Theme &lt;picture&gt;</button>
          <button class="tab-pill-btn" onclick="switchExportTab('markdown', this)">Markdown ![]()</button>
          <button class="tab-pill-btn" onclick="switchExportTab('action', this)">GitHub Action (100% Uptime)</button>
        </div>
      </div>

      <!-- Tab 1: Dual Theme Picture tag -->
      <div id="export-picture" class="code-wrapper">
        <button class="copy-button" onclick="copyCodeFromPre('picture-code', this)">ðŸ“‹ Copy Dual-Theme Code</button>
        <pre id="picture-code"></pre>
      </div>

      <!-- Tab 2: Standard Markdown -->
      <div id="export-markdown" class="code-wrapper" style="display: none;">
        <button class="copy-button" onclick="copyCodeFromPre('markdown-code', this)">ðŸ“‹ Copy Markdown</button>
        <pre id="markdown-code"></pre>
      </div>

      <!-- Tab 3: GitHub Action YAML -->
      <div id="export-action" class="code-wrapper" style="display: none;">
        <button class="copy-button" onclick="copyCodeFromPre('action-yaml-code', this)">ðŸ“‹ Copy Workflow YAML</button>
        <pre id="action-yaml-code">name: Update GitHub Stats &amp; RPG Cards

on:
  schedule:
    - cron: '0 */2 * * *' # Auto-refreshes every 2 hours
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
      - name: Generate All Cards
        run: npx github-stats-cards --username \${{ github.repository_owner }} --timezone Asia/Kolkata --grace-days 1 --theme github-dark --output ./stats
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      - name: Commit and Push Updated SVGs
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add stats/
          git commit -m "Update profile cards and stats [skip ci]" || exit 0
          git push</pre>
      </div>
    </div>
  </div>

  <!-- Off-Screen Canvas for PNG Rasterization -->
  <canvas id="png-render-canvas" style="display: none;"></canvas>

  <!-- Interactive 3D WebGL Scene & Client Logic -->
  <script>
    let activeTheme = 'github-dark';
    let currentRadius = 12;
    let sfxEnabled = true;

    // Web Audio Synthesizer Engine
    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playHoverSound() {
      if (!sfxEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {}
    }

    function playClickSound() {
      if (!sfxEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      } catch (e) {}
    }

    function playSuccessFanfare() {
      if (!sfxEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 Major chord
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
          gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.25);
        });
      } catch (e) {}
    }

    function toggleAudio() {
      sfxEnabled = !sfxEnabled;
      const btn = document.getElementById('sfx-toggle-btn');
      const text = document.getElementById('sfx-status-text');
      if (sfxEnabled) {
        btn.classList.remove('audio-muted');
        text.innerText = 'SFX: ON';
        playClickSound();
      } else {
        btn.classList.add('audio-muted');
        text.innerText = 'SFX: OFF';
      }
    }

    // Three.js 3D Interactive WebGL Scene (Particle Constellation + Rotating Hologram Core)
    function initThreeScene() {
      const canvas = document.getElementById('webgl-canvas');
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 85;

      // 1. Holographic Icosahedron Core
      const coreGeo = new THREE.IcosahedronGeometry(22, 1);
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      const coreMesh = new THREE.Mesh(coreGeo, wireframeMat);
      scene.add(coreMesh);

      // 2. Dual Orbit Particle Rings
      const ringGeo = new THREE.BufferGeometry();
      const ringCount = 180;
      const ringPositions = new Float32Array(ringCount * 3);
      for (let i = 0; i < ringCount; i++) {
        const angle = (i / ringCount) * Math.PI * 2;
        const radius = 34 + (Math.random() - 0.5) * 4;
        ringPositions[i * 3] = Math.cos(angle) * radius;
        ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
        ringPositions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
      const ringMat = new THREE.PointsMaterial({
        color: 0x06b6d4,
        size: 1.8,
        transparent: true,
        opacity: 0.65
      });
      const ringMesh = new THREE.Points(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      scene.add(ringMesh);

      // 3. Floating Background Constellation
      const pCount = 120;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 200;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 160;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 100;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x818cf8,
        size: 1.5,
        transparent: true,
        opacity: 0.45
      });
      const particleField = new THREE.Points(pGeo, pMat);
      scene.add(particleField);

      // Mouse Parallax & Spring physics
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      // Click Ripple Shockwave
      window.addEventListener('click', (e) => {
        playClickSound();
        coreMesh.scale.set(1.15, 1.15, 1.15);
        setTimeout(() => { coreMesh.scale.set(1, 1, 1); }, 220);
      });

      function animate() {
        requestAnimationFrame(animate);

        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        coreMesh.rotation.x += 0.003;
        coreMesh.rotation.y += 0.005;
        coreMesh.position.x = mouseX * 12;
        coreMesh.position.y = -mouseY * 8;

        ringMesh.rotation.z += 0.004;
        ringMesh.position.x = mouseX * 10;
        ringMesh.position.y = -mouseY * 6;

        particleField.rotation.y += 0.0008;

        camera.position.x = mouseX * 8;
        camera.position.y = -mouseY * 6;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    // 3D Perspective Tilt on Card Hover
    function init3DTilt() {
      const cards = document.querySelectorAll('.tilt-wrapper');
      cards.forEach((card) => {
        const frame = card.querySelector('.card-frame');
        const glare = card.querySelector('.card-glare');

        card.addEventListener('mouseenter', () => {
          playHoverSound();
        });

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -9;
          const rotateY = ((x - centerX) / centerX) * 9;

          frame.style.transform = \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.02, 1.02, 1.02)\`;

          if (glare) {
            glare.style.background = \`radial-gradient(circle 320px at \${x}px \${y}px, rgba(255, 255, 255, 0.16), transparent 70%)\`;
          }
        });

        card.addEventListener('mouseleave', () => {
          frame.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
      });
    }

    // Update Radius slider
    function updateRadius(val) {
      currentRadius = val;
      document.getElementById('radiusValBadge').innerText = val + 'px';
      updateAllCards();
    }

    // Live URL Builder
    function getCardUrl(endpoint, extraParams = {}) {
      const username = document.getElementById('username').value.trim() || '13507-IN';
      const timezone = document.getElementById('timezone').value.trim() || 'UTC';
      const graceDays = document.getElementById('graceDays').value;

      const params = new URLSearchParams({
        username,
        theme: activeTheme,
        timezone,
        grace_days: graceDays,
        border_radius: currentRadius,
        ...extraParams
      });

      return \`/api/\${endpoint}?\${params.toString()}\`;
    }

    function updateAllCards() {
      const t = Date.now();
      const setSrc = (id, url) => {
        const img = document.getElementById(id);
        if (img) img.src = url + '&_t=' + t;
      };

      setSrc('card-banner', getCardUrl('banner', { border_radius: currentRadius }));
      setSrc('card-rpg', getCardUrl('rpg'));
      setSrc('card-worth', getCardUrl('worth'));
      setSrc('card-trophies', getCardUrl('trophies'));
      setSrc('card-streak', getCardUrl('streak'));
      setSrc('card-stats', getCardUrl('stats'));
      setSrc('card-languages', getCardUrl('languages'));

      updateExportCodes();
    }

    function updateExportCodes() {
      const username = document.getElementById('username').value.trim() || '13507-IN';
      const origin = window.location.origin;

      // 1. Dual-Theme Picture Tag
      const pictureCode = \`<!-- GitHub Profile Suite: Auto Dark/Light Mode -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="\${origin}/api/banner?username=\${username}&theme=github-dark&grace_days=1&border_radius=16">
  <source media="(prefers-color-scheme: light)" srcset="\${origin}/api/banner?username=\${username}&theme=default&grace_days=1&border_radius=16">
  <img alt="\${username}'s GitHub Banner" src="\${origin}/api/banner?username=\${username}&theme=github-dark&grace_days=1&border_radius=16">
</picture>

<div align="center">
  <img src="\${origin}/api/rpg?username=\${username}&theme=\${activeTheme}&grace_days=1" alt="RPG Character" height="195" />
  <img src="\${origin}/api/worth?username=\${username}&theme=\${activeTheme}&grace_days=1" alt="Net Worth" height="195" />
</div>

<div align="center">
  <img src="\${origin}/api/trophies?username=\${username}&theme=\${activeTheme}&grace_days=1" alt="Trophies" height="195" />
  <img src="\${origin}/api/streak?username=\${username}&theme=\${activeTheme}&grace_days=1" alt="Streak Card" height="195" />
</div>\`;

      const picEl = document.getElementById('picture-code');
      if (picEl) picEl.innerText = pictureCode;

      // 2. Standard Markdown Code
      const mdCode = \`# \${username}'s GitHub Profile

![\${username}'s Banner](\${origin}/api/banner?username=\${username}&theme=\${activeTheme}&grace_days=1)

![\${username}'s RPG Character](\${origin}/api/rpg?username=\${username}&theme=\${activeTheme}&grace_days=1)
![\${username}'s Valuation](\${origin}/api/worth?username=\${username}&theme=\${activeTheme}&grace_days=1)
![\${username}'s Trophies](\${origin}/api/trophies?username=\${username}&theme=\${activeTheme}&grace_days=1)
![\${username}'s Streak](\${origin}/api/streak?username=\${username}&theme=\${activeTheme}&grace_days=1)
![\${username}'s Stats](\${origin}/api/stats?username=\${username}&theme=\${activeTheme})
![\${username}'s Languages](\${origin}/api/languages?username=\${username}&theme=\${activeTheme})\`;

      const mdEl = document.getElementById('markdown-code');
      if (mdEl) mdEl.innerText = mdCode;
    }

    // Export Tab Switcher
    function switchExportTab(tabName, btn) {
      playClickSound();
      document.querySelectorAll('.tab-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.getElementById('export-picture').style.display = tabName === 'picture' ? 'block' : 'none';
      document.getElementById('export-markdown').style.display = tabName === 'markdown' ? 'block' : 'none';
      document.getElementById('export-action').style.display = tabName === 'action' ? 'block' : 'none';
    }

    // Filter Cards
    function filterCards(category, btn) {
      playClickSound();
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tilt-wrapper').forEach(wrapper => {
        const cat = wrapper.getAttribute('data-category');
        if (category === 'all' || cat === category) {
          wrapper.style.display = 'block';
        } else {
          wrapper.style.display = 'none';
        }
      });
    }

    // Theme selector
    function setTheme(themeKey, el) {
      activeTheme = themeKey;
      playClickSound();
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      if (el) el.classList.add('active');
      document.getElementById('activeThemeBadge').innerText = 'Active: ' + themeKey;
      updateAllCards();
    }

    // Username Preset
    function setUsername(user) {
      playClickSound();
      document.getElementById('username').value = user;
      updateAllCards();
    }

    // Auto-detect Timezone
    function detectUserTimezone() {
      playClickSound();
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) {
          document.getElementById('timezone').value = tz;
          updateAllCards();
        }
      } catch (e) {}
    }

    // Download SVG
    function downloadSvg(imgId, filename) {
      playClickSound();
      const img = document.getElementById(imgId);
      if (!img) return;
      fetch(img.src)
        .then(r => r.text())
        .then(svgText => {
          const blob = new Blob([svgText], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          triggerConfetti();
          playSuccessFanfare();
        });
    }

    // Export PNG @2x Retina via Canvas
    function exportPng(imgId, filename, width, height) {
      playClickSound();
      const img = document.getElementById(imgId);
      if (!img) return;

      fetch(img.src)
        .then(res => res.text())
        .then(svgText => {
          const canvas = document.getElementById('png-render-canvas');
          const ctx = canvas.getContext('2d');
          const scale = 2; // 2x Retina

          canvas.width = width * scale;
          canvas.height = height * scale;

          const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
          const URLObj = window.URL || window.webkitURL || window;
          const blobURL = URLObj.createObjectURL(svgBlob);

          const tempImg = new Image();
          tempImg.onload = function() {
            ctx.drawImage(tempImg, 0, 0, width * scale, height * scale);
            const pngURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = pngURL;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URLObj.revokeObjectURL(blobURL);
            triggerConfetti();
            playSuccessFanfare();
          };
          tempImg.src = blobURL;
        });
    }

    function copyCardUrl(imgId) {
      const img = document.getElementById(imgId);
      if (!img) return;
      const fullUrl = window.location.origin + img.getAttribute('src');
      navigator.clipboard.writeText(fullUrl).then(() => {
        triggerConfetti();
        playSuccessFanfare();
      });
    }

    function copyCardMarkdown(name, imgId) {
      const img = document.getElementById(imgId);
      if (!img) return;
      const fullUrl = window.location.origin + img.getAttribute('src');
      const md = \`![\${name}](\${fullUrl})\`;
      navigator.clipboard.writeText(md).then(() => {
        triggerConfetti();
        playSuccessFanfare();
      });
    }

    function copyCodeFromPre(preId, btn) {
      const el = document.getElementById(preId);
      if (!el) return;
      navigator.clipboard.writeText(el.innerText).then(() => {
        triggerConfetti();
        playSuccessFanfare();
        const orig = btn.innerHTML;
        btn.innerHTML = 'âœ… Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      });
    }

    function triggerConfetti() {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']
        });
      }
    }

    // Event Listeners for Live Form
    ['username', 'timezone', 'graceDays'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateAllCards);
    });

    // Boot
    window.addEventListener('DOMContentLoaded', () => {
      initThreeScene();
      init3DTilt();
      updateAllCards();
    });
  </script>
</body>
</html>`;
}
