export interface StreakData {
  totalContributions: number;
  firstContributionDate: string;
  currentStreak: number;
  currentStreakStart: string;
  currentStreakEnd: string;
  longestStreak: number;
  longestStreakStart: string;
  longestStreakEnd: string;
  isStreakActiveToday: boolean;
  streakDaysList: { date: string; count: number }[];
}

export interface UserStatsData {
  name: string;
  login: string;
  avatarUrl: string;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  totalReviews: number;
  contributedTo: number;
  rank: {
    level: string;
    percentile: number;
    score: number;
  };
}

export interface LanguageItem {
  name: string;
  color: string;
  size: number;
  percentage: number;
}

export interface LanguagesData {
  totalSize: number;
  languages: LanguageItem[];
}

export interface ThemeColors {
  background: string;
  cardBorder: string;
  titleColor: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
  streakFireColor: string;
  highlightColor: string;
  ringColor: string;
  progressBarBg: string;
}

export interface CardOptions {
  username: string;
  theme?: string;
  timezone?: string;
  hideBorder?: boolean;
  borderRadius?: number;
  customTitle?: string;
  hideTitle?: boolean;
  hideRank?: boolean;
  showIcons?: boolean;
  locale?: string;
  // Overrides
  bgColor?: string;
  borderColor?: string;
  titleColor?: string;
  textColor?: string;
  accentColor?: string;
  fireColor?: string;
  ringColor?: string;
  // Languages options
  hideLangs?: string[];
  langsCount?: number;
  layout?: 'compact' | 'normal' | 'donut';
}
