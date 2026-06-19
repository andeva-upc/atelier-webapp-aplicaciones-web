/**
 * @typedef {object} VehicleResponse
 * @property {string} id
 * @property {string} user_id
 * @property {string} vehicle_model_id
 * @property {string} plate_number
 * @property {number} year
 * @property {string} vin
 * @property {number} current_mileage
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [deleted_at]
 */
export const VehicleResponse = {}; // Export to make it resolvable

/**
 * @typedef {object} VehiclesListResponse
 * @property {VehicleResponse[]} data
 */
export const VehiclesListResponse = {}; // Export to make it resolvable