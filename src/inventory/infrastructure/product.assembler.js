import { Product } from '../domain/model/product.entity.js';

/**
 * Product Assembler.
 * Maps between Product Resources (API DTOs) and Product Entities.
 */
export class ProductAssembler {
  /**
   * Maps a resource to a domain entity.
   * @param {Object} resource - The product data from the API (snake_case).
   * @returns {Product} The product entity (camelCase).
   */
  toEntityFromResource(resource) {
    return new Product(
      resource.id,
      resource.sku,
      resource.name,
      resource.category,
      resource.unit_price,
      resource.unit_cost,
      resource.current_stock,
      resource.minimum_stock
    );
  }

  /**
   * Maps an entity back to a resource for API consumption.
   * @param {Product} entity - The product domain entity.
   * @returns {Object} The product resource (snake_case).
   */
  toResourceFromEntity(entity) {
    return {
      id: entity.id,
      sku: entity.sku,
      name: entity.name,
      category: entity.category,
      unit_price: entity.unitPrice,
      unit_cost: entity.unitCost,
      current_stock: entity.currentStock,
      minimum_stock: entity.minimumStock
    };
  }
}
