/**
 * @typedef {object} CustomerRegistrationResponse
 * @property {string} id
 * @property {string} branch_id
 * @property {string} customer_id
 * @property {string} registered_at
 * @property {string | null} [unregistered_at]
 */
export const CustomerRegistrationResponse = {}; // Export to make it resolvable

/**
 * @typedef {object} CustomerRegistrationsListResponse
 * @property {CustomerRegistrationResponse[]} data
 */
export const CustomerRegistrationsListResponse = {}; // Export to make it resolvable