import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js';
import { Vehicle } from '../domain/model/vehicle.entity.js';
import { VehicleResponse, VehiclesListResponse } from './vehicles-response.js';

/**
 * VehicleAssembler.
 * Maps backend vehicle resources to Vehicle domain entities.
 */
export class VehicleAssembler extends BaseAssembler {
  /**
   * @param {VehicleResponse} resource
   * @returns {Vehicle}
   */
  toEntityFromResource(resource) {
    return new Vehicle(
      resource.id,
      resource.workshop_id, // Assuming workshop_id is part of the response
      resource.user_id, // customerId in domain, user_id in resource
      resource.vehicle_model_id,
      resource.plate_number,
      resource.year,
      resource.vin,
      resource.current_mileage
    );
  }

  /**
   * @param {Vehicle} entity
   * @returns {VehicleResponse}
   */
  toResourceFromEntity(entity) {
    return {
      id: entity.id,
      workshop_id: entity.workshopId,
      user_id: entity.customerId, // customerId in domain, user_id in resource
      vehicle_model_id: entity.vehicleModelId,
      plate_number: entity.plateNumber,
      year: entity.year,
      vin: entity.vin,
      current_mileage: entity.currentMileage,
      created_at: new Date().toISOString(), // Placeholder, ideally from entity
      updated_at: new Date().toISOString(), // Placeholder, ideally from entity
    };
  }

  /**
   * @param {VehiclesListResponse | VehicleResponse[]} response
   * @returns {Vehicle[]}
   */
  toEntitiesFromResponse(response) {
    const data = Array.isArray(response) ? response : response.data || [];
    return data.map((resource) => this.toEntityFromResource(resource));
  }
}