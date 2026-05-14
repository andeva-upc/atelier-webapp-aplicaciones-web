<script setup>
import { reactive, ref } from 'vue';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible', 'save']);

const documentTypes = [
  { label: 'DNI', value: 'DNI' },
  { label: 'RUC', value: 'RUC' },
  { label: 'C.E.', value: 'CE' }
];

const form = reactive({
  documentType: 'DNI',
  documentNumber: '',
  phone: ''
});

const isSearching = ref(false);

const close = () => {
  emit('update:visible', false);
};

const handleSearch = () => {
  isSearching.value = true;
  setTimeout(() => {
    isSearching.value = false;
    emit('save', { ...form });
    close();
  }, 800);
};
</script>

<template>
  <pv-dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :modal="true" 
    class="custom-registration-dialog"
    :style="{ width: '550px' }"
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
          <pv-select 
            v-model="form.documentType" 
            :options="documentTypes" 
            optionLabel="label" 
            optionValue="value" 
            class="custom-select"
          />
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
          class="search-btn" 
        />
      </div>
    </template>
  </pv-dialog>
</template>

<!-- Global Styles for the Teleported Dialog -->
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
  padding: 2.5rem 2.5rem 1rem 2.5rem !important;
  border: none !important;
}

.custom-registration-dialog .p-dialog-content {
  background: #ffffff !important;
  padding: 0 2.5rem 2rem 2.5rem !important;
  border: none !important;
}

.custom-registration-dialog .p-dialog-footer {
  background: #ffffff !important;
  padding: 1rem 2.5rem 2.5rem 2.5rem !important;
  border: none !important;
}

.custom-registration-dialog .dialog-title {
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.custom-registration-dialog .description-text {
  font-family: 'Arimo', sans-serif;
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.custom-registration-dialog .form-row {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.custom-registration-dialog .form-field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.custom-registration-dialog .form-field label {
  font-family: 'Arimo', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #1e293b;
}

.custom-registration-dialog .doc-type {
  flex: 0 0 150px;
}

.custom-registration-dialog .doc-number {
  flex: 1;
}

.custom-registration-dialog .full-width {
  width: 100%;
}

.custom-registration-dialog .custom-select, 
.custom-registration-dialog .custom-input {
  border-radius: 14px !important;
  border: 1px solid #e2e8f0 !important;
  height: 54px !important;
  font-size: 1rem !important;
  width: 100% !important;
}

.custom-registration-dialog .p-iconfield {
  width: 100% !important;
}

.custom-registration-dialog .custom-input {
  padding-left: 3.5rem !important;
}

.custom-registration-dialog .p-inputicon {
  left: 1.25rem !important;
  color: #94a3b8;
  font-size: 1.1rem;
}

.custom-registration-dialog .divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 2.5rem 0;
}

.custom-registration-dialog .divider::before,
.custom-registration-dialog .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #f1f5f9;
}

.custom-registration-dialog .divider-text {
  padding: 0 1.25rem;
  font-family: 'Arimo', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.1em;
}

.custom-registration-dialog .footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.25rem;
  width: 100%;
}

.custom-registration-dialog .cancel-btn {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #475569 !important;
  padding: 0.8rem 2rem !important;
  border-radius: 14px !important;
  font-weight: 700 !important;
}

.custom-registration-dialog .search-btn {
  background: #0071EB !important;
  color: #ffffff !important;
  padding: 0.8rem 2.5rem !important;
  border-radius: 14px !important;
  font-weight: 700 !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 113, 235, 0.25) !important;
}

.custom-registration-dialog .p-dialog-header-icons {
  gap: 0.5rem;
}
</style>
