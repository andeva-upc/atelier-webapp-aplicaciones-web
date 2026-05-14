export class DashboardAlert {
  constructor(id, dtcCode, severity, vehiclePlate, description, time) {
    this.id = id;
    this.dtcCode = dtcCode;
    this.severity = severity;
    this.vehiclePlate = vehiclePlate;
    this.description = description;
    this.time = time;
  }
}
