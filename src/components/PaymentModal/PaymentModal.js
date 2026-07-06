import { getIcon } from '../../utils/icons.js';
import Modal from '../Modal/Modal.js';

class PaymentModal {
  constructor() {
    this.container = null;
    this.onSuccess = null;
  }

  show(onSuccessCallback) {
    this.onSuccess = onSuccessCallback;
    
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
          <div class="payment-info" style="margin-bottom: 24px; text-align: center; color: var(--text-secondary); font-size: 14px; line-height: 1.5;">
            <p style="margin-bottom: 12px;">Ao clicar no botão abaixo, será redirecionado para a plataforma segura do <strong>PaySuite</strong>, onde poderá efetuar o pagamento via MPesa, Emola ou Cartão de Crédito/Débito.</p>
          </div>
          
          <button class="payment-submit-btn" id="pay-btn" style="width: 100%;">Pagar com PaySuite (50 MT)</button>
          
          <div class="payment-loading" style="display: none; flex-direction: column; align-items: center; justify-content: center; gap: var(--spacing-md);">
            <div class="spinner"></div>
            <p>A iniciar processo de pagamento PaySuite...</p>
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
    const loadingView = this.container.querySelector('.payment-loading');
    const infoView = this.container.querySelector('.payment-info');
    
    payBtn.addEventListener('click', async () => {
      payBtn.style.display = 'none';
      if (infoView) infoView.style.display = 'none';
      loadingView.style.display = 'flex';
      
      try {
        const clerkUserId = (window.Clerk && window.Clerk.user) ? window.Clerk.user.id : 'anonymous';
        const cleanId = clerkUserId.replace(/[^a-zA-Z0-9]/g, '');
        const referenceId = `PRO${cleanId}${Date.now()}`;

        const response = await fetch('/api/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: 50.00,
            reference: referenceId,
            description: 'PNG Cutter - Acesso Premium Pro (7 dias)',
            return_url: `${window.location.origin}/app.html`
          })
        });

        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          console.error('Resposta da API não é JSON:', text);
          throw new Error('A rota /api/create-payment não respondeu em formato JSON. Certifique-se de que as variáveis de ambiente PAYSUITE_API_KEY estão configuradas no painel Vercel.');
        }

        if (result.status === 'success' && result.data && result.data.checkout_url) {
          localStorage.setItem('pending_payment_id', result.data.id);
          window.location.href = result.data.checkout_url;
        } else {
          const errorMsg = result.message || 'Erro interno do servidor PaySuite ou chave de API inválida no ficheiro .env.';
          alert(`Erro ao iniciar processo de pagamento: ${errorMsg}`);
          console.error('Erro detalhado do PaySuite:', result);
          payBtn.style.display = 'block';
          if (infoView) infoView.style.display = 'block';
          loadingView.style.display = 'none';
        }
      } catch (err) {
        console.error('Erro no checkout:', err);
        alert('Erro de rede ao iniciar o pagamento.');
        payBtn.style.display = 'block';
        if (infoView) infoView.style.display = 'block';
        loadingView.style.display = 'none';
      }
    });
  }
  
  close() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export default PaymentModal;
