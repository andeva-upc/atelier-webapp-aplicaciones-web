import { defineStore } from 'pinia';
import axios from 'axios';
import { environment } from '../../environments/environment.js';

export const useBillingStore = defineStore('billing', {
  state: () => ({
    quotes: [],
    vouchers: [],
    products: [],
    vehicles: [],
    isLoading: false,
    error: null
  }),

  getters: {
    totalIncome: (state) => {
      return state.vouchers.reduce((acc, v) => acc + v.total_amount, 0);
    },
    pendingQuotesCount: (state) => {
      return state.quotes.filter(q => q.status === 'PENDING').length;
    }
  },

  actions: {
    async fetchBillingData() {
      this.isLoading = true;
      this.error = null;
      try {
        const [quotesRes, vouchersRes, productsRes, customersRes, vehiclesRes] = await Promise.all([
          axios.get(`${environment.apiBaseUrl}/quotes`),
          axios.get(`${environment.apiBaseUrl}/vouchers`),
          axios.get(`${environment.apiBaseUrl}/products`),
          axios.get(`${environment.apiBaseUrl}/customers`),
          axios.get(`${environment.apiBaseUrl}/vehicles`)
        ]);

        const customers = customersRes.data;
        const vehicles = vehiclesRes.data;
        this.vehicles = vehicles;

        this.quotes = quotesRes.data.map(quote => this._processQuote(quote, customers, vehicles));
        this.vouchers = vouchersRes.data;
        this.products = productsRes.data;
      } catch (err) {
        this.error = err.message || 'Error fetching billing data';
        console.error('[BillingStore] Error:', err);
      } finally {
        this.isLoading = false;
      }
    },

    _processQuote(quote, customers = [], vehicles = []) {
      const clientObj = customers.find(c => c.id === quote.customer_id);
      const client = clientObj?.full_name || quote.customer_name || 'N/A';
      
      const vehicleObj = vehicles.find(v => v.id === quote.vehicle_id);
      const vehicle = vehicleObj 
        ? `${vehicleObj.brand} ${vehicleObj.model} ${vehicleObj.plate_number}`
        : quote.vehicle || 'N/A';
      
      // Normalize status
      let status = (quote.status || 'pending').toLowerCase();
      if (status.startsWith('billing.status.')) {
        status = status.replace('billing.status.', '');
      }

      // Generate display ID (COT-XXX)
      const displayId = quote.id?.length > 8 
        ? `COT-${quote.id.substring(0, 3).toUpperCase()}` 
        : (quote.id || 'N/A');

      return {
        ...quote,
        displayId,
        client,
        vehicle,
        total: quote.total_amount || quote.total || 0,
        items: Array.isArray(quote.items) ? quote.items.length : (quote.items || 0),
        date: quote.created_at ? quote.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        status
      };
    },

    async saveQuote(quoteData) {
      this.isLoading = true;
      try {
        const payload = {
          ...quoteData,
          total_amount: quoteData.total,
          created_at: new Date().toISOString(),
          status: 'PENDING'
        };
        const response = await axios.post(`${environment.apiBaseUrl}/quotes`, payload);
        
        // Refetch or process locally
        const processed = this._processQuote(response.data);
        this.quotes.unshift(processed); // Add to the beginning
        return processed;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async registerPayment(paymentData) {
      this.isLoading = true;
      try {
        // En un sistema real esto crearía un registro en 'payments' y actualizaría el voucher/quote
        const response = await axios.post(`${environment.apiBaseUrl}/payments`, paymentData);
        
        // Actualizar localmente el estado de la cotización si corresponde
        const quote = this.quotes.find(q => q.id === paymentData.quoteId);
        if (quote) {
          quote.status = 'APPROVED';
        }
        
        return response.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
