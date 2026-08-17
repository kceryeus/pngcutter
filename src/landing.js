import { getIcon } from './utils/icons.js';
import Modal from './components/Modal/Modal.js';
import { legalTexts } from './utils/legalTexts.js';

// Traduções simples para a landing page
const translations = {
  pt: {
    title: 'PNG Cutter',
    tagline: 'Format Convert & Resize',
    subtitle: 'Conversão de formatos, redimensionamento em lote e remoção de fundo com alta velocidade e precisão.',
    getStarted: 'Começar Agora',
    features: {
      title: 'Funcionalidades',
      subtitle: 'Tudo o que precisa para remover backgrounds de imagens',
      autoRemoval: {
        title: 'Remoção Automática',
        description: 'Algoritmo inteligente que remove o background automaticamente sem necessidade de configuração'
      },
      pngExport: {
        title: 'Exportação PNG',
        description: 'Descarregue a sua imagem processada em formato PNG com transparência preservada'
      },
      modernUI: {
        title: 'Interface Moderna',
        description: 'Design limpo e intuitivo que torna o processo simples e agradável'
      },
      darkMode: {
        title: 'Dark Mode',
        description: 'Suporte completo a temas claro e escuro para o seu conforto visual'
      },
      multiLanguage: {
        title: 'Multi-idioma',
        description: 'Disponível em Português e Inglês para uma experiência personalizada'
      },
      responsive: {
        title: 'Totalmente Responsivo',
        description: 'Funciona perfeitamente em desktop, tablet e dispositivos móveis'
      }
    },
    howItWorks: {
      title: 'Como Funciona',
      subtitle: 'Três passos simples para remover o background das suas imagens',
      step1: {
        title: 'Carregue a Imagem',
        description: 'Arraste e solte ou clique para selecionar a imagem que deseja processar'
      },
      step2: {
        title: 'Processamento Automático',
        description: 'O nosso algoritmo detecta e remove o background automaticamente'
      },
      step3: {
        title: 'Descarregue o Resultado',
        description: 'Descarregue a sua imagem em PNG com background removido'
      }
    },
    cta: {
      title: 'Pronto para começar?',
      subtitle: 'Experimente agora e remova o background das suas imagens em segundos',
      button: 'Começar Agora'
    },
    topbar: {
      home: 'Início',
      features: 'Funcionalidades',
      howItWorks: 'Como Funciona',
      getStarted: 'Começar Agora',
      openMenu: 'Abrir menu',
      closeMenu: 'Fechar menu'
    },
    footer: {
      rights: '© 2026 PNG Cutter. Todos os direitos reservados.',
      madeWith: 'Feito com',
      by: 'por',
      links: {
        about: 'Sobre',
        features: 'Funcionalidades',
        contact: 'Contacto',
        terms: 'Termos de Uso',
        privacy: 'Política de Privacidade'
      }
    }
  },
  en: {
    title: 'PNG Cutter',
    tagline: 'Format Convert & Resize',
    subtitle: 'Fast and precise format conversion, bulk resizing, and background removal.',
    getStarted: 'Get Started',
    features: {
      title: 'Features',
      subtitle: 'Everything you need to remove image backgrounds',
      autoRemoval: {
        title: 'Automatic Removal',
        description: 'Smart algorithm that automatically removes backgrounds without any configuration needed'
      },
      pngExport: {
        title: 'PNG Export',
        description: 'Download your processed image in PNG format with transparency preserved'
      },
      modernUI: {
        title: 'Modern Interface',
        description: 'Clean and intuitive design that makes the process simple and enjoyable'
      },
      darkMode: {
        title: 'Dark Mode',
        description: 'Full support for light and dark themes for your visual comfort'
      },
      multiLanguage: {
        title: 'Multi-language',
        description: 'Available in Portuguese and English for a personalized experience'
      },
      responsive: {
        title: 'Fully Responsive',
        description: 'Works perfectly on desktop, tablet and mobile devices'
      }
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Three simple steps to remove backgrounds from your images',
      step1: {
        title: 'Upload Image',
        description: 'Drag and drop or click to select the image you want to process'
      },
      step2: {
        title: 'Automatic Processing',
        description: 'Our algorithm detects and removes the background automatically'
      },
      step3: {
        title: 'Download Result',
        description: 'Download your image in PNG format with background removed'
      }
    },
    cta: {
      title: 'Ready to get started?',
      subtitle: 'Try it now and remove backgrounds from your images in seconds',
      button: 'Get Started'
    },
    topbar: {
      home: 'Home',
      features: 'Features',
      howItWorks: 'How It Works',
      getStarted: 'Get Started',
      openMenu: 'Open menu',
      closeMenu: 'Close menu'
    },
    footer: {
      rights: '© 2026 PNG Cutter. All rights reserved.',
      madeWith: 'Made with',
      by: 'by',
      links: {
        about: 'About',
        features: 'Features',
        contact: 'Contact',
        terms: 'Terms of Use',
        privacy: 'Privacy Policy'
      }
    }
  }
};

