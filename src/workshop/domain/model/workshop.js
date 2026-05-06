import { BaseEntity } from '../../../shared/domain/model/base-entity.js';

/**
 * Pure Domain Entity representing a physical automotive workshop (EuroMotors Workshop).
 */
export class Workshop extends BaseEntity {
  /**
   * @param {number} id - Unique identifier of the workshop.
   * @param {string} name - Name of the workshop (e.g. EuroMotors Central - Miraflores).
   * @param {string} taxId - RUC / Tax identifier of the workshop (e.g. 20123456789).
   * @param {string} address - Physical address.
   * @param {string} phone - Contact phone number.
   */
  constructor(id, name, taxId, address, phone) {
    super(id);
    this.name = name;
    this.taxId = taxId;
    this.address = address;
    this.phone = phone;
  }
}
