import { StreakData } from '../types.js';

export interface DayContribution {
  date: string; // YYYY-MM-DD
  count: number;
}

/**
 * Returns YYYY-MM-DD for a given Date in a specific timezone.
 */
export function getLocalDateString(date: Date = new Date(), timezone: string = 'UTC'): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date); // Returns "YYYY-MM-DD"
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/**
 * Adds or subtracts days from a YYYY-MM-DD string.
 */
export function shiftDateString(dateStr: string, daysOffset: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

/**
 * Format a date string "YYYY-MM-DD" to human readable "MMM D, YYYY" or "MMM D".
 */
export function formatDate(dateStr: string, includeYear: boolean = true): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[d.getUTCMonth()];
  const dayNum = d.getUTCDate();
  if (includeYear) {
    return `${monthName} ${dayNum}, ${d.getUTCFullYear()}`;
  }
  return `${monthName} ${dayNum}`;
}

/**
 * Robust, timezone-accurate streak calculation engine.
 *
 * Solves:
 * 1. Timezone boundary offset (e.g. IST vs UTC vs PST).
 * 2. Today's grace period: If user committed yesterday and today is still in progress,
 *    their streak remains intact (not reset to 0 or broken).
 * 3. Multi-year continuity and longest streak tracking.
 */
export function calculateStreak(
  days: DayContribution[],
  timezone: string = 'UTC',
  referenceDate?: Date,
  graceDays: number = 0
): StreakData {
  if (!days || days.length === 0) {
    return {
      totalContributions: 0,
      firstContributionDate: '',
      currentStreak: 0,
      currentStreakStart: '',
      currentStreakEnd: '',
      longestStreak: 0,
      longestStreakStart: '',
      longestStreakEnd: '',
      isStreakActiveToday: false,
      streakDaysList: []
    };
  }

  // Create a fast lookup map: dateStr -> count
  const dayMap = new Map<string, number>();
  let totalContributions = 0;
  let firstContributionDate = '';

  // Sort days ascending
  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

  for (const day of sortedDays) {
    dayMap.set(day.date, day.count);
    totalContributions += day.count;
    if (!firstContributionDate && day.count > 0) {
      firstContributionDate = day.date;
    }
  }

  // Determine today's and yesterday's date in target timezone
  const now = referenceDate || new Date();
  const todayStr = getLocalDateString(now, timezone);
  const yesterdayStr = shiftDateString(todayStr, -1);

  // Calculate longest streak across the entire timeline
  let longestStreak = 0;
  let longestStreakStart = '';
  let longestStreakEnd = '';

  let currentRun = 0;
  let currentRunStart = '';
  let longestMisses = 0;

  for (let i = 0; i < sortedDays.length; i++) {
    const day = sortedDays[i];
    // Do not count future dates beyond today
    if (day.date > todayStr) continue;

    if (day.count > 0) {
      if (currentRun === 0) {
        currentRunStart = day.date;
      }
      currentRun++;
      longestMisses = 0;

      if (currentRun > longestStreak) {
        longestStreak = currentRun;
        longestStreakStart = currentRunStart;
        longestStreakEnd = day.date;
      }
    } else if (currentRun > 0 && longestMisses < graceDays) {
      longestMisses++;
    } else {
      currentRun = 0;
      currentRunStart = '';
      longestMisses = 0;
    }
  }

  // Calculate CURRENT streak
  const todayCount = dayMap.get(todayStr) || 0;
  const yesterdayCount = dayMap.get(yesterdayStr) || 0;

  let currentStreak = 0;
  let currentStreakStart = '';
  let currentStreakEnd = '';
  let isStreakActiveToday = false;
  const streakDaysList: { date: string; count: number }[] = [];

  let pointerDate = '';

  if (todayCount > 0) {
    // User already made contributions today
    isStreakActiveToday = true;
    pointerDate = todayStr;
    currentStreakEnd = todayStr;
  } else if (yesterdayCount > 0) {
    // User contributed yesterday, today is pending (streak still alive!)
    isStreakActiveToday = false;
    pointerDate = yesterdayStr;
    currentStreakEnd = yesterdayStr;
  } else {
    // Neither today nor yesterday had contributions -> streak is 0
    pointerDate = '';
  }

  if (pointerDate) {
    let checkDate = pointerDate;
    let currentMisses = 0;
    while (true) {
      const count = dayMap.get(checkDate) || 0;
      if (count > 0) {
        currentStreak++;
        currentStreakStart = checkDate;
        currentMisses = 0;
        streakDaysList.unshift({ date: checkDate, count });
        checkDate = shiftDateString(checkDate, -1);
      } else if (currentStreak > 0 && currentMisses < graceDays) {
        currentMisses++;
        checkDate = shiftDateString(checkDate, -1);
      } else {
        break;
      }
    }
  }

  // Update longest streak if current is somehow larger (e.g. edge cases)
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
    longestStreakStart = currentStreakStart;
    longestStreakEnd = currentStreakEnd;
  }

  return {
    totalContributions,
    firstContributionDate: firstContributionDate || sortedDays[0]?.date || '',
    currentStreak,
    currentStreakStart,
    currentStreakEnd,
    longestStreak,
    longestStreakStart,
    longestStreakEnd,
    isStreakActiveToday,
    streakDaysList
  };
}
