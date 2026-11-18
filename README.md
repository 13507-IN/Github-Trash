# 🚀 GitHub Suite (by [@13507-IN](https://github.com/13507-IN))

> A curated collection of high-performance tools, cards, widgets, and utilities to boost your GitHub experience and supercharge your Profile README.

---

## 📦 Products in this Repository

| Product | Folder | Description | Status |
| :--- | :--- | :--- | :--- |
| **🎮 RPG Developer Card** | [`/Github-Stats`](./Github-Stats) | Gamified developer character sheet with classes, levels, and stat attributes. | ✅ **Active** |
| **💰 Account Worth / Valuation** | [`/Github-Stats`](./Github-Stats) | Calculates estimated commercial engineering value & market tier. | ✅ **Active** |
| **🔥 Streak & Stats Cards** | [`/Github-Stats`](./Github-Stats) | Timezone-accurate, 100% zero-downtime streak and stats cards. | ✅ **Active** |
| **🖼️ GitHub Images** | [`/Github-Images`](./Github-Images) | Dynamic banners, custom badges, headers, and visual assets for GitHub profiles. | 🚧 *In Development* |

---

## 🎮 The Full Card Suite

<p align="center">
  <img src="./Github-Stats/user-stats/rpg.svg" alt="Developer RPG Sheet" width="480" />
  <img src="./Github-Stats/user-stats/worth.svg" alt="GitHub Account Valuation" width="480" />
</p>
<p align="center">
  <img src="./Github-Stats/user-stats/streak.svg" alt="GitHub Streak" width="480" />
  <img src="./Github-Stats/user-stats/stats.svg" alt="GitHub Stats" width="480" />
</p>
<p align="center">
  <img src="./Github-Stats/user-stats/languages.svg" alt="Top Languages" width="480" />
</p>

### Key Highlights:
- **🎮 RPG Character Sheet**: Determines your character class (*TypeScript Spellblade, Async Warlock, Data Necromancer, etc.*), computes your Level & XP, and scores your STR, INT, DEX, CHA, and STA attributes!
- **💰 Account Valuation Engine**: Evaluates commit volume, repository architecture, star equity, and consistency multipliers into an estimated commercial dev net worth (*e.g. $85,500 - Principal / Staff Architect Tier*).
- **100% Zero Downtime**: Served directly by GitHub's CDN via GitHub Actions.
- **Timezone Accurate**: Calculates streaks in your exact timezone (`Asia/Kolkata`, `UTC`, `America/New_York`, etc.).
- **Grace Day Support**: `--grace-days 1` allows your streak to survive accidental 1-day gaps, travel, or private commit delays.
- **10+ Themes**: `github-dark`, `tokyonight`, `dracula`, `nord`, `cyberpunk`, `radical`, `catppuccin`, and more.

👉 **[Read full GitHub-Stats documentation & setup guide →](./Github-Stats/README.md)**

---

### 🛡️ Quick Start: How to use the GitHub Action in your own profile

In your profile repository, create `.github/workflows/update-stats.yml`:

```yaml
name: Update Profile Stats & RPG Cards

on:
  schedule:
    - cron: '0 */6 * * *' # Automatically runs every 6 hours
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-stats:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Uses the action from this monorepo!
      - uses: 13507-IN/Github-Trash/Github-Stats@main
        with:
          username: ${{ github.repository_owner }}
          timezone: Asia/Kolkata
          grace_days: 1
          theme: github-dark
          output: ./stats
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Commit and Push
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add stats/
          git commit -m "Update profile cards [skip ci]" || exit 0
          git push
```

And in your `README.md`:
```markdown
<p align="center">
  <img src="./stats/rpg.svg" alt="Developer RPG Sheet" width="480" />
  <img src="./stats/worth.svg" alt="GitHub Account Valuation" width="480" />
</p>
<p align="center">
  <img src="./stats/streak.svg" alt="GitHub Streak" width="480" />
  <img src="./stats/stats.svg" alt="GitHub Stats" width="480" />
</p>
```

---

## 📄 License

MIT License © 2024 [Rishiraj Debnath (@13507-IN)](https://github.com/13507-IN).
Built with passion for the developer community.
