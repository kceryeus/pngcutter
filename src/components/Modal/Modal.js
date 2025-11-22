import i18n from '../../i18n/i18n.js';
import { getIcon } from '../../utils/icons.js';

class Modal {
  constructor(options = {}) {
    this.options = {
      type: options.type || 'info',
      title: options.title || 'modal.info',
      message: options.message || '',
      confirmText: options.confirmText || 'modal.confirm',
      cancelText: options.cancelText || 'modal.cancel',
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
      showCancel: options.showCancel !== false,
      ...options
    };
    this.modal = null;
    this.unsubscribe = null;
  }

  renderMessage() {
    const message = this.options.message;
    
    // Se a mensagem contém HTML (tags), renderizar diretamente
    if (typeof message === 'string' && message.includes('<')) {
      return message;
    }
    
    // Se é uma translation key (contém ponto e não é HTML), traduzir
    if (typeof message === 'string' && message.includes('.') && !message.includes(' ')) {
      return i18n.t(message);
    }
    
    // Caso contrário, retornar a mensagem como está
    return message;
  }

  show() {
    if (this.modal) {
      this.close();
    }

    const modalId = `modal-${Date.now()}`;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = modalId;
    
    const iconMap = {
      info: 'info',
      warning: 'warning',
      danger: 'danger',
      success: 'success'
    };

    modal.innerHTML = `
      <div class="modal-content modal-${this.options.type}">
        <div class="modal-header">
          <span class="modal-icon">${getIcon(iconMap[this.options.type] || 'info')}</span>
          <h3 class="modal-title">${i18n.t(this.options.title)}</h3>
          <button class="modal-close" aria-label="${i18n.t('modal.close')}">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-message">${this.renderMessage()}</div>
        </div>
        <div class="modal-footer">
          ${this.options.showCancel ? `
            <button class="modal-btn modal-btn-cancel">${i18n.t(this.options.cancelText)}</button>
          ` : ''}
          <button class="modal-btn modal-btn-confirm modal-btn-${this.options.type}">${i18n.t(this.options.confirmText)}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    this.attachEvents();
    this.updateTranslations();

    setTimeout(() => {
      modal.classList.add('show');
    }, 10);

    this.unsubscribe = i18n.subscribe(() => {
      this.updateTranslations();
    });
  }

  attachEvents() {
    const closeBtn = this.modal.querySelector('.modal-close');
    const cancelBtn = this.modal.querySelector('.modal-btn-cancel');
    const confirmBtn = this.modal.querySelector('.modal-btn-confirm');
    const overlay = this.modal;

    const close = () => {
      if (this.options.onCancel) {
        this.options.onCancel();
      }
      this.close();
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', close);
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (this.options.onConfirm) {
          this.options.onConfirm();
        }
        this.close();
      });
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal) {
        close();
      }
    });
  }

  updateTranslations() {
    if (!this.modal) return;

    const title = this.modal.querySelector('.modal-title');
    const message = this.modal.querySelector('.modal-message');
    const confirmBtn = this.modal.querySelector('.modal-btn-confirm');
    const cancelBtn = this.modal.querySelector('.modal-btn-cancel');
    const closeBtn = this.modal.querySelector('.modal-close');

    if (title) {
      title.textContent = i18n.t(this.options.title);
    }

    if (message) {
      message.innerHTML = this.renderMessage();
    }

    if (confirmBtn) {
      confirmBtn.textContent = i18n.t(this.options.confirmText);
    }

    if (cancelBtn) {
      cancelBtn.textContent = i18n.t(this.options.cancelText);
    }

    if (closeBtn) {
      closeBtn.setAttribute('aria-label', i18n.t('modal.close'));
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('show');
      setTimeout(() => {
        if (this.modal && this.modal.parentNode) {
          this.modal.parentNode.removeChild(this.modal);
        }
        this.modal = null;
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }, 300);
    }
  }

  static confirm(message, onConfirm, onCancel) {
    const modal = new Modal({
      type: 'info',
      title: 'modal.confirmAction',
      message: message,
      onConfirm: onConfirm,
      onCancel: onCancel
    });
    modal.show();
    return modal;
  }

  static warning(message, onConfirm) {
    const modal = new Modal({
      type: 'warning',
      title: 'modal.warning',
      message: message,
      onConfirm: onConfirm,
      showCancel: false
    });
    modal.show();
    return modal;
  }

  static danger(message, onConfirm, onCancel) {
    const modal = new Modal({
      type: 'danger',
      title: 'modal.danger',
      message: message,
      onConfirm: onConfirm,
      onCancel: onCancel
    });
    modal.show();
    return modal;
  }

  static success(message, onConfirm) {
    const modal = new Modal({
      type: 'success',
      title: 'modal.success',
      message: message,
      onConfirm: onConfirm,
      showCancel: false
    });
    modal.show();
    return modal;
  }

  static info(title, message, onConfirm) {
    const modal = new Modal({
      type: 'info',
      title: title,
      message: message,
      onConfirm: onConfirm || (() => {}),
      showCancel: false,
      confirmText: 'modal.close'
    });
    modal.show();
    return modal;
  }
}

export default Modal;

