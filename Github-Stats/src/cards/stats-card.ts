import { UserStatsData, CardOptions } from '../types.js';
import { getTheme } from '../themes/index.js';
import { formatNumber, escapeXml } from '../utils/format.js';

export function renderStatsCard(data: UserStatsData, options: CardOptions): string {
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
  const title = options.customTitle || `${data.name || data.login}'s GitHub Stats`;

  // Color for the rank badge
  let rankColor = theme.accentColor;
  if (data.rank.level.startsWith('S')) rankColor = '#f0883e'; // gold/orange
  else if (data.rank.level.startsWith('A')) rankColor = '#2ea44f'; // green
  else if (data.rank.level.startsWith('B')) rankColor = '#58a6ff'; // blue
  else rankColor = '#8b949e';

  // Stats items
  const items = [
    {
      label: 'Total Stars Earned',
      value: formatNumber(data.totalStars),
      icon: '<path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />'
    },
    {
      label: 'Total Commits',
      value: formatNumber(data.totalCommits),
      icon: '<path d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z" />'
    },
    {
      label: 'Total PRs',
      value: formatNumber(data.totalPRs),
      icon: '<path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1.25 9.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm-8.5 0a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />'
    },
    {
      label: 'Total Issues',
      value: formatNumber(data.totalIssues),
      icon: '<path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" />'
    },
    {
      label: 'Contributed to',
      value: formatNumber(data.contributedTo),
      icon: '<path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />'
    }
  ];

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: ${theme.background}; ${hideBorder ? '' : `stroke: ${theme.cardBorder}; stroke-width: 1px;`} rx: ${borderRadius}px; }
    .card-title { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.titleColor}; }
    .stat-label { font: 500 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.textColor}; }
    .stat-value { font: 700 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.textColor}; }
    .stat-icon { fill: ${theme.titleColor}; }
    .rank-circle-bg { stroke: ${theme.progressBarBg}; stroke-width: 6; fill: none; }
    .rank-circle { stroke: ${rankColor}; stroke-width: 6; stroke-linecap: round; fill: none; }
    .rank-text { font: 800 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${rankColor}; text-anchor: middle; dominant-baseline: central; }
    .rank-label { font: 600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtextColor}; text-anchor: middle; }
  </style>

  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" class="bg" />

  ${options.hideTitle ? '' : `
  <!-- Title -->
  <text x="30" y="36" class="card-title">${escapeXml(title)}</text>
  `}

  <!-- Left Stats Column -->
  <g transform="translate(30, 48)">
    ${items.map((item, index) => {
      const y = index * 24 + 14;
      return `
      <g transform="translate(0, ${y})">
        <svg x="0" y="-12" width="16" height="16" viewBox="0 0 16 16" class="stat-icon">
          ${item.icon}
        </svg>
        <text x="25" y="0" class="stat-label">${escapeXml(item.label)}:</text>
        <text x="210" y="0" class="stat-value">${escapeXml(item.value)}</text>
      </g>`;
    }).join('')}
  </g>

  <!-- Right Rank Badge -->
  ${options.hideRank ? '' : `
  <g transform="translate(390, 105)">
    <!-- Rank Ring -->
    <circle cx="0" cy="0" r="42" class="rank-circle-bg" />
    <circle cx="0" cy="0" r="42" class="rank-circle" stroke-dasharray="264" stroke-dashoffset="${264 * (data.rank.percentile / 100)}" transform="rotate(-90)" />

    <text x="0" y="-3" class="rank-text">${escapeXml(data.rank.level)}</text>
    <text x="0" y="24" class="rank-label">Top ${data.rank.percentile}%</text>
  </g>
  `}
</svg>`;
}
