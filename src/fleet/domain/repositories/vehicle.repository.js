import { Vehicle } from '../model/vehicle.entity.js';

export class VehicleRepository {
  /**
   * @returns {Promise<Vehicle[]>}
   */
  async getAll() {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {Vehicle} vehicle
   * @returns {Promise<Vehicle>}
   */
  async create(vehicle) {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {string} id
   * @param {Vehicle} vehicle
   * @returns {Promise<Vehicle>}
   */
  async update(id, vehicle) {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error('Method not implemented.');
  }
}