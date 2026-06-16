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
    /** @type {import('../domain/model/product.entity').Product | null} */
    selectedProduct: null,
    isLoading: false,
    error: null
  }),

  getters: {
    totalProducts: (state) => state.products.length,
    lowStockProducts: (state) => state.products.filter(p => p.isLowStock()),
    lowStockCount: (state) => state.products.filter(p => p.isLowStock()).length,
    uniqueCategories: (state) => {
      const categories = state.allProducts.map(p => p.category).filter(c => c);
      return [...new Set(categories)];
    }
  },

  actions: {
    /**
     * Fetches products by branch ID.
     */
    async fetchProductsByBranchId(branchId) {
      this.isLoading = true;
      try {
        const products = await inventoryApi.getByBranchId(branchId);
        this.allProducts = products;
        this.products = products;
      } catch (err) {
        this.error = err.message || 'Failed to fetch inventory by branch';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetches a single product by ID.
     */
    async fetchProductById(id) {
      this.isLoading = true;
      try {
        const product = await inventoryApi.getById(id);
        this.selectedProduct = product;
        return product;
      } catch (err) {
        this.error = err.message || 'Failed to fetch product';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Creates a new product.
     * @param {import('../domain/model/product.entity').Product} productEntity
     */
    async createProduct(productEntity) {
      this.isLoading = true;
      try {
        const newProduct = await inventoryApi.create(productEntity);
        this.products.push(newProduct);
        return newProduct;
      } catch (err) {
        this.error = err.message || 'Failed to create product';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Updates an existing product.
     * @param {string} id
     * @param {import('../domain/model/product.entity').Product} productEntity
     */
    async updateProduct(id, productEntity) {
      this.isLoading = true;
      try {
        const updatedProduct = await inventoryApi.update(productEntity, id);
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        if (this.selectedProduct && this.selectedProduct.id === id) {
          this.selectedProduct = updatedProduct;
        }
        return updatedProduct;
      } catch (err) {
        this.error = err.message || 'Failed to update product';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Adds a batch to a product.
     */
    async addBatchToProduct(productId, batchData) {
      this.isLoading = true;
      try {
        await inventoryApi.addBatch(productId, batchData);
        // Refresh product details to get new batch and updated stock
        await this.fetchProductById(productId);
      } catch (err) {
        this.error = err.message || 'Failed to add batch to product';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Filters products by query and category.
     */
    filterProducts(query = '', category = null) {
      this.products = this.allProducts.filter(product => {
        const matchesQuery = !query || 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.sku.toLowerCase().includes(query.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(query.toLowerCase()));
        
        const matchesCategory = !category || product.category === category;
        
        return matchesQuery && matchesCategory;
      });
    },

    /**
     * Search products by query.
     */
    searchProducts(query) {
      this.filterProducts(query, null);
    }
  }
});
