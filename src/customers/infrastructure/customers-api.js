import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint.js';
import { CustomerAssembler } from './customer.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * CustomersApi.
 * Infrastructure service for handling HTTP requests related to the Customers resource.
 * 
 * Extends BaseApiEndpoint to leverage generic CRUD operations and automatic 
 * DTO-to-Entity mapping via CustomerAssembler.
 * 
 * @public
 */
export class CustomersApi extends BaseApiEndpoint {
  constructor() {
    /**
     * Initializes the service with the target endpoint URL and the domain assembler.
     */
    super(`${environment.apiBaseUrl}/customers`, new CustomerAssembler());
  }

  /**
   * Example of a specialized method for the Customers context.
   * Finds a customer by their document number.
   * 
   * @param {string} documentNumber - The DNI/RUC to search for.
   * @returns {Promise<Object|null>} The customer entity if found.
   */
  async findByDocumentNumber(documentNumber) {
    const results = await this.find({ document_number: documentNumber });
    return results.length > 0 ? results[0] : null;
  }
}
