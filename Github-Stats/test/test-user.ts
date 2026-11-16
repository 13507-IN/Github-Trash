import { calculateStreak } from '../src/utils/streak-calc.js';

async function testUser() {
  const username = '13507-IN';
  const res = await fetch(`https://github.com/users/${username}/contributions`);
  const html = await res.text();

  const dayRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-[^"]+)"/g;
  const days: { date: string; id: string; count: number }[] = [];
  let match;
  while ((match = dayRegex.exec(html)) !== null) {
    days.push({ date: match[1], id: match[2], count: 0 });
  }

  // Parse tooltips
  const tooltipRegex = /<tool-tip[^>]*for="(contribution-day-component-[^"]+)"[^>]*>(.*?)<\/tool-tip>/gs;
  const counts = new Map<string, number>();
  let ttMatch;
  while ((ttMatch = tooltipRegex.exec(html)) !== null) {
    const id = ttMatch[1];
    const text = ttMatch[2].replace(/\s+/g, ' ').trim();
    let count = 0;
    const numMatch = text.match(/^(\d+)\s+contribution/);
    if (numMatch) {
      count = parseInt(numMatch[1], 10);
    }
    counts.set(id, count);
  }

  for (const d of days) {
    d.count = counts.get(d.id) ?? 0;
  }

  // Sort chronologically!
  days.sort((a, b) => a.date.localeCompare(b.date));

  console.log('=== CHRONOLOGICAL LAST 35 DAYS ===');
  for (const d of days.slice(-35)) {
    console.log(`  ${d.date}: ${d.count} contribs`);
  }

  const streak = calculateStreak(days, 'Asia/Kolkata');
  console.log('\n=== CALCULATED STREAK RESULT ===');
  console.log('Total Contributions:', streak.totalContributions);
  console.log('Current Streak:', streak.currentStreak, 'days');
  console.log('Current Streak Start:', streak.currentStreakStart);
  console.log('Current Streak End:', streak.currentStreakEnd);
  console.log('Longest Streak:', streak.longestStreak, 'days');
  console.log('Longest Streak Start:', streak.longestStreakStart);
  console.log('Longest Streak End:', streak.longestStreakEnd);
  console.log('Is Streak Active Today:', streak.isStreakActiveToday);
}

testUser().catch(console.error);
