import { TelemetrySnapshot } from '../domain/model/telemetry-snapshot.entity.js';
import { DtcAlert } from '../domain/model/dtc-alert.entity.js';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js';

/**
 * TelemetryAssembler.
 * Maps between Telemetry Resource DTOs and Domain Entities.
 */
export class TelemetryAssembler extends BaseAssembler {
  /**
   * Translates a Snapshot resource into a Snapshot entity.
   */
  toSnapshotEntityFromResource(resource) {
    return new TelemetrySnapshot(
      resource.id,
      resource.device_id,
      resource.timestamp,
      resource.rpm,
      resource.speed_kmh,
      resource.fuel_level_percent,
      resource.temp,
      resource.odometer_km
    );
  }

  /**
   * Translates an Alert resource into an Alert entity.
   */
  toAlertEntityFromResource(resource) {
    return new DtcAlert(
      resource.id,
      resource.vehicle_id,
      resource.dtc_code,
      resource.severity,
      resource.description,
      resource.is_active,
      resource.timestamp || "2026-05-14T16:34:00Z" // Defaulting to something close to current mock time if missing
    );
  }

  toEntitiesFromResponse(response) {
    // This is a generic method, we might need specific ones for snapshots and alerts
    const data = Array.isArray(response) ? response : (response.data || []);
    if (data.length > 0 && 'rpm' in data[0]) {
      return data.map(r => this.toSnapshotEntityFromResource(r));
    }
    if (data.length > 0 && 'dtc_code' in data[0]) {
      return data.map(r => this.toAlertEntityFromResource(r));
    }
    return data;
  }
}
