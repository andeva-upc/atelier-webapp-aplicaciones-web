/**
 * Environment configuration file.
 * Integrates Vite environment variables for use across the application.
 */
export const environment = {
  /**
   * The base URL for the backend API.
   * @type {string}
   */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://atelier-backend-mock.onrender.com/api/v1'
};
