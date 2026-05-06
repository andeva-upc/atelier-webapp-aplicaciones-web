import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js';
import { Workshop } from '../domain/model/workshop.js';

/**
 * Assembler class responsible for mapping data between Workshop DTOs/resources and Workshop Domain Entities.
 * Maps 'tax_id' from the network to the domain's 'taxId' camelCase property.
 */
export class WorkshopAssembler extends BaseAssembler {
  /**
   * Maps a network resource (DTO) to a Workshop domain entity.
   * @param {Object} resource - The workshop resource from the network.
   * @returns {Workshop} The Workshop domain entity.
   */
  toEntityFromResource(resource) {
    return new Workshop(
      resource.id,
      resource.name,
      resource.tax_id,
      resource.address,
      resource.phone
    );
  }

  /**
   * Maps a Workshop domain entity to a network resource (DTO).
   * @param {Workshop} entity - The Workshop domain entity.
   * @returns {Object} The workshop network resource (DTO).
   */
  toResourceFromEntity(entity) {
    return {
      id: entity.id,
      name: entity.name,
      tax_id: entity.taxId,
      address: entity.address,
      phone: entity.phone
    };
  }

  /**
   * Maps a bulk network response to an array of Workshop domain entities.
   * @param {Object} response - The bulk response.
   * @returns {Workshop[]} Array of Workshop domain entities.
   */
  toEntitiesFromResponse(response) {
    // Standard json-server returns arrays directly, which is handled in BaseApiEndpoint.
    return [];
  }
}
