import { calculateStreak, getLocalDateString, shiftDateString, DayContribution } from '../src/utils/streak-calc.js';

function runTests() {
  console.log('--- Running Streak Calculation Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Test 1: Timezone calculation
  const testDate = new Date('2024-11-15T22:30:00Z');
  // In UTC: 2024-11-15
  assert(getLocalDateString(testDate, 'UTC') === '2024-11-15', 'UTC date string matches');
  // In Asia/Kolkata (UTC+5:30): 22:30 UTC on Nov 15 is 04:00 on Nov 16!
  assert(getLocalDateString(testDate, 'Asia/Kolkata') === '2024-11-16', 'IST date rollover at night matches');

  // Test 2: 30-Day Streak with Today pending (User has not committed yet today)
  // Let reference date be 2024-11-15 15:00:00 UTC
  const today = '2024-11-15';
  const mockDays: DayContribution[] = [];

  // Generate 30 days ending yesterday (2024-10-16 to 2024-11-14)
  for (let i = 30; i >= 1; i--) {
    mockDays.push({
      date: shiftDateString(today, -i),
      count: 3
    });
  }
  // Today has 0 commits
  mockDays.push({
    date: today,
    count: 0
  });

  const refDate = new Date('2024-11-15T12:00:00Z');
  const resultPending = calculateStreak(mockDays, 'UTC', refDate);

  assert(resultPending.currentStreak === 30, '30-day streak preserved when today is pending');
  assert(resultPending.isStreakActiveToday === false, 'Marked as pending today');
  assert(resultPending.currentStreakEnd === '2024-11-14', 'Current streak end is yesterday');
  assert(resultPending.currentStreakStart === '2024-10-16', 'Current streak start is 30 days ago');

  // Test 3: User commits today (Day 31)
  mockDays[mockDays.length - 1].count = 5;
  const resultCommittedToday = calculateStreak(mockDays, 'UTC', refDate);
  assert(resultCommittedToday.currentStreak === 31, 'Current streak advances to 31 after committing today');
  assert(resultCommittedToday.isStreakActiveToday === true, 'Marked as active today');
  assert(resultCommittedToday.currentStreakEnd === '2024-11-15', 'Current streak end is today');

  // Test 4: Streak broke (no commit yesterday AND no commit today)
  const brokeDays: DayContribution[] = [
    { date: shiftDateString(today, -2), count: 5 },
    { date: shiftDateString(today, -1), count: 0 },
    { date: today, count: 0 }
  ];
  const resultBroken = calculateStreak(brokeDays, 'UTC', refDate);
  assert(resultBroken.currentStreak === 0, 'Current streak is 0 if missed yesterday and today');

  // Test 5: Longest streak tracked properly across breaks
  const multiStreakDays: DayContribution[] = [
    // 10 day streak
    { date: '2024-01-01', count: 1 },
    { date: '2024-01-02', count: 2 },
    { date: '2024-01-03', count: 1 },
    { date: '2024-01-04', count: 3 },
    // Gap
    { date: '2024-01-05', count: 0 },
    // 5 day streak
    { date: '2024-01-06', count: 2 },
    { date: '2024-01-07', count: 1 }
  ];
  const resultLongest = calculateStreak(multiStreakDays, 'UTC', new Date('2024-01-08T00:00:00Z'));
  assert(resultLongest.longestStreak === 4, 'Longest streak is correctly 4');
  assert(resultLongest.longestStreakStart === '2024-01-01', 'Longest streak start is 2024-01-01');
  assert(resultLongest.longestStreakEnd === '2024-01-04', 'Longest streak end is 2024-01-04');

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
