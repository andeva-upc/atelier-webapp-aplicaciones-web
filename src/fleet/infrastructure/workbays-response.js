/**
 * @typedef {object} WorkBayResponse
 * @property {string} id
 * @property {string} branch_id
 * @property {string} status
 * @property {number} internal_number
 * @property {number} version
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [deleted_at]
 */
export const WorkBayResponse = {}; // Export to make it resolvable

/**
 * @typedef {object} WorkBaysListResponse
 * @property {WorkBayResponse[]} data
 */
export const WorkBaysListResponse = {}; // Export to make it resolvable