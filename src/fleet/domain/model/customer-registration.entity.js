import { BaseEntity } from '../../../../shared/domain/model/base-entity.js';

/**
 * @typedef {object} CustomerRegistration
 * @property {string} id
 * @property {string} branchId
 * @property {string} customerId
 * @property {string} registeredAt
 * @property {string | null} unregisteredAt
 */
export class CustomerRegistration extends BaseEntity {
  /**
   * @param {string} id
   * @param {string} branchId
   * @param {string} customerId
   * @param {string} registeredAt
   * @param {string | null} unregisteredAt
   */
  constructor(id, branchId, customerId, registeredAt, unregisteredAt = null) {
    super(id);
    this.branchId = branchId;
    this.customerId = customerId;
    this.registeredAt = registeredAt;
    this.unregisteredAt = unregisteredAt;
  }
}