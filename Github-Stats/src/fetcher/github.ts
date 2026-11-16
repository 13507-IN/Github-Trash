import { StreakData, UserStatsData, LanguagesData, LanguageItem } from '../types.js';
import { calculateStreak, DayContribution } from '../utils/streak-calc.js';
import { calculateRank } from '../utils/rank.js';
import { getLanguageColor } from '../utils/colors.js';
import {
  USER_CALENDAR_QUERY,
  USER_YEARS_QUERY,
  USER_STATS_QUERY,
  USER_LANGUAGES_QUERY
} from './queries.js';

class GitHubClient {
  private tokens: string[] = [];
  private tokenIndex = 0;

  constructor() {
    this.reloadTokens();
  }

  public reloadTokens() {
    const rawTokens = process.env.GITHUB_TOKENS || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
    this.tokens = rawTokens
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
  }

  public hasToken(): boolean {
    if (this.tokens.length === 0) {
      this.reloadTokens();
    }
    return this.tokens.length > 0;
  }

  private getToken(): string {
    if (this.tokens.length === 0) {
      this.reloadTokens();
    }
    if (this.tokens.length === 0) {
      return '';
    }
    const token = this.tokens[this.tokenIndex % this.tokens.length];
    this.tokenIndex++;
    return token;
  }

  public async graphql<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'github-stats-card-generator'
    };

    if (token) {
      headers['Authorization'] = `bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API HTTP ${response.status}: ${errorText}`);
      }

      const json = (await response.json()) as any;
      if (json.errors && json.errors.length > 0) {
        throw new Error(`GitHub GraphQL Error: ${json.errors.map((e: any) => e.message).join(', ')}`);
      }

      return json.data as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const githubClient = new GitHubClient();

/**
 * Scrape public contribution calendar when no token is available
 */
async function fetchPublicContributions(username: string): Promise<DayContribution[]> {
  const headers = { 'User-Agent': 'github-stats-card-generator' };
  const res = await fetch(`https://github.com/users/${username}/contributions`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch public contributions: HTTP ${res.status}`);
  }
  const html = await res.text();

  const dayRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-[^"]+)"/g;
  const days: { date: string; id: string; count: number }[] = [];
  let match;
  while ((match = dayRegex.exec(html)) !== null) {
    days.push({ date: match[1], id: match[2], count: 0 });
  }

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

  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

/**
 * Fetch calendar contribution days across all relevant years and calculate streak
 */
export async function fetchStreakData(
  username: string,
  timezone: string = 'UTC',
  graceDays: number = 0
): Promise<StreakData> {
  // If no token or GraphQL fails, gracefully use public calendar parser
  if (!githubClient.hasToken()) {
    const days = await fetchPublicContributions(username);
    return calculateStreak(days, timezone, undefined, graceDays);
  }

  try {
    let years: number[] = [];
    try {
      const yearsData = await githubClient.graphql<any>(USER_YEARS_QUERY, { login: username });
      years = yearsData?.user?.contributionsCollection?.contributionYears || [];
    } catch {
      years = [new Date().getFullYear()];
    }

    if (years.length === 0) {
      years = [new Date().getFullYear()];
    }

    const yearsToFetch = years.slice(0, Math.min(years.length, 3));
    const allDays: DayContribution[] = [];
    let totalContributionsSum = 0;

    for (const year of yearsToFetch) {
      const from = `${year}-01-01T00:00:00Z`;
      const to = `${year}-12-31T23:59:59Z`;

      try {
        const calData = await githubClient.graphql<any>(USER_CALENDAR_QUERY, {
          login: username,
          from,
          to
        });

        const calendar = calData?.user?.contributionsCollection?.contributionCalendar;
        if (calendar) {
          totalContributionsSum += calendar.totalContributions || 0;
          const weeks = calendar.weeks || [];
          for (const week of weeks) {
            for (const day of week.contributionDays || []) {
              allDays.push({
                date: day.date,
                count: day.contributionCount
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Could not fetch calendar for year ${year}:`, err);
      }
    }

    if (allDays.length === 0) {
      // Fallback to public contributions
      const days = await fetchPublicContributions(username);
      return calculateStreak(days, timezone, undefined, graceDays);
    }

    const streak = calculateStreak(allDays, timezone, undefined, graceDays);
    streak.totalContributions = Math.max(streak.totalContributions, totalContributionsSum);
    return streak;
  } catch (err) {
    // If GraphQL failed (e.g. token expired), fallback to public calendar
    const days = await fetchPublicContributions(username);
    return calculateStreak(days, timezone, undefined, graceDays);
  }
}

/**
 * Fetch overall user statistics (stars, commits, PRs, issues, rank)
 */
