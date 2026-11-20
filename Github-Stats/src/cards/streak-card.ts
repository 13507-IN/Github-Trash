import { StreakData, CardOptions } from '../types.js';
import { getTheme } from '../themes/index.js';
import { formatNumber, formatDate, escapeXml } from '../utils/format.js';

export function renderStreakCard(data: StreakData, options: CardOptions): string {
  const theme = getTheme(options.theme, {
    background: options.bgColor,
    cardBorder: options.borderColor,
    titleColor: options.titleColor,
    textColor: options.textColor,
    accentColor: options.accentColor,
    streakFireColor: options.fireColor,
    ringColor: options.ringColor
  });

  const width = 495;
  const height = 195;
  const borderRadius = options.borderRadius ?? 10;
  const hideBorder = options.hideBorder ?? false;

  const totalContribStr = formatNumber(data.totalContributions);
  const currentStreakStr = formatNumber(data.currentStreak);
  const longestStreakStr = formatNumber(data.longestStreak);

  // Date ranges
  const firstDateFormatted = data.firstContributionDate ? formatDate(data.firstContributionDate) : '';
  const totalRangeStr = firstDateFormatted ? `${firstDateFormatted} - Present` : 'All Time';

  let currentRangeStr = '';
  if (data.currentStreak > 0) {
    const startStr = formatDate(data.currentStreakStart, false);
    const endStr = formatDate(data.currentStreakEnd, false);
    currentRangeStr = startStr === endStr ? startStr : `${startStr} - ${endStr}`;
    if (!data.isStreakActiveToday) {
      currentRangeStr += ' (Pending today)';
    }
  } else {
    currentRangeStr = 'Inactive';
  }

  let longestRangeStr = '';
  if (data.longestStreak > 0) {
    const startStr = formatDate(data.longestStreakStart, false);
    const endStr = formatDate(data.longestStreakEnd, false);
    longestRangeStr = startStr === endStr ? startStr : `${startStr} - ${endStr}`;
  } else {
    longestRangeStr = 'None';
  }

  // Ring stroke calculation
  // Circle radius 36 -> circumference = 2 * PI * 36 ~= 226.2
  const circumference = 226.2;
  const ringProgress = data.longestStreak > 0
    ? Math.min(1, data.currentStreak / data.longestStreak)
    : (data.currentStreak > 0 ? 1 : 0);
  const strokeDashoffset = circumference * (1 - ringProgress);

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: ${theme.background}; ${hideBorder ? '' : `stroke: ${theme.cardBorder}; stroke-width: 1px;`} rx: ${borderRadius}px; }
    .num-large { font: 700 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.textColor}; text-anchor: middle; }
    .num-current { font: 700 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.textColor}; text-anchor: middle; dominant-baseline: central; }
    .label { font: 600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.titleColor}; text-anchor: middle; }
    .label-current { font: 600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.ringColor}; text-anchor: middle; }
    .subtext { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtextColor}; text-anchor: middle; }
    .divider { stroke: ${theme.cardBorder}; stroke-width: 1px; opacity: 0.7; }
    .ring-bg { stroke: ${theme.progressBarBg}; stroke-width: 4.5px; fill: none; }
    .ring-progress { stroke: ${theme.ringColor}; stroke-width: 4.5px; stroke-linecap: round; fill: none; transform: rotate(-90deg); transform-origin: 0px 74px; transition: stroke-dashoffset 0.8s ease; }
    .flame { fill: ${theme.streakFireColor}; filter: drop-shadow(0px 0px 4px ${theme.streakFireColor}88); }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
    .flame-anim { animation: pulse 2.5s infinite ease-in-out; transform-origin: 0px 26px; }
  </style>

  <!-- Background Card -->
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" class="bg" />

  <!-- Left Column: Total Contributions -->
  <g transform="translate(100, 0)">
    <text x="0" y="74" class="num-large">${escapeXml(totalContribStr)}</text>
    <text x="0" y="106" class="label">Total Contributions</text>
    <text x="0" y="128" class="subtext">${escapeXml(totalRangeStr)}</text>
  </g>

  <!-- Vertical Divider 1 -->
  <line x1="185" y1="35" x2="185" y2="155" class="divider" />

  <!-- Center Column: Current Streak with Flame & Circular Ring -->
  <g transform="translate(247, 0)">
    <!-- Flame Icon -->
    <g class="flame-anim">
      <path class="flame" transform="translate(-9, 16) scale(0.9)" d="M9.8 1.4c-.4.7-.6 1.6-.5 2.5.3 1.2 1.1 2.2 1.4 3.4.4 1.5.1 3.2-.8 4.4-.9 1.2-2.3 1.9-3.7 2-1.7.1-3.4-.8-4.3-2.2-.6-1-.8-2.3-.5-3.5.1-.4.3-.8.6-1.1.2-.2.6-.1.6.2 0 1 .3 2 1 2.7.5.5 1.3.8 2 .6.5-.1.9-.4 1.1-.9.3-.7.2-1.5-.1-2.2-.3-.8-.8-1.5-1.2-2.3-.6-1.2-.8-2.6-.5-3.9.1-.3.4-.6.7-.4.6.4 1.2 1 1.7 1.6 1.1 1.3 1.7 3 1.6 4.7 0 .3.4.5.6.3.8-.9 1.2-2.1 1.2-3.3 0-.7-.2-1.5-.6-2.1-.2-.3.1-.7.4-.5.4.3.7.6 1 1z" />
    </g>

    <!-- Ring Background -->
    <circle cx="0" cy="74" r="36" class="ring-bg" />
    <!-- Ring Progress -->
    <circle cx="0" cy="74" r="36" class="ring-progress" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" />

    <!-- Current Streak Number Inside Ring -->
    <text x="0" y="75" class="num-current">${escapeXml(currentStreakStr)}</text>

    <!-- Label & Range -->
    <text x="0" y="130" class="label-current">Current Streak</text>
    <text x="0" y="152" class="subtext">${escapeXml(currentRangeStr)}</text>
  </g>

  <!-- Vertical Divider 2 -->
  <line x1="310" y1="35" x2="310" y2="155" class="divider" />

  <!-- Right Column: Longest Streak -->
  <g transform="translate(395, 0)">
    <text x="0" y="74" class="num-large">${escapeXml(longestStreakStr)}</text>
    <text x="0" y="106" class="label">Longest Streak</text>
    <text x="0" y="128" class="subtext">${escapeXml(longestRangeStr)}</text>
  </g>
</svg>`;
}
