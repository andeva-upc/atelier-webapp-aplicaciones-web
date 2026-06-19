import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint.js';
import { VehicleAssembler } from './vehicle.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * VehiclesApiEndpoint.
 * Handles direct HTTP operations for the Vehicle resource.
 */
export class VehiclesApiEndpoint extends BaseApiEndpoint {
  constructor() {
    const endpointUrl = `${environment.platformProviderApiBaseUrl}/vehicles`; // Assuming a /vehicles endpoint
    super(endpointUrl, new VehicleAssembler());
  }
}