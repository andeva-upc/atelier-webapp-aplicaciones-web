import { Workshop } from '../domain/workshop.entity.js';

/**
 * Assembler class to map between Workshop Resource DTOs and Workshop Domain Entities.
 * Maps 'tax_id' from the network to the domain's 'taxId' camelCase property.
 */
export class WorkshopAssembler {
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
   * Maps a bulk network response to domain entities.
   */
  toEntitiesFromResponse(response) {
    return [];
  }
}
