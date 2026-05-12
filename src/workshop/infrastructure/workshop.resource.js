/**
 * Workshop Resource representing the DTO structure returned by the network.
 */
export class WorkshopResource {
  /**
   * @param {number} id
   * @param {string} name
   * @param {string} tax_id
   * @param {string} address
   * @param {string} phone
   */
  constructor(id, name, tax_id, address, phone) {
    this.id = id;
    this.name = name;
    this.tax_id = tax_id;
    this.address = address;
    this.phone = phone;
  }
}
