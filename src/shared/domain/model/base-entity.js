/**
 * Base entity class representing the core contract for domain entities.
 * In Domain-Driven Design (DDD), an entity is defined by its unique identity.
 */
export class BaseEntity {
  /**
   * @param {number} id - The unique identifier for this entity.
   */
  constructor(id) {
    if (this.constructor === BaseEntity) {
      throw new TypeError("Cannot construct BaseEntity instances directly (abstract class)");
    }

    if (id === undefined || id === null) {
      throw new Error("BaseEntity requires a unique identifier (id)");
    }

    /**
     * The unique identifier for this entity.
     * @type {number}
     */
    this.id = id;
  }
}
