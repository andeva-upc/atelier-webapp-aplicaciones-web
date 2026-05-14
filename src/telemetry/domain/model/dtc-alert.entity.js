import { BaseEntity } from '../../../shared/domain/model/base-entity.js';

/**
 * DtcAlert Entity.
 * Represents a Diagnostic Trouble Code alert for a vehicle.
 */
export class DtcAlert extends BaseEntity {
  /**
   * @param {string|number} id - Unique identifier.
   * @param {string} vehicleId - ID of the vehicle.
   * @param {string} code - DTC code (e.g., P0301).
   * @param {string} severity - Severity level (CRITICAL, MEDIUM, LOW).
   * @param {string} description - Human-readable description of the fault.
   * @param {boolean} isActive - Whether the alert is currently active.
   * @param {string} [timestamp] - ISO date string of the alert.
   */
  constructor(id, vehicleId, code, severity, description, isActive, timestamp = new Date().toISOString()) {
    super(id);
    this.vehicleId = vehicleId;
    this.code = code;
    this.severity = severity;
    this.description = description;
    this.isActive = isActive;
    this.timestamp = timestamp;
  }

  /**
   * Gets the severity label key for i18n.
   * @returns {string}
   */
  get severityKey() {
    return `telemetry.severity.${this.severity.toLowerCase()}`;
  }
}
