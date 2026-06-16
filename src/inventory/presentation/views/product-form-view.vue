<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useInventoryStore } from '../../application/inventory.store.js';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { Product } from '../../domain/model/product.entity.js';

const { t } = useI18n();
const router = useRouter();
const inventoryStore = useInventoryStore();
const toast = useToast();

const submitted = ref(false);
const newProduct = ref({
  name: '',
  sku: '',
  category: '',
  description: '',
  salePrice: null,
  minimumStock: null
});

const goBack = () => {
  router.push({ name: 'inventory' });
};

const saveProduct = async () => {
  submitted.value = true;

  if (newProduct.value.name.trim() && newProduct.value.sku.trim()) {
    try {
      const productEntity = new Product(
        null, // id
        '1', // branchId hardcoded for now
        newProduct.value.category,
        newProduct.value.name,
        newProduct.value.sku,
        newProduct.value.description,
        newProduct.value.salePrice || 0,
        newProduct.value.minimumStock || 0,
        0, // currentStock
        [] // batches
      );
      
      await inventoryStore.createProduct(productEntity);
      
      toast.add({severity:'success', summary: 'Éxito', detail: 'Repuesto registrado exitosamente', life: 3000});
      router.push({ name: 'inventory' });
    } catch (err) {
      toast.add({severity:'error', summary: 'Error', detail: 'No se pudo registrar el repuesto', life: 3000});
    }
  }
};
</script>

<template>
  <div class="product-form-container p-5">
    <pv-toast />
    
    <div class="flex align-items-center mb-5 gap-3">
      <pv-button icon="pi pi-arrow-left" class="p-button-rounded p-button-text p-button-secondary" @click="goBack" aria-label="Back" />
      <h1 class="text-3xl font-bold text-900 m-0">{{ t('inventory.productForm.newTitle') }}</h1>
    </div>

    <div class="grid">
      <div class="col-12 md:col-8 lg:col-6 mx-auto">
        <pv-card class="border-round-xl shadow-2">
          <template #content>
            <div class="p-fluid">
              <div class="field mb-4">
                <label for="name" class="font-medium text-900 mb-2 block">{{ t('inventory.productForm.name') }} *</label>
                <pv-input-text id="name" v-model.trim="newProduct.name" required="true" autofocus :class="{'p-invalid': submitted && !newProduct.name}" class="border-round-lg py-3" />
                <small class="p-error block mt-1" v-if="submitted && !newProduct.name">El nombre es requerido.</small>
              </div>

              <div class="field mb-4">
                <label for="sku" class="font-medium text-900 mb-2 block">{{ t('inventory.productForm.sku') }} *</label>
                <pv-input-text id="sku" v-model.trim="newProduct.sku" required="true" :class="{'p-invalid': submitted && !newProduct.sku}" class="border-round-lg py-3 uppercase" />
                <small class="p-error block mt-1" v-if="submitted && !newProduct.sku">El SKU es requerido.</small>
              </div>

              <div class="field mb-4">
                <label for="category" class="font-medium text-900 mb-2 block">{{ t('inventory.productForm.category') }}</label>
                <pv-input-text id="category" v-model.trim="newProduct.category" class="border-round-lg py-3" />
              </div>

              <div class="field mb-4">
                <label for="description" class="font-medium text-900 mb-2 block">{{ t('inventory.productForm.description') }}</label>
                <pv-textarea id="description" v-model="newProduct.description" rows="3" class="border-round-lg" />
              </div>

              <div class="formgrid grid">
                <div class="field col-12 md:col-6 mb-4">
                  <label for="salePrice" class="font-medium text-900 mb-2 block">{{ t('inventory.productForm.salePrice') }}</label>
                  <pv-input-number id="salePrice" v-model="newProduct.salePrice" mode="currency" currency="PEN" locale="es-PE" class="border-round-lg" inputClass="py-3" />
                </div>
                <div class="field col-12 md:col-6 mb-4">
                  <label for="minimumStock" class="font-medium text-900 mb-2 block">{{ t('inventory.productForm.minimumStock') }}</label>
                  <pv-input-number id="minimumStock" v-model="newProduct.minimumStock" class="border-round-lg" inputClass="py-3" />
                </div>
              </div>

              <div class="flex justify-content-end gap-3 mt-4">
                <pv-button :label="t('inventory.productForm.cancel')" icon="pi pi-times" class="p-button-text p-button-secondary px-4 border-round-lg" @click="goBack"/>
                <pv-button :label="t('inventory.productForm.save')" icon="pi pi-check" class="p-button-primary px-5 border-round-lg shadow-2" @click="saveProduct" :loading="inventoryStore.isLoading" />
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-form-container {
  background-color: #f8fafc;
  min-height: 100%;
}
</style>
