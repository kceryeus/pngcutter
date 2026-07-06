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
      { id: 'bulkResizer', label: 'sidebar.bulkResizer', icon: 'dashboard', href: '#/bulk-resizer', isPro: true },
      { id: 'formatConverter', label: 'sidebar.formatConverter', icon: 'settings', href: '#/format-converter', isPro: true }
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

  // Verificar se há redirecionamento de pagamento do PaySuite
  const urlParams = new URLSearchParams(window.location.search);
  let paymentId = urlParams.get('payment_id');
  
  if (!paymentId) {
    paymentId = localStorage.getItem('pending_payment_id');
    if (paymentId) {
      localStorage.removeItem('pending_payment_id');
    }
  }
  
  // Verificar se já é PRO, se sim limpar URL e localStorage e não mostrar modal
  const { default: premiumManager } = await import('./utils/premium.js');
  const isPremium = ((window.Clerk && window.Clerk.user && window.Clerk.user.publicMetadata && window.Clerk.user.publicMetadata.isPremium === true) || premiumManager.checkPremium());

  if (isPremium && paymentId) {
    if (window.history.replaceState) {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
    }
    paymentId = null;
  }

  if (paymentId) {
    const { default: Modal } = await import('./components/Modal/Modal.js');
    
    const loadingModal = new Modal({
      type: 'info',
      title: 'Verificação de Pagamento',
      message: 'A verificar o seu pagamento... Por favor, aguarde.',
      showCancel: false,
      confirmText: 'Verificando...'
    });
    loadingModal.show();

    let attempts = 0;
    const maxAttempts = 6; // ~12 segundos de tempo de tolerância

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/verify-payment?id=${paymentId}`);
        const result = await response.json();
        
        if (result.status === 'success' && result.paid === true) {
          const { default: premiumManager } = await import('./utils/premium.js');
          premiumManager.setPremium(true);
          
          if (window.Clerk && window.Clerk.user) {
            if (!window.Clerk.user.publicMetadata) window.Clerk.user.publicMetadata = {};
            window.Clerk.user.publicMetadata.isPremium = true;
          }
          
          loadingModal.close();
          
          const successModal = new Modal({
            type: 'success',
            title: 'Pagamento Confirmado',
            message: 'O seu acesso PRO foi ativado com sucesso. Aproveite todas as funcionalidades premium!',
            showCancel: false,
            confirmText: 'Começar',
            onConfirm: () => {
              // Limpar URL e recarregar a app sem o parâmetro
              window.location.href = window.location.pathname + window.location.hash;
            }
          });
          successModal.show();
          return true;
        }
      } catch (err) {
        console.error('Erro na tentativa de verificação:', err);
      }
      return false;
    };

    const runVerificationLoop = async () => {
      while (attempts < maxAttempts) {
        attempts++;
        const verified = await checkPaymentStatus();
        if (verified) return;
        
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      // Se falhar após todas as tentativas
      loadingModal.close();
      
      const errorModal = new Modal({
        type: 'danger',
        title: 'Verificação Pendente',
        message: 'Não foi possível confirmar o pagamento ou o mesmo ainda está pendente. Por favor, certifique-se de que concluiu a transação no telemóvel.',
        showCancel: false,
        confirmText: 'OK',
        onConfirm: () => {
          window.location.href = 'app.html';
        }
      });
      errorModal.show();
    };

    runVerificationLoop();
    return;
  }

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
      const { default: premiumManager } = await import('./utils/premium.js');
      const isPremium = ((window.Clerk && window.Clerk.user && window.Clerk.user.publicMetadata && window.Clerk.user.publicMetadata.isPremium === true) || premiumManager.checkPremium());
      
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
