#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import { fetchStreakData, fetchUserStatsData, fetchLanguagesData } from '../fetcher/github.js';
import { renderStreakCard } from '../cards/streak-card.js';
import { renderStatsCard } from '../cards/stats-card.js';
import { renderLanguagesCard } from '../cards/languages-card.js';
import { CardOptions } from '../types.js';

function parseArgs(): {
  username: string;
  outputDir: string;
  theme: string;
  timezone: string;
  hideBorder: boolean;
  borderRadius: number;
  graceDays: number;
} {
  const args = process.argv.slice(2);
  let username = process.env.GITHUB_ACTOR || process.env.USERNAME || '';
  let outputDir = './stats';
  let theme = 'github-dark';
  let timezone = process.env.TIMEZONE || 'UTC';
  let hideBorder = false;
  let borderRadius = 10;
  let graceDays = 0;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--username' || arg === '-u') {
      username = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      outputDir = args[++i];
    } else if (arg === '--theme' || arg === '-t') {
      theme = args[++i];
    } else if (arg === '--timezone' || arg === '-tz') {
      timezone = args[++i];
    } else if (arg === '--hide-border') {
      hideBorder = true;
    } else if (arg === '--border-radius') {
      borderRadius = parseInt(args[++i], 10);
    } else if (arg === '--grace-days') {
      graceDays = parseInt(args[++i], 10);
    }
  }

  return { username, outputDir, theme, timezone, hideBorder, borderRadius, graceDays };
}

async function main() {
  const config = parseArgs();

  if (!config.username) {
    console.error('Error: GitHub username is required. Pass --username <user> or set GITHUB_ACTOR / USERNAME in environment.');
    process.exit(1);
  }

  console.log(`🚀 Generating GitHub Stats Cards for: @${config.username}`);
  console.log(`🎨 Theme: ${config.theme} | Timezone: ${config.timezone} | Output: ${config.outputDir}`);

  const options: CardOptions = {
    username: config.username,
    theme: config.theme,
    timezone: config.timezone,
    graceDays: config.graceDays,
    hideBorder: config.hideBorder,
    borderRadius: config.borderRadius
  };

  const resolvedOutputDir = path.resolve(process.cwd(), config.outputDir);
  if (!fs.existsSync(resolvedOutputDir)) {
    fs.mkdirSync(resolvedOutputDir, { recursive: true });
  }

  // 1. Generate Streak Card
  try {
    console.log('⏳ Calculating streak data...');
    const streakData = await fetchStreakData(config.username, config.timezone, config.graceDays);
    const streakSvg = renderStreakCard(streakData, options);
    const streakPath = path.join(resolvedOutputDir, 'streak.svg');
    fs.writeFileSync(streakPath, streakSvg, 'utf-8');
    console.log(`✅ Saved: ${streakPath} (Current streak: ${streakData.currentStreak} days, Longest: ${streakData.longestStreak} days)`);
  } catch (err: any) {
    console.error('❌ Failed to generate streak card:', err.message || err);
  }

  // 2. Generate Stats Card
  try {
    console.log('⏳ Fetching overall stats...');
    const statsData = await fetchUserStatsData(config.username);
    const statsSvg = renderStatsCard(statsData, options);
    const statsPath = path.join(resolvedOutputDir, 'stats.svg');
    fs.writeFileSync(statsPath, statsSvg, 'utf-8');
    console.log(`✅ Saved: ${statsPath} (Stars: ${statsData.totalStars}, Commits: ${statsData.totalCommits}, Rank: ${statsData.rank.level})`);
  } catch (err: any) {
    console.error('❌ Failed to generate stats card:', err.message || err);
  }

  // 3. Generate Languages Card
  try {
    console.log('⏳ Analyzing top languages...');
    const langsData = await fetchLanguagesData(config.username);
    const langsSvg = renderLanguagesCard(langsData, options);
    const langsPath = path.join(resolvedOutputDir, 'languages.svg');
    fs.writeFileSync(langsPath, langsSvg, 'utf-8');
    console.log(`✅ Saved: ${langsPath} (${langsData.languages.length} languages tracked)`);
  } catch (err: any) {
    console.error('❌ Failed to generate languages card:', err.message || err);
  }

  console.log('🎉 All cards generated successfully!');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
