import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js';
import { WorkBay } from '../domain/model/workbay.entity.js';
import { WorkBayResponse, WorkBaysListResponse } from './workbays-response.js';

/**
 * WorkBayAssembler.
 * Maps backend workbay resources to WorkBay domain entities.
 */
export class WorkBayAssembler extends BaseAssembler {
  /**
   * @param {WorkBayResponse} resource
   * @returns {WorkBay}
   */
  toEntityFromResource(resource) {
    return new WorkBay(
      resource.id,
      resource.branch_id,
      resource.status,
      resource.internal_number
    );
  }

  /**
   * @param {WorkBay} entity
   * @returns {WorkBayResponse}
   */
  toResourceFromEntity(entity) {
    return {
      id: entity.id,
      branch_id: entity.branchId,
      status: entity.status,
      internal_number: entity.internalNumber,
      version: 0, // Assuming version is handled by backend or default
      created_at: new Date().toISOString(), // Placeholder
      updated_at: new Date().toISOString(), // Placeholder
    };
  }

  /**
   * @param {WorkBaysListResponse | WorkBayResponse[]} response
   * @returns {WorkBay[]}
   */
  toEntitiesFromResponse(response) {
    const data = Array.isArray(response) ? response : response.data || [];
    return data.map((resource) => this.toEntityFromResource(resource));
  }
}