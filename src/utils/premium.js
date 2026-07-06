/**
 * Sistema simples de verificação Premium
 * Por enquanto é apenas uma flag, mas pode ser expandido
 * para integração com sistema de pagamento
 */
class PremiumManager {
  constructor() {
    this.isPremium = false;
    this._initializePremiumStatus();
  }

  _initializePremiumStatus() {
    // 1. Verificar prioritariamente a Nuvem (Clerk)
    if (window.Clerk && window.Clerk.user && window.Clerk.user.publicMetadata) {
      const clerkExpiresAt = window.Clerk.user.publicMetadata.premiumExpiresAt;
      if (clerkExpiresAt && Date.now() < parseInt(clerkExpiresAt, 10)) {
        this.isPremium = true;
        // Opcional: Atualizar local storage para consistência offline
        localStorage.setItem('premium_expires_at', clerkExpiresAt.toString());
        return;
      } else if (clerkExpiresAt) {
        // Expirou na nuvem
        this.isPremium = false;
        localStorage.removeItem('premium_expires_at');
        return;
      }
    }

    // 2. Fallback para Local Storage (temporário ou inicialização)
    const expiresAt = localStorage.getItem('premium_expires_at');
    
    if (expiresAt && Date.now() < parseInt(expiresAt, 10)) {
      this.isPremium = true;
    } else {
      // Verificar se existe a flag antiga (migração para o novo sistema)
      const legacyPremium = localStorage.getItem('premium') === 'true';
      if (legacyPremium) {
        // Converte a conta antiga para o sistema de 7 dias começando hoje
        this.setPremium(true);
      } else {
        // Expirou ou não existe
        localStorage.removeItem('premium_expires_at');
        localStorage.removeItem('premium');
        this.isPremium = false;
      }
    }
  }

  checkPremium() {
    // Re-verificar sempre que pedido, para caso tenha expirado na sessão atual
    this._initializePremiumStatus();
    return this.isPremium;
  }

  setPremium(value) {
    if (value) {
      // 7 dias de acesso
      const durationDays = 7;
      const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
      localStorage.setItem('premium_expires_at', expiresAt.toString());
      localStorage.removeItem('premium'); // remover flag antiga
      this.isPremium = true;
    } else {
      localStorage.removeItem('premium_expires_at');
      localStorage.removeItem('premium');
      this.isPremium = false;
    }
  }

  // Método para verificar se uma funcionalidade está disponível
  hasFeature(feature) {
    const premiumFeatures = [
      'advancedRemoval',
      'manualRefinement',
      'colorPalettes',
      'colorAdjustments',
      'filters',
      'customBackgrounds',
      'multipleFormats'
    ];

    if (!premiumFeatures.includes(feature)) {
      return true; // Funcionalidades básicas sempre disponíveis
    }

    return this.isPremium;
  }
}

export default new PremiumManager();



