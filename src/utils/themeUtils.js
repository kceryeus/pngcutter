import themeManager from '../themes/themeManager.js';

export const toggleDarkMode = () => {
  themeManager.toggleTheme();
};

export const setTheme = (theme) => {
  themeManager.applyTheme(theme);
};

export const getCurrentTheme = () => {
  return themeManager.getTheme();
};

export const isDarkMode = () => {
  return themeManager.getTheme() === 'dark';
};

export const applyTheme = (theme) => {
  themeManager.applyTheme(theme);
};

export const initThemeSystem = () => {
  themeManager.init();
};

export const onThemeChange = (callback) => {
  return themeManager.subscribe(callback);
};

export { themeManager };

export const getThemeColor = (colorKey) => {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(`--${colorKey}`).trim();
};

export const addThemeClass = (element, className) => {
  element.classList.add(className);
};

export const removeThemeClass = (element, className) => {
  element.classList.remove(className);
};

export const hasThemeClass = (element, className) => {
  return element.classList.contains(className);
};

export const respectSystemPreferences = () => {
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if (!localStorage.getItem('theme')) {
    themeManager.applyTheme(systemPreference);
  }
};

