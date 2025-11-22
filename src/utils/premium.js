/**
 * Sistema simples de verificação Premium
 * Por enquanto é apenas uma flag, mas pode ser expandido
 * para integração com sistema de pagamento
 */
class PremiumManager {
  constructor() {
    // Por padrão, vamos deixar premium ativo para demonstração
    // Em produção, isso viria de um sistema de autenticação/pagamento
    this.isPremium = localStorage.getItem('premium') === 'true' || true; // Demo: sempre true
  }

  checkPremium() {
    return this.isPremium;
  }

  setPremium(value) {
    this.isPremium = value;
    localStorage.setItem('premium', value.toString());
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


