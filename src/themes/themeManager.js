class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.listeners = [];
  }

  init() {
    const savedTheme = localStorage.getItem('theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    this.currentTheme = savedTheme || systemPreference;
    this.applyTheme(this.currentTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  applyTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      theme = 'light';
    }

    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.notifyListeners();
  }

  toggleTheme() {
    this.applyTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  getTheme() {
    return this.currentTheme;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentTheme));
  }
}

const themeManager = new ThemeManager();

export default themeManager;



