import { EmployeeRegistration } from '../model/employee-registration.entity.js';

export class EmployeeRegistrationRepository {
  /**
   * @returns {Promise<EmployeeRegistration[]>}
   */
  async getAll() {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {EmployeeRegistration} employeeRegistration
   * @returns {Promise<EmployeeRegistration>}
   */
  async create(employeeRegistration) {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {string} id
   * @param {EmployeeRegistration} employeeRegistration
   * @returns {Promise<EmployeeRegistration>}
   */
  async update(id, employeeRegistration) {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error('Method not implemented.');
  }
}