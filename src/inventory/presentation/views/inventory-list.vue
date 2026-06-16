<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInventoryStore } from '../../application/inventory.store.js';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const router = useRouter();
const inventoryStore = useInventoryStore();
const toast = useToast();
const searchQuery = ref('');
const selectedCategory = ref(null);
const filterMenu = ref(null);

onMounted(() => {
  // Hardcoded branchId '1' for now, should come from auth/user context
  inventoryStore.fetchProductsByBranchId('1');
});

const handleSearch = () => {
  inventoryStore.filterProducts(searchQuery.value, selectedCategory.value);
};

const toggleFilterMenu = (event) => {
  filterMenu.value.toggle(event);
};

const setCategory = (category) => {
  selectedCategory.value = category;
  handleSearch();
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = null;
  handleSearch();
};

const filterMenuItems = computed(() => {
  const items = [
    {
      label: 'Todas las categorías',
      icon: 'pi pi-th-large',
      command: () => setCategory(null)
    },
    { separator: true }
  ];

  inventoryStore.uniqueCategories.forEach(cat => {
    items.push({
      label: cat,
      icon: 'pi pi-tag',
      command: () => setCategory(cat)
    });
  });

  return items;
});

const openNew = () => {
  router.push({ name: 'product-form-new' });
};

const viewDetails = (product) => {
  router.push({ name: 'product-detail', params: { id: product.id } });
};

const lowStockSummary = computed(() => {
  if (inventoryStore.lowStockProducts.length === 0) return '';
  return inventoryStore.lowStockProducts.slice(0, 3).map(p => p.name.split(' ').slice(0, 2).join(' ')).join(', ');
});
</script>

<template>
  <div class="inventory-container p-5">
    <pv-toast />
    
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div class="flex-grow-1">
        <h1 class="text-4xl font-bold text-900 m-0">{{ t('inventory.title') }}</h1>
        <p class="text-500 font-medium m-0 mt-1">{{ inventoryStore.totalProducts }} {{ t('inventory.registered_products') }}</p>
      </div>
      <pv-button :label="t('inventory.add_product')" icon="pi pi-plus" class="p-button-primary border-round-lg shadow-2 px-4" @click="openNew" />
    </div>

    <!-- Low Stock Alert -->
    <div v-if="inventoryStore.lowStockCount > 0" class="low-stock-alert p-3 mb-5 flex align-items-center border-round-xl border-1 border-orange-200">
      <i class="pi pi-exclamation-triangle mr-3 text-orange-500 text-xl"></i>
      <span class="text-orange-900">
        <span class="font-bold text-orange-600">{{ inventoryStore.lowStockCount }} {{ t('inventory.low_stock_alert') }}:</span>
        <span class="ml-2 font-medium">{{ lowStockSummary }}...</span>
      </span>
    </div>

    <!-- Toolbar -->
    <div class="flex gap-3 mb-5 align-items-center">
      <pv-icon-field iconPosition="left" class="flex-grow-1">
        <pv-input-icon class="pi pi-search text-500"> </pv-input-icon>
        <pv-input-text 
          v-model="searchQuery" 
          @input="handleSearch"
          :placeholder="t('inventory.search_placeholder')" 
          class="w-full border-round-xl border-1 border-200 py-3 shadow-sm" 
        />
      </pv-icon-field>
      
      <div class="flex gap-2">
        <pv-button 
          v-if="selectedCategory || searchQuery" 
          icon="pi pi-filter-slash" 
          class="p-button-text p-button-secondary border-round-xl" 
          @click="clearFilters" 
        />
        <pv-button 
          icon="pi pi-filter" 
          :class="{'p-button-primary': selectedCategory, 'p-button-secondary p-button-outlined': !selectedCategory}"
          class="border-round-xl border-1 border-300 py-3 px-3 shadow-sm bg-white" 
          @click="toggleFilterMenu"
          aria-haspopup="true"
          aria-controls="filter_menu"
        />
        <pv-menu ref="filterMenu" id="filter_menu" :model="filterMenuItems" :popup="true" class="border-round-xl shadow-4" />
      </div>
    </div>

    <!-- Active Filters Badge -->
    <div v-if="selectedCategory" class="mb-4 flex align-items-center gap-2">
      <pv-tag :value="selectedCategory" severity="info" class="px-3 py-1 border-round-lg" icon="pi pi-tag" @click="setCategory(null)" style="cursor:pointer" />
      <span class="text-xs text-500">Filtrando por categoría</span>
    </div>

    <!-- Product Grid -->
    <div class="grid">
      <div v-for="product in inventoryStore.products" :key="product.id" class="col-12 md:col-6 lg:col-4 xl:col-3 p-2">
        <pv-card 
          class="product-card border-round-xl shadow-1 hover:shadow-3 transition-all transition-duration-300 overflow-hidden cursor-pointer" 
          :class="{'low-stock-border': product.isLowStock()}"
          @click="viewDetails(product)"
        >
          <template #content>
            <div class="flex justify-content-between align-items-start mb-3">
              <div class="product-icon flex align-items-center justify-content-center bg-blue-50 text-blue-500 border-round-lg w-3rem h-3rem">
                <i class="pi pi-box text-xl"></i>
              </div>
              <pv-tag 
                :value="product.isLowStock() ? t('inventory.status.low_stock') : t('inventory.status.ok')" 
                :severity="product.isLowStock() ? 'warn' : 'success'" 
                class="px-3"
              />
            </div>

            <div class="mb-3">
              <p class="text-xs text-500 uppercase font-medium m-0">{{ product.sku }} • {{ product.category }}</p>
              <h3 class="text-lg font-bold text-900 m-0 mt-1 line-height-2 h-3rem overflow-hidden">{{ product.name }}</h3>
              <p class="text-sm text-600 m-0 mt-1 text-overflow-ellipsis overflow-hidden white-space-nowrap">{{ product.description || 'Sin descripción' }}</p>
            </div>

            <div class="flex justify-content-between align-items-end mt-4">
              <div>
                <p class="text-xs text-500 m-0">{{ t('inventory.current_stock') }}</p>
                <div class="flex align-items-baseline gap-1">
                  <span class="text-2xl font-bold" :class="product.isLowStock() ? 'text-orange-500' : 'text-900'">{{ product.currentStock }}</span>
                  <span class="text-xs text-500">min: {{ product.minimumStock }}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-500 m-0">{{ t('inventory.productDetail.salePrice') }}</p>
                <p class="text-xl font-bold text-900 m-0">S/ {{ product.salePrice }}</p>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="inventoryStore.isLoading && inventoryStore.products.length === 0" class="flex justify-content-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <!-- Error State -->
    <div v-if="inventoryStore.error" class="text-center p-4">
      <p class="text-red-500">{{ inventoryStore.error }}</p>
      <pv-button :label="t('common.retry')" icon="pi pi-refresh" @click="inventoryStore.fetchProductsByBranchId('1')" />
    </div>
  </div>
</template>

<style scoped>
.inventory-container {
  background-color: #f8fafc;
  min-height: 100%;
}

.low-stock-alert {
  background-color: #fff7ed;
  border: 1px solid #fed7aa;
}

.product-card {
  height: 100%;
  border: 1px solid #e2e8f0;
}

.product-card.low-stock-border {
  border-color: #fb923c;
}

.product-icon {
  background: #eff6ff;
}

:deep(.p-card-body) {
  padding: 1.25rem;
}

:deep(.p-inputtext) {
  background: white;
}

/* Custom hover effects for a premium feel */
.product-card:hover {
  transform: translateY(-4px);
}
</style>
