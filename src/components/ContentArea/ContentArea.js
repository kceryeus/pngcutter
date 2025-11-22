import i18n from '../../i18n/i18n.js';

class ContentArea {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      showBreadcrumbs: options.showBreadcrumbs || false,
      breadcrumbs: options.breadcrumbs || [],
      ...options
    };
    this.container = null;
    this.contentElement = null;
    this.unsubscribe = null;
    this.onSidebarStateChange = null;
  }

  setSidebarStateChangeCallback(callback) {
    this.onSidebarStateChange = callback;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }

    this.container = container;
    this.container.className = 'content-area';
    
    this.container.innerHTML = `
      ${this.options.showBreadcrumbs ? this.renderBreadcrumbs() : ''}
      <div class="content-area-body" id="content-area-body">
        <div class="content-area-placeholder">
          ${i18n.t('contentArea.noContent')}
        </div>
      </div>
    `;

    this.contentElement = document.getElementById('content-area-body');
    this.updateTranslations();
    
    this.unsubscribe = i18n.subscribe(() => {
      this.updateTranslations();
    });
  }

  renderBreadcrumbs() {
    if (this.options.breadcrumbs.length === 0) return '';
    
    return `
      <nav class="content-area-breadcrumbs">
        ${this.options.breadcrumbs.map((crumb, index) => {
          const isLast = index === this.options.breadcrumbs.length - 1;
          const label = crumb.labelKey ? i18n.t(crumb.labelKey) : crumb.label;
          return `
            ${index > 0 ? '<span class="breadcrumb-separator">/</span>' : ''}
            ${isLast ? 
              `<span class="breadcrumb-item breadcrumb-current">${label}</span>` :
              `<a href="${crumb.href || '#'}" class="breadcrumb-item">${label}</a>`
            }
          `;
        }).join('')}
      </nav>
    `;
  }

  setContent(content) {
    if (!this.contentElement) return;
    
    this.contentElement.innerHTML = '';
    if (content instanceof HTMLElement) {
      this.contentElement.appendChild(content);
    } else if (typeof content === 'string') {
      this.contentElement.innerHTML = content;
    }
  }

  appendContent(content) {
    if (!this.contentElement) return;
    
    if (content instanceof HTMLElement) {
      this.contentElement.appendChild(content);
    } else if (typeof content === 'string') {
      this.contentElement.insertAdjacentHTML('beforeend', content);
    }
  }

  clearContent() {
    if (this.contentElement) {
      this.contentElement.innerHTML = '';
    }
  }

  setBreadcrumbs(breadcrumbs) {
    this.options.breadcrumbs = breadcrumbs;
    if (this.container) {
      const breadcrumbsEl = this.container.querySelector('.content-area-breadcrumbs');
      if (breadcrumbsEl) {
        breadcrumbsEl.outerHTML = this.renderBreadcrumbs();
      } else if (this.options.showBreadcrumbs) {
        this.container.insertAdjacentHTML('afterbegin', this.renderBreadcrumbs());
      }
    }
  }

  showLoading() {
    if (!this.contentElement) return;
    
    this.contentElement.innerHTML = `
      <div class="content-area-state">
        <div class="content-area-spinner"></div>
        <p>${i18n.t('contentArea.loading')}</p>
      </div>
    `;
  }

  showEmpty(message = 'contentArea.noContent') {
    if (!this.contentElement) return;
    
    this.contentElement.innerHTML = `
      <div class="content-area-state">
        <p>${i18n.t(message)}</p>
      </div>
    `;
  }

  showError(message = 'contentArea.error') {
    if (!this.contentElement) return;
    
    this.contentElement.innerHTML = `
      <div class="content-area-state content-area-error">
        <p>${i18n.t(message)}</p>
      </div>
    `;
  }

  updateTranslations() {
    const placeholder = this.container?.querySelector('.content-area-placeholder');
    if (placeholder) {
      placeholder.textContent = i18n.t('contentArea.noContent');
    }

    const breadcrumbs = this.container?.querySelectorAll('.breadcrumb-item');
    if (breadcrumbs) {
      this.options.breadcrumbs.forEach((crumb, index) => {
        const breadcrumb = Array.from(breadcrumbs).find(b => {
          const label = crumb.labelKey ? i18n.t(crumb.labelKey) : crumb.label;
          return b.textContent.trim() === label;
        });
        if (breadcrumb && crumb.labelKey) {
          breadcrumb.textContent = i18n.t(crumb.labelKey);
        }
      });
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.container) {
      this.container.innerHTML = '';
      this.container.className = '';
    }
  }
}

export default ContentArea;

