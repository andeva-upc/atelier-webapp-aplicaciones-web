import { defineStore } from 'pinia';
import { CustomersApi } from '../infrastructure/customers-api.js';

const customersApi = new CustomersApi();

/**
 * Customers Store.
 * Application layer state management for the Customers Bounded Context.
 * 
 * Handles data fetching, state persistence, and provides a unified interface
 * for the UI components to interact with the infrastructure layer.
 * 
 * @public
 */
export const useCustomersStore = defineStore('customers', {
  state: () => ({
    /** @type {import('../domain/model/customer.entity').Customer[]} */
    customers: [],
    /** @type {import('../domain/model/customer.entity').Customer|null} */
    selectedCustomer: null,
    isLoading: false,
    error: null
  }),

  getters: {
    /**
     * Gets the count of registered customers.
     * @returns {number}
     */
    totalCustomers: (state) => state.customers.length
  },

  actions: {
    /**
     * Fetches all customers from the backend and updates the state.
     */
    async fetchCustomers() {
      this.isLoading = true;
      this.error = null;
      try {
        this.customers = await customersApi.getAll();
      } catch (err) {
        this.error = err.message || 'Failed to fetch customers';
        console.error('[CustomersStore] fetchCustomers error:', err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Searches for customers based on a query string.
     * @param {string} query - The search term (name, email, or phone).
     */
    async searchCustomers(query) {
      if (!query) return this.fetchCustomers();
      
      this.isLoading = true;
      this.error = null;
      try {
        // The find method uses query parameters (e.g., ?full_name_like=query)
        // Adjusting to common mock server search pattern or general filter
        this.customers = await customersApi.find({ q: query });
      } catch (err) {
        this.error = err.message || 'Search failed';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Registers a new customer in the system.
     * @param {import('../domain/model/customer.entity').Customer} customerEntity
     */
    async addCustomer(customerEntity) {
      this.isLoading = true;
      this.error = null;
      try {
        const newCustomer = await customersApi.create(customerEntity);
        this.customers.push(newCustomer);
        return newCustomer;
      } catch (err) {
        this.error = err.message || 'Failed to create customer';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Selects a customer for detailed view or editing.
     * @param {string|number} id
     */
    async selectCustomer(id) {
      const customer = this.customers.find(c => c.id === id);
      if (customer) {
        this.selectedCustomer = customer;
      } else {
        this.isLoading = true;
        try {
          this.selectedCustomer = await customersApi.getById(id);
        } catch (err) {
          this.error = err.message;
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
});
