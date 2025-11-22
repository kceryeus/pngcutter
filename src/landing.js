// Script standalone para a landing page (sem MOZ-CHOP)
import { getIcon } from './utils/icons.js';

// Traduções simples para a landing page
const translations = {
  pt: {
    title: 'PNG Cutter',
    subtitle: 'Remova o background das suas imagens de forma rápida e gratuita. Converta para PNG transparente com apenas alguns cliques.',
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
      pricing: 'Preços',
      getStarted: 'Começar Agora'
    },
    pricing: {
      title: 'Planos e Preços',
      subtitle: 'Escolha o plano ideal para si',
      free: {
        title: 'Gratuito',
        price: '0 MT',
        period: 'sempre',
        features: [
          'Remoção ilimitada de backgrounds',
          'Download imediato',
          'Sem necessidade de registo',
          'Suporte à comunidade'
        ],
        button: 'Começar Grátis'
      },
      pro: {
        title: 'Pro',
        price: '50 MT',
        period: 'por mês',
        features: [
          'Tudo do plano Gratuito',
          'Armazenamento até 500MB',
          'Histórico de conversões',
          'Suporte prioritário',
          'Sem limites de processamento'
        ],
        button: 'Subscrever Agora',
        popular: 'Mais Popular'
      }
    },
    footer: {
      rights: '© 2025 PNG Cutter. Todos os direitos reservados.',
      madeWith: 'Feito com',
      by: 'por',
      links: {
        about: 'Sobre',
        features: 'Funcionalidades',
        pricing: 'Preços',
        contact: 'Contacto'
      }
    }
  },
  en: {
    title: 'PNG Cutter',
    subtitle: 'Remove backgrounds from your images quickly and for free. Convert to transparent PNG with just a few clicks.',
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
      pricing: 'Pricing',
      getStarted: 'Get Started'
    },
    pricing: {
      title: 'Plans & Pricing',
      subtitle: 'Choose the perfect plan for you',
      free: {
        title: 'Free',
        price: '0 MT',
        period: 'forever',
        features: [
          'Unlimited background removal',
          'Instant download',
          'No registration required',
          'Community support'
        ],
        button: 'Start Free'
      },
      pro: {
        title: 'Pro',
        price: '50 MT',
        period: 'per month',
        features: [
          'Everything in Free',
          'Storage up to 500MB',
          'Conversion history',
          'Priority support',
          'Unlimited processing'
        ],
        button: 'Subscribe Now',
        popular: 'Most Popular'
      }
    },
    footer: {
      rights: '© 2025 PNG Cutter. All rights reserved.',
      madeWith: 'Made with',
      by: 'by',
      links: {
        about: 'About',
        features: 'Features',
        pricing: 'Pricing',
        contact: 'Contact'
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
          <img src="src/assets/logo.png" alt="PNG Cutter" style="width: 32px; height: 32px; object-fit: contain;">
          <span>PNG Cutter</span>
        </a>
        <div class="landing-nav-links">
          <a href="#home" class="nav-link">${t('topbar.home')}</a>
          <a href="#features" class="nav-link">${t('topbar.features')}</a>
          <a href="#how-it-works" class="nav-link">${t('topbar.howItWorks')}</a>
          <a href="#pricing" class="nav-link">${t('topbar.pricing')}</a>
          <div class="language-selector">
            <button class="lang-btn ${lang === 'pt' ? 'active' : ''}" data-lang="pt" aria-label="Português">PT</button>
            <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en" aria-label="English">EN</button>
          </div>
          <a href="app.html" class="nav-link nav-cta">${t('topbar.getStarted')}</a>
        </div>
      </div>
    </nav>
    
    <div class="landing-page">
      <div class="landing-hero" id="home">
        <div class="landing-hero-content">
          <img src="src/assets/logo.png" alt="PNG Cutter" class="landing-logo-large">
          <h1 class="landing-title">${t('title')}</h1>
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

      <div class="landing-pricing" id="pricing">
        <div class="landing-section-header">
          <h2>${t('pricing.title')}</h2>
          <p>${t('pricing.subtitle')}</p>
        </div>
        
        <div class="pricing-cards">
          <div class="pricing-card">
            <h3>${t('pricing.free.title')}</h3>
            <div class="pricing-price">
              <span class="price-amount">${t('pricing.free.price')}</span>
              <span class="price-period">/${t('pricing.free.period')}</span>
            </div>
            <ul class="pricing-features">
              ${translations[lang].pricing.free.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <a href="app.html" class="pricing-button">${t('pricing.free.button')}</a>
          </div>
          
          <div class="pricing-card pricing-card-pro">
            ${translations[lang].pricing.pro.popular ? `<div class="pricing-badge">${t('pricing.pro.popular')}</div>` : ''}
            <h3>${t('pricing.pro.title')}</h3>
            <div class="pricing-price">
              <span class="price-amount">${t('pricing.pro.price')}</span>
              <span class="price-period">/${t('pricing.pro.period')}</span>
            </div>
            <ul class="pricing-features">
              ${translations[lang].pricing.pro.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <a href="app.html" class="pricing-button pricing-button-pro">${t('pricing.pro.button')}</a>
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
            <img src="src/assets/logo.png" alt="PNG Cutter" style="width: 24px; height: 24px; object-fit: contain;">
            <span>PNG Cutter</span>
          </div>
          <p class="footer-tagline">${t('subtitle')}</p>
        </div>
        
        <div class="footer-section">
          <h4>Links Rápidos</h4>
          <ul class="footer-links">
            <li><a href="#home">${t('footer.links.about')}</a></li>
            <li><a href="#features">${t('footer.links.features')}</a></li>
            <li><a href="#pricing">${t('footer.links.pricing')}</a></li>
            <li><a href="#contact">${t('footer.links.contact')}</a></li>
          </ul>
        </div>
        
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
document.addEventListener('DOMContentLoaded', renderLanding);

