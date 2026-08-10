/**
 * Component responsible for rendering individual Service Cards
 */
export class ServiceCard {
  /**
   * @param {Object} props
   * @param {import('../models/Service.js').Service} props.service
   * @param {import('../services/CartService.js').CartService} props.cartService
   */
  constructor({ service, cartService }) {
    this.service = service;
    this.cartService = cartService;
  }

  /**
   * Render DOM Element for Service Card
   * @returns {HTMLElement}
   */
  render() {
    const card = document.createElement('article');
    card.className = `service-card touch-active ${this.cartService.hasService(this.service.id) ? 'selected' : ''}`;
    card.dataset.serviceId = this.service.id;

    const categoryNames = {
      maquiagem: 'Maquiagem',
      sobrancelha: 'Sobrancelha',
      estetica: 'Estética Geral'
    };

    let addonsHtml = '';
    if (this.service.addons && this.service.addons.length > 0) {
      const addonChips = this.service.addons.map(addon => {
        const isAddonActive = this.cartService.hasAddon(this.service.id, addon.id);
        const formattedAddonPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(addon.price);
        return `
          <button type="button" 
                  class="addon-chip ${isAddonActive ? 'active' : ''}" 
                  data-addon-id="${addon.id}">
            <span>+ ${addon.name}</span>
            <span>(${formattedAddonPrice})</span>
          </button>
        `;
      }).join('');

      addonsHtml = `
        <div class="addons-wrap">
          <div class="addons-title">Adicionais Opcionais</div>
          <div class="addons-list">${addonChips}</div>
        </div>
      `;
    }

    const isSelected = this.cartService.hasService(this.service.id);

    card.innerHTML = `
      <div class="service-card-image-wrap">
        <img src="${this.service.image}" alt="${this.service.title}" class="service-card-image" loading="lazy" />
        <span class="service-badge-category">${categoryNames[this.service.category] || 'Estética'}</span>
      </div>
      <div class="service-card-content">
        <div class="service-card-header">
          <h3 class="service-title">${this.service.title}</h3>
          <div class="service-price">${this.service.formattedPrice}</div>
        </div>
        <div class="service-meta">
          <div class="service-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${this.service.formattedDuration}</span>
          </div>
        </div>
        <p class="service-description">${this.service.description}</p>
        ${addonsHtml}
        <div class="service-card-footer">
          <button type="button" class="btn-select-service ${isSelected ? 'selected' : ''}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              ${isSelected 
                ? '<polyline points="20 6 9 17 4 12"></polyline>' 
                : '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'}
            </svg>
            <span>${isSelected ? 'Selecionado' : 'Adicionar ao Agendamento'}</span>
          </button>
        </div>
      </div>
    `;

    // Event listeners
    const selectBtn = card.querySelector('.btn-select-service');
    selectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.cartService.toggleService(this.service);
    });

    // Addon click listeners
    const addonBtns = card.querySelectorAll('.addon-chip');
    addonBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const addonId = btn.dataset.addonId;
        if (!this.cartService.hasService(this.service.id)) {
          // Auto-select service if clicking an addon
          this.cartService.toggleService(this.service);
        }
        this.cartService.toggleAddon(this.service.id, addonId);
      });
    });

    return card;
  }
}
