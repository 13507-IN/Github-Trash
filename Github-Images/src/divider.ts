export interface DividerOptions {
  type?: 'wave' | 'neon-line' | 'cyber';
  colorA?: string;
  colorB?: string;
  height?: number;
}

export function renderDividerSvg(options: DividerOptions = {}): string {
  const type = options.type || 'wave';
  const colorA = options.colorA || '#6366f1';
  const colorB = options.colorB || '#06b6d4';
  const width = 800;
  const height = options.height || (type === 'wave' ? 90 : 20);

  if (type === 'neon-line') {
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${colorA}" stop-opacity="0" />
      <stop offset="20%" stop-color="${colorA}" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="80%" stop-color="${colorB}" />
      <stop offset="100%" stop-color="${colorB}" stop-opacity="0" />
    </linearGradient>
  </defs>
  <line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="url(#neonGrad)" stroke-width="2" />
  <circle cx="${width / 2}" cy="${height / 2}" r="4" fill="${colorB}" />
</svg>`;
  }

  // Animated Wave Divider
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colorA}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${colorB}" stop-opacity="0.3" />
    </linearGradient>
  </defs>
  <path d="M0,30 C150,80 350,-20 500,40 C650,100 750,20 800,50 L800,${height} L0,${height} Z" fill="url(#waveGrad)">
    <animate attributeName="d" 
      values="M0,30 C150,80 350,-20 500,40 C650,100 750,20 800,50 L800,${height} L0,${height} Z;
              M0,50 C200,10 300,70 500,20 C700,-10 720,60 800,30 L800,${height} L0,${height} Z;
              M0,30 C150,80 350,-20 500,40 C650,100 750,20 800,50 L800,${height} L0,${height} Z"
      dur="10s" repeatCount="indefinite" />
  </path>
</svg>`;
}
