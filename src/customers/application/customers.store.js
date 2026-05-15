import { defineStore } from 'pinia';
import axios from 'axios';
import { CustomersApi } from '../infrastructure/customers-api.js';
import { environment } from '../../environments/environment.js';

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
        // Fetch customers using the API service and appointments using a direct axios call
        const [customersResponse, appointmentsResponse] = await Promise.all([
          customersApi.http.get(''),
          axios.get(`${environment.apiBaseUrl}/appointments`)
        ]);

        const rawCustomers = customersResponse.data;
        const rawAppointments = appointmentsResponse.data;

        // Manually embed appointments into each customer resource by matching customer_id
        const enrichedCustomers = rawCustomers.map(customer => ({
          ...customer,
          appointments: rawAppointments.filter(a => a.customer_id === customer.id)
        }));

        this.customers = enrichedCustomers.map(resource => customersApi.assembler.toEntityFromResource(resource));
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
     * Searches for pre-registrations in the appointments collection.
     * Follows the "Estado A" architecture logic.
     * @param {Object} criteria - Search criteria (document or phone).
     * @returns {Promise<Object|null>} The pre-registered appointment data if found.
     */
    async findPreRegistration(criteria) {
      this.isLoading = true;
      try {
        console.log('[CustomersStore] Searching pre-registration with criteria:', criteria);
        // Using the remote API base URL from environment
        const response = await axios.get(`${environment.apiBaseUrl}/appointments`, {
          params: { status: 'PENDING_APPROVAL' }
        });
        
        const appointments = response.data;
        const found = appointments.find(a => 
          (criteria.document && a.pre_registered_document_number === criteria.document) ||
          (criteria.phone && a.pre_registered_phone === criteria.phone)
        );
        
        if (found) {
          console.log('[CustomersStore] Pre-registration found:', found.id);
        } else {
          console.log('[CustomersStore] No pre-registration found for criteria');
        }
        
        return found || null;
      } catch (err) {
        console.error('[CustomersStore] findPreRegistration error:', err);
        return null;
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
        // If successful, update the local list
        this.customers.push(newCustomer);
        return newCustomer;
      } catch (err) {
        this.error = err.message || 'Failed to create customer';
        console.error('[CustomersStore] addCustomer error:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Deletes a customer by ID.
     * @param {string|number} id
     */
    async deleteCustomer(id) {
      this.isLoading = true;
      this.error = null;
      try {
        await customersApi.delete(id);
        this.customers = this.customers.filter(c => c.id !== id);
        if (this.selectedCustomer?.id === id) {
          this.selectedCustomer = null;
        }
      } catch (err) {
        this.error = err.message || 'Failed to delete customer';
        console.error('[CustomersStore] deleteCustomer error:', err);
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
