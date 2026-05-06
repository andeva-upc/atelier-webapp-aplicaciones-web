/**
 * Base assembler class representing the contract for data mapping (Mappers/Assemblers).
 * It isolates the core domain from external representation changes (DTOs / network resources).
 */
export class BaseAssembler {
  constructor() {
    if (this.constructor === BaseAssembler) {
      throw new TypeError("Cannot construct BaseAssembler instances directly (abstract class)");
    }
  }

  /**
   * Maps a network resource (DTO) to a domain entity.
   * @param {Object} resource - The DTO from the network.
   * @returns {import('../domain/model/base-entity').BaseEntity} The domain entity.
   */
  toEntityFromResource(resource) {
    throw new Error("toEntityFromResource(resource) must be implemented by subclass");
  }

  /**
   * Maps a domain entity to a network resource (DTO).
   * @param {import('../domain/model/base-entity').BaseEntity} entity - The domain entity.
   * @returns {Object} The DTO for the network.
   */
  toResourceFromEntity(entity) {
    throw new Error("toResourceFromEntity(entity) must be implemented by subclass");
  }

  /**
   * Maps a bulk response (from a custom payload) to an array of domain entities.
   * @param {Object} response - The bulk network response.
   * @returns {import('../domain/model/base-entity').BaseEntity[]} Array of domain entities.
   */
  toEntitiesFromResponse(response) {
    return [];
  }
}
