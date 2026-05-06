import axios from 'axios';
import { BaseApi } from './base-api.js';

/**
 * Generic orchestration endpoint class for standard REST CRUD operations.
 * Implements a single network client instance via Axios and automatically maps responses.
 */
export class BaseApiEndpoint extends BaseApi {
  /**
   * @param {string} endpointUrl - The fully qualified URL of the target resource.
   * @param {import('./base-assembler').BaseAssembler} assembler - The assembler used for domain mapping.
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
      baseURL: endpointUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Fetches all resources and converts them to domain entities.
   * @returns {Promise<import('../domain/model/base-entity').BaseEntity[]>} A list of domain entities.
   */
  async getAll() {
    try {
      const response = await this.http.get('');
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(res => this.assembler.toEntityFromResource(res));
      }
      return this.assembler.toEntitiesFromResponse(data);
    } catch (error) {
      return this.handleError('Failed to fetch entities')(error);
    }
  }

  /**
   * Fetches a resource by unique identifier and converts it to a domain entity.
   * @param {number|string} id - The resource identifier.
   * @returns {Promise<import('../domain/model/base-entity').BaseEntity>} The domain entity.
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
   * Creates a resource on the server from a domain entity.
   * @param {import('../domain/model/base-entity').BaseEntity} entity - The domain entity to create.
   * @returns {Promise<import('../domain/model/base-entity').BaseEntity>} The created domain entity.
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
   * Replaces a resource on the server using put.
   * @param {import('../domain/model/base-entity').BaseEntity} entity - The updated domain entity.
   * @param {number|string} id - The identifier of the resource to replace.
   * @returns {Promise<import('../domain/model/base-entity').BaseEntity>} The updated domain entity.
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
   * Partially updates a resource on the server using patch.
   * @param {number|string} id - The identifier of the resource.
   * @param {Object} partialResource - The partial DTO data to update.
   * @returns {Promise<import('../domain/model/base-entity').BaseEntity>} The updated domain entity.
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
   * Deletes a resource on the server.
   * @param {number|string} id - The identifier of the resource to delete.
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await this.http.delete(`/${id}`);
    } catch (error) {
      return this.handleError(`Failed to delete entity with id ${id}`)(error);
    }
  }

  /**
   * Searches and filters resources based on query parameters.
   * @param {Object} params - The query parameters.
   * @returns {Promise<import('../domain/model/base-entity').BaseEntity[]>} A list of filtered domain entities.
   */
  async find(params = {}) {
    try {
      const response = await this.http.get('', { params });
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(res => this.assembler.toEntityFromResource(res));
      }
      return this.assembler.toEntitiesFromResponse(data);
    } catch (error) {
      return this.handleError('Failed to search entities')(error);
    }
  }
}
