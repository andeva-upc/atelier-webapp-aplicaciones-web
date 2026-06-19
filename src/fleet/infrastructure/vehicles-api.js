import { VehicleRepository } from '../domain/repositories/vehicle.repository.js';
import { VehiclesApiEndpoint } from './vehicles-api-endpoint.js';
import { VehicleAssembler } from './vehicle.assembler.js';

/**
 * VehiclesApi.
 * Infrastructure service for vehicle HTTP operations, implementing the VehicleRepository contract.
 */
export class VehiclesApi extends VehicleRepository {
  constructor() {
    super();
    this.vehiclesEndpoint = new VehiclesApiEndpoint();
    this.assembler = new VehicleAssembler();
  }

  /**
   * @returns {Promise<Vehicle[]>}
   */
  async getAll() {
    const response = await this.vehiclesEndpoint.getAll();
    return this.assembler.toEntitiesFromResponse(response);
  }

  /**
   * @param {Vehicle} vehicle
   * @returns {Promise<Vehicle>}
   */
  async create(vehicle) {
    const resource = this.assembler.toResourceFromEntity(vehicle);
    const response = await this.vehiclesEndpoint.create(resource);
    return this.assembler.toEntityFromResource(response);
  }

  /**
   * @param {string} id
   * @param {Vehicle} vehicle
   * @returns {Promise<Vehicle>}
   */
  async update(id, vehicle) {
    const resource = this.assembler.toResourceFromEntity(vehicle);
    const response = await this.vehiclesEndpoint.update(id, resource);
    return this.assembler.toEntityFromResource(response);
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.vehiclesEndpoint.delete(id);
  }
}