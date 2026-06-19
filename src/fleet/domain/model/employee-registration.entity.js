import { BaseEntity } from '../../../../shared/domain/model/base-entity.js';

/**
 * @typedef {object} EmployeeRegistration
 * @property {string} id
 * @property {string} branchId
 * @property {string} employeeId
 * @property {string} specialtyId
 * @property {number} salary
 * @property {string} registeredAt
 * @property {string | null} unregisteredAt
 */
export class EmployeeRegistration extends BaseEntity {
  /**
   * @param {string} id
   * @param {string} branchId
   * @param {string} employeeId
   * @param {string} specialtyId
   * @param {number} salary
   * @param {string} registeredAt
   * @param {string | null} unregisteredAt
   */
  constructor(id, branchId, employeeId, specialtyId, salary, registeredAt, unregisteredAt = null) {
    super(id);
    this.branchId = branchId;
    this.employeeId = employeeId;
    this.specialtyId = specialtyId;
    this.salary = salary;
    this.registeredAt = registeredAt;
    this.unregisteredAt = unregisteredAt;
  }
}