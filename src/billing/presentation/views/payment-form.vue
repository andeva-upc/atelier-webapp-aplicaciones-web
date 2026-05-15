<script setup>
import { reactive, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  visible: Boolean,
  totalToPay: Number,
  quoteId: String
});

const emit = defineEmits(['update:visible', 'success']);
const { t } = useI18n();

const paymentMethods = [
  { label: 'Efectivo', value: 'CASH' },
  { label: 'Tarjeta de Crédito/Débito', value: 'CARD' },
  { label: 'Transferencia Bancaria', value: 'TRANSFER' }
];

const form = reactive({
  amount: 0,
  method: 'CASH'
});

const isProcessing = ref(false);
const errorMessage = ref('');

const remainingBalance = computed(() => {
  return props.totalToPay - form.amount;
});

const isAmountValid = computed(() => {
  return form.amount >= props.totalToPay;
});

const close = () => {
  emit('update:visible', false);
  errorMessage.value = '';
};

const handlePayment = async () => {
  if (!isAmountValid.value) {
    errorMessage.value = 'Monto insuficiente. El pago debe ser igual o mayor al total adeudado.';
    return;
  }

  isProcessing.value = true;
  // Simulating API call
  setTimeout(() => {
    isProcessing.value = false;
    emit('success', { quoteId: props.quoteId, amount: form.amount, method: form.method });
    close();
  }, 1500);
};
</script>

<template>
  <pv-dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :modal="true" 
    class="custom-payment-dialog"
    :style="{ width: '500px' }"
    :draggable="false"
    appendTo="body"
  >
    <template #header>
      <div class="dialog-header flex align-items-center gap-3">
        <div class="payment-icon-container">
          <i class="pi pi-wallet text-2xl text-blue-600"></i>
        </div>
        <div>
          <h2 class="dialog-title m-0">Registro de cobro</h2>
          <span class="text-500 text-sm">Cotización: {{ quoteId }}</span>
        </div>
      </div>
    </template>

    <div class="dialog-content p-5">
      <!-- Total Display -->
      <div class="total-display p-4 border-round-xl mb-6 flex justify-content-between align-items-center">
        <span class="text-600 font-medium">Total a cobrar</span>
        <span class="total-amount">S/ {{ totalToPay.toFixed(2) }}</span>
      </div>

      <!-- Payment Form -->
      <div class="flex flex-column gap-5">
        <div class="flex flex-column">
          <label class="payment-label mb-2">Método de pago</label>
          <pv-select 
            v-model="form.method" 
            :options="paymentMethods" 
            optionLabel="label" 
            optionValue="value"
            class="custom-select w-full"
          />
        </div>

        <div class="flex flex-column">
          <label class="payment-label mb-2">Monto recibido (S/)</label>
          <pv-icon-field iconPosition="left">
            <pv-input-icon class="pi pi-money-bill" />
            <pv-input-number 
              v-model="form.amount" 
              mode="decimal" 
              :minFractionDigits="2" 
              class="payment-input w-full"
              placeholder="0.00"
              autofocus
            />
          </pv-icon-field>
        </div>

        <!-- Feedback Messages -->
        <div v-if="errorMessage" class="p-3 border-round-lg bg-red-50 border-1 border-red-100 flex align-items-start gap-2">
          <i class="pi pi-times-circle text-red-500 mt-1"></i>
          <span class="text-red-700 text-sm font-medium">{{ errorMessage }}</span>
        </div>

        <div v-if="form.amount > totalToPay" class="p-3 border-round-lg bg-green-50 border-1 border-green-100 flex align-items-start gap-2">
          <i class="pi pi-info-circle text-green-500 mt-1"></i>
          <div class="flex flex-column">
            <span class="text-green-700 text-sm font-bold">Vuelto a entregar</span>
            <span class="text-green-600 text-lg font-black">S/ {{ (form.amount - totalToPay).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="footer-actions flex justify-content-between align-items-center w-full">
        <pv-button label="Cancelar" @click="close" class="cancel-link" text />
        <pv-button 
          label="Confirmar pago" 
          @click="handlePayment" 
          class="pay-btn" 
          :loading="isProcessing"
          :disabled="form.amount <= 0"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style>
.custom-payment-dialog {
  border-radius: 28px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
  border: none !important;
  overflow: hidden !important;
}

.custom-payment-dialog .p-dialog-header {
  padding: 2rem 2.5rem !important;
  border-bottom: 1px solid #f1f5f9 !important;
  background: #ffffff !important;
}

.custom-payment-dialog .p-dialog-content {
  padding: 0 !important;
}

.custom-payment-dialog .p-dialog-footer {
  padding: 1.5rem 2.5rem !important;
  border-top: 1px solid #f1f5f9 !important;
  background: #f8fafc !important;
}

.custom-payment-dialog .dialog-title {
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

.payment-icon-container {
  width: 48px;
  height: 48px;
  background: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.total-display {
  background: #0f172a;
  color: white;
}

.total-amount {
  font-family: 'Mona Sans', sans-serif;
  font-size: 2rem;
  font-weight: 900;
}

.payment-label {
  font-family: 'Arimo', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #64748b;
}

.payment-input :deep(.p-inputnumber-input) {
  height: 60px !important;
  border-radius: 16px !important;
  font-size: 1.5rem !important;
  font-weight: 800 !important;
  padding-left: 4rem !important;
  border: 2px solid #e2e8f0 !important;
}

.payment-input :deep(.p-inputnumber-input:focus) {
  border-color: #0071EB !important;
  box-shadow: 0 0 0 4px rgba(0, 113, 235, 0.1) !important;
}

.custom-payment-dialog .p-inputicon {
  left: 1.5rem !important;
  font-size: 1.5rem !important;
  color: #94a3b8 !important;
}

.pay-btn {
  background: #0071EB !important;
  border: none !important;
  border-radius: 16px !important;
  padding: 1rem 2.5rem !important;
  font-weight: 800 !important;
  font-family: 'Arimo', sans-serif;
  color: #ffffff !important;
  box-shadow: 0 10px 15px -3px rgba(0, 113, 235, 0.3) !important;
}

.pay-btn:disabled {
  background: #cbd5e1 !important;
  box-shadow: none !important;
}

.cancel-link {
  color: #64748b !important;
  font-weight: 700 !important;
}
</style>
