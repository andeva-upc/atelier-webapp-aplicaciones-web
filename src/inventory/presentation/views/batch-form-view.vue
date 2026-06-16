<script setup>
import { ref, onMounted, computed } from 'vue';
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

const submitted = ref(false);
const batchData = ref({
  quantity: null,
  acquisitionCost: null
});

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
  router.push({ name: 'batch-list', params: { id: productId } });
};

const saveBatch = async () => {
  submitted.value = true;

  if (batchData.value.quantity > 0 && batchData.value.acquisitionCost >= 0) {
    try {
      const payload = {
        quantity: batchData.value.quantity,
        acquisitionCost: batchData.value.acquisitionCost
      };
      
      await inventoryStore.addBatchToProduct(productId, payload);
      
      toast.add({severity:'success', summary: 'Éxito', detail: 'Lote registrado exitosamente', life: 3000});
      router.push({ name: 'batch-list', params: { id: productId } });
    } catch (err) {
      toast.add({severity:'error', summary: 'Error', detail: 'No se pudo registrar el lote', life: 3000});
    }
  }
};
</script>

<template>
  <div class="batch-form-container p-5">
    <pv-toast />
    
    <div class="flex align-items-center mb-5 gap-3">
      <pv-button icon="pi pi-arrow-left" class="p-button-rounded p-button-text p-button-secondary" @click="goBack" aria-label="Back" />
      <div>
        <h1 class="text-3xl font-bold text-900 m-0">{{ t('inventory.batchForm.newTitle') }}</h1>
        <p class="text-500 m-0 mt-1" v-if="product">{{ product.name }} ({{ product.sku }})</p>
      </div>
    </div>

    <div class="grid">
      <div class="col-12 md:col-8 lg:col-6 mx-auto">
        <pv-card class="border-round-xl shadow-2">
          <template #content>
            <div class="p-fluid">
              
              <div class="field mb-4">
                <label for="quantity" class="font-medium text-900 mb-2 block">{{ t('inventory.batchForm.quantity') }} *</label>
                <pv-input-number 
                  id="quantity" 
                  v-model="batchData.quantity" 
                  :min="1" 
                  showButtons 
                  buttonLayout="horizontal" 
                  class="border-round-lg" 
                  inputClass="py-3 text-center font-bold" 
                  :class="{'p-invalid': submitted && (!batchData.quantity || batchData.quantity <= 0)}"
                  decrementButtonClass="p-button-secondary p-button-outlined"
                  incrementButtonClass="p-button-secondary p-button-outlined"
                  incrementButtonIcon="pi pi-plus" 
                  decrementButtonIcon="pi pi-minus" 
                />
                <small class="p-error block mt-1" v-if="submitted && (!batchData.quantity || batchData.quantity <= 0)">La cantidad debe ser mayor a 0.</small>
              </div>

              <div class="field mb-4">
                <label for="acquisitionCost" class="font-medium text-900 mb-2 block">{{ t('inventory.batchForm.cost') }} *</label>
                <pv-input-number 
                  id="acquisitionCost" 
                  v-model="batchData.acquisitionCost" 
                  mode="currency" 
                  currency="PEN" 
                  locale="es-PE" 
                  class="border-round-lg" 
                  inputClass="py-3" 
                  :class="{'p-invalid': submitted && (batchData.acquisitionCost === null || batchData.acquisitionCost < 0)}"
                />
                <small class="p-error block mt-1" v-if="submitted && (batchData.acquisitionCost === null || batchData.acquisitionCost < 0)">El costo no puede ser negativo.</small>
              </div>

              <div class="flex justify-content-end gap-3 mt-5">
                <pv-button :label="t('inventory.batchForm.cancel')" icon="pi pi-times" class="p-button-text p-button-secondary px-4 border-round-lg" @click="goBack"/>
                <pv-button :label="t('inventory.batchForm.save')" icon="pi pi-check" class="p-button-primary px-5 border-round-lg shadow-2" @click="saveBatch" :loading="inventoryStore.isLoading" />
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.batch-form-container {
  background-color: #f8fafc;
  min-height: 100%;
}
</style>
