import { ErrorHandlingEnabledBaseType } from './error-handling-enabled-base-type.js';

/**
 * Abstract base class for API service implementations.
 *
 * @remarks
 * This class serves as the foundation for all infrastructure service layer APIs.
 * In Domain-Driven Design (DDD), an infrastructure API offers access to 
 * infrastructure services to the application layer.
 *
 * Subclasses should extend this class to define infrastructure-specific API operations
 * while leveraging shared infrastructure patterns and error handling strategies.
 *
 * @public
 */
export class BaseApi extends ErrorHandlingEnabledBaseType {
  constructor() {
    super();
    if (this.constructor === BaseApi) {
      throw new TypeError("Cannot construct BaseApi instances directly (abstract class)");
    }
  }
}
