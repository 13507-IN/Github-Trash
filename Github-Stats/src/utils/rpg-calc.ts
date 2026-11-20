import { UserStatsData, StreakData, LanguagesData, RPGData } from '../types.js';

export function calculateRPG(
  stats: UserStatsData,
  streak: StreakData,
  langs: LanguagesData
): RPGData {
  const topLang = langs.languages[0]?.name || 'Code';

  // 1. Determine Character Class
  let characterClass = 'Code Sorcerer';
  let weapon = 'Enchanted Mechanical Keyboard';

  switch (topLang.toLowerCase()) {
    case 'typescript':
      characterClass = 'TypeScript Spellblade';
      weapon = 'Staff of Strict Types';
      break;
    case 'javascript':
      characterClass = 'Async Warlock';
      weapon = 'Event-Loop Scythe';
      break;
    case 'python':
      characterClass = 'Data Necromancer';
      weapon = 'Serpent Tome of PyTorch';
      break;
    case 'rust':
      characterClass = 'Memory Paladin';
      weapon = 'Borrow-Checker Greatsword';
      break;
    case 'c++':
    case 'c':
      characterClass = 'Kernel Berserker';
      weapon = 'Raw Pointer of Chaos';
      break;
    case 'go':
      characterClass = 'Concurrency Shaman';
      weapon = 'Goroutine Twin-Daggers';
      break;
    case 'html':
    case 'css':
      characterClass = 'Pixel Enchanter';
      weapon = 'Prismatic CSS Wand';
      break;
    case 'java':
      characterClass = 'Enterprise Templar';
      weapon = 'Hammer of FactoryBeans';
      break;
    case 'php':
      characterClass = 'Web Alchemist';
      weapon = 'Lamp-Stack Morningstar';
      break;
    default:
      characterClass = `${topLang} Battlemage`;
      weapon = 'Code-Forged Claymore';
      break;
  }

  // 2. Calculate Level & XP
  const totalPoints = Math.round(
    stats.totalCommits * 1.5 +
    stats.contributedTo * 10 +
    stats.totalStars * 20 +
    stats.totalPRs * 8 +
    streak.currentStreak * 12 +
    streak.longestStreak * 5
  );

  // Level curve: Lv 1 -> ~50 pts, Lv 30 -> ~7,200 pts, Lv 99 -> ~78,000 pts
  const level = Math.max(1, Math.min(99, Math.floor(Math.sqrt(totalPoints / 8))));

  const prevThreshold = Math.pow(level, 2) * 8;
  const nextThreshold = Math.pow(level + 1, 2) * 8;
  const xpCurrent = Math.max(0, totalPoints - prevThreshold);
  const xpNeeded = Math.max(1, nextThreshold - prevThreshold);
  const xpPct = Math.min(100, Math.round((xpCurrent / xpNeeded) * 100));

  // 3. Determine Title
  let title = 'Apprentice Hacker';
  if (level >= 80) title = 'Mythic Code Grandmaster';
  else if (level >= 60) title = 'High Architect of the Realm';
  else if (level >= 45) title = 'Veteran Dungeon Debugger';
  else if (level >= 30) title = 'Senior Sorcerer of Systems';
  else if (level >= 15) title = 'Battle-Tested Developer';

  // 4. Calculate RPG Stats (STR, INT, DEX, CHA, STA) [15 - 99 scale]
  const clamp = (v: number) => Math.max(15, Math.min(99, Math.round(v)));

  const str = clamp(20 + Math.sqrt(stats.totalCommits) * 1.8);
  const int = clamp(25 + langs.languages.length * 8 + (topLang === 'Rust' || topLang === 'C++' ? 12 : 5));
  const dex = clamp(20 + (stats.totalPRs * 4 + stats.totalIssues * 3));
  const cha = clamp(15 + Math.sqrt(stats.totalStars) * 14 + Math.min(30, stats.contributedTo * 0.8));
  const sta = clamp(20 + streak.currentStreak * 2 + streak.longestStreak * 0.8);

  // 5. Passive Perk
  let passivePerk = '\u{1F6E1}\u{FE0F} Guardian of Commits (+10% resilience)';
  if (streak.currentStreak >= 20 || streak.longestStreak >= 30) {
    passivePerk = '\u{1F525} Unyielding Flame (Immune to burnout & streak resets)';
  } else if (langs.languages.length >= 4) {
    passivePerk = '\u{1F52E} Polyglot Aura (+25% speed learning new frameworks)';
  } else if (stats.totalStars >= 50) {
    passivePerk = '\u{1F451} Open-Source Royalty (+30% community reverence)';
  } else if (stats.totalCommits >= 1000) {
    passivePerk = '\u{26A1} Endless Mana (Generates high-velocity code)';
  }

  return {
    characterClass,
    title,
    level,
    xp: {
      current: xpCurrent,
      next: xpNeeded,
      percentage: xpPct
    },
    stats: {
      str,
      int,
      dex,
      cha,
      sta
    },
    weapon,
    passivePerk
  };
}
