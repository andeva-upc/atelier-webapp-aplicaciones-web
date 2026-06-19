import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint.js';
import { WorkBayAssembler } from './workbay.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * WorkBaysApiEndpoint.
 * Handles direct HTTP operations for the WorkBay resource.
 */
export class WorkBaysApiEndpoint extends BaseApiEndpoint {
  constructor() {
    const endpointUrl = `${environment.platformProviderApiBaseUrl}/workbays`; // Assuming a /workbays endpoint
    super(endpointUrl, new WorkBayAssembler());
  }
}