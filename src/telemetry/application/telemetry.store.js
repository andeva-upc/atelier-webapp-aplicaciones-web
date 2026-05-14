import { defineStore } from 'pinia';
import { TelemetryApi } from '../infrastructure/telemetry-api.js';
import { TelemetryAssembler } from '../infrastructure/telemetry.assembler.js';

const api = new TelemetryApi();
const assembler = new TelemetryAssembler();

export const useTelemetryStore = defineStore('telemetry', {
  state: () => ({
    vehicles: [],
    devices: [],
    selectedVehicleId: null,
    snapshots: [],
    alerts: [],
    isLoading: false,
    error: null
  }),

  getters: {
    selectedVehicle: (state) => state.vehicles.find(v => v.id === state.selectedVehicleId),
    selectedDevice: (state) => state.devices.find(d => d.vehicle_id === state.selectedVehicleId),
    latestSnapshot: (state) => state.snapshots.length > 0 ? state.snapshots[state.snapshots.length - 1] : null,
    activeAlerts: (state) => state.alerts.filter(a => a.isActive)
  },

  actions: {
    async initialize() {
      this.isLoading = true;
      try {
        const [vehiclesData, devicesData] = await Promise.all([
          api.getVehicles(),
          api.getDevices()
        ]);
        this.vehicles = vehiclesData;
        this.devices = devicesData;
        
        if (this.vehicles.length > 0 && !this.selectedVehicleId) {
          await this.selectVehicle(this.vehicles[0].id);
        }
      } catch (err) {
        this.error = "Error loading telemetry context";
      } finally {
        this.isLoading = false;
      }
    },

    async selectVehicle(vehicleId) {
      this.selectedVehicleId = vehicleId;
      const device = this.devices.find(d => d.vehicle_id === vehicleId);
      
      this.isLoading = true;
      try {
        if (device) {
          const [snapshotsData, alertsData] = await Promise.all([
            api.getSnapshotsByDeviceId(device.id),
            api.getAlertsByVehicleId(vehicleId)
          ]);
          this.snapshots = snapshotsData.map(s => assembler.toSnapshotEntityFromResource(s));
          this.alerts = alertsData.map(a => assembler.toAlertEntityFromResource(a));
        } else {
          this.snapshots = [];
          this.alerts = [];
        }
      } catch (err) {
        this.error = "Error fetching telemetry data for vehicle";
      } finally {
        this.isLoading = false;
      }
    }
  }
});
