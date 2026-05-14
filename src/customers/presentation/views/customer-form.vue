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

    <div class="dialog-content">
      <p class="description-text">
        Enter the driver's credentials (by document or phone number) to verify passive matches or online appointments.
      </p>

      <div class="form-row">
        <div class="form-field doc-type">
          <label>Document type</label>
          <select 
            v-model="form.documentType" 
            class="native-select"
          >
            <option v-for="opt in documentTypes" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="form-field doc-number">
          <label>Document number</label>
          <pv-icon-field iconPosition="left">
            <pv-input-icon class="pi pi-id-card" />
            <pv-input-text 
              v-model="form.documentNumber" 
              placeholder="Ej. 77889900" 
              class="custom-input"
            />
          </pv-icon-field>
        </div>
      </div>

      <div class="divider">
        <span class="divider-text">OR ALTERNATIVELY</span>
      </div>

      <div class="form-field full-width">
        <label>Mobile phone</label>
        <pv-icon-field iconPosition="left">
          <pv-input-icon class="pi pi-mobile" />
          <pv-input-text 
            v-model="form.phone" 
            placeholder="Ej. 999888777" 
            class="custom-input"
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
  padding: 2.5rem !important;
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
  margin-bottom: 3rem;
}

.custom-registration-dialog .form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.custom-registration-dialog .form-field {
  display: flex;
  flex-direction: column;
}

.custom-registration-dialog .form-field label {
  font-family: 'Arimo', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #334155;
  margin-bottom: 0.75rem;
}

.custom-registration-dialog .doc-type {
  flex: 0 0 160px;
}

.custom-registration-dialog .doc-number {
  flex: 1;
}

.custom-registration-dialog .full-width {
  width: 100%;
}

/* Base styles for Select and Input */
.custom-registration-dialog .native-select, 
.custom-registration-dialog .p-inputtext {
  border-radius: 16px !important;
  border: 1px solid #e2e8f0 !important;
  height: 60px !important;
  font-size: 1.1rem !important;
  background: #ffffff !important;
  color: #1e293b !important;
  outline: none !important;
  transition: all 0.2s ease;
}

.custom-registration-dialog .native-select {
  padding: 0 3rem 0 1.5rem !important; /* Extra padding on right for the arrow */
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 1.25rem top 50% !important;
  background-size: 0.85rem auto !important;
  cursor: pointer;
  width: 100% !important;
}

.custom-registration-dialog .native-select:focus,
.custom-registration-dialog .p-inputtext:focus {
  border-color: #0071EB !important;
  box-shadow: 0 0 0 1px #0071EB !important;
}

/* Centering for Icons in IconField */
.custom-registration-dialog .p-iconfield {
  width: 100% !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;
}

.custom-registration-dialog .p-inputicon {
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  left: 1.5rem !important;
  color: #94a3b8;
  font-size: 1.3rem;
  z-index: 10;
  line-height: 0;
}

.custom-registration-dialog .p-inputtext {
  padding-left: 4rem !important;
}

.custom-registration-dialog .divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 3rem 0;
}

.custom-registration-dialog .divider::before,
.custom-registration-dialog .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #f1f5f9;
}

.custom-registration-dialog .divider-text {
  padding: 0 1.5rem;
  font-family: 'Arimo', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.1em;
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
