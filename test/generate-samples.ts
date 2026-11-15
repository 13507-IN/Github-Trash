import fs from 'node:fs';
import path from 'node:path';
import { renderStreakCard } from '../src/cards/streak-card.js';
import { renderStatsCard } from '../src/cards/stats-card.js';
import { renderLanguagesCard } from '../src/cards/languages-card.js';
import { StreakData, UserStatsData, LanguagesData } from '../src/types.js';

const sampleStreak: StreakData = {
  totalContributions: 1617,
  firstContributionDate: '2024-06-20',
  currentStreak: 30, // User's actual 30-day streak!
  currentStreakStart: '2024-10-17',
  currentStreakEnd: '2024-11-15',
  longestStreak: 33,
  longestStreakStart: '2024-02-03',
  longestStreakEnd: '2024-03-07',
  isStreakActiveToday: true,
  streakDaysList: []
};

const sampleStats: UserStatsData = {
  name: 'Code Explorer',
  login: 'developer',
  avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
  totalCommits: 1482,
  totalPRs: 64,
  totalIssues: 28,
  totalStars: 195,
  totalReviews: 42,
  contributedTo: 18,
  rank: {
    level: 'S',
    percentile: 5,
    score: 820
  }
};

const sampleLanguages: LanguagesData = {
  totalSize: 4500000,
  languages: [
    { name: 'TypeScript', color: '#3178c6', size: 2100000, percentage: 46.7 },
    { name: 'JavaScript', color: '#f1e05a', size: 1200000, percentage: 26.7 },
    { name: 'Python', color: '#3572A5', size: 650000, percentage: 14.4 },
    { name: 'HTML', color: '#e34c26', size: 300000, percentage: 6.7 },
    { name: 'CSS', color: '#563d7c', size: 200000, percentage: 4.4 },
    { name: 'Rust', color: '#dea584', size: 50000, percentage: 1.1 }
  ]
};

const outDir = path.resolve(process.cwd(), 'sample-output');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate for themes
const sampleThemes = ['github-dark', 'dracula', 'cyberpunk', 'tokyonight'];

for (const theme of sampleThemes) {
  const streakSvg = renderStreakCard(sampleStreak, { username: 'test', theme });
  const statsSvg = renderStatsCard(sampleStats, { username: 'test', theme });
  const langsSvg = renderLanguagesCard(sampleLanguages, { username: 'test', theme });

  fs.writeFileSync(path.join(outDir, `streak-${theme}.svg`), streakSvg, 'utf-8');
  fs.writeFileSync(path.join(outDir, `stats-${theme}.svg`), statsSvg, 'utf-8');
  fs.writeFileSync(path.join(outDir, `languages-${theme}.svg`), langsSvg, 'utf-8');
}

console.log(`Generated sample SVG cards in ${outDir} for themes: ${sampleThemes.join(', ')}`);
