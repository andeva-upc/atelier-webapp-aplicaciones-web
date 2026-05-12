/**
 * Environment configuration file.
 * Integrates Vite environment variables for use across the application.
 */
export const environment = {
  /**
   * The base URL for the backend API.
   * @type {string}
   */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
};
