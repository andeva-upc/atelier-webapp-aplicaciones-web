import { WorkBayRepository } from '../domain/repositories/workbay.repository.js';
import { WorkBaysApiEndpoint } from './workbays-api-endpoint.js';
import { WorkBayAssembler } from './workbay.assembler.js';

/**
 * WorkBaysApi.
 * Infrastructure service for workbay HTTP operations, implementing the WorkBayRepository contract.
 */
export class WorkBaysApi extends WorkBayRepository {
  constructor() {
    super();
    this.workbaysEndpoint = new WorkBaysApiEndpoint();
    this.assembler = new WorkBayAssembler();
  }

  /**
   * @returns {Promise<WorkBay[]>}
   */
  async getAll() {
    const response = await this.workbaysEndpoint.getAll();
    return this.assembler.toEntitiesFromResponse(response);
  }

  /**
   * @param {WorkBay} workBay
   * @returns {Promise<WorkBay>}
   */
  async create(workBay) {
    const resource = this.assembler.toResourceFromEntity(workBay);
    const response = await this.workbaysEndpoint.create(resource);
    return this.assembler.toEntityFromResource(response);
  }

  /**
   * @param {string} id
   * @param {WorkBay} workBay
   * @returns {Promise<WorkBay>}
   */
  async update(id, workBay) {
    const resource = this.assembler.toResourceFromEntity(workBay);
    const response = await this.workbaysEndpoint.update(id, resource);
    return this.assembler.toEntityFromResource(response);
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.workbaysEndpoint.delete(id);
  }
}