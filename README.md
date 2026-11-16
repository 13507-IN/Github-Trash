# 🚀 GitHub Suite (by [@13507-IN](https://github.com/13507-IN))

> A curated collection of high-performance tools, cards, widgets, and utilities to boost your GitHub experience and supercharge your Profile README.

---

## 📦 Products in this Repository

| Product | Folder | Description | Status |
| :--- | :--- | :--- | :--- |
| **⚡ GitHub Stats & Streak Cards** | [`/Github-Stats`](./Github-Stats) | Timezone-accurate, 100% zero-downtime streak and stats cards for your profile README. | ✅ **Active & Ready** |
| **🖼️ GitHub Images** | [`/Github-Images`](./Github-Images) | Dynamic banners, custom badges, headers, and visual assets for GitHub profiles. | 🚧 *In Development* |

---

## ⚡ 1. GitHub Stats & Streak Cards

A rock-solid replacement for buggy third-party stats services. Solves the dropped streak bug and broken image icon problem forever.

<p align="center">
  <img src="./Github-Stats/sample-output/streak-github-dark.svg" alt="GitHub Streak" width="480" />
</p>
<p align="center">
  <img src="./Github-Stats/sample-output/stats-github-dark.svg" alt="GitHub Stats" width="480" />
  <img src="./Github-Stats/sample-output/languages-github-dark.svg" alt="Top Languages" width="480" />
</p>

### Key Highlights:
- **100% Zero Downtime**: Served directly by GitHub's CDN via GitHub Actions.
- **Timezone Accurate**: Calculates streaks in your exact timezone (`Asia/Kolkata`, `UTC`, `America/New_York`, etc.).
- **Grace Day Support**: `--grace-days 1` allows your streak to survive accidental 1-day gaps, travel, or private commit delays.
- **10+ Themes**: `github-dark`, `tokyonight`, `dracula`, `nord`, `cyberpunk`, `radical`, `catppuccin`, and more.
- **Dual-Mode**: Use it as a GitHub Action or run the Express Web API server with an interactive live playground.

👉 **[Read full GitHub-Stats documentation & setup guide →](./Github-Stats/README.md)**

---

### 🛡️ Quick Start: How to use the GitHub Action in your own profile

In your profile repository, create `.github/workflows/update-stats.yml`:

```yaml
name: Update Profile Stats

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
          theme: github-dark
          grace_days: 1
          output: ./stats
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Commit and Push
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add stats/
          git commit -m "Update profile stats [skip ci]" || exit 0
          git push
```

---

## 🖼️ 2. GitHub Images

Dynamic header banners, custom SVG widgets, and badges designed to give developer profiles an unfair aesthetic advantage.

👉 **[Explore GitHub-Images →](./Github-Images/README.md)**

---

## 📄 License

MIT License © 2024 [Rishiraj Debnath (@13507-IN)](https://github.com/13507-IN).
Built with passion for the developer community.
