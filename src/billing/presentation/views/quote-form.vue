<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCustomersStore } from '../../../customers/application/customers.store.js';
import { useBillingStore } from '../../application/billing.store.js';
import { useInventoryStore } from '../../../inventory/application/inventory.store.js';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible', 'save']);
const { t } = useI18n();
const customersStore = useCustomersStore();
const billingStore = useBillingStore();
const inventoryStore = useInventoryStore();

const itemTypes = computed(() => [
  { label: t('billing.quote_form.service'), value: 'SERVICE' },
  { label: t('billing.quote_form.product'), value: 'PART' }
]);

const form = reactive({
  customerName: '',
  selectedCustomer: null,
  vehicle: '',
  items: [
    { type: 'SERVICE', name: '', quantity: 1, price: 0, stock: 10, productId: null }
  ],
  discountAmount: 0
});

const discountError = ref('');

onMounted(async () => {
  await customersStore.fetchCustomers();
  await inventoryStore.fetchProducts();
  if (billingStore.vehicles.length === 0) {
    await billingStore.fetchBillingData();
  }
});

const addItem = () => {
  form.items.push({ type: 'SERVICE', name: '', quantity: 1, price: 0, stock: 5, productId: null });
};

const removeItem = (index) => {
  form.items.splice(index, 1);
};

const subtotal = computed(() => {
  return form.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
});

const igv = computed(() => {
  return (subtotal.value - form.discountAmount) * 0.18;
});

const total = computed(() => {
  return (subtotal.value - form.discountAmount) + igv.value;
});

const maxDiscount = computed(() => subtotal.value * 0.30); // US029: 30% limit

const close = () => {
  emit('update:visible', false);
  discountError.value = '';
};

const onCustomerChange = (e) => {
  if (typeof e.value === 'object' && e.value !== null) {
    form.customerName = e.value.fullName;
    form.selectedCustomer = e.value;
    
    // Auto-fill vehicle if found
    const customerVehicle = billingStore.vehicles.find(v => v.customer_id === e.value.id);
    if (customerVehicle) {
      form.vehicle = `${customerVehicle.brand} ${customerVehicle.model} ${customerVehicle.plate_number}`;
      form.vehicle_id = customerVehicle.id;
    } else {
      form.vehicle = '';
      form.vehicle_id = null;
    }
  } else {
    form.customerName = e.value;
  }
};

const onProductChange = (item) => {
  if (item.type === 'PART' && item.productId) {
    const product = inventoryStore.allProducts.find(p => p.id === item.productId);
    if (product) {
      item.name = product.name;
      item.price = product.price || 0;
      item.stock = product.current_stock || 0;
    }
  }
};

const handleSave = () => {
  if (form.discountAmount > maxDiscount.value) {
    discountError.value = `El descuento no puede superar el 30% del subtotal (Máx: S/ ${maxDiscount.value.toFixed(2)})`;
    return;
  }

  const payload = {
    ...form,
    customer_id: form.selectedCustomer?.id || null,
    customer_name: form.customerName,
    items: form.items,
    total: total.value,
    subtotal: subtotal.value,
    igv: igv.value
  };
  emit('save', payload);
  close();
};
</script>

