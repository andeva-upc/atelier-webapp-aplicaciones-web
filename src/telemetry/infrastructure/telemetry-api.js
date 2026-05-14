import axios from 'axios';
import { environment } from '../../environments/environment.js';

const http = axios.create({
  baseURL: environment.apiBaseUrl
});

/**
 * TelemetryApi.
 * Handles communication with the mock backend for telemetry data.
 */
export class TelemetryApi {
  /**
   * Fetches all OBD2 devices.
   */
  async getDevices() {
    const response = await http.get('obd2_devices');
    return response.data;
  }

  /**
   * Fetches all vehicles (to list in sidebar).
   */
  async getVehicles() {
    const response = await http.get('vehicles');
    return response.data;
  }

  /**
   * Fetches telemetry snapshots for a specific device.
   */
  async getSnapshotsByDeviceId(deviceId) {
    const response = await http.get(`telemetry_snapshots?device_id=${deviceId}`);
    return response.data;
  }

  /**
   * Fetches DTC alerts for a specific vehicle.
   */
  async getAlertsByVehicleId(vehicleId) {
    const response = await http.get(`vehicle_dtc_alerts?vehicle_id=${vehicleId}`);
    return response.data;
  }
}
