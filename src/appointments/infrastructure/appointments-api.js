import axios from 'axios';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint.js';
import { AppointmentAssembler } from './appointment.assembler.js';
import { environment } from '../../environments/environment.js';

/**
 * AppointmentsApi.
 * Infrastructure service for appointment HTTP operations.
 */
export class AppointmentsApi extends BaseApiEndpoint {
  constructor() {
    super(`${environment.apiBaseUrl}/appointments`, new AppointmentAssembler());
    this.baseUrl = environment.apiBaseUrl;
  }

  async getAppointmentsWithRelations(query = '') {
    const [appointmentsResponse, customersResponse, vehiclesResponse] = await Promise.all([
      this.http.get(''),
      axios.get(`${this.baseUrl}/customers`),
      axios.get(`${this.baseUrl}/vehicles`)
    ]);

    const customersById = new Map(
      customersResponse.data
        .filter((customer) => !customer.deleted_at)
        .map((customer) => [customer.id, customer])
    );

    const vehiclesById = new Map(
      vehiclesResponse.data
        .filter((vehicle) => !vehicle.deleted_at)
        .map((vehicle) => [vehicle.id, vehicle])
    );

    const normalizedQuery = query.trim().toLowerCase();

    const enrichedAppointments = appointmentsResponse.data
      .filter((appointment) => !appointment.deleted_at)
      .map((appointment) => ({
        ...appointment,
        customer: customersById.get(appointment.customer_id) || null,
        vehicle: vehiclesById.get(appointment.vehicle_id) || null
      }))
      .map((appointment) => this.assembler.toEntityFromResource(appointment));

    if (!normalizedQuery) {
      return enrichedAppointments;
    }

    return enrichedAppointments.filter((appointment) => {
      return [
        appointment.customerName,
        appointment.customerPhone,
        appointment.vehicleSummary,
        appointment.serviceType,
        appointment.mechanicName,
        appointment.status
      ].some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }
}
