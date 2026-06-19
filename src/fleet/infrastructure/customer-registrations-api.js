import { CustomerRegistrationRepository } from '../domain/repositories/customer-registration.repository.js';
import { CustomerRegistrationsApiEndpoint } from './customer-registrations-api-endpoint.js';
import { CustomerRegistrationAssembler } from './customer-registration.assembler.js';

/**
 * CustomerRegistrationsApi.
 * Infrastructure service for customer registration HTTP operations, implementing the CustomerRegistrationRepository contract.
 */
export class CustomerRegistrationsApi extends CustomerRegistrationRepository {
  constructor() {
    super();
    this.customerRegistrationsEndpoint = new CustomerRegistrationsApiEndpoint();
    this.assembler = new CustomerRegistrationAssembler();
  }

  /**
   * @returns {Promise<CustomerRegistration[]>}
   */
  async getAll() {
    const response = await this.customerRegistrationsEndpoint.getAll();
    return this.assembler.toEntitiesFromResponse(response);
  }

  /**
   * @param {CustomerRegistration} customerRegistration
   * @returns {Promise<CustomerRegistration>}
   */
  async create(customerRegistration) {
    const resource = this.assembler.toResourceFromEntity(customerRegistration);
    const response = await this.customerRegistrationsEndpoint.create(resource);
    return this.assembler.toEntityFromResource(response);
  }

  /**
   * @param {string} id
   * @param {CustomerRegistration} customerRegistration
   * @returns {Promise<CustomerRegistration>}
   */
  async update(id, customerRegistration) {
    const resource = this.assembler.toResourceFromEntity(customerRegistration);
    const response = await this.customerRegistrationsEndpoint.update(id, resource);
    return this.assembler.toEntityFromResource(response);
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.customerRegistrationsEndpoint.delete(id);
  }
}