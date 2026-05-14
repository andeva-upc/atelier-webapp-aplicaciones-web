import axios from 'axios';
import { BaseApi } from './base-api.js';

/**
 * Generic Base Class for REST API Endpoints.
 * Automatically translates Resource DTOs to Domain Entities using the injected Assembler.
 * 
 * This is the JavaScript implementation of the Angular BaseApiEndpoint.
 * It uses Axios for network requests and handles asynchronous operations via Promises.
 * 
 * @public
 */
export class BaseApiEndpoint extends BaseApi {
  /**
   * @param {string} endpointUrl - The fully qualified URL of the target resource.
   * @param {Object} assembler - The assembler used for domain mapping.
   */
  constructor(endpointUrl, assembler) {
    super();
    if (this.constructor === BaseApiEndpoint) {
      throw new TypeError("Cannot construct BaseApiEndpoint instances directly (abstract class)");
    }

    this.endpointUrl = endpointUrl;
    this.assembler = assembler;

    /**
     * Customized Axios client for this specific resource.
     */
    this.http = axios.create({
      baseURL: this.endpointUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Retrieves all items from the collection.
   * @returns {Promise<Array>} A list of domain entities.
   */
  async getAll() {
    try {
      const response = await this.http.get('');
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(resource => this.assembler.toEntityFromResource(resource));
      }
      return this.assembler.toEntitiesFromResponse(data);
    } catch (error) {
      return this.handleError('Failed to fetch entities')(error);
    }
  }

  /**
   * Retrieves a single item by its ID.
   * @param {string|number} id - The unique identifier of the resource.
   * @returns {Promise<Object>} The domain entity.
   */
  async getById(id) {
    try {
      const response = await this.http.get(`/${id}`);
      return this.assembler.toEntityFromResource(response.data);
    } catch (error) {
      return this.handleError(`Failed to fetch entity with id ${id}`)(error);
    }
  }

  /**
   * Performs searching and filtering using query parameters.
   * @param {Object} params - The query parameters for filtering.
   * @returns {Promise<Array>} A list of filtered domain entities.
   */
  async find(params = {}) {
    try {
      const response = await this.http.get('', { params });
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(resource => this.assembler.toEntityFromResource(resource));
      }
      return this.assembler.toEntitiesFromResponse(data);
    } catch (error) {
      return this.handleError('Failed to search entities')(error);
    }
  }

  /**
   * Creates a new resource entry.
   * @param {Object} entity - The domain entity to be created.
   * @returns {Promise<Object>} The created domain entity.
   */
  async create(entity) {
    try {
      const resource = this.assembler.toResourceFromEntity(entity);
      const response = await this.http.post('', resource);
      return this.assembler.toEntityFromResource(response.data);
    } catch (error) {
      return this.handleError('Failed to create entity')(error);
    }
  }

  /**
   * Updates an existing resource completely (PUT).
   * @param {Object} entity - The domain entity with updated data.
   * @param {string|number} id - The identifier of the resource to update.
   * @returns {Promise<Object>} The updated domain entity.
   */
  async update(entity, id) {
    try {
      const resource = this.assembler.toResourceFromEntity(entity);
      const response = await this.http.put(`/${id}`, resource);
      return this.assembler.toEntityFromResource(response.data);
    } catch (error) {
      return this.handleError(`Failed to update entity with id ${id}`)(error);
    }
  }

  /**
   * Performs a partial update on a resource (PATCH).
   * @param {string|number} id - The identifier of the resource.
   * @param {Object} partialResource - The partial DTO data for update.
   * @returns {Promise<Object>} The updated domain entity.
   */
  async patch(id, partialResource) {
    try {
      const response = await this.http.patch(`/${id}`, partialResource);
      return this.assembler.toEntityFromResource(response.data);
    } catch (error) {
      return this.handleError(`Failed to patch entity with id ${id}`)(error);
    }
  }

  /**
   * Deletes a resource by its identifier.
   * @param {string|number} id - The identifier of the resource to delete.
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await this.http.delete(`/${id}`);
    } catch (error) {
      return this.handleError(`Failed to delete entity with id ${id}`)(error);
    }
  }
}
