import { WorthData, CardOptions } from '../types.js';
import { getTheme } from '../themes/index.js';
import { formatNumber, escapeXml } from '../utils/format.js';

export function renderWorthCard(data: WorthData, options: CardOptions): string {
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

  const formattedWorth = `${data.currency}${formatNumber(data.totalWorth)}`;
  const hoursFormatted = formatNumber(data.engineeringHours);

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: ${theme.background}; ${hideBorder ? '' : `stroke: ${theme.cardBorder}; stroke-width: 1px;`} rx: ${borderRadius}px; }
    .card-title { font: 700 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.titleColor}; }
    .worth-val { font: 800 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: #2ea44f; }
    .tier-badge { font: 700 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: #58a6ff; }
    .breakdown-label { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtextColor}; }
    .breakdown-val { font: 700 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.textColor}; text-anchor: end; }
    .stamp-box { stroke: #2ea44f; stroke-width: 1; fill: #2ea44f15; rx: 4px; }
    .stamp-text { font: 800 9px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: #2ea44f; text-anchor: middle; letter-spacing: 0.5px; }
    .disclaimer { font: 400 9px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtextColor}; opacity: 0.8; }
    @keyframes glowGreen {
      0% { filter: drop-shadow(0 0 2px #2ea44f44); }
      50% { filter: drop-shadow(0 0 8px #2ea44faa); }
      100% { filter: drop-shadow(0 0 2px #2ea44f44); }
    }
    .glowing-worth { animation: glowGreen 3s infinite ease-in-out; }
  </style>

  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" class="bg" />

  <!-- Top Title -->
  <g transform="translate(25, 20)">
    <text x="0" y="14" class="card-title">GitHub Account Valuation</text>
    <rect x="340" y="2" width="105" height="18" class="stamp-box" />
    <text x="392" y="14" class="stamp-text">VERIFIED ASSET</text>
  </g>

  <!-- Left: Big Worth Value & Tier -->
  <g transform="translate(25, 62)">
    <text x="0" y="28" class="worth-val glowing-worth">${escapeXml(formattedWorth)}</text>
    <text x="0" y="48" class="tier-badge">${escapeXml(data.tier)}</text>
    <text x="0" y="65" class="breakdown-label">Estimated engineering market replacement value</text>
  </g>

  <!-- Right: Breakdown Box -->
  <g transform="translate(265, 52)">
    <!-- Background Pill -->
    <rect x="0" y="0" width="205" height="78" rx="6" fill="${theme.progressBarBg}" stroke="${theme.cardBorder}" stroke-width="0.5" />

    <g transform="translate(12, 18)">
      <text x="0" y="0" class="breakdown-label">Engineering Hours:</text>
      <text x="180" y="0" class="breakdown-val">~${hoursFormatted} hrs</text>
    </g>

    <g transform="translate(12, 36)">
      <text x="0" y="0" class="breakdown-label">Base Dev Equity:</text>
      <text x="180" y="0" class="breakdown-val">${data.currency}${formatNumber(data.breakdown.commitsValue + data.breakdown.reposValue)}</text>
    </g>

    <g transform="translate(12, 54)">
      <text x="0" y="0" class="breakdown-label">Consistency Multiplier:</text>
      <text x="180" y="0" class="breakdown-val" fill="#388bfd">${data.breakdown.multiplier}x (Streak Bonus)</text>
    </g>
  </g>

  <!-- Bottom Divider & Disclaimer -->
  <line x1="25" y1="150" x2="470" y2="150" stroke="${theme.cardBorder}" stroke-width="1" opacity="0.6" />
  <g transform="translate(25, 168)">
    <text x="0" y="0" class="disclaimer">Calculated using commit cadence, repository architecture, star equity &amp; streak endurance.</text>
  </g>
</svg>`;
}
