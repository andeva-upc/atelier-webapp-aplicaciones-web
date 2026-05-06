/**
 * Class providing reusable HTTP error translation and normalization for Axios requests.
 */
export class ErrorHandlingEnabledBaseType {
  constructor() {
    if (this.constructor === ErrorHandlingEnabledBaseType) {
      throw new TypeError("Cannot construct ErrorHandlingEnabledBaseType instances directly (abstract class)");
    }
  }

  /**
   * Normalizes and translates HTTP errors into a standardized Error.
   * @param {string} operation - The name of the failed operation.
   * @returns {function(Error): Promise<never>} A rejection promise with the formatted error message.
   */
  handleError(operation) {
    return (error) => {
      let errorMessage = operation;
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        if (error.response.status === 404) {
          errorMessage = `${operation}: Resource not found`;
        } else {
          errorMessage = `${operation}: ${error.response.status} - ${error.response.data?.message || error.response.statusText || 'Unexpected error'}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = `${operation}: No response received from server`;
      } else {
        // Something went wrong while setting up the request
        errorMessage = `${operation}: ${error.message}`;
      }
      return Promise.reject(new Error(errorMessage));
    };
  }
}
