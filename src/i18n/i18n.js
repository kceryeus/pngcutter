class I18n {
  constructor() {
    this.currentLanguage = 'pt';
    this.translations = {};
    this.listeners = [];
  }

  loadLanguage(lang, translations) {
    this.translations[lang] = translations;
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      this.notifyListeners();
    }
  }

  t(key, params = {}) {
    const translation = this.translations[this.currentLanguage]?.[key] || key;
    
    if (Object.keys(params).length === 0) {
      return translation;
    }

    return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

const i18n = new I18n();

export default i18n;