// Gerenciar idioma
let currentLanguage = 'pt'; // Padrão português

function getLanguage() {
  // Verificar se há idioma salvo no localStorage
  const savedLang = localStorage.getItem('pngcutter-language');
  if (savedLang && (savedLang === 'pt' || savedLang === 'en')) {
    return savedLang;
  }
  
  // Detectar idioma do navegador
  const lang = navigator.language || navigator.userLanguage;
  return lang.startsWith('pt') ? 'pt' : 'en';
}

function setLanguage(lang) {
  if (lang === 'pt' || lang === 'en') {
    currentLanguage = lang;
    localStorage.setItem('pngcutter-language', lang);
    renderLanding();
  }
}

// Inicializar idioma ao carregar
currentLanguage = getLanguage();

// Obter tradução
function getTranslation(key, lang) {
  const keys = key.split('.');
  let value = translations[lang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}

// Renderizar landing page
function renderLanding() {
  const lang = currentLanguage;
  const t = (key) => getTranslation(key, lang);
  
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="landing-background"></div>
    <nav class="landing-topbar">
      <div class="landing-topbar-content">
        <a href="index.html" class="landing-logo">
          <img src="src/assets/logo.png" alt="PNG Cutter – Format Convert & Resize" style="width: 32px; height: 32px; object-fit: contain;">
          <span>PNG Cutter</span>
        </a>
        <div class="landing-nav-links landing-nav-desktop">
          <a href="#home">${t('topbar.home')}</a>
          <a href="#features" class="nav-link">${t('topbar.features')}</a>
          <a href="#how-it-works" class="nav-link">${t('topbar.howItWorks')}</a>
          <div class="language-selector">
            <button class="lang-btn ${lang === 'pt' ? 'active' : ''}" data-lang="pt" aria-label="Português">PT</button>
            <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en" aria-label="English">EN</button>
          </div>
          <a href="app.html" class="nav-link nav-cta">${t('topbar.getStarted')}</a>
        </div>
        <div class="landing-topbar-mobile">
          <div class="language-selector landing-lang-compact">
            <button class="lang-btn ${lang === 'pt' ? 'active' : ''}" data-lang="pt" aria-label="Português">PT</button>
            <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en" aria-label="English">EN</button>
          </div>
          <button class="landing-menu-toggle" aria-label="${t('topbar.openMenu')}" aria-expanded="false">
            ${getIcon('menu')}
          </button>
        </div>
      </div>
      <div class="landing-mobile-nav" aria-hidden="true">
        <a href="#home" class="landing-mobile-nav-link">${t('topbar.home')}</a>
        <a href="#features" class="landing-mobile-nav-link">${t('topbar.features')}</a>
        <a href="#how-it-works" class="landing-mobile-nav-link">${t('topbar.howItWorks')}</a>
        <a href="app.html" class="landing-mobile-nav-link landing-mobile-nav-cta">${t('topbar.getStarted')}</a>
      </div>
    </nav>
    <div class="landing-nav-overlay" aria-hidden="true"></div>
    
    <div class="landing-page">
      <div class="landing-hero" id="home">
        <div class="landing-hero-content">
          <img src="src/assets/logo.png" alt="PNG Cutter" class="landing-logo-large">
          <h1 class="landing-title">${t('title')}</h1>
          <div class="landing-brand-badge">${t('tagline')}</div>
          <p class="landing-subtitle">${t('subtitle')}</p>
          <a href="app.html" class="landing-cta-button">${t('getStarted')}</a>
        </div>
      </div>

      <div class="landing-features" id="features">
        <div class="landing-section-header">
          <h2>${t('features.title')}</h2>
          <p>${t('features.subtitle')}</p>
        </div>

        <div class="landing-features-grid">
          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('camera')}</div>
            <h3>${t('features.autoRemoval.title')}</h3>
            <p>${t('features.autoRemoval.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('success')}</div>
            <h3>${t('features.pngExport.title')}</h3>
            <p>${t('features.pngExport.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('theme')}</div>
            <h3>${t('features.modernUI.title')}</h3>
            <p>${t('features.modernUI.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('themeDark')}</div>
            <h3>${t('features.darkMode.title')}</h3>
            <p>${t('features.darkMode.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('help')}</div>
            <h3>${t('features.multiLanguage.title')}</h3>
            <p>${t('features.multiLanguage.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('dashboard')}</div>
            <h3>${t('features.responsive.title')}</h3>
            <p>${t('features.responsive.description')}</p>
          </div>
        </div>
      </div>

      <div class="landing-how-it-works" id="how-it-works">
        <div class="landing-section-header">
          <h2>${t('howItWorks.title')}</h2>
          <p>${t('howItWorks.subtitle')}</p>
        </div>

        <div class="landing-steps">
          <div class="landing-step">
            <div class="step-number">1</div>
            <h3>${t('howItWorks.step1.title')}</h3>
            <p>${t('howItWorks.step1.description')}</p>
          </div>

          <div class="landing-step">
            <div class="step-number">2</div>
            <h3>${t('howItWorks.step2.title')}</h3>
            <p>${t('howItWorks.step2.description')}</p>
          </div>

          <div class="landing-step">
            <div class="step-number">3</div>
            <h3>${t('howItWorks.step3.title')}</h3>
            <p>${t('howItWorks.step3.description')}</p>
          </div>
        </div>
      </div>

      <div class="landing-cta">
        <div class="landing-cta-content">
          <h2>${t('cta.title')}</h2>
          <p>${t('cta.subtitle')}</p>
          <a href="app.html" class="landing-cta-button">${t('cta.button')}</a>
        </div>
      </div>
    </div>
    
    <footer class="landing-footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <img src="src/assets/logo.png" alt="PNG Cutter – Format Convert & Resize" style="width: 24px; height: 24px; object-fit: contain;">
            <span>PNG Cutter</span>
          </div>
          <p class="footer-tagline">${t('subtitle')}</p>
        </div>
        
        <div class="footer-section">
          <h4>Links Rápidos</h4>
          <ul class="footer-links">
            <li><a href="#home">${t('footer.links.about')}</a></li>
            <li><a href="#features">${t('footer.links.features')}</a></li>
            <li><a href="#how-it-works">${t('topbar.howItWorks')}</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Legal</h4>
          <ul class="footer-links">
            <li><a href="#" id="open-terms-link">${t('footer.links.terms')}</a></li>
            <li><a href="#" id="open-privacy-link">${t('footer.links.privacy')}</a></li>
          </ul>
        </div>
        
        <!-- Redes Sociais (Comentado temporariamente)
        <div class="footer-section">
          <h4>Redes Sociais</h4>
          <div class="footer-social">
            <a href="#" aria-label="Facebook" class="social-link">${getIcon('facebook')}</a>
            <a href="#" aria-label="Twitter" class="social-link">${getIcon('twitter')}</a>
            <a href="#" aria-label="Instagram" class="social-link">${getIcon('instagram')}</a>
            <a href="#" aria-label="LinkedIn" class="social-link">${getIcon('linkedin')}</a>
            <a href="#" aria-label="GitHub" class="social-link">${getIcon('github')}</a>
          </div>
        </div>
        -->
      </div>
      
      <div class="footer-bottom">
        <p>${t('footer.rights')}</p>
      </div>
    </footer>
  `;
  
  // Adicionar navegação suave
  attachSmoothScroll();
  
  // Adicionar eventos de troca de idioma
  attachLanguageSwitcher();

  // Menu mobile
  attachMobileMenu();

  // Adicionar eventos dos modais de Termos e Privacidade
  attachLegalModals();

  // Configurar autenticação Clerk
  setupClerkAuth();
}

async function setupClerkAuth() {
  // Esperar o Clerk carregar
  let retries = 0;
  while (!window.Clerk && retries < 20) {
    await new Promise(r => setTimeout(r, 100));
    retries++;
  }
  
  let isClerkLoaded = false;
  if (window.Clerk) {
    try {
      await window.Clerk.load();
      isClerkLoaded = true;
    } catch (e) {
      console.warn('Clerk falhou ao carregar, fallback offline ativado', e);
    }
  }

  // Configurar autenticação e navegação para app.html
  const appLinks = document.querySelectorAll('a[href="app.html"]');
  appLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (isClerkLoaded && window.Clerk && window.Clerk.user) {
        // Já tem sessão, redirecionar normal
        window.location.href = 'app.html';
      } else if (isClerkLoaded && window.Clerk) {
        // Não tem sessão, abrir modal de login
        window.Clerk.openSignIn({
          afterSignInUrl: 'app.html',
          afterSignUpUrl: 'app.html'
        });
      } else {
        // Fallback caso o script do Clerk falhe (ex: chave invalida)
        sessionStorage.setItem('mock_clerk_auth', 'true');
        window.location.href = 'app.html';
      }
    });
  });
}

// Trocar idioma
function attachLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.getAttribute('data-lang');
      setLanguage(newLang);
    });
  });
}

function attachMobileMenu() {
  const menuToggle = document.querySelector('.landing-menu-toggle');
  const mobileNav = document.querySelector('.landing-mobile-nav');
  const overlay = document.querySelector('.landing-nav-overlay');
  if (!menuToggle || !mobileNav || !overlay) return;

  let isOpen = false;
  const openLabel = getTranslation('topbar.openMenu', currentLanguage);
  const closeLabel = getTranslation('topbar.closeMenu', currentLanguage);

  const closeMenu = () => {
    isOpen = false;
    menuToggle.innerHTML = getIcon('menu');
    menuToggle.setAttribute('aria-label', openLabel);
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('is-active');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('landing-nav-open');
  };

  const openMenu = () => {
    isOpen = true;
    menuToggle.innerHTML = getIcon('close');
    menuToggle.setAttribute('aria-label', closeLabel);
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.classList.add('is-active');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('landing-nav-open');
  };

  menuToggle.addEventListener('click', () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  mobileNav.querySelectorAll('.landing-mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
}

// Modais Legais (Termos e Privacidade)
function attachLegalModals() {
  const termsBtn = document.getElementById('open-terms-link');
  const privacyBtn = document.getElementById('open-privacy-link');

  if (termsBtn) {
    termsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = currentLanguage;
      const modal = new Modal({
        title: legalTexts[lang].termsTitle,
        message: legalTexts[lang].termsContent,
        showCancel: false,
        confirmText: lang === 'pt' ? 'Fechar' : 'Close'
      });
      modal.show();
      const contentEl = modal.modal?.querySelector('.modal-content');
      if (contentEl) contentEl.classList.add('legal-modal');
    });
  }

  if (privacyBtn) {
    privacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = currentLanguage;
      const modal = new Modal({
        title: legalTexts[lang].privacyTitle,
        message: legalTexts[lang].privacyContent,
        showCancel: false,
        confirmText: lang === 'pt' ? 'Fechar' : 'Close'
      });
      modal.show();
      const contentEl = modal.modal?.querySelector('.modal-content');
      if (contentEl) contentEl.classList.add('legal-modal');
    });
  }
}

// Navegação suave
function attachSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const topbarHeight = 80;
          const targetPosition = target.offsetTop - topbarHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Atualizar topbar ao fazer scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const topbar = document.querySelector('.landing-topbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      topbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      topbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  renderLanding();
  
  // Create cursor glow element
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let isMouseMoving = false;
  let timeoutId;

  document.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    // Use requestAnimationFrame for smoother following
    requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      glow.style.opacity = '0';
    }, 1000);
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
});

