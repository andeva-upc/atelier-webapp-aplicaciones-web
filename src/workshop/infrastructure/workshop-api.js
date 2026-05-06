import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { WorkshopAssembler } from './workshop.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * Service concrete implementation to consume the workshops endpoint (/wm_workshops).
 */
export class WorkshopApi extends BaseEndpoint {
  constructor() {
    super(`${environment.apiBaseUrl}/wm_workshops`, new WorkshopAssembler());
  }
}
