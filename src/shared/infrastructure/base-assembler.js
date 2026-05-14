/**
 * Abstract Base Class for Data Assemblers (Mappers).
 * Decouples the backend resource schema (DTO) from the pure front-end Domain Model (Entity).
 * 
 * This is the JavaScript implementation of the Angular BaseAssembler interface.
 * Subclasses must implement all methods to provide specific mapping logic between
 * network resources and domain entities.
 * 
 * @public
 */
export class BaseAssembler {
  constructor() {
    if (this.constructor === BaseAssembler) {
      throw new TypeError("Cannot construct BaseAssembler instances directly (abstract class)");
    }
  }

  /**
   * Translates a network Resource (DTO) into a clean Domain Entity.
   * 
   * @param {Object} resource - The DTO resource from the network.
   * @returns {Object} The domain entity.
   */
  toEntityFromResource(resource) {
    throw new Error(`[BaseAssembler] Method 'toEntityFromResource()' not implemented in ${this.constructor.name}`);
  }

  /**
   * Translates a clean Domain Entity back into a network Resource DTO for writing operations.
   * 
   * @param {Object} entity - The domain entity.
   * @returns {Object} The DTO resource for network transmission.
   */
  toResourceFromEntity(entity) {
    throw new Error(`[BaseAssembler] Method 'toResourceFromEntity()' not implemented in ${this.constructor.name}`);
  }

  /**
   * Translates a wrapped backend response into an array of Domain Entities.
   * Handles cases where the response might include metadata or pagination information.
   * 
   * @param {Object} response - The backend response payload.
   * @returns {Array} A list of domain entities.
   */
  toEntitiesFromResponse(response) {
    throw new Error(`[BaseAssembler] Method 'toEntitiesFromResponse()' not implemented in ${this.constructor.name}`);
  }
}
