import i18n from '../../i18n/i18n.js';
import { toggleDarkMode, getCurrentTheme, onThemeChange } from '../../utils/themeUtils.js';
import { getIcon } from '../../utils/icons.js';

class Topbar {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      showSearch: options.showSearch || false,
      userAvatar: options.userAvatar || null,
      userName: options.userName || 'Utilizador',
      userMenu: options.userMenu || [],
      ...options
    };
    this.container = null;
    this.unsubscribe = null;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }

    this.container = container;
    this.container.className = 'topbar';
    
    this.renderContent();
    this.attachEvents();
    this.updateTranslations();
    
    this.unsubscribe = i18n.subscribe(() => {
      this.updateTranslations();
    });
    
    // Subscribe to theme changes
    this.themeUnsubscribe = onThemeChange(() => {
      this.updateThemeIcon();
    });
  }

  renderContent() {
    this.container.innerHTML = `
      <div class="topbar-content">
        ${this.options.showSearch ? this.renderSearch() : ''}
        <div class="topbar-actions">
          <button class="topbar-theme-toggle" title="Alternar tema" aria-label="Alternar tema">
            ${this.getThemeIcon()}
          </button>
          <button class="topbar-help-btn" title="${i18n.t('topbar.help')}" aria-label="${i18n.t('topbar.help')}">
            ${getIcon('help')}
          </button>
          ${this.renderUserMenu()}
        </div>
      </div>
      ${this.renderUserDropdown()}
    `;
  }

  getThemeIcon() {
    return getCurrentTheme() === 'dark' ? getIcon('themeDark') : getIcon('theme');
  }

  updateThemeIcon() {
    const themeBtn = this.container.querySelector('.topbar-theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = this.getThemeIcon();
    }
  }

  renderSearch() {
    return `
      <div class="topbar-search">
        <input type="text" class="topbar-search-input" placeholder="${i18n.t('topbar.search')}">
        <span class="topbar-search-icon">${getIcon('search')}</span>
      </div>
    `;
  }

  renderUserMenu() {
    const isPremium = window.Clerk && window.Clerk.user && window.Clerk.user.publicMetadata && window.Clerk.user.publicMetadata.isPremium;
    
    return `
      <div class="topbar-user" id="clerk-user-button">
        <!-- Clerk UserButton will be mounted here -->
      </div>
      ${isPremium ? '<div class="topbar-pro-badge">PRO</div>' : ''}
    `;
  }

  renderUserDropdown() {
    if (this.options.userMenu.length === 0) return '';
    
    return `
      <div class="topbar-dropdown" id="topbar-dropdown">
        ${this.options.userMenu.map(item => `
          <a href="${item.href || '#'}" class="topbar-dropdown-item" data-action="${item.onClick ? 'custom' : ''}">
            ${i18n.t(item.label)}
          </a>
        `).join('')}
      </div>
    `;
  }

  attachEvents() {
    const themeToggle = this.container.querySelector('.topbar-theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        toggleDarkMode();
        // Icon will update via theme change listener
      });
    }

    const helpBtn = this.container.querySelector('.topbar-help-btn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.showHelp();
      });
    }

    const userBtn = this.container.querySelector('.topbar-user-btn');
    const dropdown = document.getElementById('topbar-dropdown');
    
    if (userBtn && dropdown) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.remove('show');
        }
      });

      const dropdownItems = dropdown.querySelectorAll('.topbar-dropdown-item');
      dropdownItems.forEach((item, index) => {
        const menuItem = this.options.userMenu[index];
        if (menuItem && menuItem.onClick) {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            menuItem.onClick();
            dropdown.classList.remove('show');
          });
        }
      });
    }
  }

  updateTranslations() {
    const searchInput = this.container.querySelector('.topbar-search-input');
    if (searchInput) {
      searchInput.placeholder = i18n.t('topbar.search');
    }

    const dropdownItems = this.container.querySelectorAll('.topbar-dropdown-item');
    dropdownItems.forEach((item, index) => {
      const menuItem = this.options.userMenu[index];
      if (menuItem) {
        item.textContent = i18n.t(menuItem.label);
      }
    });
  }

  showHelp() {
    import('../Modal/Modal.js').then(({ default: Modal }) => {
      Modal.info(
        i18n.t('topbar.help'),
        `<div style="line-height: 1.8;">
          <p><strong>${i18n.t('backgroundRemover.title')}</strong></p>
          <p>${i18n.t('backgroundRemover.subtitle')}</p>
          <br>
          <p><strong>Como usar:</strong></p>
          <ul style="margin-left: 20px; margin-top: 8px;">
            <li>Arraste e solte uma imagem na área de upload</li>
            <li>Ou clique em "Carregar Imagem" para selecionar um ficheiro</li>
            <li>Aguarde o processamento automático</li>
            <li>Descarregue a imagem em PNG sem background</li>
          </ul>
          <br>
          <p><strong>Formatos suportados:</strong> JPG, PNG, WEBP</p>
          <p><strong>Tamanho máximo:</strong> 10MB</p>
        </div>`,
        () => {}
      );
    });
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.themeUnsubscribe) {
      this.themeUnsubscribe();
    }
    if (this.container) {
      this.container.innerHTML = '';
      this.container.className = '';
    }
  }
}

export default Topbar;

