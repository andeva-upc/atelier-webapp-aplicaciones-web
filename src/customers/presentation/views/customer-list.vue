<script setup>
import { onMounted, ref, watch } from 'vue';
import { useCustomersStore } from '../../application/customers.store.js';
import { useI18n } from 'vue-i18n';
import CustomerForm from './customer-form.vue';

const store = useCustomersStore();
const { t } = useI18n();

const searchQuery = ref('');
const showForm = ref(false);

const openNewCustomerForm = () => {
  showForm.value = true;
};

const handleSaveCustomer = async (newCustomer) => {
  await store.addCustomer(newCustomer);
};

onMounted(() => {
  store.fetchCustomers();
});

watch(searchQuery, (newQuery) => {
  store.searchCustomers(newQuery);
});

const getFirstInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : '';
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return dateString; // Keeping the format from the mock
};

// Mock vehicles for UI demonstration
const mockVehicles = [
  'Toyota Corolla ABC-123',
  'Nissan Sentra BXY-456',
  'Kia Sportage Z1A-789',
  'Toyota Etios ETI-444'
];

const getCustomerVehicles = (index) => {
  if (index % 3 === 0) return [mockVehicles[0], mockVehicles[1]];
  if (index % 3 === 1) return [mockVehicles[2], mockVehicles[3]];
  return ['Ford F-150 Raptor F15-RAP', 'Hyundai Tucson TUC-202', 'Nissan Frontier FRO-888'];
};
</script>

<template>
  <div class="customer-management">
    <!-- Header Section -->
    <header class="flex justify-content-between align-items-start mb-6">
      <div class="title-container">
        <h1 class="m-0 view-title">{{ t('customers.title') }}</h1>
        <p class="view-subtitle mt-1">{{ t('customers.subtitle', { count: store.totalCustomers }) }}</p>
      </div>
      <pv-button :label="t('customers.new_customer')" icon="pi pi-plus" class="new-customer-btn flex align-items-center gap-2" @click="openNewCustomerForm" />
    </header>

    <CustomerForm v-model:visible="showForm" @save="handleSaveCustomer" />

    <!-- Search Bar -->
    <div class="flex w-full mb-8">
      <pv-icon-field iconPosition="left" class="flex-1">
        <pv-input-icon class="pi pi-search" />
        <pv-input-text 
          v-model="searchQuery" 
          :placeholder="t('customers.search_placeholder')" 
          class="w-full search-input"
        />
      </pv-icon-field>
    </div>

    <!-- Customer Grid -->
    <div v-if="store.isLoading && store.customers.length === 0" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <div v-else class="grid">
      <div v-for="(customer, index) in store.customers" :key="customer.id" class="col-12 md:col-6 lg:col-4">
        <pv-card class="customer-card h-full">
          <template #content>
            <div class="card-main-content flex flex-column gap-4 p-4">
              <div class="flex justify-content-between align-items-start mb-3">
                <div class="flex align-items-center gap-3">
                  <pv-avatar 
                    :label="getFirstInitial(customer.fullName)" 
                    class="avatar-circle flex align-items-center justify-content-center" 
                    shape="circle" 
                  />
                  <div>
                    <h3 class="customer-name m-0">{{ customer.fullName }}</h3>
                    <p class="services-count m-0 mt-1">{{ customer.totalServices }} {{ t('customers.services_performed') }}</p>
                  </div>
                </div>
                <pv-button icon="pi pi-trash" text severity="secondary" class="delete-btn p-0" />
              </div>

              <div class="flex flex-column gap-2 mb-3">
                <div class="flex align-items-center gap-2 info-item">
                  <i class="pi pi-envelope text-color-secondary"></i>
                  <span>{{ customer.email }}</span>
                </div>
                <div class="flex align-items-center gap-2 info-item">
                  <i class="pi pi-phone text-color-secondary"></i>
                  <span>{{ customer.phone }}</span>
                </div>
              </div>

              <div class="flex gap-3 align-items-start mb-3">
                <i class="pi pi-car text-color-secondary mt-1"></i>
                <div class="flex flex-wrap gap-2">
                  <pv-chip 
                    v-for="vehicle in getCustomerVehicles(index)" 
                    :key="vehicle" 
                    :label="vehicle"
                    class="vehicle-pill px-3 py-2 border-round-3xl font-semibold text-xs" 
                  />
                </div>
              </div>
            </div>

            <div class="card-footer px-4 py-3 flex justify-content-between align-items-center">
              <span class="last-visit-label">Last visit</span>
              <span v-if="customer.lastVisit && customer.lastVisit !== 'Sin visitas registradas'" class="last-visit-date">{{ formatDate(customer.lastVisit) }}</span>
              <span v-else class="no-visits">Sin visitas registradas</span>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-management {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

/* Header */
.view-title {
  font-family: 'Mona Sans', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
}

.view-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

.new-customer-btn {
  background: #0071EB;
  border: none;
  border-radius: 14px;
  padding: 0.8rem 1.75rem;
  font-weight: 600;
  font-family: 'Arimo', sans-serif;
  font-size: 0.95rem;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 113, 235, 0.2);
  transition: all 0.2s ease;
}

.new-customer-btn:hover {
  background: #0056b3 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 113, 235, 0.3);
}

/* Search */
:deep(.p-inputtext) {
  border-radius: 20px !important;
  border: 1px solid #e2e8f0 !important;
  padding: 1.5rem 1.5rem 1.5rem 4.5rem !important;
  font-size: 1.1rem;
  background: #fff !important;
  color: #111827;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02) !important;
  transition: all 0.3s ease;
  outline: none !important;
}

:deep(.p-inputtext:hover) {
  border-color: #0071EB !important;
  box-shadow: 0 0 0 3px rgba(0, 113, 235, 0.08) !important;
}

:deep(.p-inputtext::placeholder) {
  color: #94a3b8;
  opacity: 0.7;
}

:deep(.p-inputtext:focus) {
  border-color: #0071EB !important;
  box-shadow: 0 0 0 4px rgba(0, 113, 235, 0.05) !important;
}

:deep(.p-inputicon) {
  left: 1.75rem !important;
  color: #94a3b8;
  font-size: 1.2rem;
}

.customer-card {
  border-radius: 24px;
  border: 1px solid #f3f4f6;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.customer-card:hover {
  border-color: #0071EB !important;
  transform: translateY(-6px);
  box-shadow: 0 15px 30px -5px rgba(0, 113, 235, 0.1) !important;
}

:deep(.avatar-circle) {
  width: 48px;
  height: 48px;
  background-color: #eff6ff !important;
  color: #2563eb !important;
  font-weight: 700;
  font-size: 1.1rem;
  font-family: 'Mona Sans', sans-serif;
}

.customer-name {
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.services-count {
  color: #6b7280;
  font-size: 0.9rem;
  font-family: 'Arimo', sans-serif;
}

.delete-btn {
  color: #9ca3af !important;
}

.info-item {
  color: #6b7280;
  font-size: 0.95rem;
  font-family: 'Arimo', sans-serif;
}

/* Vehicles Pills */
:deep(.vehicle-pill) {
  background-color: #eff6ff !important;
  color: #2563eb !important;
  font-family: 'Arimo', sans-serif;
  border: none !important;
}

/* Footer */
.card-footer {
  border-top: 1px solid #f9fafb;
}

.last-visit-label {
  color: #9ca3af;
  font-size: 0.9rem;
  font-family: 'Arimo', sans-serif;
}

.last-visit-date {
  color: #111827;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'Mona Sans', sans-serif;
}

.no-visits {
  color: #111827;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'Arimo', sans-serif;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 5rem;
}
</style>
