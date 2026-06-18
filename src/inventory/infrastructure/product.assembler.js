import { Product } from '../domain/model/product.entity.js';

/**
 * Product Assembler.
 * Maps between Product Resources (API DTOs) and Product Entities.
 *
 * The .NET backend serializes responses in camelCase by default.
 */
export class ProductAssembler {
  /**
   * Maps a resource to a domain entity.
   * @param {Object} resource - The product data from the API.
   * @returns {Product} The product entity.
   */
  toEntityFromResource(resource) {
    return new Product(
      resource.id,
      resource.branchId,
      resource.category,
      resource.name,
      resource.sku,
      resource.description,
      resource.salePrice,
      resource.minimumStock,
      resource.currentStock,
      resource.batches || [],
      resource.createdAt,
      resource.updatedAt
    );
  }

  /**
   * Maps an entity back to a resource for API consumption.
   * @param {Product} entity - The product domain entity.
   * @returns {Object} The product resource.
   */
  toResourceFromEntity(entity) {
    return {
      id: entity.id,
      branchId: entity.branchId,
      category: entity.category,
      name: entity.name,
      sku: entity.sku,
      description: entity.description,
      salePrice: entity.salePrice,
      minimumStock: entity.minimumStock,
      currentStock: entity.currentStock
    };
  }
}