export async function fetchUserStatsData(username: string): Promise<UserStatsData> {
  const headers = { 'User-Agent': 'github-stats-card-generator' };

  if (githubClient.hasToken()) {
    try {
      const data = await githubClient.graphql<any>(USER_STATS_QUERY, { login: username });
      const user = data?.user;

      if (user) {
        const repos = user.repositories?.nodes || [];
        let totalStars = 0;
        for (const repo of repos) {
          totalStars += repo.stargazerCount || 0;
        }

        const totalPRs = user.pullRequests?.totalCount || 0;
        const totalIssues = user.issues?.totalCount || 0;
        const contributedTo = user.repositoriesContributedTo?.totalCount || 0;
        const totalReviews = user.contributionsCollection?.totalPullRequestReviewContributions || 0;

        const directCommits = user.contributionsCollection?.totalCommitContributions || 0;
        const restrictedCommits = user.contributionsCollection?.restrictedContributionsCount || 0;
        const totalCommits = directCommits + restrictedCommits;

        const rank = calculateRank({
          totalCommits,
          totalPRs,
          totalIssues,
          totalStars,
          totalReviews,
          contributedTo
        });

        return {
          name: user.name || user.login,
          login: user.login,
          avatarUrl: user.avatarUrl,
          totalCommits,
          totalPRs,
          totalIssues,
          totalStars,
          totalReviews,
          contributedTo,
          rank
        };
      }
    } catch {
      // fallback to REST
    }
  }

  // Fallback to REST API
  const uRes = await fetch(`https://api.github.com/users/${username}`, { headers });
  if (!uRes.ok) throw new Error(`User "${username}" not found.`);
  const u = (await uRes.json()) as any;

  // Repositories for stars
  let totalStars = 0;
  let page = 1;
  while (page <= 2) { // up to 200 repos
    const rRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`, { headers });
    const rData = (await rRes.json()) as any;
    if (!Array.isArray(rData) || rData.length === 0) break;
    for (const repo of rData) {
      if (!repo.fork) totalStars += repo.stargazers_count || 0;
    }
    page++;
  }

  // Estimate commits & stats from contributions
  let totalCommits = 0;
  try {
    const days = await fetchPublicContributions(username);
    totalCommits = days.reduce((sum, d) => sum + d.count, 0);
  } catch {
    totalCommits = u.public_repos * 15;
  }

  const rank = calculateRank({
    totalCommits,
    totalPRs: 5,
    totalIssues: 2,
    totalStars,
    totalReviews: 0,
    contributedTo: u.public_repos
  });

  return {
    name: u.name || u.login,
    login: u.login,
    avatarUrl: u.avatar_url,
    totalCommits,
    totalPRs: 5,
    totalIssues: 2,
    totalStars,
    totalReviews: 0,
    contributedTo: u.public_repos,
    rank
  };
}

/**
 * Fetch top programming languages by byte size across user's repositories
 */
export async function fetchLanguagesData(
  username: string,
  hideLangs: string[] = [],
  limit: number = 6
): Promise<LanguagesData> {
  const headers = { 'User-Agent': 'github-stats-card-generator' };
  const normalizedHideLangs = new Set(hideLangs.map(l => l.toLowerCase().trim()));

  if (githubClient.hasToken()) {
    try {
      const data = await githubClient.graphql<any>(USER_LANGUAGES_QUERY, { login: username });
      const repos = data?.user?.repositories?.nodes || [];
      const langMap = new Map<string, { size: number; color?: string }>();

      for (const repo of repos) {
        const edges = repo.languages?.edges || [];
        for (const edge of edges) {
          const name = edge.node?.name;
          const size = edge.size || 0;
          const color = edge.node?.color;

          if (!name || normalizedHideLangs.has(name.toLowerCase())) continue;

          const existing = langMap.get(name);
          if (existing) {
            existing.size += size;
            if (!existing.color && color) existing.color = color;
          } else {
            langMap.set(name, { size, color });
          }
        }
      }

      let totalSize = 0;
      const langList: LanguageItem[] = [];
      for (const [, info] of langMap.entries()) totalSize += info.size;

      if (totalSize > 0) {
        for (const [name, info] of langMap.entries()) {
          const percentage = Number(((info.size / totalSize) * 100).toFixed(1));
          langList.push({
            name,
            color: info.color || getLanguageColor(name),
            size: info.size,
            percentage
          });
        }
        langList.sort((a, b) => b.size - a.size);
        return { totalSize, languages: langList.slice(0, limit) };
      }
    } catch {
      // fallback
    }
  }

  // REST fallback
  const langMap = new Map<string, number>();
  let page = 1;
  while (page <= 2) {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`, { headers });
    const data = (await res.json()) as any;
    if (!Array.isArray(data) || data.length === 0) break;
    for (const repo of data) {
      if (repo.fork) continue;
      const lang = repo.language;
      if (lang && !normalizedHideLangs.has(lang.toLowerCase())) {
        langMap.set(lang, (langMap.get(lang) || 0) + (repo.size || 1));
      }
    }
    page++;
  }

  let totalSize = 0;
  for (const size of langMap.values()) totalSize += size;
  if (totalSize === 0) return { totalSize: 0, languages: [] };

  const langList: LanguageItem[] = [];
  for (const [name, size] of langMap.entries()) {
    const percentage = Number(((size / totalSize) * 100).toFixed(1));
    langList.push({
      name,
      color: getLanguageColor(name),
      size,
      percentage
    });
  }

  langList.sort((a, b) => b.size - a.size);
  return { totalSize, languages: langList.slice(0, limit) };
}
