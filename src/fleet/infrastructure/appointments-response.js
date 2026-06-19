/**
 * @typedef {object} AppointmentResponse
 * @property {string} id
 * @property {string} workshop_id
 * @property {string} branch_id
 * @property {string} [customer_id]
 * @property {string} [vehicle_id]
 * @property {string} appointment_date
 * @property {string} status
 * @property {string} [pre_registered_full_name]
 * @property {string} [pre_registered_phone]
 * @property {string} [pre_registered_vehicle_brand_model]
 * @property {string} [pre_registered_vehicle_plate]
 * @property {string} [vehicle_summary]
 * @property {string} service_type
 * @property {string} mechanic_name
 * @property {string} notes
 * @property {number} version
 * @property {string} [created_at]
 * @property {string} [updated_at]
 * @property {string} [deleted_at]
 * @property {object} [customerProfile]
 * @property {object} [customerUser]
 * @property {object} [vehicle]
 * @property {object} [vehicleModel]
 * @property {object} [branch]
 */
export const AppointmentResponse = {}; // Export to make it resolvable

/**
 * @typedef {object} AppointmentsListResponse
 * @property {AppointmentResponse[]} data
 */
export const AppointmentsListResponse = {}; // Export to make it resolvable