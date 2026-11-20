import { UserStatsData, StreakData, LanguagesData, CardOptions } from '../types.js';
import { getTheme } from '../themes/index.js';
import { formatNumber, escapeXml } from '../utils/format.js';

export interface TrophyItem {
  icon: string;
  name: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND' | 'MYTHIC';
  tierColor: string;
  statValue: string;
}

export function renderTrophyCard(
  stats: UserStatsData,
  streak: StreakData,
  langs: LanguagesData,
  options: CardOptions
): string {
  const theme = getTheme(options.theme, {
    background: options.bgColor,
    cardBorder: options.borderColor,
    titleColor: options.titleColor,
    textColor: options.textColor,
    accentColor: options.accentColor,
    highlightColor: options.fireColor
  });

  const width = 495;
  const height = 195;
  const borderRadius = options.borderRadius ?? 10;
  const hideBorder = options.hideBorder ?? false;

  // Determine Trophies
  const trophies: TrophyItem[] = [];

  // 1. Streak Trophy
  const bestStreak = Math.max(streak.currentStreak, streak.longestStreak);
  if (bestStreak >= 60) {
    trophies.push({ icon: '\u{1F525}', name: 'Streak Titan', tier: 'DIAMOND', tierColor: '#06b6d4', statValue: `${bestStreak} Days` });
  } else if (bestStreak >= 25) {
    trophies.push({ icon: '\u{1F525}', name: 'Streak Titan', tier: 'GOLD', tierColor: '#f59e0b', statValue: `${bestStreak} Days` });
  } else if (bestStreak >= 10) {
    trophies.push({ icon: '\u{1F525}', name: 'Streak Titan', tier: 'SILVER', tierColor: '#94a3b8', statValue: `${bestStreak} Days` });
  } else {
    trophies.push({ icon: '\u{1F525}', name: 'Streak Spark', tier: 'BRONZE', tierColor: '#d97706', statValue: `${bestStreak} Days` });
  }

  // 2. Commit Machine
  if (stats.totalCommits >= 5000) {
    trophies.push({ icon: '\u{26A1}', name: 'Code Titan', tier: 'MYTHIC', tierColor: '#a855f7', statValue: `${formatNumber(stats.totalCommits)}` });
  } else if (stats.totalCommits >= 1000) {
    trophies.push({ icon: '\u{26A1}', name: 'Code Engine', tier: 'GOLD', tierColor: '#f59e0b', statValue: `${formatNumber(stats.totalCommits)}` });
  } else if (stats.totalCommits >= 300) {
    trophies.push({ icon: '\u{26A1}', name: 'Code Builder', tier: 'SILVER', tierColor: '#94a3b8', statValue: `${formatNumber(stats.totalCommits)}` });
  } else {
    trophies.push({ icon: '\u{26A1}', name: 'Code Initiate', tier: 'BRONZE', tierColor: '#d97706', statValue: `${formatNumber(stats.totalCommits)}` });
  }

  // 3. Stargazer
  if (stats.totalStars >= 100) {
    trophies.push({ icon: '\u{2B50}', name: 'Star Galaxy', tier: 'DIAMOND', tierColor: '#06b6d4', statValue: `${stats.totalStars} Stars` });
  } else if (stats.totalStars >= 20) {
    trophies.push({ icon: '\u{2B50}', name: 'Star Cluster', tier: 'GOLD', tierColor: '#f59e0b', statValue: `${stats.totalStars} Stars` });
  } else if (stats.totalStars >= 5) {
    trophies.push({ icon: '\u{2B50}', name: 'Star Collector', tier: 'SILVER', tierColor: '#94a3b8', statValue: `${stats.totalStars} Stars` });
  } else {
    trophies.push({ icon: '\u{2B50}', name: 'Star Sprout', tier: 'BRONZE', tierColor: '#d97706', statValue: `${stats.totalStars} Stars` });
  }

  // 4. Polyglot
  const langCount = langs.languages.length;
  if (langCount >= 7) {
    trophies.push({ icon: '\u{1F310}', name: 'Grand Polyglot', tier: 'DIAMOND', tierColor: '#10b981', statValue: `${langCount} Langs` });
  } else if (langCount >= 4) {
    trophies.push({ icon: '\u{1F4BB}', name: 'Multi-Stack', tier: 'GOLD', tierColor: '#f59e0b', statValue: `${langCount} Langs` });
  } else if (langCount >= 2) {
    trophies.push({ icon: '\u{1F4BB}', name: 'Dual Coder', tier: 'SILVER', tierColor: '#94a3b8', statValue: `${langCount} Langs` });
  } else {
    trophies.push({ icon: '\u{1F4BB}', name: 'Specialist', tier: 'BRONZE', tierColor: '#d97706', statValue: `${langCount} Lang` });
  }

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: ${theme.background}; ${hideBorder ? '' : `stroke: ${theme.cardBorder}; stroke-width: 1px;`} rx: ${borderRadius}px; }
    .card-title { font: 700 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.titleColor}; }
    .unlocked-pill { font: 700 10px 'JetBrains Mono', monospace; fill: #10b981; }
    .trophy-name { font: 700 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.textColor}; text-anchor: middle; }
    .trophy-tier { font: 800 9px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-anchor: middle; letter-spacing: 0.5px; }
    .trophy-stat { font: 600 10px 'JetBrains Mono', monospace; fill: ${theme.subtextColor}; text-anchor: middle; }
    
    @keyframes trophyGlow {
      0%, 100% { filter: drop-shadow(0 0 2px rgba(255,255,255,0.1)); }
      50% { filter: drop-shadow(0 0 6px rgba(255,255,255,0.3)); }
    }
    .trophy-item { animation: trophyGlow 3s infinite ease-in-out; }
  </style>

  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" class="bg" />

  <!-- Top Title Bar -->
  <g transform="translate(25, 20)">
    <text x="0" y="14" class="card-title">\u{1F3C6} Developer Achievements &amp; Trophies</text>
    <rect x="330" y="2" width="115" height="18" rx="9" fill="#10b98118" stroke="#10b98144" stroke-width="1" />
    <text x="387" y="14" text-anchor="middle" class="unlocked-pill">UNLOCKED: 4/4</text>
  </g>

  <!-- 4 Trophies Column Grid -->
  <g transform="translate(18, 54)">
    ${trophies
      .map((t, idx) => {
        const xOffset = idx * 114;
        return `
    <!-- Trophy ${idx + 1} -->
    <g transform="translate(${xOffset}, 0)" class="trophy-item">
      <!-- Outer Card Frame -->
      <rect x="0" y="0" width="104" height="120" rx="10" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.06)" stroke-width="1" />
      
      <!-- Medal Embellishment Circle -->
      <circle cx="52" cy="36" r="22" fill="${t.tierColor}18" stroke="${t.tierColor}" stroke-width="1.5" />
      <text x="52" y="44" text-anchor="middle" font-size="20">${t.icon}</text>

      <!-- Trophy Title -->
      <text x="52" y="74" class="trophy-name">${escapeXml(t.name)}</text>

      <!-- Tier Badge -->
      <rect x="22" y="82" width="60" height="15" rx="4" fill="${t.tierColor}25" stroke="${t.tierColor}" stroke-width="0.75" />
      <text x="52" y="93" fill="${t.tierColor}" class="trophy-tier">${t.tier}</text>

      <!-- Stat Value -->
      <text x="52" y="110" class="trophy-stat">${escapeXml(t.statValue)}</text>
    </g>`;
      })
      .join('\n')}
  </g>
</svg>`;
}
