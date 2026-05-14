import { BaseEntity } from '../../../shared/domain/model/base-entity.js';

/**
 * Customer Entity.
 * Represents a client in the Fleet Bounded Context.
 * 
 * In DDD, this entity is defined by its ID and maintains the customer's 
 * profile information and history summaries.
 * 
 * @public
 */
export class Customer extends BaseEntity {
  /**
   * @param {string|number} id - Unique identifier.
   * @param {string} documentType - Type of document (DNI, RUC, etc.).
   * @param {string} documentNumber - The document identification number.
   * @param {string} firstName - Customer's first name.
   * @param {string} lastName - Customer's last name.
   * @param {string} email - Contact email.
   * @param {string} phone - Contact phone number.
   * @param {string} businessName - Company name (if applicable).
   * @param {number} [totalServices=0] - Total services performed (virtual/summary field).
   * @param {string|null} [lastVisit=null] - Date of the last visit (virtual/summary field).
   */
  constructor(
    id,
    documentType,
    documentNumber,
    firstName,
    lastName,
    email,
    phone,
    businessName,
    totalServices = 0,
    lastVisit = null
  ) {
    super(id);
    this.documentType = documentType;
    this.documentNumber = documentNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.businessName = businessName;
    this.totalServices = totalServices;
    this.lastVisit = lastVisit;
  }

  /**
   * Gets the combined full name of the customer.
   * @returns {string}
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
