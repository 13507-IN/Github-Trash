import { UserStatsData, StreakData, WorthData } from '../types.js';

export function calculateWorth(
  stats: UserStatsData,
  streak: StreakData,
  currency: string = '$'
): WorthData {
  // 1. Engineering Hours & Commits Value
  // Commits represent ~1.5 hours of dedicated dev work
  const avgHoursPerCommit = 1.6;
  const engineeringHours = Math.round(
    stats.totalCommits * avgHoursPerCommit +
    stats.contributedTo * 8 +
    stats.totalPRs * 4 +
    stats.totalIssues * 1.5
  );

  // Hourly rate based on developer rank / output
  let hourlyRate = 45;
  if (stats.rank.level.startsWith('S')) hourlyRate = 75;
  else if (stats.rank.level.startsWith('A')) hourlyRate = 60;
  else if (stats.rank.level.startsWith('B')) hourlyRate = 48;
  else hourlyRate = 35;

  const commitsValue = Math.round(stats.totalCommits * 28);
  const reposValue = Math.round(stats.contributedTo * 220);
  const starsValue = Math.round(stats.totalStars * 140);
  const streakBonus = Math.round((streak.currentStreak * 120) + (streak.longestStreak * 50));

  // 2. Consistency & Streak Multiplier
  let multiplier = 1.0;
  const effectiveStreak = Math.max(streak.currentStreak, streak.longestStreak);
  if (effectiveStreak >= 60) multiplier = 1.45;
  else if (effectiveStreak >= 30) multiplier = 1.30;
  else if (effectiveStreak >= 14) multiplier = 1.20;
  else if (effectiveStreak >= 7) multiplier = 1.10;

  const baseTotal = commitsValue + reposValue + starsValue + streakBonus;
  const totalWorth = Math.round((baseTotal * multiplier) / 50) * 50;

  // 3. Market Valuation Tier
  let tier = '🌱 Fast-Growing Builder';
  if (totalWorth >= 150000) {
    tier = '💎 Mythic Unicorn / Enterprise Legend';
  } else if (totalWorth >= 75000) {
    tier = '🚀 Principal / Staff Architect';
  } else if (totalWorth >= 35000) {
    tier = '⭐ Senior Production Engineer';
  } else if (totalWorth >= 15000) {
    tier = '🔥 High-Velocity Contributor';
  }

  return {
    totalWorth,
    currency,
    tier,
    engineeringHours,
    hourlyRate,
    breakdown: {
      commitsValue,
      reposValue,
      starsValue,
      streakBonus,
      multiplier
    }
  };
}
