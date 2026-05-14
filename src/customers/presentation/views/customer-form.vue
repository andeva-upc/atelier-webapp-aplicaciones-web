<script setup>
import { reactive, ref, computed } from 'vue';
import { useCustomersStore } from '../../application/customers.store.js';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible', 'save']);
const store = useCustomersStore();

const documentTypes = [
  { label: 'DNI', value: 'DNI' },
  { label: 'RUC', value: 'RUC' },
  { label: 'C.E.', value: 'CE' },
  { label: 'Passport', value: 'PASSPORT' }
];

const form = reactive({
  documentType: 'DNI',
  documentNumber: '',
  phone: '',
  fullName: '',
  email: ''
});

const isSearching = ref(false);

const close = () => {
  emit('update:visible', false);
};

const isFormValid = computed(() => {
  const docNum = form.documentNumber ? form.documentNumber.trim() : '';
  const phoneNum = form.phone ? form.phone.trim() : '';

  // Si hay teléfono, asumimos formato de 9 dígitos (estándar móvil)
  if (phoneNum.length > 0) {
    return phoneNum.length >= 9;
  }

  // Validaciones por tipo de documento
  if (docNum.length > 0) {
    switch (form.documentType) {
      case 'DNI':
        return docNum.length === 8;
      case 'RUC':
        return docNum.length === 11;
      case 'CE':
        return docNum.length >= 9 && docNum.length <= 12; // C.E. suele ser 9, pero a veces hasta 12
      case 'PASSPORT':
        return docNum.length >= 6; // Pasaportes varían, un mínimo razonable es 6
      default:
        return docNum.length > 0;
    }
  }

  return false;
});

const handleSearch = async () => {
  if (!isFormValid.value) return;
  
  isSearching.value = true;
  try {
    const preRegistration = await store.findPreRegistration({
      document: form.documentNumber,
      phone: form.phone
    });
    
    if (preRegistration) {
      const customerData = {
        fullName: preRegistration.pre_registered_full_name,
        email: preRegistration.pre_registered_email,
        documentType: preRegistration.pre_registered_document_type,
        documentNumber: preRegistration.pre_registered_document_number,
        phone: preRegistration.pre_registered_phone
      };
      
      emit('save', customerData);
      close();
    } else {
      console.log('No pre-registration found for the provided criteria.');
    }
  } finally {
    isSearching.value = false;
  }
};
</script>

<template>
  <pv-dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :modal="true" 
    class="custom-registration-dialog"
    :style="{ width: '580px' }"
    :draggable="false"
    :closable="true"
    :showHeader="true"
    appendTo="body"
  >
    <template #header>
      <div class="dialog-header">
        <h2 class="dialog-title">Verify pre-registration</h2>
      </div>
    </template>

    <div class="dialog-content p-5">
      <p class="description-text mb-6">
        Enter the driver's credentials (by document or phone number) to verify passive matches or online appointments.
      </p>

      <div class="flex gap-4 mb-5">
        <div class="flex flex-column doc-type" style="flex: 0 0 160px;">
          <label class="mb-2 font-bold text-sm text-color-secondary">Document type</label>
          <pv-select 
            v-model="form.documentType" 
            :options="documentTypes" 
            optionLabel="label" 
            optionValue="value"
            class="custom-select w-full"
          />
        </div>
        <div class="flex flex-column flex-1">
          <label class="mb-2 font-bold text-sm text-color-secondary">Document number</label>
          <pv-icon-field iconPosition="left" class="w-full relative flex align-items-center">
            <pv-input-icon class="pi pi-id-card" />
            <pv-input-text 
              v-model="form.documentNumber" 
              placeholder="Ej. 77889900" 
              class="custom-input w-full"
            />
          </pv-icon-field>
        </div>
      </div>

      <pv-divider align="center" class="my-6">
        <span class="divider-text px-3 font-extrabold text-xs text-color-secondary uppercase tracking-widest">OR ALTERNATIVELY</span>
      </pv-divider>

      <div class="flex flex-column w-full">
        <label class="mb-2 font-bold text-sm text-color-secondary">Mobile phone</label>
        <pv-icon-field iconPosition="left" class="w-full relative flex align-items-center">
          <pv-input-icon class="pi pi-mobile" />
          <pv-input-text 
            v-model="form.phone" 
            placeholder="Ej. 999888777" 
            class="custom-input w-full"
          />
        </pv-icon-field>
      </div>
    </div>

    <template #footer>
      <div class="footer-actions">
        <pv-button 
          label="Cancel" 
          @click="close" 
          class="cancel-btn" 
        />
        <pv-button 
          label="Search record" 
          @click="handleSearch" 
          :loading="isSearching"
          :disabled="!isFormValid"
          class="search-btn" 
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style>
/* Global Styles to blur everything behind the modal */
.p-overflow-hidden #app {
  filter: blur(10px);
  transition: filter 0.4s ease-in-out;
}

