/**
 * Single Responsibility: Manages the scheduling cart state (Selected Services & Add-ons)
 */
export class CartService {
  constructor() {
    /** @type {Map<string, { service: import('../models/Service.js').Service, selectedAddons: Set<string> }>} */
    this.selectedItems = new Map();
    this.listeners = [];
    this._loadFromStorage();
  }

  /**
   * Subscribe to cart updates
   * @param {Function} callback
   */
  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getState());
  }

  /**
   * Toggle a service selection
   * @param {import('../models/Service.js').Service} service
   */
  toggleService(service) {
    if (this.selectedItems.has(service.id)) {
      this.selectedItems.delete(service.id);
    } else {
      this.selectedItems.set(service.id, {
        service,
        selectedAddons: new Set()
      });
    }
    this._notify();
  }

  /**
   * Check if a service is currently selected
   * @param {string} serviceId
   */
  hasService(serviceId) {
    return this.selectedItems.has(serviceId);
  }

  /**
   * Toggle an add-on for a selected service
   * @param {string} serviceId
   * @param {string} addonId
   */
  toggleAddon(serviceId, addonId) {
    const item = this.selectedItems.get(serviceId);
    if (!item) return;

    if (item.selectedAddons.has(addonId)) {
      item.selectedAddons.delete(addonId);
    } else {
      item.selectedAddons.add(addonId);
    }
    this._notify();
  }

  /**
   * Check if an add-on is selected
   */
  hasAddon(serviceId, addonId) {
    const item = this.selectedItems.get(serviceId);
    return item ? item.selectedAddons.has(addonId) : false;
  }

  /**
   * Clears all selected services
   */
  clear() {
    this.selectedItems.clear();
    this._notify();
  }

  /**
   * Returns current state summary
   */
  getState() {
    let total = 0;
    const items = [];

    this.selectedItems.forEach(({ service, selectedAddons }) => {
      let itemTotal = service.price;
      const addonsDetail = [];

      service.addons.forEach(addon => {
        if (selectedAddons.has(addon.id)) {
          itemTotal += addon.price;
          addonsDetail.push(addon);
        }
      });

      total += itemTotal;
      items.push({
        service,
        selectedAddons: addonsDetail,
        itemTotal
      });
    });

    return {
      items,
      count: this.selectedItems.size,
      total,
      formattedTotal: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(total)
    };
  }

  _notify() {
    this._saveToStorage();
    const state = this.getState();
    this.listeners.forEach(cb => cb(state));
  }

  _saveToStorage() {
    try {
      const serializable = [];
      this.selectedItems.forEach(({ service, selectedAddons }) => {
        serializable.push({
          serviceId: service.id,
          addons: Array.from(selectedAddons)
        });
      });
      localStorage.setItem('gabriela_beauty_cart', JSON.stringify(serializable));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }

  _loadFromStorage() {
    // Loaded when services are registered
  }
}
