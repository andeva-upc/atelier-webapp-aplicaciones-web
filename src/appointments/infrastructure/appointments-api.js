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
    const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAppointmentsEndpointPath}`;

    super(endpointUrl, new AppointmentAssembler());

    this.baseUrl = environment.platformProviderApiBaseUrl;
  }

  async getAppointmentsWithRelations(query = '') {
    const [
      appointmentsResponse,
      usersResponse,
      customerProfilesResponse,
      vehiclesResponse,
      vehicleModelsResponse,
      branchesResponse
    ] = await Promise.all([
      this.http.get(''),
      axios.get(`${this.baseUrl}${environment.platformProviderUsersEndpointPath}`),
      axios.get(`${this.baseUrl}${environment.platformProviderCustomerProfilesEndpointPath}`),
      axios.get(`${this.baseUrl}${environment.platformProviderVehiclesEndpointPath}`),
      axios.get(`${this.baseUrl}${environment.platformProviderVehicleModelsEndpointPath}`),
      axios.get(`${this.baseUrl}${environment.platformProviderBranchesEndpointPath}`)
    ]);

    const appointments = this.toArray(appointmentsResponse);
    const users = this.toArray(usersResponse);
    const customerProfiles = this.toArray(customerProfilesResponse);
    const vehicles = this.toArray(vehiclesResponse);
    const vehicleModels = this.toArray(vehicleModelsResponse);
    const branches = this.toArray(branchesResponse);

    const usersById = new Map(
        users
            .filter((user) => !user.deleted_at)
            .map((user) => [user.id, user])
    );

    const customerProfilesById = new Map(
        customerProfiles
            .filter((customerProfile) => !customerProfile.deleted_at)
            .map((customerProfile) => [customerProfile.id, customerProfile])
    );

    const vehiclesById = new Map(
        vehicles
            .filter((vehicle) => !vehicle.deleted_at)
            .map((vehicle) => [vehicle.id, vehicle])
    );

    const vehicleModelsById = new Map(
        vehicleModels.map((vehicleModel) => [vehicleModel.id, vehicleModel])
    );

    const branchesById = new Map(
        branches
            .filter((branch) => !branch.deleted_at)
            .map((branch) => [branch.id, branch])
    );

    const normalizedQuery = query.trim().toLowerCase();

    const enrichedAppointments = appointments
        .filter((appointment) => !appointment.deleted_at)
        .map((appointment) => {
          const customerProfile = appointment.customer_id
              ? customerProfilesById.get(appointment.customer_id)
              : null;

          const customerUser = customerProfile?.user_id
              ? usersById.get(customerProfile.user_id)
              : null;

          const vehicle = appointment.vehicle_id
              ? vehiclesById.get(appointment.vehicle_id)
              : null;

          const vehicleModel = vehicle?.vehicle_model_id
              ? vehicleModelsById.get(vehicle.vehicle_model_id)
              : null;

          const branch = appointment.branch_id
              ? branchesById.get(appointment.branch_id)
              : null;

          return {
            ...appointment,
            workshop_id: appointment.workshop_id || branch?.workshop_id || '',
            customerProfile,
            customerUser,
            vehicle,
            vehicleModel,
            branch
          };
        })
        .map((appointment) => this.assembler.toEntityFromResource(appointment))
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

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

  toArray(response) {
    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.data?.data)) {
      return response.data.data;
    }

    return [];
  }
}