import { Customer } from '../domain/model/customer.entity.js';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js';

/**
 * CustomerAssembler.
 * Maps between Customer Resource DTOs (from the API) and Customer Domain Entities.
 * 
 * Handles the transformation of snake_case fields from the network into 
 * camelCase properties for the domain model.
 * 
 * @public
 */
export class CustomerAssembler extends BaseAssembler {
  /**
   * Translates a network Resource (DTO) into a clean Domain Entity.
   * @param {Object} resource - The DTO from the API.
   * @returns {Customer} The domain entity.
   */
  toEntityFromResource(resource) {
    // Handling potential name splitting if only full_name is provided by the mock
    let firstName = resource.first_name || '';
    let lastName = resource.last_name || '';
    
    if (resource.full_name && !firstName && !lastName) {
      const parts = resource.full_name.split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    return new Customer(
      resource.id,
      resource.document_type,
      resource.document_number,
      firstName,
      lastName,
      resource.email,
      resource.phone,
      resource.business_name || '',
      resource.total_services || 0,
      resource.last_visit || null
    );
  }

  /**
   * Translates a clean Domain Entity back into a network Resource DTO.
   * @param {Customer} entity - The domain entity.
   * @returns {Object} The DTO for the network.
   */
  toResourceFromEntity(entity) {
    return {
      id: entity.id,
      document_type: entity.documentType,
      document_number: entity.documentNumber,
      first_name: entity.firstName,
      last_name: entity.lastName,
      full_name: entity.fullName, // Providing both for compatibility
      email: entity.email,
      phone: entity.phone,
      business_name: entity.businessName
    };
  }

  /**
   * Translates a wrapped backend response into an array of Domain Entities.
   * @param {Object|Array} response - The API response.
   * @returns {Customer[]}
   */
  toEntitiesFromResponse(response) {
    const data = Array.isArray(response) ? response : (response.data || []);
    return data.map(resource => this.toEntityFromResource(resource));
  }
}
