import { BaseEntity } from '../../../../shared/domain/model/base-entity.js';

export const BayStatus = Object.freeze({
  VACANT: 'VACANT',
  OCCUPIED: 'OCCUPIED',
  NOT_AVAILABLE: 'NOT_AVAILABLE'
});

/**
 * @typedef {object} WorkBay
 * @property {string} id
 * @property {string} branchId
 * @property {string} status
 * @property {number} internalNumber
 */
export class WorkBay extends BaseEntity {
  /**
   * @param {string} id
   * @param {string} branchId
   * @param {string} status
   * @param {number} internalNumber
   */
  constructor(id, branchId, status, internalNumber) {
    super(id);
    this.branchId = branchId;
    this.status = status;
    this.internalNumber = internalNumber;
  }
}