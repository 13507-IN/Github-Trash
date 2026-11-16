import { ThemeColors } from '../types.js';

export const themes: Record<string, ThemeColors> = {
  'github-dark': {
    background: '#0d1117',
    cardBorder: '#30363d',
    titleColor: '#58a6ff',
    textColor: '#c9d1d9',
    subtextColor: '#8b949e',
    accentColor: '#238636',
    streakFireColor: '#f78166',
    highlightColor: '#f0883e',
    ringColor: '#388bfd',
    progressBarBg: '#21262d'
  },
  'tokyonight': {
    background: '#1a1b26',
    cardBorder: '#24283b',
    titleColor: '#7aa2f7',
    textColor: '#a9b1d6',
    subtextColor: '#565f89',
    accentColor: '#bb9af7',
    streakFireColor: '#f7768e',
    highlightColor: '#e0af68',
    ringColor: '#7aa2f7',
    progressBarBg: '#24283b'
  },
  'dracula': {
    background: '#282a36',
    cardBorder: '#44475a',
    titleColor: '#ff79c6',
    textColor: '#f8f8f2',
    subtextColor: '#6272a4',
    accentColor: '#bd93f9',
    streakFireColor: '#ff5555',
    highlightColor: '#f1fa8c',
    ringColor: '#8be9fd',
    progressBarBg: '#44475a'
  },
  'nord': {
    background: '#2e3440',
    cardBorder: '#434c5e',
    titleColor: '#88c0d0',
    textColor: '#eceff4',
    subtextColor: '#7b88a1',
    accentColor: '#81a1c1',
    streakFireColor: '#bf616a',
    highlightColor: '#ebcb8b',
    ringColor: '#8fbcbb',
    progressBarBg: '#3b4252'
  },
  'cyberpunk': {
    background: '#0b0c10',
    cardBorder: '#1f2833',
    titleColor: '#ffe600',
    textColor: '#e0e6ed',
    subtextColor: '#66fcf1',
    accentColor: '#45a29e',
    streakFireColor: '#ff003c',
    highlightColor: '#00e5ff',
    ringColor: '#ffe600',
    progressBarBg: '#1f2833'
  },
  'radical': {
    background: '#141321',
    cardBorder: '#29283e',
    titleColor: '#fe428e',
    textColor: '#a9fef7',
    subtextColor: '#a0a3c2',
    accentColor: '#f8d847',
    streakFireColor: '#fe428e',
    highlightColor: '#30c48d',
    ringColor: '#fe428e',
    progressBarBg: '#29283e'
  },
  'catppuccin': {
    background: '#1e1e2e',
    cardBorder: '#313244',
    titleColor: '#cba6f7',
    textColor: '#cdd6f4',
    subtextColor: '#a6adc8',
    accentColor: '#89b4fa',
    streakFireColor: '#f38ba8',
    highlightColor: '#fab387',
    ringColor: '#94e2d5',
    progressBarBg: '#313244'
  },
  'one-dark': {
    background: '#282c34',
    cardBorder: '#3e4451',
    titleColor: '#61afef',
    textColor: '#abb2bf',
    subtextColor: '#5c6370',
    accentColor: '#98c379',
    streakFireColor: '#e06c75',
    highlightColor: '#e5c07b',
    ringColor: '#61afef',
    progressBarBg: '#3e4451'
  },
  'github-light': {
    background: '#ffffff',
    cardBorder: '#d0d7de',
    titleColor: '#0969da',
    textColor: '#1f2328',
    subtextColor: '#656d76',
    accentColor: '#1a7f37',
    streakFireColor: '#cf222e',
    highlightColor: '#9a6700',
    ringColor: '#0969da',
    progressBarBg: '#eaeef2'
  },
  'high-contrast': {
    background: '#000000',
    cardBorder: '#ffffff',
    titleColor: '#00ffff',
    textColor: '#ffffff',
    subtextColor: '#bbbbbb',
    accentColor: '#00ff66',
    streakFireColor: '#ff3333',
    highlightColor: '#ffff00',
    ringColor: '#00ffff',
    progressBarBg: '#333333'
  }
};

export function getTheme(themeName?: string, overrides: Partial<ThemeColors> = {}): ThemeColors {
  const base = themes[themeName || 'github-dark'] || themes['github-dark'];
  return {
    background: overrides.background || base.background,
    cardBorder: overrides.cardBorder || base.cardBorder,
    titleColor: overrides.titleColor || base.titleColor,
    textColor: overrides.textColor || base.textColor,
    subtextColor: overrides.subtextColor || base.subtextColor,
    accentColor: overrides.accentColor || base.accentColor,
    streakFireColor: overrides.streakFireColor || base.streakFireColor,
    highlightColor: overrides.highlightColor || base.highlightColor,
    ringColor: overrides.ringColor || base.ringColor,
    progressBarBg: overrides.progressBarBg || base.progressBarBg
  };
}
