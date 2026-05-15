/**
 * Product Entity.
 * Represents a product in the inventory.
 */
export class Product {
  /**
   * @param {string} id - Unique identifier.
   * @param {string} sku - Stock Keeping Unit.
   * @param {string} name - Product name.
   * @param {string} category - Category name.
   * @param {number} unitPrice - Selling price.
   * @param {number} unitCost - Cost price.
   * @param {number} currentStock - Current stock level.
   * @param {number} minimumStock - Minimum stock level for alerts.
   */
  constructor(id, sku, name, category, unitPrice, unitCost, currentStock, minimumStock) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.category = category;
    this.unitPrice = unitPrice;
    this.unitCost = unitCost;
    this.currentStock = currentStock;
    this.minimumStock = minimumStock;
  }

  /**
   * Checks if the product is in low stock.
   * @returns {boolean}
   */
  isLowStock() {
    return this.currentStock < this.minimumStock;
  }
}
