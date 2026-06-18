import { Product } from '../domain/model/product.entity.js';

/**
 * Product Assembler.
 * Maps between Product Resources (mock API DTOs in snake_case) and Product Domain Entities (camelCase).
 *
 * The mock backend (json-server) stores products with snake_case fields:
 *   product_name, branch_id, category_id, current_selling_price, current_stock, minimum_stock, etc.
 */
export class ProductAssembler {
  /**
   * Maps a resource (snake_case DTO from json-server) to a Product domain entity.
   * @param {Object} resource - The product data from the mock API.
   * @returns {Product} The product entity.
   */
  toEntityFromResource(resource) {
    // Map batches: json-server embeds them as 'inventory_batches' when using ?_embed=inventory_batches
    const batches = resource.inventory_batches || resource.batches || [];

    return new Product(
      resource.id,
      resource.branch_id,
      resource.category_id,       // category_id is the category key in json-server
      resource.product_name,       // product_name is the name field in json-server
      resource.sku,
      resource.description,
      resource.current_selling_price,
      resource.minimum_stock,
      resource.current_stock ?? 0,
      batches,
      resource.created_at,
      resource.updated_at
    );
  }

  /**
   * Maps a Product domain entity back to a resource DTO for json-server (snake_case).
   * @param {Product} entity - The product domain entity.
   * @returns {Object} The product resource for API consumption.
   */
  toResourceFromEntity(entity) {
    const resource = {
      branch_id: entity.branchId,
      category_id: entity.category,
      product_name: entity.name,
      sku: entity.sku,
      description: entity.description,
      current_selling_price: entity.salePrice,
      minimum_stock: entity.minimumStock,
      current_stock: entity.currentStock ?? 0,
      version: 0,
      created_at: entity.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: '',
      created_by: entity.branchId,
      updated_by: ''
    };

    // Only include id if it exists (not when creating a new product)
    if (entity.id) {
      resource.id = entity.id;
    }

    return resource;
  }
}
