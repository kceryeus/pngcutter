import i18n from '../../i18n/i18n.js';
import { getIcon } from '../../utils/icons.js';

class Landing {
  constructor() {
    this.unsubscribe = null;
  }

  render(contentArea) {
    const container = document.createElement('div');
    container.className = 'landing-page';
    
    container.innerHTML = `
      <div class="landing-hero">
        <div class="landing-hero-content">
          <img src="src/assets/logo.png" alt="PNG Cutter – Format Convert & Resize" class="landing-logo-large">
          <h1 class="landing-title">${i18n.t('landing.title')}</h1>
          <div class="landing-brand-badge">${i18n.t('landing.tagline')}</div>
          <p class="landing-subtitle">${i18n.t('landing.subtitle')}</p>
          <a href="#/background-remover" class="landing-cta-button">
            ${i18n.t('landing.getStarted')}
          </a>
        </div>
      </div>

      <div class="landing-features">
        <div class="landing-section-header">
          <h2>${i18n.t('landing.features.title')}</h2>
          <p>${i18n.t('landing.features.subtitle')}</p>
        </div>

        <div class="landing-features-grid">
          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('camera')}</div>
            <h3>${i18n.t('landing.features.autoRemoval.title')}</h3>
            <p>${i18n.t('landing.features.autoRemoval.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('success')}</div>
            <h3>${i18n.t('landing.features.pngExport.title')}</h3>
            <p>${i18n.t('landing.features.pngExport.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('theme')}</div>
            <h3>${i18n.t('landing.features.modernUI.title')}</h3>
            <p>${i18n.t('landing.features.modernUI.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('themeDark')}</div>
            <h3>${i18n.t('landing.features.darkMode.title')}</h3>
            <p>${i18n.t('landing.features.darkMode.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('help')}</div>
            <h3>${i18n.t('landing.features.multiLanguage.title')}</h3>
            <p>${i18n.t('landing.features.multiLanguage.description')}</p>
          </div>

          <div class="landing-feature-card">
            <div class="feature-icon">${getIcon('dashboard')}</div>
            <h3>${i18n.t('landing.features.responsive.title')}</h3>
            <p>${i18n.t('landing.features.responsive.description')}</p>
          </div>
        </div>
      </div>

      <div class="landing-how-it-works">
        <div class="landing-section-header">
          <h2>${i18n.t('landing.howItWorks.title')}</h2>
          <p>${i18n.t('landing.howItWorks.subtitle')}</p>
        </div>

        <div class="landing-steps">
          <div class="landing-step">
            <div class="step-number">1</div>
            <h3>${i18n.t('landing.howItWorks.step1.title')}</h3>
            <p>${i18n.t('landing.howItWorks.step1.description')}</p>
          </div>

          <div class="landing-step">
            <div class="step-number">2</div>
            <h3>${i18n.t('landing.howItWorks.step2.title')}</h3>
            <p>${i18n.t('landing.howItWorks.step2.description')}</p>
          </div>

          <div class="landing-step">
            <div class="step-number">3</div>
            <h3>${i18n.t('landing.howItWorks.step3.title')}</h3>
            <p>${i18n.t('landing.howItWorks.step3.description')}</p>
          </div>
        </div>
      </div>

      <div class="landing-cta">
        <div class="landing-cta-content">
          <h2>${i18n.t('landing.cta.title')}</h2>
          <p>${i18n.t('landing.cta.subtitle')}</p>
          <a href="#/background-remover" class="landing-cta-button">
            ${i18n.t('landing.cta.button')}
          </a>
        </div>
      </div>
    `;

    contentArea.setContent(container);
    this.attachEvents();
    this.updateTranslations();
    
    this.unsubscribe = i18n.subscribe(() => {
      this.updateTranslations();
    });
  }

  attachEvents() {
    // Os links já usam href com hash, então o roteamento será tratado pelo index.js
    const container = document.querySelector('.landing-page');
    if (!container) return;
    
    const ctaButtons = container.querySelectorAll('.landing-cta-button');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const href = button.getAttribute('href');
        if (href) {
          window.location.hash = href.replace('#', '');
        }
      });
    });
  }

  updateTranslations() {
    const container = document.querySelector('.landing-page');
    if (!container) return;

    const title = container.querySelector('.landing-title');
    const subtitle = container.querySelector('.landing-subtitle');
    const getStartedBtn = container.querySelector('.landing-cta-button');
    
    if (title) title.textContent = i18n.t('landing.title');
    if (subtitle) subtitle.textContent = i18n.t('landing.subtitle');
    if (getStartedBtn) getStartedBtn.textContent = i18n.t('landing.getStarted');

    // Features
    const featuresTitle = container.querySelector('.landing-features .landing-section-header h2');
    const featuresSubtitle = container.querySelector('.landing-features .landing-section-header p');
    if (featuresTitle) featuresTitle.textContent = i18n.t('landing.features.title');
    if (featuresSubtitle) featuresSubtitle.textContent = i18n.t('landing.features.subtitle');

    // How it works
    const howItWorksTitle = container.querySelector('.landing-how-it-works .landing-section-header h2');
    const howItWorksSubtitle = container.querySelector('.landing-how-it-works .landing-section-header p');
    if (howItWorksTitle) howItWorksTitle.textContent = i18n.t('landing.howItWorks.title');
    if (howItWorksSubtitle) howItWorksSubtitle.textContent = i18n.t('landing.howItWorks.subtitle');

    // CTA
    const ctaTitle = container.querySelector('.landing-cta h2');
    const ctaSubtitle = container.querySelector('.landing-cta p');
    const ctaButton = container.querySelector('.landing-cta .landing-cta-button');
    if (ctaTitle) ctaTitle.textContent = i18n.t('landing.cta.title');
    if (ctaSubtitle) ctaSubtitle.textContent = i18n.t('landing.cta.subtitle');
    if (ctaButton) ctaButton.textContent = i18n.t('landing.cta.button');
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default Landing;

