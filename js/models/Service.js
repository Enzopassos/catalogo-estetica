/**
 * Domain entity representing a Beauty Service offered by Gabriela
 */
export class Service {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.title
   * @param {string} data.category - 'maquiagem' | 'sobrancelha' | 'estetica'
   * @param {number} data.price - Base price in BRL
   * @param {number} data.durationMinutes - Estimated duration
   * @param {string} data.description
   * @param {string} data.image
   * @param {Array<{id: string, name: string, price: number}>} [data.addons]
   */
  constructor({ id, title, category, price, durationMinutes, description, image, addons = [] }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.price = price;
    this.durationMinutes = durationMinutes;
    this.description = description;
    this.image = image;
    this.addons = addons;
  }

  /**
   * Formats price to Brazilian Real format (e.g., R$ 180,00)
   */
  get formattedPrice() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.price);
  }

  /**
   * Formats duration in hours/minutes
   */
  get formattedDuration() {
    if (this.durationMinutes >= 60) {
      const hrs = Math.floor(this.durationMinutes / 60);
      const mins = this.durationMinutes % 60;
      return mins > 0 ? `${hrs}h ${mins}min` : `${hrs}h`;
    }
    return `${this.durationMinutes} min`;
  }
}
