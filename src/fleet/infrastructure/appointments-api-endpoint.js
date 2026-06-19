import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint.js';
import { AppointmentAssembler } from './appointment.assembler.js';
import { environment } from '../../environments/environment.js';

export class AppointmentsApiEndpoint extends BaseApiEndpoint {
  constructor() {
    const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAppointmentsEndpointPath}`;
    super(endpointUrl, new AppointmentAssembler());
  }
}