<template>
  <pv-dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :modal="true" 
    class="standard-quote-dialog"
    :style="{ width: '550px' }"
    :draggable="false"
    appendTo="body"
    :closable="false"
  >
    <template #header>
      <div class="flex justify-content-between align-items-center w-full px-2 pt-2">
        <h2 class="dialog-title font-bold">{{ t('billing.quote_form.title') }}</h2>
        <pv-button icon="pi pi-times" @click="close" class="close-btn-minimal" text rounded />
      </div>
    </template>

    <div class="dialog-content px-5 py-4">
      <!-- Main Info -->
      <div class="flex flex-column gap-4 mb-5">
        <div class="relative custom-search-field">
          <pv-icon-field iconPosition="left">
            <pv-input-icon class="pi pi-user text-xl" style="left: 1.25rem !important;" />
            <pv-select 
              v-model="form.selectedCustomer" 
              :options="customersStore.customers" 
              optionLabel="fullName"
              :placeholder="t('billing.quote_form.customer_placeholder')" 
              class="field-input w-full search-select-input"
              :class="{ 'border-red-500': !form.customerName && !form.selectedCustomer }"
              editable
              filter
              @change="onCustomerChange"
            >
              <template #option="slotProps">
                <div class="flex align-items-center gap-3 py-1">
                  <pv-avatar :label="slotProps.option.firstName.charAt(0)" shape="circle" class="bg-blue-600 text-white font-bold" />
                  <div class="flex flex-column">
                    <span class="font-bold text-900">{{ slotProps.option.fullName }}</span>
                    <span class="text-xs text-500">{{ slotProps.option.documentNumber }} • {{ slotProps.option.email }}</span>
                  </div>
                </div>
              </template>
            </pv-select>
          </pv-icon-field>
        </div>

        <div class="relative">
          <pv-icon-field iconPosition="left">
            <pv-input-icon class="pi pi-car text-xl" style="left: 1.25rem !important;" />
            <pv-input-text 
              v-model="form.vehicle" 
              :placeholder="t('billing.quote_form.vehicle_placeholder')" 
              class="field-input w-full"
              style="padding-left: 3.5rem !important;"
            />
          </pv-icon-field>
        </div>
      </div>

      <pv-divider class="mb-5" />

      <!-- Quote Items Section -->
      <div class="items-section">
        <h3 class="section-title mb-4 uppercase">{{ t('billing.quote_form.items_title') }}</h3>
        
        <div v-for="(item, index) in form.items" :key="index" class="item-card-refined mb-4">
          <div class="grid p-fluid">
            <!-- Row 1 -->
            <div class="col-4 relative">
              <span class="minimal-label mb-2 block">{{ t('billing.quote_form.inventory_label') }}</span>
              <div class="flex align-items-center gap-2 inventory-minimal-field">
                <div class="vertical-bar-accent"></div>
                <pv-select 
                  v-model="item.type" 
                  :options="itemTypes" 
                  optionLabel="label" 
                  optionValue="value"
                  class="dropdown-no-border flex-1"
                />
              </div>
            </div>
            <div class="col-8 relative">
              <span class="minimal-label mb-2 block">{{ t('billing.quote_form.item_name_placeholder') }}</span>
              <div v-if="item.type === 'PART'" class="flex flex-column gap-1">
                   <pv-select 
                  v-model="item.productId" 
                  :options="inventoryStore.allProducts" 
                  optionLabel="name" 
                  optionValue="id"
                  :placeholder="t('billing.quote_form.select_product')"
                  class="input-rounded-minimal"
                  filter
                  @change="onProductChange(item)"
                />
                <span v-if="item.stock === 0" class="text-xs text-red-500 font-bold ml-1 mt-1 flex align-items-center">
                  <i class="pi pi-exclamation-triangle mr-1"></i> {{ t('billing.quote_form.no_stock_warning') }}
                </span>
              </div>
              <pv-input-text v-else v-model="item.name" class="input-rounded-minimal" />
            </div>
            
            <!-- Row 2 (Grouped) -->
            <div class="col-12 mt-3">
              <div class="flex gap-2">
                <div class="flex-1">
                   <span class="minimal-label mb-2 block">{{ t('billing.quote_form.quantity_label') }}</span>
                </div>
                <div class="flex-1">
                   <span class="minimal-label mb-2 block">{{ t('billing.quote_form.price_label') }}</span>
                </div>
              </div>
              <div class="grouped-fields-container flex align-items-center">
                <pv-input-number v-model="item.quantity" class="grouped-input flex-1" :min="1" />
                <div class="vertical-divider-small"></div>
                <div class="flex-1 flex align-items-center pr-3">
                  <pv-input-number v-model="item.price" class="grouped-input flex-1" :min="0" mode="decimal" :minFractionDigits="2" />
                  <pv-button icon="pi pi-trash" @click="removeItem(index)" class="p-0 text-red-400 hover:text-red-600 ml-2" text />
                </div>
              </div>
            </div>
          </div>
        </div>

        <pv-button 
          :label="t('billing.quote_form.add_item')" 
          icon="pi pi-plus" 
          @click="addItem" 
          class="add-item-mint-btn w-full py-3 mb-5" 
          text
        />
      </div>

      <!-- Financial Card -->
      <div class="financial-card p-4 border-1 border-100 shadow-1">
        <div class="flex flex-column gap-3">
          <div class="flex flex-column gap-2">
            <div class="discount-pill flex align-items-center gap-2 px-3 py-2 border-1 border-300" :class="{ 'border-red-400 bg-red-50': discountError }">
              <i class="pi pi-tag" :class="discountError ? 'text-red-500' : 'text-700'"></i>
              <span class="text-sm font-bold" :class="discountError ? 'text-red-700' : 'text-700'">{{ t('billing.quote_form.discount_label') }}</span>
              <pv-input-number v-model="form.discountAmount" :min="0" class="discount-mini-input" placeholder="0" />
            </div>
            <span v-if="discountError" class="text-xs text-red-500 font-bold px-1 flex align-items-center gap-1">
              <i class="pi pi-times-circle"></i> {{ discountError }}
            </span>
          </div>

          <div class="flex flex-column gap-2 text-right">
            <div class="flex justify-content-between text-500 font-medium">
              <span>{{ t('billing.quote_form.subtotal') }}</span>
              <span>S/ {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-content-between text-500 font-medium">
              <span>{{ t('billing.quote_form.igv') }}</span>
              <span>S/ {{ igv.toFixed(2) }}</span>
            </div>
            <pv-divider class="my-1" />
            <div class="flex justify-content-between align-items-center mt-1">
              <span class="total-label text-900 font-bold">{{ t('billing.quote_form.total') }}</span>
              <span class="total-value text-900 font-black">S/ {{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-content-end align-items-center gap-4 px-3 pb-3">
        <pv-button :label="t('billing.quote_form.cancel')" @click="close" class="cancel-link" text />
        <pv-button 
          :label="t('billing.quote_form.submit')" 
          @click="handleSave" 
          class="submit-button" 
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style>
.standard-quote-dialog {
  border-radius: 28px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
  border: none !important;
  overflow: hidden !important;
}

.standard-quote-dialog .p-dialog-header {
  padding: 2rem 2rem 0 !important;
}

.standard-quote-dialog .p-dialog-content {
  padding: 0 !important;
}

.standard-quote-dialog .p-dialog-footer {
  padding: 1.5rem 2.5rem 2.5rem !important;
  border: none !important;
}

.dialog-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
}

.close-btn-minimal {
  color: #64748b !important;
}

.field-input {
  border-radius: 12px !important;
  border: 1.5px solid #e2e8f0 !important;
  padding: 1.25rem 1rem !important;
  font-size: 1.1rem !important;
}

.search-select-input {
  padding-left: 3.5rem !important;
  display: flex !important;
  align-items: center !important;
}

.search-select-input :deep(.p-select-label) {
  padding: 0 !important;
  font-size: 1.1rem !important;
  font-weight: 500 !important;
}

.search-select-input :deep(.p-select-dropdown) {
  display: none !important; /* Hide the arrow like in the reference */
}

.section-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
}

/* Item Refined */
.item-card-refined {
  padding: 0.5rem 0;
}

.minimal-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
}

