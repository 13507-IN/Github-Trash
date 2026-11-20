export interface TechSkill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Languages';
  color: string;
  textColor?: string;
  icon: string;
}

export const TECH_LIBRARY: Record<string, TechSkill> = {
  typescript: { name: 'TypeScript', category: 'Languages', color: '#3178c6', icon: 'TS' },
  javascript: { name: 'JavaScript', category: 'Languages', color: '#f7df1e', textColor: '#000', icon: 'JS' },
  python: { name: 'Python', category: 'Languages', color: '#3776ab', icon: 'PY' },
  go: { name: 'Go', category: 'Languages', color: '#00add8', icon: 'GO' },
  rust: { name: 'Rust', category: 'Languages', color: '#dea584', icon: 'RS' },
  cpp: { name: 'C++', category: 'Languages', color: '#00599c', icon: 'C++' },
  react: { name: 'React', category: 'Frontend', color: '#61dafb', textColor: '#000', icon: 'RCT' },
  nextjs: { name: 'Next.js', category: 'Frontend', color: '#ffffff', textColor: '#000', icon: 'N' },
  vue: { name: 'Vue.js', category: 'Frontend', color: '#4fc08d', icon: 'V' },
  tailwind: { name: 'TailwindCSS', category: 'Frontend', color: '#06b6d4', icon: 'TW' },
  html5: { name: 'HTML5', category: 'Frontend', color: '#e34f26', icon: 'H5' },
  css3: { name: 'CSS3', category: 'Frontend', color: '#1572b6', icon: 'CSS' },
  nodejs: { name: 'Node.js', category: 'Backend', color: '#339933', icon: 'NODE' },
  express: { name: 'Express', category: 'Backend', color: '#ffffff', textColor: '#000', icon: 'EX' },
  fastapi: { name: 'FastAPI', category: 'Backend', color: '#059669', icon: 'FA' },
  graphql: { name: 'GraphQL', category: 'Backend', color: '#e10098', icon: 'GQL' },
  postgres: { name: 'PostgreSQL', category: 'Database', color: '#4169e1', icon: 'PG' },
  mongodb: { name: 'MongoDB', category: 'Database', color: '#47a248', icon: 'MDB' },
  redis: { name: 'Redis', category: 'Database', color: '#dc382d', icon: 'RDS' },
  supabase: { name: 'Supabase', category: 'Database', color: '#3ecf8e', icon: 'SB' },
  docker: { name: 'Docker', category: 'DevOps', color: '#2496ed', icon: 'DK' },
  kubernetes: { name: 'Kubernetes', category: 'DevOps', color: '#326ce5', icon: 'K8S' },
  aws: { name: 'AWS', category: 'DevOps', color: '#ff9900', textColor: '#000', icon: 'AWS' },
  git: { name: 'Git', category: 'DevOps', color: '#f05032', icon: 'GIT' },
  linux: { name: 'Linux', category: 'DevOps', color: '#fcc624', textColor: '#000', icon: 'TUX' }
};

export interface StackGridOptions {
  title?: string;
  theme?: 'dark' | 'light';
  columns?: number;
  borderRadius?: number;
}

export function renderStackGridSvg(techKeys: string[], options: StackGridOptions = {}): string {
  const isDark = options.theme !== 'light';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const borderColor = isDark ? '#30363d' : '#e1e4e8';
  const titleColor = isDark ? '#58a6ff' : '#0366d6';
  const textColor = isDark ? '#c9d1d9' : '#24292e';
  const borderRadius = options.borderRadius ?? 12;
  const title = options.title || 'Tech Stack & Ecosystem';

  const skills: TechSkill[] = [];
  for (const k of techKeys) {
    const key = k.trim().toLowerCase();
    if (TECH_LIBRARY[key]) {
      skills.push(TECH_LIBRARY[key]);
    } else {
      // Custom fallback
      skills.push({
        name: k.trim(),
        category: 'Languages',
        color: '#6366f1',
        icon: 'DEV'
      });
    }
  }

  // Layout calculation
  const cardWidth = 495;
  const pillHeight = 32;
  const pillGap = 10;
  const startX = 25;
  let curX = startX;
  let curY = 56;
  const maxY = 185;

  const pillElements: string[] = [];

  for (const s of skills) {
    const textLen = s.name.length;
    const pWidth = Math.max(90, textLen * 9 + 48);

    if (curX + pWidth > cardWidth - 25) {
      curX = startX;
      curY += pillHeight + pillGap;
    }

    const pillBg = `${s.color}18`;
    const pillBorder = `${s.color}66`;
    const pillText = s.textColor ? s.textColor : textColor;

    pillElements.push(`
    <g transform="translate(${curX}, ${curY})">
      <rect x="0" y="0" width="${pWidth}" height="${pillHeight}" rx="8" fill="${pillBg}" stroke="${pillBorder}" stroke-width="1" />
      <rect x="6" y="6" width="20" height="20" rx="5" fill="${s.color}" />
      <text x="16" y="20" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="800" fill="${s.textColor || '#ffffff'}">${s.icon}</text>
      <text x="34" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="${pillText}">${s.name}</text>
    </g>`);

    curX += pWidth + pillGap;
  }

  const finalHeight = Math.max(160, curY + pillHeight + 24);

  return `<svg width="${cardWidth}" height="${finalHeight}" viewBox="0 0 ${cardWidth} ${finalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: ${bgColor}; stroke: ${borderColor}; stroke-width: 1px; rx: ${borderRadius}px; }
    .title { font: 700 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${titleColor}; }
    .badge { font: 700 10px 'JetBrains Mono', monospace; fill: #10b981; }
  </style>

  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${finalHeight - 1}" class="bg" />

  <!-- Title Bar -->
  <g transform="translate(25, 20)">
    <text x="0" y="14" class="title">\u{2699}\u{FE0F} ${title}</text>
    <rect x="340" y="2" width="105" height="18" rx="9" fill="#10b98118" stroke="#10b98144" stroke-width="1" />
    <text x="392" y="14" text-anchor="middle" class="badge">${skills.length} TECHNOLOGIES</text>
  </g>

  <!-- Skills Pills -->
  ${pillElements.join('\n')}
</svg>`;
}
