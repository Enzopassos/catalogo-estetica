/**
 * Single Responsibility: Constructs formatted WhatsApp booking messages and initiates WhatsApp redirect.
 */
export class WhatsAppService {
  /**
   * @param {string} phoneNumber - WhatsApp destination phone number (country code + DDD + number)
   */
  constructor(phoneNumber = '5511999999999') {
    this.phoneNumber = phoneNumber.replace(/\D/g, '');
  }

  /**
   * Formats the WhatsApp message text
   * @param {Object} bookingDetails
   * @param {string} bookingDetails.clientName
   * @param {string} bookingDetails.preferredDate
   * @param {string} bookingDetails.preferredPeriod - 'manha' | 'tarde' | 'indiferente'
   * @param {string} [bookingDetails.notes]
   * @param {Array<{service: any, selectedAddons: Array<any>, itemTotal: number}>} bookingDetails.items
   * @param {number} bookingDetails.total
   * @returns {string}
   */
  formatMessage({ clientName, preferredDate, preferredPeriod, notes, items, total }) {
    const periodMap = {
      manha: 'Manhã (09:00 - 12:00)',
      tarde: 'Tarde (13:00 - 18:00)',
      indiferente: 'Qualquer horário disponível'
    };

    const formattedTotal = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(total);

    let msg = `✨ *SOLICITAÇÃO DE AGENDAMENTO* ✨\n`;
    msg += `*Gabriela Beauty Studio*\n`;
    msg += `-----------------------------------\n\n`;

    msg += `👤 *Cliente:* ${clientName.trim()}\n`;
    
    if (preferredDate) {
      // Format YYYY-MM-DD to DD/MM/YYYY
      const parts = preferredDate.split('-');
      const dateFormatted = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : preferredDate;
      msg += `📅 *Data Preferencial:* ${dateFormatted}\n`;
    }
    
    if (preferredPeriod && periodMap[preferredPeriod]) {
      msg += `🕒 *Período Desejado:* ${periodMap[preferredPeriod]}\n`;
    }

    msg += `\n💅 *SERVIÇOS SELECIONADOS:*\n`;

    items.forEach(({ service, selectedAddons, itemTotal }) => {
      const priceStr = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price);
      msg += `• *${service.title}* (${priceStr})\n`;
      
      if (selectedAddons && selectedAddons.length > 0) {
        selectedAddons.forEach(addon => {
          const addonPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(addon.price);
          msg += `   └ + ${addon.name} (${addonPrice})\n`;
        });
      }
    });

    msg += `\n💰 *VALOR ESTIMADO:* ${formattedTotal}\n`;

    if (notes && notes.trim().length > 0) {
      msg += `\n📝 *Observações:* ${notes.trim()}\n`;
    }

    msg += `\n-----------------------------------\n`;
    msg += `Olá Gabi! Escolhi esses procedimentos no seu cardápio digital. Gostaria de verificar a disponibilidade na sua agenda! ❤️`;

    return msg;
  }

  /**
   * Generates WhatsApp URL
   * @param {string} messageText
   */
  getWhatsAppUrl(messageText) {
    const encodedText = encodeURIComponent(messageText);
    return `https://wa.me/${this.phoneNumber}?text=${encodedText}`;
  }

  /**
   * Triggers redirection to WhatsApp
   * @param {Object} bookingDetails
   */
  sendToWhatsApp(bookingDetails) {
    const message = this.formatMessage(bookingDetails);
    const url = this.getWhatsAppUrl(message);
    window.open(url, '_blank');
  }
}