.inventory-minimal-field {
  border-bottom: 1.5px solid #cbd5e1;
  padding-bottom: 4px;
}

.vertical-bar-accent {
  width: 2px;
  height: 20px;
  background: #cbd5e1;
}

.dropdown-no-border {
  border: none !important;
  background: transparent !important;
}

.dropdown-no-border :deep(.p-select-label) {
  padding: 0.5rem 0 !important;
  font-weight: 600 !important;
}

.input-rounded-minimal {
  border-radius: 12px !important;
  border: 1.5px solid #e2e8f0 !important;
  padding: 0.75rem 1rem !important;
}

/* Grouped Fields */
.grouped-fields-container {
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  overflow: hidden;
}

.grouped-input :deep(.p-inputnumber-input) {
  border: none !important;
  background: transparent !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 500 !important;
}

.vertical-divider-small {
  width: 1.5px;
  height: 25px;
  background: #e2e8f0;
}

/* Mint Button */
.add-item-mint-btn {
  border: 1.5px dashed #cbd5e1 !important;
  border-radius: 16px !important;
  color: #64748b !important;
  font-weight: 700 !important;
  background: #f0fdf4 !important;
}

/* Financial */
.financial-card {
  border-radius: 20px;
  background: #f8fbff;
}

.discount-pill {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
}

.discount-mini-input :deep(.p-inputnumber-input) {
  width: 60px !important;
  border: none !important;
  background: transparent !important;
  font-weight: 700 !important;
  padding: 0 !important;
}

.total-label {
  font-size: 1.25rem;
}

.total-value {
  font-size: 1.5rem;
}

/* Buttons */
.cancel-link {
  color: #0071EB !important;
  font-weight: 700 !important;
}

.submit-button {
  background: #0071EB !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 1rem 2.5rem !important;
  font-weight: 800 !important;
  color: white !important;
}

/* Custom Select Overlay Styles */
:deep(.p-select-panel) {
  border-radius: 16px !important;
  border: none !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}

:deep(.p-select-item) {
  border-radius: 8px !important;
  margin: 4px !important;
  transition: background 0.2s ease !important;
}

:deep(.p-select-item:hover) {
  background: #f1f5f9 !important;
}
</style>
style>
