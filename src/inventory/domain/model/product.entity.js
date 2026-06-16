/**
 * Product Entity.
 * Represents a product in the inventory.
 */
export class Product {
  /**
   * @param {string} id - Unique identifier.
   * @param {string} branchId - Branch identifier.
   * @param {string} category - Category name.
   * @param {string} name - Product name.
   * @param {string} sku - Stock Keeping Unit.
   * @param {string} description - Product description.
   * @param {number} salePrice - Selling price.
   * @param {number} minimumStock - Minimum stock level for alerts.
   * @param {number} currentStock - Current stock level.
   * @param {Array} batches - List of product batches.
   * @param {string} createdAt - Creation date.
   * @param {string} updatedAt - Update date.
   */
  constructor(
    id,
    branchId,
    category,
    name,
    sku,
    description,
    salePrice,
    minimumStock,
    currentStock = 0,
    batches = [],
    createdAt = null,
    updatedAt = null
  ) {
    this.id = id;
    this.branchId = branchId;
    this.category = category;
    this.name = name;
    this.sku = sku;
    this.description = description;
    this.salePrice = salePrice;
    this.minimumStock = minimumStock;
    this.currentStock = currentStock;
    this.batches = batches;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Checks if the product is in low stock.
   * @returns {boolean}
   */
  isLowStock() {
    return this.currentStock < this.minimumStock;
  }
}
