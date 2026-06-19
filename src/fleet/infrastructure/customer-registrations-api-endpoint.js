import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint.js';
import { CustomerRegistrationAssembler } from './customer-registration.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * CustomerRegistrationsApiEndpoint.
 * Handles direct HTTP operations for the CustomerRegistration resource.
 */
export class CustomerRegistrationsApiEndpoint extends BaseApiEndpoint {
  constructor() {
    const endpointUrl = `${environment.platformProviderApiBaseUrl}/customer-registrations`; // Assuming a /customer-registrations endpoint
    super(endpointUrl, new CustomerRegistrationAssembler());
  }
}