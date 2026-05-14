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
    <header class="view-header">
      <div class="title-container">
        <h1 class="view-title">{{ t('customers.title') }}</h1>
        <p class="view-subtitle">{{ t('customers.subtitle', { count: store.totalCustomers }) }}</p>
      </div>
      <pv-button :label="t('customers.new_customer')" icon="pi pi-plus" class="new-customer-btn" @click="openNewCustomerForm" />
    </header>

    <CustomerForm v-model:visible="showForm" @save="handleSaveCustomer" />

    <!-- Search Bar -->
    <div class="search-section">
      <pv-icon-field iconPosition="left">
        <pv-input-icon class="pi pi-search" />
        <pv-input-text 
          v-model="searchQuery" 
          :placeholder="t('customers.search_placeholder')" 
          class="search-input"
        />
      </pv-icon-field>
    </div>

    <!-- Customer Grid -->
    <div v-if="store.isLoading && store.customers.length === 0" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <div v-else class="customer-grid">
      <pv-card v-for="(customer, index) in store.customers" :key="customer.id" class="customer-card">
        <template #content>
          <div class="card-main-content">
            <div class="card-header">
              <div class="header-left">
                <div class="avatar-circle">
                  {{ getFirstInitial(customer.fullName) }}
                </div>
                <div class="name-section">
                  <h3 class="customer-name">{{ customer.fullName }}</h3>
                  <p class="services-count">{{ customer.totalServices }} {{ t('customers.services_performed') }}</p>
                </div>
              </div>
              <pv-button icon="pi pi-trash" text severity="secondary" class="delete-btn" />
            </div>

            <div class="contact-info">
              <div class="info-item">
                <i class="pi pi-envelope"></i>
                <span>{{ customer.email }}</span>
              </div>
              <div class="info-item">
                <i class="pi pi-phone"></i>
                <span>{{ customer.phone }}</span>
              </div>
            </div>

            <div class="vehicles-pills">
              <i class="pi pi-car vehicle-icon"></i>
              <div class="pills-container">
                <span v-for="vehicle in getCustomerVehicles(index)" :key="vehicle" class="vehicle-pill">
                  {{ vehicle }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <span class="last-visit-label">Last visit</span>
            <span v-if="customer.lastVisit" class="last-visit-date">{{ formatDate(customer.lastVisit) }}</span>
            <span v-else class="no-visits">No visits registered</span>
          </div>
        </template>
      </pv-card>
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
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.view-title {
  font-family: 'Mona Sans', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.view-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin-top: 0.25rem;
}

.new-customer-btn {
  background: #0071EB;
  border: none;
  border-radius: 14px;
  padding: 0.8rem 1.75rem;
  font-weight: 600;
  font-family: 'Arimo', sans-serif;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 113, 235, 0.2);
  transition: all 0.2s ease;
}

.new-customer-btn:hover {
  background: #0056b3 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 113, 235, 0.3);
}

/* Search */
.search-section {
  display: flex;
  width: 100%;
  margin-bottom: 3.5rem;
  justify-content: flex-start;
}

:deep(.p-iconfield) {
  flex: 1;
  display: flex;
  max-width: 100%; /* Expanded width */
}

:deep(.p-inputtext) {
  flex: 1;
  width: 100%;
  border-radius: 20px !important;
  border: 1px solid #e2e8f0 !important;
  padding: 1.5rem 1.5rem 1.5rem 4.5rem !important;
  font-size: 1.1rem;
  background: #fff !important;
  color: #111827;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02) !important;
  transition: all 0.3s ease;
  outline: none !important;
  appearance: none !important;
  -webkit-appearance: none !important;
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
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1.75rem !important;
  color: #94a3b8;
  font-size: 1.2rem;
  line-height: 0;
  pointer-events: none;
}

/* Flexbox Grid */
.customer-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: flex-start;
}

.customer-card {
  flex: 1 1 calc(33.333% - 2rem);
  min-width: 320px;
  max-width: 100%; /* More flexible max width */
  border-radius: 24px;
  border: 1px solid #f3f4f6;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.customer-card:hover {
  border-color: #0071EB !important;
  transform: translateY(-6px);
  box-shadow: 0 15px 30px -5px rgba(0, 113, 235, 0.1) !important;
}

@media (max-width: 1300px) {
  .customer-card {
    flex: 1 1 calc(50% - 2rem); /* 2 columns for smaller desktops/tablets */
  }
}

@media (max-width: 768px) {
  .customer-card {
    flex: 1 1 100%; /* 1 column for mobile */
    min-width: 0;
  }
}

.card-main-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.header-left {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  background-color: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-weight: 700;
  font-size: 1.1rem;
  font-family: 'Mona Sans', sans-serif;
}

.customer-name {
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.services-count {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  font-family: 'Arimo', sans-serif;
}

.delete-btn {
  color: #9ca3af !important;
  padding: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280;
  font-size: 0.95rem;
  font-family: 'Arimo', sans-serif;
}

.info-item i {
  color: #d1d5db;
  font-size: 1rem;
}

/* Vehicles Pills */
.vehicles-pills {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.vehicle-icon {
  color: #d1d5db;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.vehicle-pill {
  background-color: #eff6ff;
  color: #2563eb;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Arimo', sans-serif;
}

/* Footer */
.card-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
