import { BaseEntity } from '../../../shared/domain/model/base-entity.js';

export const AppointmentStatus = Object.freeze({
  SCHEDULED: 'SCHEDULED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
});

/**
 * Appointment Entity.
 * Represents a workshop appointment in the Appointments Bounded Context.
 */
export class Appointment extends BaseEntity {
  constructor(
    id,
    workshopId,
    branchId,
    appointmentDate,
    status,
    customerName,
    customerPhone,
    vehicleSummary,
    serviceType = 'Revisión general',
    mechanicName = 'Luis P.',
    notes = '',
    version = 0,
    customerId = null,
    vehicleId = null,
    deletedAt = null
  ) {
    super(id);
    this.workshopId = workshopId;
    this.branchId = branchId;
    this.appointmentDate = appointmentDate;
    this.status = status;
    this.customerName = customerName;
    this.customerPhone = customerPhone;
    this.vehicleSummary = vehicleSummary;
    this.serviceType = serviceType;
    this.mechanicName = mechanicName;
    this.notes = notes;
    this.version = version;
    this.customerId = customerId;
    this.vehicleId = vehicleId;
    this.deletedAt = deletedAt;
  }

  getDateLabel() {
    if (!this.appointmentDate) return '';
    return this.appointmentDate.split('T')[0];
  }

  getTimeLabel() {
    if (!this.appointmentDate) return '';
    const timePart = this.appointmentDate.split('T')[1] || '';
    return timePart.slice(0, 5);
  }

  isToday() {
    const dateLabel = this.getDateLabel();
    const today = new Date().toISOString().split('T')[0];
    return dateLabel === today;
  }

  isConfirmed() {
    return this.status === AppointmentStatus.SCHEDULED || this.status === AppointmentStatus.IN_PROGRESS;
  }
}
