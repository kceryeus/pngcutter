import i18n from '../../i18n/i18n.js';
import { getIcon } from '../../utils/icons.js';

class Sidebar {
  constructor(containerId, items = []) {
    this.containerId = containerId;
    this.items = items;
    this.isPinned = false;
    this.isExpanded = false;
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
    this.container.className = 'sidebar';
    
    this.container.innerHTML = `
      <div class="sidebar-content">
        <div class="sidebar-header">
          <a href="index.html" class="sidebar-logo">
            <img src="src/assets/logo.png" alt="PNG Cutter" class="sidebar-logo-img">
            <span class="sidebar-logo-text">PNG Cutter</span>
          </a>
          <button class="sidebar-pin-btn" title="Fixar sidebar" aria-label="Fixar sidebar">
            ${getIcon('pin')}
          </button>
        </div>
        <nav class="sidebar-nav">
          ${this.items.map(item => this.renderItem(item)).join('')}
        </nav>
      </div>
    `;

    this.attachEvents();
    this.updateTranslations();
    
    this.unsubscribe = i18n.subscribe(() => {
      this.updateTranslations();
    });
  }

  renderItem(item) {
    const currentHash = window.location.hash || '#/';
    const isActive = currentHash === item.href || (item.href === '#/' && currentHash === '#/');
    // Mapear ícones comuns
    let iconSvg = item.icon;
    if (typeof item.icon === 'string' && !item.icon.startsWith('<svg')) {
      const iconMap = {
        'home': 'home',
        'dashboard': 'dashboard',
        'backgroundRemover': 'backgroundRemover',
        'settings': 'settings'
      };
      const iconName = iconMap[item.icon] || item.icon;
      iconSvg = getIcon(iconName);
    }
    
    return `
      <a href="${item.href}" class="sidebar-item ${isActive ? 'active' : ''}" data-id="${item.id}">
        <span class="sidebar-item-icon">${iconSvg || getIcon('dashboard')}</span>
        <span class="sidebar-item-label">${i18n.t(item.label)}</span>
      </a>
    `;
  }

  attachEvents() {
    const pinBtn = this.container.querySelector('.sidebar-pin-btn');
    if (pinBtn) {
      pinBtn.addEventListener('click', () => this.togglePin());
    }

    this.container.addEventListener('mouseenter', () => {
      if (!this.isPinned) {
        this.expand();
      }
    });

    this.container.addEventListener('mouseleave', () => {
      if (!this.isPinned) {
        this.collapse();
      }
    });
  }

  updateTranslations() {
    const items = this.container.querySelectorAll('.sidebar-item');
    items.forEach((itemEl, index) => {
      const item = this.items[index];
      if (item) {
        const labelEl = itemEl.querySelector('.sidebar-item-label');
        if (labelEl) {
          labelEl.textContent = i18n.t(item.label);
        }
      }
    });
  }

  expand() {
    this.isExpanded = true;
    this.container.classList.add('expanded');
  }

  collapse() {
    this.isExpanded = false;
    this.container.classList.remove('expanded');
  }

  toggle() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  pin() {
    this.isPinned = true;
    this.container.classList.add('pinned');
    document.body.classList.add('sidebar-pinned');
    this.expand();
    const pinBtn = this.container.querySelector('.sidebar-pin-btn');
    if (pinBtn) {
      pinBtn.innerHTML = getIcon('pinned');
      pinBtn.title = 'Desfixar sidebar';
      pinBtn.setAttribute('aria-label', 'Desfixar sidebar');
    }
    this.notifyStateChange();
  }

  unpin() {
    this.isPinned = false;
    this.container.classList.remove('pinned');
    document.body.classList.remove('sidebar-pinned');
    this.collapse();
    const pinBtn = this.container.querySelector('.sidebar-pin-btn');
    if (pinBtn) {
      pinBtn.innerHTML = getIcon('pin');
      pinBtn.title = 'Fixar sidebar';
      pinBtn.setAttribute('aria-label', 'Fixar sidebar');
    }
    this.notifyStateChange();
  }

  setStateChangeCallback(callback) {
    this.stateChangeCallback = callback;
  }

  notifyStateChange() {
    if (this.stateChangeCallback) {
      this.stateChangeCallback(this.isPinned);
    }
  }

  togglePin() {
    if (this.isPinned) {
      this.unpin();
    } else {
      this.pin();
    }
  }

  addItem(item) {
    this.items.push(item);
    if (this.container) {
      const nav = this.container.querySelector('.sidebar-nav');
      if (nav) {
        nav.insertAdjacentHTML('beforeend', this.renderItem(item));
      }
    }
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    if (this.container) {
      const itemEl = this.container.querySelector(`[data-id="${itemId}"]`);
      if (itemEl) {
        itemEl.remove();
      }
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

export default Sidebar;

