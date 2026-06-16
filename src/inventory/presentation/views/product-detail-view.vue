<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInventoryStore } from '../../application/inventory.store.js';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const inventoryStore = useInventoryStore();
const toast = useToast();

const productId = route.params.id;
const product = computed(() => inventoryStore.selectedProduct);

onMounted(async () => {
  if (productId) {
    try {
      await inventoryStore.fetchProductById(productId);
    } catch (err) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Could not load product details.', life: 3000 });
      router.push({ name: 'inventory' });
    }
  }
});

const goBack = () => {
  router.push({ name: 'inventory' });
};

const goToBatches = () => {
  router.push({ name: 'batch-list', params: { id: productId } });
};
</script>

<template>
  <div class="product-detail-container p-5">
    <pv-toast />
    
    <div class="flex align-items-center mb-4 gap-3">
      <pv-button icon="pi pi-arrow-left" class="p-button-rounded p-button-text p-button-secondary" @click="goBack" aria-label="Back" />
      <h1 class="text-3xl font-bold text-900 m-0">{{ t('inventory.productDetail.title') }}</h1>
    </div>

    <!-- Loading State -->
    <div v-if="inventoryStore.isLoading && !product" class="flex justify-content-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <div v-else-if="product" class="grid">
      <!-- Main Details Card -->
      <div class="col-12 md:col-8">
        <pv-card class="border-round-xl shadow-2 h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center mb-4">
              <h2 class="text-2xl font-bold text-900 m-0">{{ product.name }}</h2>
              <pv-tag 
                :value="product.isLowStock() ? t('inventory.status.low_stock') : t('inventory.status.ok')" 
                :severity="product.isLowStock() ? 'warn' : 'success'" 
                class="px-3 py-2 text-sm"
              />
            </div>
            
            <p class="text-600 line-height-3 mb-5">{{ product.description || 'Sin descripción' }}</p>

            <div class="grid">
              <div class="col-12 md:col-6 mb-4">
                <p class="text-500 text-sm m-0 mb-1">{{ t('inventory.productDetail.sku') }}</p>
                <p class="text-900 font-medium m-0 text-lg">{{ product.sku }}</p>
              </div>
              <div class="col-12 md:col-6 mb-4">
                <p class="text-500 text-sm m-0 mb-1">{{ t('inventory.productDetail.category') }}</p>
                <p class="text-900 font-medium m-0 text-lg">{{ product.category }}</p>
              </div>
              <div class="col-12 md:col-6 mb-4">
                <p class="text-500 text-sm m-0 mb-1">{{ t('inventory.productDetail.salePrice') }}</p>
                <p class="text-900 font-bold m-0 text-xl text-blue-600">S/ {{ product.salePrice }}</p>
              </div>
            </div>
          </template>
        </pv-card>
      </div>

      <!-- Stock & Batches Card -->
      <div class="col-12 md:col-4">
        <pv-card class="border-round-xl shadow-2 h-full flex flex-column">
          <template #content>
            <div class="flex-grow-1">
              <h3 class="text-xl font-bold text-900 mt-0 mb-4">{{ t('inventory.current_stock') }}</h3>
              
              <div class="text-center py-4 mb-4 bg-blue-50 border-round-lg" :class="{'bg-orange-50': product.isLowStock()}">
                <span class="text-5xl font-bold block" :class="product.isLowStock() ? 'text-orange-500' : 'text-blue-600'">{{ product.currentStock }}</span>
                <span class="text-500 text-sm mt-2 block">{{ t('inventory.productDetail.minimumStock') }}: {{ product.minimumStock }}</span>
              </div>
              
              <pv-divider />
              
              <div class="flex align-items-center justify-content-between mt-4">
                <span class="text-600">{{ t('inventory.batchList.title') }}</span>
                <span class="font-bold bg-gray-100 px-2 py-1 border-round">{{ product.batches ? product.batches.length : 0 }}</span>
              </div>
            </div>

            <div class="mt-5">
              <pv-button 
                :label="t('inventory.productDetail.viewBatches')" 
                icon="pi pi-history" 
                class="p-button-outlined p-button-secondary w-full border-round-lg py-3" 
                @click="goToBatches"
              />
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-container {
  background-color: #f8fafc;
  min-height: 100%;
}
</style>
