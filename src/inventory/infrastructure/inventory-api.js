import axios from 'axios';
import { ProductAssembler } from './product.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * InventoryApi.
 * Infrastructure service for handling HTTP requests related to the Products (Inventory) resource.
 *
 * NOTE: The mock backend (json-server at atelier-backend-mock.onrender.com) maps /api/v1/* → /*
 * so it does NOT support REST sub-paths like /inventory/products/branch/{id}.
 * Products are stored in the top-level "products" collection and must be filtered via query params.
 *
 * Base URL for list/create/update/delete: {platformProviderApiBaseUrl}/products
 * Base URL for batches: {platformProviderApiBaseUrl}/inventory_batches
 */
export class InventoryApi {
  constructor() {
    this.assembler = new ProductAssembler();

    // Axios client for the /products resource
    this.http = axios.create({
      baseURL: `${environment.platformProviderApiBaseUrl}${environment.platformProviderProductsEndpointPath}`,
      headers: { 'Content-Type': 'application/json' }
    });

    // Axios client for the /inventory_batches resource
    this.batchHttp = axios.create({
      baseURL: `${environment.platformProviderApiBaseUrl}${environment.platformProviderInventoryBatchesEndpointPath}`,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Fetches products by branch ID using query params (json-server compatible).
   * Calls: GET /api/v1/products?branch_id={branchId}
   * @param {string} branchId
   * @returns {Promise<Array>} A list of product entities.
   */
  async getByBranchId(branchId) {
    try {
      const response = await this.http.get('', { params: { branch_id: branchId } });
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(resource => this.assembler.toEntityFromResource(resource));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch products by branch:', error);
      throw error;
    }
  }

  /**
   * Retrieves a single product by ID, including its batches.
   * Calls: GET /api/v1/products/{id}?_embed=inventory_batches
   * @param {string|number} id
   * @returns {Promise<Object>} The product entity.
   */
  async getById(id) {
    try {
      const response = await this.http.get(`/${id}`, { params: { _embed: 'inventory_batches' } });
      return this.assembler.toEntityFromResource(response.data);
    } catch (error) {
      console.error(`Failed to fetch product with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new product.
   * Calls: POST /api/v1/products
   * @param {Object} entity - The product domain entity.
   * @returns {Promise<Object>} The created product entity.
   */
  async create(entity) {
    try {
      const resource = this.assembler.toResourceFromEntity(entity);
      const response = await this.http.post('', resource);
      return this.assembler.toEntityFromResource(response.data);
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  }

  /**
   * Updates an existing product (PUT).
   * Calls: PUT /api/v1/products/{id}
   * @param {Object} entity
   * @param {string|number} id
   * @returns {Promise<Object>} The updated product entity.
   */
  async update(entity, id) {
    try {
      const resource = this.assembler.toResourceFromEntity(entity);
      const response = await this.http.put(`/${id}`, resource);
      return this.assembler.toEntityFromResource(response.data);
    } catch (error) {
      console.error(`Failed to update product with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Adds a new batch to a product.
   * Calls: POST /api/v1/inventory_batches
   * The json-server does not support nested sub-routes, so batches are stored in a
   * separate top-level collection and linked via product_id.
   * @param {string} productId
   * @param {Object} batchData { quantity, acquisitionCost }
   * @returns {Promise<Object>} The created batch resource.
   */
  async addBatch(productId, batchData) {
    try {
      const payload = {
        product_id: productId,
        initial_quantity: batchData.quantity,
        available_quantity: batchData.quantity,
        acquisition_cost: batchData.acquisitionCost,
        created_at: new Date().toISOString()
      };
      const response = await this.batchHttp.post('', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to add batch to product:', error);
      throw error;
    }
  }
}
