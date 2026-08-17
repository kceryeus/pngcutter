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
  await loadTranslations();
  
  const defaultOptions = {
    sidebarItems: [
      { id: 'backgroundRemover', label: 'sidebar.backgroundRemover', icon: 'backgroundRemover', href: '#/background-remover' },
      { id: 'bulkResizer', label: 'sidebar.bulkResizer', icon: 'dashboard', href: '#/bulk-resizer' },
      { id: 'formatConverter', label: 'sidebar.formatConverter', icon: 'settings', href: '#/format-converter' }
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
    themeManager: null
  };
}

async function initClerkAuth() {
  if (sessionStorage.getItem('mock_clerk_auth') === 'true') {
    window.Clerk = window.Clerk || {};
    window.Clerk.user = window.Clerk.user || { publicMetadata: {} };
    return true;
  }

  let retries = 0;
  while (!window.Clerk && retries < 20) {
    await new Promise(r => setTimeout(r, 100));
    retries++;
  }
  
  let isLoaded = false;
  if (window.Clerk) {
    try {
      await window.Clerk.load();
      isLoaded = true;
    } catch (e) {
      console.warn('Clerk falhou ao carregar', e);
    }
  }
  
  if (!isLoaded || (!window.Clerk || !window.Clerk.user)) {
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

document.addEventListener('DOMContentLoaded', async () => {
  const isAuth = await initClerkAuth();
  if (!isAuth) return;

  const app = await initMozChop();
  
  const userBtnContainer = document.getElementById('clerk-user-button');
  if (userBtnContainer && window.Clerk && window.Clerk.mountUserButton && typeof window.Clerk.mountUserButton === 'function') {
    window.Clerk.mountUserButton(userBtnContainer);
  }
  
  const handleRoute = async () => {
    const hash = window.location.hash || '#/background-remover';
    let PageClass;
    
    if (hash === '#/background-remover') {
      const module = await import('./pages/BackgroundRemover/BackgroundRemover.js');
      PageClass = module.default;
    } else if (hash === '#/bulk-resizer') {
      const module = await import('./pages/BulkResizer/BulkResizer.js');
      PageClass = module.default;
    } else if (hash === '#/format-converter') {
      const module = await import('./pages/FormatConverter/FormatConverter.js');
      PageClass = module.default;
    }
    
    if (PageClass) {
      const page = new PageClass();
      page.render(app.layout.contentArea);
    }
    
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === hash) {
        item.classList.add('active');
      }
    });
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
});
