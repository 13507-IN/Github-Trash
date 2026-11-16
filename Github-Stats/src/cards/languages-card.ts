import { LanguagesData, CardOptions } from '../types.js';
import { getTheme } from '../themes/index.js';
import { escapeXml } from '../utils/format.js';

export function renderLanguagesCard(data: LanguagesData, options: CardOptions): string {
  const theme = getTheme(options.theme, {
    background: options.bgColor,
    cardBorder: options.borderColor,
    titleColor: options.titleColor,
    textColor: options.textColor,
    accentColor: options.accentColor
  });

  const width = 495;
  const height = 195;
  const borderRadius = options.borderRadius ?? 10;
  const hideBorder = options.hideBorder ?? false;
  const title = options.customTitle || 'Most Used Languages';

  const languages = data.languages;
  const barWidth = 435;
  const barHeight = 8;
  const barRadius = 4;

  // Build segmented progress bar
  let currentX = 0;
  const barSegments = languages.map((lang, idx) => {
    const segWidth = (lang.percentage / 100) * barWidth;
    const x = currentX;
    currentX += segWidth;

    return `<rect x="${x}" y="0" width="${Math.max(1, segWidth)}" height="${barHeight}" fill="${lang.color}" />`;
  });

  // Split languages into two columns (up to 3 items per column = 6 total)
  const col1 = languages.slice(0, 3);
  const col2 = languages.slice(3, 6);

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: ${theme.background}; ${hideBorder ? '' : `stroke: ${theme.cardBorder}; stroke-width: 1px;`} rx: ${borderRadius}px; }
    .card-title { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.titleColor}; }
    .lang-name { font: 500 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.textColor}; }
    .lang-pct { font: 400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtextColor}; }
    .no-data { font: 500 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtextColor}; text-anchor: middle; }
  </style>

  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" class="bg" />

  ${options.hideTitle ? '' : `
  <text x="30" y="36" class="card-title">${escapeXml(title)}</text>
  `}

  ${languages.length === 0 ? `
  <text x="${width / 2}" y="105" class="no-data">No language data found in public repositories</text>
  ` : `
  <!-- Progress Bar Container -->
  <g transform="translate(30, 52)">
    <mask id="bar-mask">
      <rect x="0" y="0" width="${barWidth}" height="${barHeight}" rx="${barRadius}" fill="#fff" />
    </mask>
    <rect x="0" y="0" width="${barWidth}" height="${barHeight}" rx="${barRadius}" fill="${theme.progressBarBg}" />
    <g mask="url(#bar-mask)">
      ${barSegments.join('')}
    </g>
  </g>

  <!-- Languages Legend Grid -->
  <g transform="translate(30, 85)">
    <!-- Column 1 -->
    <g transform="translate(0, 0)">
      ${col1.map((lang, idx) => {
        const y = idx * 26;
        return `
        <g transform="translate(0, ${y})">
          <circle cx="5" cy="5" r="5" fill="${lang.color}" />
          <text x="20" y="9" class="lang-name">${escapeXml(lang.name)}</text>
          <text x="145" y="9" class="lang-pct">${lang.percentage}%</text>
        </g>`;
      }).join('')}
    </g>

    <!-- Column 2 -->
    <g transform="translate(225, 0)">
      ${col2.map((lang, idx) => {
        const y = idx * 26;
        return `
        <g transform="translate(0, ${y})">
          <circle cx="5" cy="5" r="5" fill="${lang.color}" />
          <text x="20" y="9" class="lang-name">${escapeXml(lang.name)}</text>
          <text x="145" y="9" class="lang-pct">${lang.percentage}%</text>
        </g>`;
      }).join('')}
    </g>
  </g>
  `}
</svg>`;
}
