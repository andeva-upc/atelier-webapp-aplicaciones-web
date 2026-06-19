/**
 * @typedef {object} EmployeeRegistrationResponse
 * @property {string} id
 * @property {string} branch_id
 * @property {string} employee_id
 * @property {string} specialty_id
 * @property {number} salary
 * @property {string} registered_at
 * @property {string | null} [unregistered_at]
 */

/**
 * @typedef {object} EmployeeRegistrationsListResponse
 * @property {EmployeeRegistrationResponse[]} data
 */
