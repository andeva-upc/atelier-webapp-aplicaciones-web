import { WorkBay } from '../model/workbay.entity.js';

export class WorkBayRepository {
  /**
   * @returns {Promise<WorkBay[]>}
   */
  async getAll() {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {WorkBay} workBay
   * @returns {Promise<WorkBay>}
   */
  async create(workBay) {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {string} id
   * @param {WorkBay} workBay
   * @returns {Promise<WorkBay>}
   */
  async update(id, workBay) {
    throw new Error('Method not implemented.');
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error('Method not implemented.');
  }
}