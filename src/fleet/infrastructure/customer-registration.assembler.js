import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js';
import { CustomerRegistration } from '../domain/model/customer-registration.entity.js';
import { CustomerRegistrationResponse, CustomerRegistrationsListResponse } from './customer-registrations-response.js';

/**
 * CustomerRegistrationAssembler.
 * Maps backend customer registration resources to CustomerRegistration domain entities.
 */
export class CustomerRegistrationAssembler extends BaseAssembler {
  /**
   * @param {CustomerRegistrationResponse} resource
   * @returns {CustomerRegistration}
   */
  toEntityFromResource(resource) {
    return new CustomerRegistration(
      resource.id,
      resource.branch_id,
      resource.customer_id,
      resource.registered_at,
      resource.unregistered_at
    );
  }

  /**
   * @param {CustomerRegistration} entity
   * @returns {CustomerRegistrationResponse}
   */
  toResourceFromEntity(entity) {
    return {
      id: entity.id,
      branch_id: entity.branchId,
      customer_id: entity.customerId,
      registered_at: entity.registeredAt,
      unregistered_at: entity.unregisteredAt,
    };
  }

  /**
   * @param {CustomerRegistrationsListResponse | CustomerRegistrationResponse[]} response
   * @returns {CustomerRegistration[]}
   */
  toEntitiesFromResponse(response) {
    const data = Array.isArray(response) ? response : response.data || [];
    return data.map((resource) => this.toEntityFromResource(resource));
  }
}