.p-dialog-mask.p-component-overlay {
  background-color: rgba(15, 23, 42, 0.45) !important;
  transition: all 0.4s ease !important;
}

.custom-registration-dialog {
  background: #ffffff !important;
  border-radius: 28px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
  border: none !important;
  overflow: hidden !important;
}

.custom-registration-dialog .p-dialog-header {
  background: #ffffff !important;
  padding: 2rem 2.5rem !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

.custom-registration-dialog .p-dialog-content {
  background: #ffffff !important;
  padding: 0 !important;
}

.custom-registration-dialog .p-dialog-footer {
  background: #f8fafc !important;
  padding: 1.5rem 2.5rem !important;
  border-top: 1px solid #f1f5f9 !important;
}

.custom-registration-dialog .dialog-title {
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.custom-registration-dialog .description-text {
  font-family: 'Arimo', sans-serif;
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.6;
}

/* Base styles for Select and Input */
.custom-registration-dialog .custom-select, 
.custom-registration-dialog .custom-input {
  border-radius: 16px !important;
  border: 1px solid #e2e8f0 !important;
  height: 60px !important;
  font-size: 1.1rem !important;
  background: #ffffff !important;
  color: #1e293b !important;
  outline: none !important;
  transition: all 0.2s ease;
}

.custom-registration-dialog .custom-input {
  padding-left: 4.5rem !important;
}

/* Specific styling for pv-select to match the height and alignment */
:deep(.custom-select) {
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  border-radius: 16px !important;
}

:deep(.custom-select .p-select-label) {
  padding: 0 1.5rem !important;
  font-size: 1.1rem !important;
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  line-height: 1 !important; /* Evita desplazamientos por line-height */
}

:deep(.custom-select .p-select-dropdown) {
  height: 60px !important;
  width: 3rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.custom-select .p-select-overlay) {
  border-radius: 12px !important;
}

.custom-registration-dialog .custom-select:focus-within,
.custom-registration-dialog .p-inputtext:focus {
  border-color: #0071EB !important;
  box-shadow: 0 0 0 1px #0071EB !important;
}

.custom-registration-dialog .p-inputicon {
  position: absolute !important;
  left: 1.5rem !important;
  color: #94a3b8 !important;
  font-size: 1.3rem !important;
  z-index: 10 !important;
  height: 60px !important; /* Mismo alto que el input */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  top: 0 !important; /* Empezar desde arriba */
  transform: none !important; /* Eliminar el transform para evitar sub-pixeles */
}

:deep(.p-iconfield) {
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  position: relative !important;
}

:deep(.p-divider-content) {
  background: transparent !important;
}

:deep(.p-divider.p-divider-horizontal:before) {
  border-top: 1px solid #f1f5f9 !important;
}

.custom-registration-dialog .divider-text {
  font-family: 'Arimo', sans-serif;
}

.custom-registration-dialog .footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.custom-registration-dialog .cancel-btn {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  color: #334155 !important;
  padding: 0.85rem 2.5rem !important;
  border-radius: 16px !important;
  font-weight: 700 !important;
}

.custom-registration-dialog .search-btn {
  background: #0071EB !important;
  color: #ffffff !important;
  padding: 0.85rem 3rem !important;
  border-radius: 16px !important;
  font-weight: 700 !important;
  border: none !important;
}

.custom-registration-dialog .search-btn:disabled {
  background: #cbd5e1 !important;
  cursor: not-allowed;
}
</style>
