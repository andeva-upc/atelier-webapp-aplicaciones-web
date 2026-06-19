import { Appointment, AppointmentStatus } from '../domain/model/appointment.entity.js';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js';

/**
 * AppointmentAssembler.
 * Maps backend appointment resources to Appointment domain entities.
 */
export class AppointmentAssembler extends BaseAssembler {
  toEntityFromResource(resource) {
    const customerProfile = resource.customerProfile || null;
    const customerUser = resource.customerUser || null;
    const vehicle = resource.vehicle || null;
    const vehicleModel = resource.vehicleModel || null;

    const customerName = this.resolveCustomerName(customerProfile, resource);

    const customerPhone =
        customerUser?.phone ||
        resource.pre_registered_phone ||
        resource.customer_phone ||
        'Sin teléfono';

    const vehicleSummary = vehicle
        ? `${vehicleModel?.brand || 'Marca'} ${vehicleModel?.model || 'Modelo'} - ${vehicle.plate_number}`
        : resource.pre_registered_vehicle_brand_model ||
        resource.pre_registered_vehicle_plate ||
        resource.vehicle_summary ||
        'Vehículo por registrar';

    return new Appointment(
        resource.id,
        resource.workshop_id,
        resource.branch_id,
        this.normalizeDate(resource.appointment_date || resource.created_at || new Date().toISOString()),
        resource.status || AppointmentStatus.SCHEDULED,
        customerName,
        customerPhone,
        vehicleSummary,
        resource.service_type || this.resolveDefaultService(resource.status),
        resource.mechanic_name || 'Por asignar',
        resource.notes || 'Sin observaciones registradas.',
        resource.version ?? 0,
        resource.customer_id ?? null,
        resource.vehicle_id ?? null,
        resource.deletedAt ?? null
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
    const data = Array.isArray(response) ? response : response.data || [];
    return data.map((resource) => this.toEntityFromResource(resource));
  }

  resolveCustomerName(customerProfile, resource) {
    if (!customerProfile) {
      return resource.pre_registered_full_name || 'Cliente sin registrar';
    }

    if (customerProfile.is_corporate && customerProfile.business_name) {
      return customerProfile.business_name;
    }

    const fullName = `${customerProfile.first_name || ''} ${customerProfile.last_name || ''}`.trim();

    return fullName || resource.pre_registered_full_name || 'Cliente sin registrar';
  }

  normalizeDate(value) {
    if (!value) {
      return new Date().toISOString();
    }

    if (value.includes('T')) {
      return value;
    }

    return value.replace(' ', 'T');
  }

  resolveDefaultService(status) {
    if (status === AppointmentStatus.COMPLETED) {
      return 'Revisión general';
    }

    if (status === AppointmentStatus.PENDING_APPROVAL) {
      return 'Diagnóstico';
    }

    return 'Mantenimiento preventivo';
  }
}