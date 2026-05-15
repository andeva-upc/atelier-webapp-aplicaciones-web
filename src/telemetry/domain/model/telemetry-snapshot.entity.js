import { BaseEntity } from '../../../shared/domain/model/base-entity.js';

/**
 * TelemetrySnapshot Entity.
 * Represents a specific data point captured by an OBD2 device.
 */
export class TelemetrySnapshot extends BaseEntity {
  /**
   * @param {string|number} id - Unique identifier.
   * @param {string} deviceId - ID of the OBD2 device.
   * @param {string} timestamp - ISO date string of the capture.
   * @param {number} rpm - Engine RPM.
   * @param {number} speed - Vehicle speed in km/h.
   * @param {number} fuelLevel - Fuel level percentage (0-100).
   * @param {number} temperature - Coolant temperature in Celsius.
   * @param {number} odometer - Current odometer reading in km.
   */
  constructor(id, deviceId, timestamp, rpm, speed, fuelLevel, temperature, odometer) {
    super(id);
    this.deviceId = deviceId;
    this.timestamp = timestamp;
    this.rpm = rpm;
    this.speed = speed;
    this.fuelLevel = fuelLevel;
    this.temperature = temperature;
    this.odometer = odometer;
  }

  /**
   * Formats the timestamp for display in charts.
   * @returns {string}
   */
  get timeLabel() {
    return new Date(this.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
