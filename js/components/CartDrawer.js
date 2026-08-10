/**
 * Component responsible for managing the Bottom Sheet / Cart Drawer for WhatsApp checkout
 */
export class CartDrawer {
  /**
   * @param {Object} props
   * @param {import('../services/CartService.js').CartService} props.cartService
   * @param {import('../services/WhatsAppService.js').WhatsAppService} props.whatsAppService
   */
  constructor({ cartService, whatsAppService }) {
    this.cartService = cartService;
    this.whatsAppService = whatsAppService;
    this.modalOverlay = document.getElementById('bookingModalOverlay');
    this.sheetContent = document.getElementById('sheetSummaryContent');
    this.bookingForm = document.getElementById('bookingForm');
    this.closeBtn = document.getElementById('btnCloseModal');
    
    this.selectedPeriod = 'manha';

    this.init();
  }

  init() {
    if (!this.modalOverlay) return;

    // Close modal events
    this.closeBtn?.addEventListener('click', () => this.close());
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) this.close();
    });

    // Period selector chips
    const periodChips = document.querySelectorAll('.period-chip');
    periodChips.forEach(chip => {
      chip.addEventListener('click', () => {
        periodChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedPeriod = chip.dataset.period;
      });
    });

    // Set default date picker min to today
    const dateInput = document.getElementById('inputPreferredDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    // Form submit -> WhatsApp redirect
    this.bookingForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCheckout();
    });
  }

  open() {
    const state = this.cartService.getState();
    if (state.count === 0) {
      alert('Por favor, selecione ao menos um serviço no cardápio antes de prosseguir!');
      return;
    }

    this.renderSummary(state);
    this.modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  renderSummary(state) {
    if (!this.sheetContent) return;

    let itemsHtml = state.items.map(({ service, selectedAddons, itemTotal }) => {
      let addonsStr = '';
      if (selectedAddons.length > 0) {
        addonsStr = `<div style="font-size:0.75rem; color:var(--color-secondary); margin-top:2px;">+ ${selectedAddons.map(a => a.name).join(', ')}</div>`;
      }
      const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemTotal);

      return `
        <div class="summary-item">
          <div>
            <div class="summary-item-title">${service.title}</div>
            ${addonsStr}
          </div>
          <div class="summary-item-price">${formattedTotal}</div>
        </div>
      `;
    }).join('');

    this.sheetContent.innerHTML = `
      <div class="summary-box">
        ${itemsHtml}
        <div class="summary-divider"></div>
        <div class="summary-item" style="font-size:1rem; font-weight:700;">
          <span>Total Estimado:</span>
          <span style="color:var(--color-primary);">${state.formattedTotal}</span>
        </div>
      </div>
    `;
  }

  handleCheckout() {
    const clientNameInput = document.getElementById('inputClientName');
    const preferredDateInput = document.getElementById('inputPreferredDate');
    const notesInput = document.getElementById('inputNotes');

    const clientName = clientNameInput?.value.trim();
    if (!clientName) {
      alert('Por favor, informe seu nome para o agendamento.');
      clientNameInput?.focus();
      return;
    }

    const state = this.cartService.getState();

    this.whatsAppService.sendToWhatsApp({
      clientName,
      preferredDate: preferredDateInput?.value || '',
      preferredPeriod: this.selectedPeriod,
      notes: notesInput?.value || '',
      items: state.items,
      total: state.total
    });

    this.close();
  }
}
