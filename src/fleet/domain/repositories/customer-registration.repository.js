import { CustomerRegistration } from '../model/customer-registration.entity.js';

export class CustomerRegistrationRepository {
  /**
   * @returns {Promise<CustomerRegistration[]>}
   */
  async getAll() {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {CustomerRegistration} customerRegistration
   * @returns {Promise<CustomerRegistration>}
   */
  async create(customerRegistration) {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {string} id
   * @param {CustomerRegistration} customerRegistration
   * @returns {Promise<CustomerRegistration>}
   */
  async update(id, customerRegistration) {
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