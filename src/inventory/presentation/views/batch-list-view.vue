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
const batches = computed(() => product.value?.batches || []);

onMounted(async () => {
  if (productId && (!product.value || product.value.id !== productId)) {
    try {
      await inventoryStore.fetchProductById(productId);
    } catch (err) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información del producto.', life: 3000 });
      router.push({ name: 'inventory' });
    }
  }
});

const goBack = () => {
  router.push({ name: 'product-detail', params: { id: productId } });
};

const goToNewBatch = () => {
  router.push({ name: 'batch-form-new', params: { id: productId } });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
</script>

<template>
  <div class="batch-list-container p-5">
    <pv-toast />
    
    <div class="flex align-items-center justify-content-between mb-5">
      <div class="flex align-items-center gap-3">
        <pv-button icon="pi pi-arrow-left" class="p-button-rounded p-button-text p-button-secondary" @click="goBack" aria-label="Back" />
        <div>
          <h1 class="text-3xl font-bold text-900 m-0">{{ t('inventory.batchList.title') }}</h1>
          <p class="text-500 m-0 mt-1" v-if="product">{{ product.name }} ({{ product.sku }})</p>
        </div>
      </div>
      <pv-button :label="t('inventory.batchList.newBatch')" icon="pi pi-plus" class="p-button-primary border-round-lg shadow-2 px-4" @click="goToNewBatch" />
    </div>

    <!-- Loading State -->
    <div v-if="inventoryStore.isLoading && !product" class="flex justify-content-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <div v-else-if="product">
      <pv-card class="border-round-xl shadow-2">
        <template #content>
          <div v-if="batches.length === 0" class="text-center p-5">
            <i class="pi pi-inbox text-5xl text-400 mb-3 block"></i>
            <p class="text-600 m-0">{{ t('inventory.batchList.empty') }}</p>
          </div>
          
          <pv-data-table v-else :value="batches" responsiveLayout="scroll" class="p-datatable-sm" :paginator="true" :rows="10">
            <pv-column field="id" :header="t('inventory.batchList.columns.id')">
              <template #body="slotProps">
                <span class="font-medium text-900">{{ slotProps.data.id }}</span>
              </template>
            </pv-column>
            
            <pv-column :header="t('inventory.batchList.columns.date')">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.createdAt) }}
              </template>
            </pv-column>
            
            <!-- Note: initialQuantity depends on Backend DTO mapping. If .NET doesn't return it, we might just show available. -->
            <pv-column :header="t('inventory.batchList.columns.availableQuantity')">
              <template #body="slotProps">
                <span class="font-bold text-blue-600">{{ slotProps.data.availableQuantity?.value || slotProps.data.availableQuantity || 0 }}</span>
              </template>
            </pv-column>
            
            <pv-column :header="t('inventory.batchList.columns.cost')">
              <template #body="slotProps">
                S/ {{ slotProps.data.acquisitionCost?.amount || slotProps.data.acquisitionCost || '0.00' }}
              </template>
            </pv-column>
          </pv-data-table>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.batch-list-container {
  background-color: #f8fafc;
  min-height: 100%;
}
</style>
