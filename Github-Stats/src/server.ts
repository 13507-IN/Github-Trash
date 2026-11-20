import express, { Request, Response } from 'express';
import 'dotenv/config';
import { fetchStreakData, fetchUserStatsData, fetchLanguagesData } from './fetcher/github.js';
import { renderStreakCard } from './cards/streak-card.js';
import { renderStatsCard } from './cards/stats-card.js';
import { renderLanguagesCard } from './cards/languages-card.js';
import { renderRPGCard } from './cards/rpg-card.js';
import { renderWorthCard } from './cards/worth-card.js';
import { renderErrorCard } from './cards/error-card.js';
import { calculateRPG } from './utils/rpg-calc.js';
import { calculateWorth } from './utils/worth-calc.js';
import { getOrSetCache } from './utils/cache.js';
import { CardOptions } from './types.js';
import { themes } from './themes/index.js';
import { renderPlaygroundHtml } from './views/playground.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Helper to set image headers with edge caching
function sendSvg(res: Response, svg: string, cacheTtlSeconds: number = 14400) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader(
    'Cache-Control',
    `public, max-age=${cacheTtlSeconds}, s-maxage=${cacheTtlSeconds}, stale-while-revalidate=86400`
  );
  res.send(svg);
}

// Extract standard CardOptions from query parameters
function parseCardOptions(req: Request): CardOptions {
  const q = req.query;
  const username = (q.username as string) || '';
  const theme = (q.theme as string) || 'github-dark';
  const timezone = (q.timezone as string) || 'UTC';
  const graceDays = q.grace_days ? parseInt(q.grace_days as string, 10) : 0;
  const currency = (q.currency as string) || '$';
  const hideBorder = q.hide_border === 'true';
  const borderRadius = q.border_radius ? parseInt(q.border_radius as string, 10) : 10;
  const customTitle = q.custom_title as string | undefined;
  const hideTitle = q.hide_title === 'true';
  const hideRank = q.hide_rank === 'true';

  return {
    username,
    theme,
    timezone,
    graceDays,
    currency,
    hideBorder,
    borderRadius,
    customTitle,
    hideTitle,
    hideRank,
    bgColor: q.bg_color as string | undefined,
    borderColor: q.border_color as string | undefined,
    titleColor: q.title_color as string | undefined,
    textColor: q.text_color as string | undefined,
    accentColor: q.accent_color as string | undefined,
    fireColor: q.fire_color as string | undefined,
    ringColor: q.ring_color as string | undefined,
    hideLangs: q.hide_langs ? (q.hide_langs as string).split(',') : []
  };
}

/**
 * GET /api/streak
 */
app.get('/api/streak', async (req: Request, res: Response) => {
  const options = parseCardOptions(req);
  if (!options.username) {
    sendSvg(res, renderErrorCard('Username parameter is required', 'Add ?username=YOUR_GITHUB_USERNAME'));
    return;
  }

  const cacheKey = `streak:${options.username}:${options.timezone}:${options.graceDays}:${options.theme}:${options.hideBorder}`;

  try {
    const svg = await getOrSetCache(
      cacheKey,
      async () => {
        const data = await fetchStreakData(options.username, options.timezone, options.graceDays);
        return renderStreakCard(data, options);
      },
      1000 * 60 * 60 // 1 hour memory cache
    );
    sendSvg(res, svg);
  } catch (err: any) {
    console.error('Streak API error:', err);
    sendSvg(res, renderErrorCard('Could not load streak data', err.message || 'Please check username or token'));
  }
});

/**
 * GET /api/stats
 */
app.get('/api/stats', async (req: Request, res: Response) => {
  const options = parseCardOptions(req);
  if (!options.username) {
    sendSvg(res, renderErrorCard('Username parameter is required', 'Add ?username=YOUR_GITHUB_USERNAME'));
    return;
  }

  const cacheKey = `stats:${options.username}:${options.theme}:${options.hideBorder}:${options.hideRank}`;

  try {
    const svg = await getOrSetCache(
      cacheKey,
      async () => {
        const data = await fetchUserStatsData(options.username);
        return renderStatsCard(data, options);
      },
      1000 * 60 * 60 * 2 // 2 hours memory cache
    );
    sendSvg(res, svg);
  } catch (err: any) {
    console.error('Stats API error:', err);
    sendSvg(res, renderErrorCard('Could not load stats data', err.message || 'Please check username or token'));
  }
});

