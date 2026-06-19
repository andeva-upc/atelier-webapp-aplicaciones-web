import { BaseEntity } from '../../../../shared/domain/model/base-entity.js';

/**
 * @typedef {object} Vehicle
 * @property {string} id
 * @property {string} workshopId
 * @property {string} customerId
 * @property {string} vehicleModelId
 * @property {string} plateNumber
 * @property {number} year
 * @property {string} vin
 * @property {number} currentMileage
 */
export class Vehicle extends BaseEntity {
  /**
   * @param {string} id
   * @param {string} workshopId
   * @param {string} customerId
   * @param {string} vehicleModelId
   * @param {string} plateNumber
   * @param {number} year
   * @param {string} vin
   * @param {number} currentMileage
   */
  constructor(id, workshopId, customerId, vehicleModelId, plateNumber, year, vin, currentMileage) {
    super(id);
    this.workshopId = workshopId;
    this.customerId = customerId;
    this.vehicleModelId = vehicleModelId;
    this.plateNumber = plateNumber;
    this.year = year;
    this.vin = vin;
    this.currentMileage = currentMileage;
  }
}