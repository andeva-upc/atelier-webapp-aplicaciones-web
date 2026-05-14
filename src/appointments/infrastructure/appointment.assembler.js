import { Appointment, AppointmentStatus } from '../domain/model/appointment.entity.js';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js';

/**
 * AppointmentAssembler.
 * Maps backend appointment resources to Appointment domain entities.
 */
export class AppointmentAssembler extends BaseAssembler {
  toEntityFromResource(resource) {
    const customer = resource.customer || null;
    const vehicle = resource.vehicle || null;

    const customerName = customer?.full_name
      || resource.pre_registered_full_name
      || resource.customer_name
      || 'Cliente sin registrar';

    const customerPhone = customer?.phone
      || resource.pre_registered_phone
      || resource.customer_phone
      || 'Sin teléfono';

    const vehicleSummary = vehicle
      ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.plate_number || ''}`.trim()
      : resource.pre_registered_vehicle_brand_model
        || resource.pre_registered_vehicle_plate
        || resource.vehicle_summary
        || 'Vehículo por registrar';

    return new Appointment(
      resource.id,
      resource.workshop_id,
      resource.branch_id,
      resource.appointment_date || resource.created_at || new Date().toISOString(),
      resource.status || AppointmentStatus.SCHEDULED,
      customerName,
      customerPhone,
      vehicleSummary,
      resource.service_type || 'Revisión general',
      resource.mechanic_name || 'Luis P.',
      resource.notes || 'Sin observaciones registradas.',
      resource.version ?? 0,
      resource.customer_id ?? null,
      resource.vehicle_id ?? null,
      resource.deleted_at ?? null
    );
  }

  toResourceFromEntity(entity) {
    return {
      id: entity.id,
      workshop_id: entity.workshopId,
      branch_id: entity.branchId,
      customer_id: entity.customerId,
      vehicle_id: entity.vehicleId,
      appointment_date: entity.appointmentDate,
      status: entity.status,
      service_type: entity.serviceType,
      mechanic_name: entity.mechanicName,
      notes: entity.notes,
      pre_registered_full_name: entity.customerId ? undefined : entity.customerName,
      pre_registered_phone: entity.customerId ? undefined : entity.customerPhone,
      pre_registered_vehicle_plate: entity.vehicleId ? undefined : entity.vehicleSummary,
      version: entity.version,
      deleted_at: entity.deletedAt
    };
  }

  toEntitiesFromResponse(response) {
    const data = Array.isArray(response) ? response : (response.data || []);
    return data.map((resource) => this.toEntityFromResource(resource));
  }
}
