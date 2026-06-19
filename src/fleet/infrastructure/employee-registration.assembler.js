import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js';
import { EmployeeRegistration } from '../domain/model/employee-registration.entity.js';
import { EmployeeRegistrationResponse, EmployeeRegistrationsListResponse } from './employee-registrations-response.js';

/**
 * EmployeeRegistrationAssembler.
 * Maps backend employee registration resources to EmployeeRegistration domain entities.
 */
export class EmployeeRegistrationAssembler extends BaseAssembler {
  /**
   * @param {EmployeeRegistrationResponse} resource
   * @returns {EmployeeRegistration}
   */
  toEntityFromResource(resource) {
    return new EmployeeRegistration(
      resource.id,
      resource.branch_id,
      resource.employee_id,
      resource.specialty_id,
      resource.salary,
      resource.registered_at,
      resource.unregistered_at
    );
  }

  /**
   * @param {EmployeeRegistration} entity
   * @returns {EmployeeRegistrationResponse}
   */
  toResourceFromEntity(entity) {
    return {
      id: entity.id,
      branch_id: entity.branchId,
      employee_id: entity.employeeId,
      specialty_id: entity.specialtyId,
      salary: entity.salary,
      registered_at: entity.registeredAt,
      unregistered_at: entity.unregisteredAt,
    };
  }

  /**
   * @param {EmployeeRegistrationsListResponse | EmployeeRegistrationResponse[]} response
   * @returns {EmployeeRegistration[]}
   */
  toEntitiesFromResponse(response) {
    const data = Array.isArray(response) ? response : response.data || [];
    return data.map((resource) => this.toEntityFromResource(resource));
  }
}