import express, { Request, Response } from 'express';
import 'dotenv/config';
import { fetchStreakData, fetchUserStatsData, fetchLanguagesData } from './fetcher/github.js';
import { renderStreakCard } from './cards/streak-card.js';
import { renderStatsCard } from './cards/stats-card.js';
import { renderLanguagesCard } from './cards/languages-card.js';
import { renderErrorCard } from './cards/error-card.js';
import { getOrSetCache } from './utils/cache.js';
import { CardOptions } from './types.js';
import { themes } from './themes/index.js';

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
 * Interactive Preview Playground UI
 */
app.get('/', (req: Request, res: Response) => {
  const themeList = Object.keys(themes);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Stats & Streak Cards • Generator</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>">
  <style>
    :root {
      --bg: #0d1117;
      --card-bg: #161b22;
      --border: #30363d;
      --text: #c9d1d9;
      --heading: #f0f6fc;
      --accent: #238636;
      --accent-hover: #2ea043;
      --primary: #58a6ff;
      --subtext: #8b949e;
      --code-bg: #090d13;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 40px 20px; line-height: 1.5; }
    .container { max-width: 1100px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 40px; }
    h1 { font-size: 2.5rem; color: var(--heading); margin-bottom: 8px; font-weight: 800; }
    .tagline { color: var(--subtext); font-size: 1.15rem; max-width: 650px; margin: 0 auto; }
    .hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(56, 139, 253, 0.15); color: var(--primary); border: 1px solid rgba(56, 139, 253, 0.4); border-radius: 999px; font-size: 0.85rem; font-weight: 600; margin-bottom: 16px; }

    .control-panel { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 35px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-bottom: 20px; }
    .field label { display: block; font-size: 0.88rem; font-weight: 600; color: var(--heading); margin-bottom: 6px; }
    .field input, .field select { width: 100%; padding: 10px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; color: var(--text); font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
    .field input:focus, .field select:focus { border-color: var(--primary); }

    .checkbox-row { display: flex; align-items: center; gap: 24px; margin-top: 10px; flex-wrap: wrap; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; color: var(--text); }
    .checkbox-label input { cursor: pointer; width: 16px; height: 16px; accent-color: var(--primary); }

    .btn-row { display: flex; gap: 12px; margin-top: 20px; }
    button.btn-primary { background: var(--accent); color: #fff; font-weight: 600; border: none; padding: 11px 24px; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: background 0.2s; }
    button.btn-primary:hover { background: var(--accent-hover); }

    .cards-preview { display: flex; flex-direction: column; gap: 24px; align-items: center; margin-bottom: 40px; }
    .card-slot { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 16px; width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
    .card-slot h3 { font-size: 1rem; color: var(--subtext); margin-bottom: 12px; width: 100%; display: flex; justify-content: space-between; }
    .card-slot img { max-width: 100%; height: auto; border-radius: 10px; display: block; }

    .markdown-box { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 40px; }
    .markdown-box h2 { font-size: 1.3rem; color: var(--heading); margin-bottom: 12px; }
    .code-container { position: relative; }
    pre { background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; padding: 16px; overflow-x: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.9rem; color: #79c0ff; line-height: 1.6; }
    .copy-btn { position: absolute; top: 10px; right: 10px; background: #21262d; border: 1px solid var(--border); color: var(--text); padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: background 0.2s; }
    .copy-btn:hover { background: #30363d; color: var(--heading); }

    .tab-header { display: flex; gap: 10px; margin-bottom: 16px; }
    .tab-btn { background: transparent; border: 1px solid var(--border); color: var(--subtext); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .tab-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="hero-badge">⚡ Zero-Downtime • Timezone-Accurate</div>
      <h1>GitHub Stats & Streak Cards</h1>
      <p class="tagline">Never suffer from broken images or dropped streaks again. Built for rock-solid reliability in your GitHub profile README.</p>
    </header>

    <div class="control-panel">
      <div class="form-grid">
        <div class="field">
          <label for="username">GitHub Username</label>
          <input type="text" id="username" placeholder="e.g. torvalds" value="octocat">
        </div>
        <div class="field">
          <label for="theme">Theme</label>
          <select id="theme">
            ${themeList.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="timezone">Timezone</label>
          <input type="text" id="timezone" placeholder="e.g. Asia/Kolkata or UTC" value="UTC">
        </div>
      </div>

      <div class="checkbox-row">
        <label class="checkbox-label">
          <input type="checkbox" id="hideBorder">
          Hide Card Border
        </label>
        <label class="checkbox-label">
          <input type="checkbox" id="hideRank">
          Hide Rank Badge
        </label>
      </div>

      <div class="btn-row">
        <button class="btn-primary" onclick="updateCards()">Update Preview</button>
      </div>
    </div>

    <div class="cards-preview">
      <div class="card-slot">
        <h3><span>Streak Card</span> <span style="font-size: 0.8rem; color: #2ea44f;">● Live Vector</span></h3>
        <img id="img-streak" src="/api/streak?username=octocat&theme=github-dark" alt="Streak Card">
      </div>
      <div class="card-slot">
        <h3><span>General Stats Card</span> <span style="font-size: 0.8rem; color: #2ea44f;">● Live Vector</span></h3>
        <img id="img-stats" src="/api/stats?username=octocat&theme=github-dark" alt="Stats Card">
      </div>
      <div class="card-slot">
        <h3><span>Top Languages Card</span> <span style="font-size: 0.8rem; color: #2ea44f;">● Live Vector</span></h3>
        <img id="img-langs" src="/api/languages?username=octocat&theme=github-dark" alt="Languages Card">
      </div>
    </div>

    <div class="markdown-box">
      <h2>Add to Your GitHub Profile README</h2>
      <div class="tab-header">
        <button class="tab-btn active" onclick="switchTab('action')">Option A: GitHub Action (100% Zero-Downtime - Recommended)</button>
        <button class="tab-btn" onclick="switchTab('dynamic')">Option B: Dynamic Web API Link</button>
      </div>

      <div id="tab-action" class="tab-content">
        <p style="color: var(--subtext); margin-bottom: 12px;">Generates static SVGs directly into your repository via a daily GitHub Action. Because GitHub serves them directly, this is <strong>100% immune to API rate limits, server crashes, or Camo timeouts</strong>.</p>
        <div class="code-container">
          <button class="copy-btn" onclick="copyActionCode()">Copy Workflow YAML</button>
          <pre id="action-yaml">name: Update GitHub Stats Cards

on:
  schedule:
    - cron: '0 */6 * * *' # Updates every 6 hours
  workflow_dispatch: # Allows manual trigger anytime

jobs:
  update-stats:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Generate Stats Cards
        run: npx github-stats --username \${{ github.repository_owner }} --timezone Asia/Kolkata --theme github-dark --output ./stats
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      - name: Commit and Push
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add stats/
          git commit -m "Update GitHub stats cards [skip ci]" || exit 0
          git push</pre>
        </div>
        <p style="color: var(--subtext); margin-top: 16px; margin-bottom: 8px;">Then in your README.md, simply paste:</p>
        <div class="code-container">
          <pre id="action-readme-md">&lt;p align="center"&gt;
  &lt;img src="./stats/streak.svg" alt="GitHub Streak" /&gt;
  &lt;img src="./stats/stats.svg" alt="GitHub Stats" /&gt;
  &lt;img src="./stats/languages.svg" alt="Top Languages" /&gt;
&lt;/p&gt;</pre>
        </div>
      </div>

      <div id="tab-dynamic" class="tab-content" style="display: none;">
        <p style="color: var(--subtext); margin-bottom: 12px;">Dynamic URLs served by this API. Edge-cached with stale-while-revalidate and graceful SVG fallbacks.</p>
        <div class="code-container">
          <button class="copy-btn" onclick="copyDynamicCode()">Copy Markdown</button>
          <pre id="dynamic-md"></pre>
        </div>
      </div>
    </div>
  </div>

  <script>
    function updateCards() {
      const username = document.getElementById('username').value.trim() || 'octocat';
      const theme = document.getElementById('theme').value;
      const timezone = document.getElementById('timezone').value.trim() || 'UTC';
      const hideBorder = document.getElementById('hideBorder').checked;
      const hideRank = document.getElementById('hideRank').checked;

      const base = window.location.origin;
      const streakUrl = base + '/api/streak?username=' + encodeURIComponent(username) + '&theme=' + theme + '&timezone=' + encodeURIComponent(timezone) + (hideBorder ? '&hide_border=true' : '');
      const statsUrl = base + '/api/stats?username=' + encodeURIComponent(username) + '&theme=' + theme + (hideBorder ? '&hide_border=true' : '') + (hideRank ? '&hide_rank=true' : '');
      const langsUrl = base + '/api/languages?username=' + encodeURIComponent(username) + '&theme=' + theme + (hideBorder ? '&hide_border=true' : '');

      document.getElementById('img-streak').src = streakUrl;
      document.getElementById('img-stats').src = statsUrl;
      document.getElementById('img-langs').src = langsUrl;

      const md = '&lt;p align="center"&gt;\\n' +
        '  &lt;img src="' + streakUrl + '" alt="GitHub Streak" /&gt;\\n' +
        '  &lt;img src="' + statsUrl + '" alt="GitHub Stats" /&gt;\\n' +
        '  &lt;img src="' + langsUrl + '" alt="Top Languages" /&gt;\\n' +
        '&lt;/p&gt;';
      document.getElementById('dynamic-md').innerHTML = md.replace(/\\n/g, '<br>');
    }

    function switchTab(tab) {
      document.getElementById('tab-action').style.display = tab === 'action' ? 'block' : 'none';
      document.getElementById('tab-dynamic').style.display = tab === 'dynamic' ? 'block' : 'none';
      const btns = document.querySelectorAll('.tab-btn');
      btns[0].classList.toggle('active', tab === 'action');
      btns[1].classList.toggle('active', tab === 'dynamic');
    }

    function copyActionCode() {
      const code = document.getElementById('action-yaml').innerText;
      navigator.clipboard.writeText(code);
      alert('GitHub Actions workflow copied to clipboard!');
    }

    function copyDynamicCode() {
      const code = document.getElementById('dynamic-md').innerText;
      navigator.clipboard.writeText(code);
      alert('Markdown snippet copied to clipboard!');
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', updateCards);
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`⚡ GitHub Stats Server running at: http://localhost:${PORT}`);
    console.log(`📊 Endpoints: /api/streak, /api/stats, /api/languages`);
    console.log(`🎨 Web Playground: http://localhost:${PORT}`);
  });
}

export default app;
