import i18n from './i18n/i18n.js';
import { initThemeSystem } from './utils/themeUtils.js';
import MainLayout from './layouts/MainLayout.js';

// Carregar traduções
async function loadTranslations() {
  try {
    const [ptResponse, enResponse] = await Promise.all([
      fetch('./src/i18n/pt.json'),
      fetch('./src/i18n/en.json')
    ]);
    const ptTranslations = await ptResponse.json();
    const enTranslations = await enResponse.json();
    
    i18n.loadLanguage('pt', ptTranslations);
    i18n.loadLanguage('en', enTranslations);
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// Inicializar tema
initThemeSystem();

export async function initMozChop(options = {}) {
  // Carregar traduções primeiro
  await loadTranslations();
  
  const defaultOptions = {
    sidebarItems: [
      { id: 'backgroundRemover', label: 'sidebar.backgroundRemover', icon: 'backgroundRemover', href: '#/background-remover' }
    ],
    topbarOptions: {
      showSearch: false,
      userName: 'Utilizador'
    },
    contentAreaOptions: {
      showBreadcrumbs: false
    }
  };

  const finalOptions = { ...defaultOptions, ...options };

  const layout = new MainLayout(finalOptions);
  layout.render();

  return {
    layout: {
      sidebar: layout.sidebar,
      topbar: layout.topbar,
      contentArea: layout.contentArea
    },
    i18n,
    themeManager: null // Será inicializado pelo themeUtils
  };
}

// Inicializar automaticamente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
  const app = await initMozChop();
  
  // Carregar página inicial (BackgroundRemover)
  const { default: BackgroundRemover } = await import('./pages/BackgroundRemover/BackgroundRemover.js');
  const page = new BackgroundRemover();
  page.render(app.layout.contentArea);
});

