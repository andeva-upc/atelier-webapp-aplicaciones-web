<script setup>
import { reactive, ref, computed } from 'vue';
import { useCustomersStore } from '../../application/customers.store.js';
import { Customer } from '../../domain/model/customer.entity.js';

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
  firstName: '',
  lastName: '',
  email: ''
});

const isSearching = ref(false);
const searchPerformed = ref(false);
const found = ref(false);

const close = () => {
  // Reset form
  form.documentNumber = '';
  form.phone = '';
  form.firstName = '';
  form.lastName = '';
  form.email = '';
  searchPerformed.value = false;
  found.value = false;
  emit('update:visible', false);
};

const isSearchEnabled = computed(() => {
  const docNum = form.documentNumber ? form.documentNumber.trim() : '';
  const phoneNum = form.phone ? form.phone.trim() : '';

  // Validaciones por tipo de documento si hay DNI
  if (docNum.length > 0) {
    switch (form.documentType) {
      case 'DNI': return docNum.length === 8;
      case 'RUC': return docNum.length === 11;
      case 'CE': return docNum.length >= 8;
      default: return docNum.length >= 6;
    }
  }

  // Si no hay DNI, validar teléfono
  if (phoneNum.length > 0) {
    return phoneNum.length >= 9;
  }

  return false;
});

const isRegisterEnabled = computed(() => {
  return form.firstName.trim().length > 0 && 
         form.lastName.trim().length > 0 && 
         form.email.trim().length > 5 &&
         form.email.includes('@');
});

const handleSearch = async () => {
  if (!isSearchEnabled.value) return;
  
  isSearching.value = true;
  searchPerformed.value = false;
  
  try {
    const preRegistration = await store.findPreRegistration({
      document: form.documentNumber,
      phone: form.phone
    });
    
    searchPerformed.value = true;
    
    if (preRegistration) {
      found.value = true;
      // Split full name if possible
      const fullName = preRegistration.pre_registered_full_name || '';
      const nameParts = fullName.split(' ');
      form.firstName = nameParts[0] || '';
      form.lastName = nameParts.slice(1).join(' ') || '';
      form.email = preRegistration.pre_registered_email || '';
      form.documentType = preRegistration.pre_registered_document_type || form.documentType;
      form.documentNumber = preRegistration.pre_registered_document_number || form.documentNumber;
      form.phone = preRegistration.pre_registered_phone || form.phone;
    } else {
      found.value = false;
      // If not found, we clear the fields to allow manual entry
      form.firstName = '';
      form.lastName = '';
      form.email = '';
    }
  } finally {
    isSearching.value = false;
  }
};

const handleRegister = () => {
  if (!isRegisterEnabled.value) return;

  const newCustomer = new Customer(
    Date.now().toString(), // BaseEntity requires a non-null ID, json-server will accept it or we can just generate it here
    form.documentType,
    form.documentNumber,
    form.firstName,
    form.lastName,
    form.email,
    form.phone,
    '' // businessName empty for now
  );

  emit('save', newCustomer);
  close();
};
</script>

<template>
  <pv-dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :modal="true" 
    class="custom-registration-dialog"
    :style="{ width: '620px' }"
    :draggable="false"
    :closable="true"
    :showHeader="true"
    appendTo="body"
  >
    <template #header>
      <div class="dialog-header">
        <h2 class="dialog-title">{{ searchPerformed ? 'Complete Registration' : 'Verify pre-registration' }}</h2>
      </div>
    </template>

    <div class="dialog-content p-5">
      <div v-if="!searchPerformed">
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

      <!-- Result and Manual Entry Section -->
      <div v-else class="manual-entry-section animation-duration-400 fadein">
        <div v-if="found" class="flex align-items-center gap-3 p-3 border-round-xl bg-green-50 border-1 border-green-200 mb-5">
          <i class="pi pi-check-circle text-green-600 text-xl"></i>
          <div>
            <p class="m-0 font-bold text-green-800">Pre-registration found!</p>
            <p class="m-0 text-sm text-green-700">We've populated the fields with the existing information.</p>
          </div>
        </div>
        <div v-else class="flex align-items-center gap-3 p-3 border-round-xl bg-blue-50 border-1 border-blue-200 mb-5">
          <i class="pi pi-info-circle text-blue-600 text-xl"></i>
          <div>
            <p class="m-0 font-bold text-blue-800">No record found</p>
            <p class="m-0 text-sm text-blue-700">Please enter the customer details manually below.</p>
          </div>
        </div>

        <div class="grid mt-2">
          <div class="col-12 md:col-6 mb-4">
            <label class="mb-2 block font-bold text-sm text-color-secondary">First Name</label>
            <pv-input-text v-model="form.firstName" class="custom-input-small w-full" placeholder="John" />
          </div>
          <div class="col-12 md:col-6 mb-4">
            <label class="mb-2 block font-bold text-sm text-color-secondary">Last Name</label>
            <pv-input-text v-model="form.lastName" class="custom-input-small w-full" placeholder="Doe" />
          </div>
          <div class="col-12 mb-4">
            <label class="mb-2 block font-bold text-sm text-color-secondary">Email Address</label>
            <pv-icon-field iconPosition="left">
              <pv-input-icon class="pi pi-envelope" />
              <pv-input-text v-model="form.email" class="custom-input-small w-full" placeholder="john.doe@example.com" />
            </pv-icon-field>
          </div>
        </div>
        
        <pv-button label="Change search criteria" icon="pi pi-arrow-left" text class="p-0 mt-2 text-primary font-bold text-sm" @click="searchPerformed = false" />
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
          v-if="!searchPerformed"
          label="Search record" 
          @click="handleSearch" 
          :loading="isSearching"
          :disabled="!isSearchEnabled"
          class="search-btn" 
        />
        <pv-button 
          v-else
          label="Register customer" 
          @click="handleRegister" 
          :disabled="!isRegisterEnabled"
          class="register-btn" 
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
.custom-registration-dialog .custom-input,
.custom-registration-dialog .custom-input-small {
  border-radius: 16px !important;
  border: 1px solid #e2e8f0 !important;
  height: 60px !important;
  font-size: 1.1rem !important;
  background: #ffffff !important;
  color: #1e293b !important;
  outline: none !important;
  transition: all 0.2s ease;
}

.custom-registration-dialog .custom-input-small {
  height: 50px !important;
  font-size: 1rem !important;
  padding-left: 1rem !important;
}

.custom-registration-dialog .p-iconfield .custom-input-small {
  padding-left: 3rem !important;
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
  line-height: 1 !important;
}

:deep(.custom-select .p-select-dropdown) {
  height: 60px !important;
  width: 3rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
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
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  top: 0 !important;
  transform: none !important;
}

.manual-entry-section .p-inputicon {
  height: 50px !important;
  font-size: 1.1rem !important;
}

:deep(.p-iconfield) {
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  position: relative !important;
}

.manual-entry-section :deep(.p-iconfield) {
  height: 50px !important;
}

:deep(.p-divider-content) {
  background: transparent !important;
}

:deep(.p-divider.p-divider-horizontal:before) {
  border-top: 1px solid #f1f5f9 !important;
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

.custom-registration-dialog .search-btn,
.custom-registration-dialog .register-btn {
  background: #0071EB !important;
  color: #ffffff !important;
  padding: 0.85rem 3rem !important;
  border-radius: 16px !important;
  font-weight: 700 !important;
  border: none !important;
}

.custom-registration-dialog .search-btn:disabled,
.custom-registration-dialog .register-btn:disabled {
  background: #cbd5e1 !important;
  cursor: not-allowed;
}
</style>
