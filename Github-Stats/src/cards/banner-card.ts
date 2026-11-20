import { UserStatsData, StreakData, LanguagesData, RPGData, WorthData, CardOptions } from '../types.js';
import { getTheme } from '../themes/index.js';
import { formatNumber, escapeXml } from '../utils/format.js';

export interface BannerData {
  stats: UserStatsData;
  streak: StreakData;
  languages: LanguagesData;
  rpg: RPGData;
  worth: WorthData;
}

export function renderBannerCard(data: BannerData, options: CardOptions): string {
  const theme = getTheme(options.theme, {
    background: options.bgColor,
    cardBorder: options.borderColor,
    titleColor: options.titleColor,
    textColor: options.textColor,
    accentColor: options.accentColor,
    highlightColor: options.fireColor
  });

  const width = 800;
  const height = 220;
  const borderRadius = options.borderRadius ?? 16;
  const hideBorder = options.hideBorder ?? false;

  const displayName = data.stats.name || data.stats.login;
  const topLang = data.languages.languages[0]?.name || 'TypeScript';

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dynamic Glowing Border Gradient -->
    <linearGradient id="bannerBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.titleColor}">
        <animate attributeName="stop-color" values="${theme.titleColor};#10b981;#06b6d4;${theme.titleColor}" dur="8s" repeatCount="indefinite" />
      </stop>
      <stop offset="50%" stop-color="${theme.accentColor}">
        <animate attributeName="stop-color" values="${theme.accentColor};#6366f1;#ec4899;${theme.accentColor}" dur="8s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="${theme.streakFireColor}">
        <animate attributeName="stop-color" values="${theme.streakFireColor};#8b5cf6;#3b82f6;${theme.streakFireColor}" dur="8s" repeatCount="indefinite" />
      </stop>
    </linearGradient>

    <!-- Background Radial Aura -->
    <radialGradient id="bannerAura" cx="80%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${theme.titleColor}" stop-opacity="0.16" />
      <stop offset="100%" stop-color="${theme.background}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="bannerAuraLeft" cx="15%" cy="85%" r="55%">
      <stop offset="0%" stop-color="${theme.accentColor}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="${theme.background}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <style>
    .bg { fill: ${theme.background}; }
    .border-glow { stroke: url(#bannerBorderGrad); stroke-width: ${hideBorder ? '0' : '2'}; }
    .title-text { font: 800 24px 'Plus Jakarta Sans', -apple-system, sans-serif; fill: #ffffff; letter-spacing: -0.5px; }
    .role-badge { font: 700 12px 'Plus Jakarta Sans', -apple-system, sans-serif; fill: ${theme.titleColor}; }
    .terminal-code { font: 600 12px 'JetBrains Mono', monospace; fill: ${theme.subtextColor}; }
    .terminal-prompt { font: 700 12px 'JetBrains Mono', monospace; fill: #10b981; }
    .terminal-title { font: 500 11px 'JetBrains Mono', monospace; fill: ${theme.subtextColor}; opacity: 0.8; }
    .stat-chip-title { font: 500 10px 'Plus Jakarta Sans', -apple-system, sans-serif; fill: ${theme.subtextColor}; }
    .stat-chip-val { font: 800 15px 'Plus Jakarta Sans', -apple-system, sans-serif; fill: #ffffff; }
    .status-text { font: 700 10px 'Plus Jakarta Sans', -apple-system, sans-serif; fill: #10b981; letter-spacing: 0.5px; }
    
    @keyframes pulseAura {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
    .pulsing { animation: pulseAura 4s infinite ease-in-out; }
  </style>

  <!-- Background Base with Rounded Corners -->
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" class="bg" />
  <!-- Ambient Glow Orbs -->
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="url(#bannerAura)" class="pulsing" />
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="url(#bannerAuraLeft)" />
  <!-- Animated Border -->
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" class="border-glow" fill="none" />

  <!-- Top macOS Window Header Bar -->
  <g transform="translate(24, 18)">
    <circle cx="0" cy="0" r="5" fill="#ff5f56" />
    <circle cx="16" cy="0" r="5" fill="#ffbd2e" />
    <circle cx="32" cy="0" r="5" fill="#27c93f" />
    <text x="376" y="4" text-anchor="middle" class="terminal-title">github.com/${escapeXml(data.stats.login)} \u{2022} developer.console</text>
  </g>

  <!-- Active Status Pill (Right) -->
  <g transform="translate(640, 10)">
    <rect x="0" y="0" width="136" height="22" rx="11" fill="#10b98115" stroke="#10b98144" stroke-width="1" />
    <circle cx="14" cy="11" r="3.5" fill="#10b981" />
    <text x="24" y="15" class="status-text">BUILDING IN PUBLIC</text>
  </g>

  <!-- Divider Line -->
  <line x1="20" y1="36" x2="${width - 20}" y2="36" stroke="rgba(255,255,255,0.08)" stroke-width="1" />

  <!-- Main Left Content -->
  <g transform="translate(32, 60)">
    <!-- RPG Class Pill -->
    <rect x="0" y="0" width="auto" height="20" rx="4" fill="${theme.titleColor}1a" />
    <text x="0" y="13" class="role-badge">\u{2694}\u{FE0F} LVL ${data.rpg.level} \u{2022} ${escapeXml(data.rpg.characterClass)}</text>

    <!-- Main Heading -->
    <text x="0" y="46" class="title-text">Hi, I'm ${escapeXml(displayName)} \u{1F44B}</text>

    <!-- Terminal Command Line -->
    <g transform="translate(0, 68)">
      <rect x="0" y="0" width="460" height="34" rx="8" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      <text x="14" y="21" class="terminal-prompt">&gt;_</text>
      <text x="36" y="21" class="terminal-code">git commit -m "empower open-source" &amp;&amp; deploy</text>
      <rect x="382" y="11" width="7" height="13" fill="${theme.titleColor}">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>
    </g>

    <!-- Quick Micro Badges -->
    <g transform="translate(0, 114)">
      <text x="0" y="14" font-family="'JetBrains Mono', monospace" font-size="11" fill="${theme.subtextColor}">
        Top Skill: <tspan font-weight="700" fill="${theme.titleColor}">${escapeXml(topLang)}</tspan> \u{2022} Tier: <tspan font-weight="700" fill="#10b981">${escapeXml(data.worth.tier)}</tspan>
      </text>
    </g>
  </g>

  <!-- Right Side KPI Glass Cards -->
  <g transform="translate(520, 56)">
    <!-- Chip 1: Streak -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="248" height="42" rx="10" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
      <text x="14" y="26" font-size="16">\u{1F525}</text>
      <text x="42" y="18" class="stat-chip-title">CURRENT STREAK</text>
      <text x="42" y="34" class="stat-chip-val">${data.streak.currentStreak} Days</text>
      <text x="236" y="26" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="10" fill="${theme.subtextColor}">Max: ${data.streak.longestStreak}d</text>
    </g>

    <!-- Chip 2: Total Commits -->
    <g transform="translate(0, 50)">
      <rect x="0" y="0" width="248" height="42" rx="10" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
      <text x="14" y="26" font-size="16">\u{26A1}</text>
      <text x="42" y="18" class="stat-chip-title">TOTAL COMMITS</text>
      <text x="42" y="34" class="stat-chip-val">${formatNumber(data.stats.totalCommits)}</text>
      <text x="236" y="26" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="10" fill="#10b981">Rank: ${data.stats.rank.level}</text>
    </g>

    <!-- Chip 3: Dev Equity Worth -->
    <g transform="translate(0, 100)">
      <rect x="0" y="0" width="248" height="42" rx="10" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
      <text x="14" y="26" font-size="16">\u{1F48E}</text>
      <text x="42" y="18" class="stat-chip-title">ESTIMATED ASSET EQUITY</text>
      <text x="42" y="34" class="stat-chip-val" fill="#10b981">${data.worth.currency}${formatNumber(data.worth.totalWorth)}</text>
      <text x="236" y="26" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="10" fill="${theme.titleColor}">${data.stats.totalStars} \u{2B50}</text>
    </g>
  </g>
</svg>`;
}
