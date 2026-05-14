import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint.js';
import { ProductAssembler } from './product.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * InventoryApi.
 * Infrastructure service for handling HTTP requests related to the Products (Inventory) resource.
 */
export class InventoryApi extends BaseApiEndpoint {
  constructor() {
    super(`${environment.apiBaseUrl}/products`, new ProductAssembler());
  }
}
