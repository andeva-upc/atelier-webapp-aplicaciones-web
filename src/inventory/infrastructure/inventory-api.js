import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint.js';
import { ProductAssembler } from './product.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * InventoryApi.
 * Infrastructure service for handling HTTP requests related to the Products (Inventory) resource.
 */
export class InventoryApi extends BaseApiEndpoint {
  constructor() {
    super(`${environment.apiBaseUrl}/inventory/products`, new ProductAssembler());
  }

  /**
   * Fetches products by branch ID.
   * @param {string} branchId 
   * @returns {Promise<Array>} A list of product entities.
   */
  async getByBranchId(branchId) {
    try {
      const response = await this.http.get(`/branch/${branchId}`);
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(resource => this.assembler.toEntityFromResource(resource));
      }
      return this.assembler.toEntitiesFromResponse(data);
    } catch (error) {
      return this.handleError('Failed to fetch products by branch')(error);
    }
  }

  /**
   * Adds a new batch to a product.
   * @param {string} productId 
   * @param {Object} batchData { quantity, acquisitionCost }
   * @returns {Promise<Object>} The added batch.
   */
  async addBatch(productId, batchData) {
    try {
      const response = await this.http.post(`/${productId}/batches`, batchData);
      return response.data;
    } catch (error) {
      return this.handleError('Failed to add batch to product')(error);
    }
  }
}