/**
 * GET /api/languages
 */
app.get('/api/languages', async (req: Request, res: Response) => {
  const options = parseCardOptions(req);
  if (!options.username) {
    sendSvg(res, renderErrorCard('Username parameter is required', 'Add ?username=YOUR_GITHUB_USERNAME'));
    return;
  }

  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
  const cacheKey = `langs:${options.username}:${options.theme}:${options.hideBorder}:${limit}:${(options.hideLangs || []).join(',')}`;

  try {
    const svg = await getOrSetCache(
      cacheKey,
      async () => {
        const data = await fetchLanguagesData(options.username, options.hideLangs, limit);
        return renderLanguagesCard(data, options);
      },
      1000 * 60 * 60 * 4 // 4 hours memory cache
    );
    sendSvg(res, svg);
  } catch (err: any) {
    console.error('Languages API error:', err);
    sendSvg(res, renderErrorCard('Could not load languages data', err.message || 'Please check username or token'));
  }
});

/**
 * GET /api/rpg - Developer Character Card
 */
app.get('/api/rpg', async (req: Request, res: Response) => {
  const options = parseCardOptions(req);
  if (!options.username) {
    sendSvg(res, renderErrorCard('Username parameter is required', 'Add ?username=YOUR_GITHUB_USERNAME'));
    return;
  }

  const cacheKey = `rpg:${options.username}:${options.timezone}:${options.graceDays}:${options.theme}:${options.hideBorder}`;

  try {
    const svg = await getOrSetCache(
      cacheKey,
      async () => {
        const [statsData, streakData, langsData] = await Promise.all([
          fetchUserStatsData(options.username),
          fetchStreakData(options.username, options.timezone, options.graceDays),
          fetchLanguagesData(options.username)
        ]);
        const rpgData = calculateRPG(statsData, streakData, langsData);
        return renderRPGCard(rpgData, options);
      },
      1000 * 60 * 60 * 2
    );
    sendSvg(res, svg);
  } catch (err: any) {
    console.error('RPG API error:', err);
    sendSvg(res, renderErrorCard('Could not load RPG card', err.message || 'Please check username or token'));
  }
});

/**
 * GET /api/worth - GitHub Account Valuation Card
 */
app.get('/api/worth', async (req: Request, res: Response) => {
  const options = parseCardOptions(req);
  if (!options.username) {
    sendSvg(res, renderErrorCard('Username parameter is required', 'Add ?username=YOUR_GITHUB_USERNAME'));
    return;
  }

  const cacheKey = `worth:${options.username}:${options.timezone}:${options.currency}:${options.graceDays}:${options.theme}:${options.hideBorder}`;

  try {
    const svg = await getOrSetCache(
      cacheKey,
      async () => {
        const [statsData, streakData] = await Promise.all([
          fetchUserStatsData(options.username),
          fetchStreakData(options.username, options.timezone, options.graceDays)
        ]);
        const worthData = calculateWorth(statsData, streakData, options.currency || '$');
        return renderWorthCard(worthData, options);
      },
      1000 * 60 * 60 * 2
    );
    sendSvg(res, svg);
  } catch (err: any) {
    console.error('Worth API error:', err);
    sendSvg(res, renderErrorCard('Could not load Worth card', err.message || 'Please check username or token'));
  }
});

/**
 * Interactive Preview Playground UI
 */
app.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(renderPlaygroundHtml());
});

// Start server (only when not in test or Vercel serverless environment)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`⚡ GitHub Stats Server running at: http://localhost:${PORT}`);
    console.log(`📊 Endpoints: /api/streak, /api/stats, /api/languages, /api/rpg, /api/worth`);
    console.log(`🎨 Web Playground: http://localhost:${PORT}`);
  });
}

export default app;
