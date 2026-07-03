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
    themeManager: null // Será inicializado pelo themeUtils
  };
}

// Configurar Clerk
async function initClerkAuth() {
  if (sessionStorage.getItem('mock_clerk_auth') === 'true') {
    // Simular que Clerk está ativo e o user tem sessão se fallback ocorreu
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
    // Redirecionar para login
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

// Inicializar automaticamente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
  const isAuth = await initClerkAuth();
  if (!isAuth) return;

  const app = await initMozChop();
  
  // Montar Clerk User Button apenas se foi carregado corretamente (nao mock)
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
    } else if (hash === '#/bulk-resizer' || hash === '#/format-converter') {
      const isPremium = window.Clerk && window.Clerk.user && window.Clerk.user.publicMetadata && window.Clerk.user.publicMetadata.isPremium === true;
      
      if (!isPremium) {
        // Mostrar Modal de Pagamento em vez de carregar a ferramenta
        const { default: PaymentModal } = await import('./components/PaymentModal/PaymentModal.js');
        const paymentModal = new PaymentModal();
        paymentModal.show(() => {
          // Callback de sucesso da simulação de pagamento
          if (window.Clerk && window.Clerk.user) {
            if (!window.Clerk.user.publicMetadata) window.Clerk.user.publicMetadata = {};
            window.Clerk.user.publicMetadata.isPremium = true;
            
            // Mostrar Badge PRO no Topbar dinamicamente
            if (!document.querySelector('.topbar-pro-badge')) {
              const userBtn = document.getElementById('clerk-user-button');
              if (userBtn) userBtn.insertAdjacentHTML('afterend', '<div class="topbar-pro-badge">PRO</div>');
            }
          }
          // Recarregar a rota agora que tem acesso
          handleRoute();
        });
        
        // Voltar para background remover se cancelarem ou fechar (handled on modal, but keep current view)
        return;
      }
      
      if (hash === '#/bulk-resizer') {
        const module = await import('./pages/BulkResizer/BulkResizer.js');
        PageClass = module.default;
      } else {
        const module = await import('./pages/FormatConverter/FormatConverter.js');
        PageClass = module.default;
      }
    }
    
    if (PageClass) {
      // Limpar área de conteúdo antes de renderizar (opcional dependendo da implementação do contentArea)
      const page = new PageClass();
      page.render(app.layout.contentArea);
    }
    
    // Atualizar sidebar active state
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === hash) {
        item.classList.add('active');
      }
    });
  };

  window.addEventListener('hashchange', handleRoute);
  
  // Rota inicial
  handleRoute();
});
