import { defineStore } from 'pinia';
import { InventoryApi } from '../infrastructure/inventory-api.js';

const inventoryApi = new InventoryApi();

/**
 * Inventory Store.
 * Manages the state for the Inventory Bounded Context.
 */
export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    /** @type {import('../domain/model/product.entity').Product[]} */
    products: [],
    /** @type {import('../domain/model/product.entity').Product[]} */
    allProducts: [],
    isLoading: false,
    error: null
  }),

  getters: {
    /**
     * Total number of products registered.
     * @returns {number}
     */
    totalProducts: (state) => state.products.length,

    /**
     * Products with low stock levels.
     * @returns {import('../domain/model/product.entity').Product[]}
     */
    lowStockProducts: (state) => state.products.filter(p => p.isLowStock()),

    /**
     * Count of low stock products.
     * @returns {number}
      */
    lowStockCount: (state) => state.products.filter(p => p.isLowStock()).length,

    /**
     * Returns a list of unique categories from the current products.
     */
    uniqueCategories: (state) => {
      const categories = state.allProducts.map(p => p.category).filter(c => c);
      return [...new Set(categories)];
    }
  },

  actions: {
    /**
     * Fetches products and initializes the list.
     */
    async fetchProducts() {
      this.isLoading = true;
      try {
        const products = await inventoryApi.getAll();
        this.allProducts = products;
        this.products = products;
      } catch (err) {
        this.error = err.message || 'Failed to fetch inventory';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Filters products by query and category.
     * @param {string} query 
     * @param {string} category
     */
    filterProducts(query = '', category = null) {
      this.products = this.allProducts.filter(product => {
        const matchesQuery = !query || 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.sku.toLowerCase().includes(query.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()));
        
        const matchesCategory = !category || product.category === category;
        
        return matchesQuery && matchesCategory;
      });
    },

    /**
     * Search products by query (legacy method, updated to use filterProducts).
     * @param {string} query 
     */
    searchProducts(query) {
      this.filterProducts(query, null);
    },

    /**
     * Updates the stock level of a product.
     * @param {string} id
     * @param {number} newStock
     */
    async updateStock(id, newStock) {
      this.isLoading = true;
      try {
        const updatedProduct = await inventoryApi.patch(id, { current_stock: newStock });
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
      } catch (err) {
        this.error = err.message || 'Failed to update stock';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Adds a new product to the inventory.
     * @param {import('../domain/model/product.entity').Product} productEntity
     */
    async addProduct(productEntity) {
      this.isLoading = true;
      try {
        const newProduct = await inventoryApi.create(productEntity);
        this.products.push(newProduct);
        return newProduct;
      } catch (err) {
        this.error = err.message || 'Failed to add product';
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
