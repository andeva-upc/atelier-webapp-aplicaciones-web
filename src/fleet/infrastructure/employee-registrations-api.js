import { EmployeeRegistrationRepository } from '../domain/repositories/employee-registration.repository.js';
import { EmployeeRegistrationsApiEndpoint } from './employee-registrations-api-endpoint.js';
import { EmployeeRegistrationAssembler } from './employee-registration.assembler.js';

/**
 * EmployeeRegistrationsApi.
 * Infrastructure service for employee registration HTTP operations, implementing the EmployeeRegistrationRepository contract.
 */
export class EmployeeRegistrationsApi extends EmployeeRegistrationRepository {
  constructor() {
    super();
    this.employeeRegistrationsEndpoint = new EmployeeRegistrationsApiEndpoint();
    this.assembler = new EmployeeRegistrationAssembler();
  }

  /**
   * @returns {Promise<EmployeeRegistration[]>}
   */
  async getAll() {
    const response = await this.employeeRegistrationsEndpoint.getAll();
    return this.assembler.toEntitiesFromResponse(response);
  }

  /**
   * @param {EmployeeRegistration} employeeRegistration
   * @returns {Promise<EmployeeRegistration>}
   */
  async create(employeeRegistration) {
    const resource = this.assembler.toResourceFromEntity(employeeRegistration);
    const response = await this.employeeRegistrationsEndpoint.create(resource);
    return this.assembler.toEntityFromResource(response);
  }

  /**
   * @param {string} id
   * @param {EmployeeRegistration} employeeRegistration
   * @returns {Promise<EmployeeRegistration>}
   */
  async update(id, employeeRegistration) {
    const resource = this.assembler.toResourceFromEntity(employeeRegistration);
    const response = await this.employeeRegistrationsEndpoint.update(id, resource);
    return this.assembler.toEntityFromResource(response);
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.employeeRegistrationsEndpoint.delete(id);
  }
}