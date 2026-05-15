/**
 * Quote Entity.
 * Domain model representing a financial quote.
 */
export class Quote {
  constructor({ id, workshop_id, customer_id, vehicle_id, currency, subtotal_amount, discount_amount, tax_percentage, total_amount, status, created_at }) {
    this.id = id;
    this.workshopId = workshop_id;
    this.customerId = customer_id;
    this.vehicleId = vehicle_id;
    this.currency = currency || 'PEN';
    this.subtotal = Number(subtotal_amount);
    this.discount = Number(discount_amount);
    this.taxPercentage = Number(tax_percentage);
    this.total = Number(total_amount);
    this.status = status; // PENDING, APPROVED, SENT
    this.createdAt = created_at;
  }
}

/**
 * Voucher Entity.
 * Domain model representing an invoice or receipt.
 */
export class Voucher {
  constructor({ id, workshop_id, work_order_id, type, currency, subtotal_amount, discount_amount, tax_percentage, total_amount, sunat_status, created_at }) {
    this.id = id;
    this.workshopId = workshop_id;
    this.workOrderId = work_order_id;
    this.type = type; // INVOICE, RECEIPT
    this.currency = currency || 'PEN';
    this.subtotal = Number(subtotal_amount);
    this.discount = Number(discount_amount);
    this.taxPercentage = Number(tax_percentage);
    this.total = Number(total_amount);
    this.status = sunat_status; // PENDING, ACCEPTED, REJECTED
    this.createdAt = created_at;
  }
}
