import { RPGData, CardOptions } from '../types.js';
import { getTheme } from '../themes/index.js';
import { escapeXml } from '../utils/format.js';

export function renderRPGCard(data: RPGData, options: CardOptions): string {
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

  const stats = [
    { label: 'STR', val: data.stats.str, color: '#f85149' },
    { label: 'INT', val: data.stats.int, color: '#58a6ff' },
    { label: 'DEX', val: data.stats.dex, color: '#e3b341' },
    { label: 'CHA', val: data.stats.cha, color: '#bc8cff' },
    { label: 'STA', val: data.stats.sta, color: '#39d353' }
  ];

  const maxBarWidth = 42;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: ${theme.background}; ${hideBorder ? '' : `stroke: ${theme.cardBorder}; stroke-width: 1px;`} rx: ${borderRadius}px; }
    .class-title { font: 800 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.titleColor}; }
    .sub-title { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtextColor}; }
    .lvl-badge { fill: ${theme.titleColor}; font: 800 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .xp-text { font: 500 10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtextColor}; text-anchor: end; }
    .stat-label { font: 700 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.textColor}; }
    .stat-val { font: 700 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.textColor}; text-anchor: end; }
    .perk-text { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtextColor}; }
    .weapon-text { font: 600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.textColor}; }
    @keyframes glow {
      0% { filter: drop-shadow(0 0 2px ${theme.titleColor}44); }
      50% { filter: drop-shadow(0 0 6px ${theme.titleColor}aa); }
      100% { filter: drop-shadow(0 0 2px ${theme.titleColor}44); }
    }
    .glowing-badge { animation: glow 3s infinite ease-in-out; }
  </style>

  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" class="bg" />

  <!-- Header: Class & Level -->
  <g transform="translate(25, 20)">
    <!-- Level Badge -->
    <rect x="0" y="0" width="58" height="22" rx="4" fill="${theme.titleColor}22" stroke="${theme.titleColor}" stroke-width="1" class="glowing-badge" />
    <text x="29" y="15" text-anchor="middle" class="lvl-badge">LVL ${data.level}</text>

    <!-- Class Name & Subtitle -->
    <text x="70" y="16" class="class-title">${escapeXml(data.characterClass)}</text>
    <text x="70" y="32" class="sub-title">${escapeXml(data.title)}</text>

    <!-- XP Bar -->
    <g transform="translate(0, 42)">
      <rect x="0" y="0" width="445" height="5" rx="2.5" fill="${theme.progressBarBg}" />
      <rect x="0" y="0" width="${Math.max(4, 445 * (data.xp.percentage / 100))}" height="5" rx="2.5" fill="${theme.titleColor}" />
      <text x="445" y="-5" class="xp-text">XP ${data.xp.percentage}%</text>
    </g>
  </g>

  <!-- Middle: RPG Attribute Stats Row -->
  <g transform="translate(25, 90)">
    ${stats.map((s, idx) => {
      const x = idx * 90;
      const barFill = Math.min(maxBarWidth, (s.val / 99) * maxBarWidth);
      return `
      <g transform="translate(${x}, 0)">
        <text x="0" y="0" class="stat-label" fill="${s.color}">${s.label}</text>
        <text x="80" y="0" class="stat-val">${s.val}</text>
        <!-- Mini Bar -->
        <rect x="0" y="7" width="80" height="4" rx="2" fill="${theme.progressBarBg}" />
        <rect x="0" y="7" width="${(s.val / 99) * 80}" height="4" rx="2" fill="${s.color}" />
      </g>`;
    }).join('')}
  </g>

  <!-- Divider -->
  <line x1="25" y1="128" x2="470" y2="128" stroke="${theme.cardBorder}" stroke-width="1" opacity="0.6" />

  <!-- Bottom: Equipped Weapon & Passive Perk -->
  <g transform="translate(25, 148)">
    <g transform="translate(0, 0)">
      <text x="0" y="0" class="sub-title">EQUIPPED WEAPON:</text>
      <text x="120" y="0" class="weapon-text">⚔️ ${escapeXml(data.weapon)}</text>
    </g>
    <g transform="translate(0, 22)">
      <text x="0" y="0" class="sub-title">ACTIVE PERK:</text>
      <text x="120" y="0" class="perk-text">${escapeXml(data.passivePerk)}</text>
    </g>
  </g>
</svg>`;
}
