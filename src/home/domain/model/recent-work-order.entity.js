export class RecentWorkOrder {
  constructor(id, status, customerName, vehicleName, vehiclePlate, mechanicName, totalAmount, updatedAt) {
    this.id = id;
    this.status = status;
    this.customerName = customerName;
    this.vehicleName = vehicleName;
    this.vehiclePlate = vehiclePlate;
    this.mechanicName = mechanicName;
    this.totalAmount = totalAmount;
    this.updatedAt = updatedAt;
  }
}
