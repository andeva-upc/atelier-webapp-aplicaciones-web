import { ErrorHandlingEnabledBaseType } from './error-handling-enabled-base-type.js';

/**
 * Abstract base class for all API service implementations in the infrastructure layer.
 */
export class BaseApi extends ErrorHandlingEnabledBaseType {
  constructor() {
    super();
    if (this.constructor === BaseApi) {
      throw new TypeError("Cannot construct BaseApi instances directly (abstract class)");
    }
  }
}
