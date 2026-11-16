import { escapeXml } from '../utils/format.js';

export function renderErrorCard(message: string, secondary: string = 'Please check your configuration or username'): string {
  const safeMsg = escapeXml(message);
  const safeSec = escapeXml(secondary);

  return `<svg width="495" height="150" viewBox="0 0 495 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #0d1117; stroke: #f85149; stroke-width: 1.5; rx: 8px; }
    .icon { fill: #f85149; }
    .title { font: 600 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: #f85149; }
    .text { font: 400 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: #8b949e; }
  </style>
  <rect x="0.5" y="0.5" width="494" height="149" class="bg" />
  <g transform="translate(25, 35)">
    <circle cx="16" cy="16" r="16" fill="#f85149" fill-opacity="0.15" />
    <path class="icon" d="M16 8a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-3 0v-6A1.5 1.5 0 0 1 16 8zm0 12a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
    <text x="45" y="16" class="title">${safeMsg}</text>
    <text x="45" y="42" class="text">${safeSec}</text>
    <text x="45" y="65" class="text">GitHub Stats • Reliable Card Engine</text>
  </g>
</svg>`;
}
