import { getIcon } from '../../utils/icons.js';
import Modal from '../Modal/Modal.js'; // Fallback para mensagens simples

class PaymentModal {
  constructor() {
    this.container = null;
    this.onSuccess = null;
  }

  show(onSuccessCallback) {
    this.onSuccess = onSuccessCallback;
    
    // Adicionar link para CSS, se necessário
    if (!document.querySelector('link[href*="PaymentModal.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'src/components/PaymentModal/PaymentModal.css';
      document.head.appendChild(link);
    }
    
    this.container = document.createElement('div');
    this.container.className = 'payment-modal-overlay';
    
    this.container.innerHTML = `
      <div class="payment-modal">
        <button class="payment-close-btn">&times;</button>
        <div class="payment-header">
          <div class="payment-icon">${getIcon('success')}</div>
          <h2>Upgrade para Premium</h2>
          <p>Desbloqueie o Bulk Resizer e Format Converter por apenas <strong>50 MT</strong> durante 7 dias (acesso ilimitado).</p>
        </div>
        
        <div class="payment-body">
          <div class="payment-methods">
            <div class="payment-method active">M-Pesa / e-Mola</div>
          </div>
          
          <div class="payment-form">
            <label>Número de Telemóvel</label>
            <div class="phone-input-group">
              <span class="country-code">+258</span>
              <input type="text" id="phone-number" placeholder="84 000 0000" maxlength="9" autocomplete="off">
            </div>
            <p class="payment-hint">Irá receber um prompt USSD no seu telemóvel para introduzir o PIN.</p>
          </div>
          
          <button class="payment-submit-btn" id="pay-btn">Pagar 50 MT</button>
          
          <div class="payment-loading" style="display: none;">
            <div class="spinner"></div>
            <p>A aguardar confirmação via Paytek no seu telemóvel...</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.container);
    this.attachEvents();
  }
  
  attachEvents() {
    const closeBtn = this.container.querySelector('.payment-close-btn');
    closeBtn.addEventListener('click', () => this.close());
    
    const payBtn = this.container.querySelector('#pay-btn');
    const phoneInput = this.container.querySelector('#phone-number');
    const loadingView = this.container.querySelector('.payment-loading');
    
    payBtn.addEventListener('click', () => {
      const number = phoneInput.value.replace(/\s+/g, '');
      if (number.length !== 9 || !/^(84|85|86|87)/.test(number)) {
        alert('Por favor, introduza um número M-Pesa ou e-Mola válido (ex: 84xxxxxxx).');
        return;
      }
      
      payBtn.style.display = 'none';
      loadingView.style.display = 'flex';
      
      // Simular chamada à API da Paytek
      setTimeout(() => {
        this.close();
        
        // Em ambiente de produção real, o backend receberia um webhook e atualizaria 
        // os publicMetadata do Clerk. Aqui fazemos mock do sucesso no frontend.
        Modal.success('Pagamento recebido com sucesso! Funcionalidades Premium desbloqueadas.', () => {
          if (this.onSuccess) this.onSuccess();
        });
        
      }, 3000);
    });
  }
  
  close() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export default PaymentModal;
