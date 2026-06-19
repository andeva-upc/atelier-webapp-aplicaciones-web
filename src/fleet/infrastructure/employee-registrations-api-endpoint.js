import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint.js';
import { EmployeeRegistrationAssembler } from './employee-registration.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * EmployeeRegistrationsApiEndpoint.
 * Handles direct HTTP operations for the EmployeeRegistration resource.
 */
export class EmployeeRegistrationsApiEndpoint extends BaseApiEndpoint {
  constructor() {
    const endpointUrl = `${environment.platformProviderApiBaseUrl}/employee-registrations`; // Assuming a /employee-registrations endpoint
    super(endpointUrl, new EmployeeRegistrationAssembler());
  }
}