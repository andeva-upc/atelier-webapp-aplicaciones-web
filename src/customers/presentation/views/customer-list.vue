<script setup>
import { onMounted, ref, watch } from 'vue';
import { useCustomersStore } from '../../application/customers.store.js';
import { useI18n } from 'vue-i18n';

const store = useCustomersStore();
const { t } = useI18n();

const searchQuery = ref('');

onMounted(() => {
  store.fetchCustomers();
});

// Search debouncing logic
let searchTimeout = null;
watch(searchQuery, (newQuery) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    store.searchCustomers(newQuery);
  }, 400);
});

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return '---';
  return new Date(dateString).toLocaleDateString();
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
      <pv-button :label="t('customers.new_customer')" icon="pi pi-plus" class="new-customer-btn" />
    </header>

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

    <!-- Loading State -->
    <div v-if="store.isLoading && store.customers.length === 0" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <!-- Empty State -->
    <div v-else-if="store.customers.length === 0" class="empty-state">
      <p>No se encontraron clientes.</p>
    </div>

    <!-- Customer Grid -->
    <div v-else class="customer-grid">
      <pv-card v-for="customer in store.customers" :key="customer.id" class="customer-card">
        <template #content>
          <div class="card-header">
            <div class="avatar-container">
              <span class="avatar-text">{{ getInitials(customer.firstName, customer.lastName) }}</span>
            </div>
            <div class="customer-info">
              <h3 class="customer-name">{{ customer.fullName }}</h3>
              <p class="services-count">{{ customer.totalServices }} {{ t('customers.services_performed') }}</p>
            </div>
          </div>

          <div class="card-body">
            <div class="detail-item">
              <i class="pi pi-envelope"></i>
              <span>{{ customer.email }}</span>
            </div>
            <div class="detail-item">
              <i class="pi pi-phone"></i>
              <span>{{ customer.phone }}</span>
            </div>
            <div class="detail-item" v-if="customer.businessName">
              <i class="pi pi-briefcase"></i>
              <span>{{ customer.businessName }}</span>
            </div>
          </div>

          <div class="card-footer">
            <span class="footer-label">{{ t('customers.last_visit') }}</span>
            <span class="footer-date">{{ formatDate(customer.lastVisit) }}</span>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.customer-management {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Arimo', sans-serif;
}

/* Header Styles */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.view-title {
  font-family: 'Mona Sans', sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.view-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.25rem;
}

.new-customer-btn {
  background: #0071EB;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: transform 0.2s, background 0.2s;
}

.new-customer-btn:hover {
  background: #0056b3 !important;
  transform: translateY(-2px);
}

/* Search Bar Styles */
.search-section {
  margin-bottom: 2.5rem;
}

.search-input {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1.1rem;
  background: #fff;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  border-color: #0071EB;
  box-shadow: 0 0 0 4px rgba(0, 113, 235, 0.1);
}

/* Grid & Card Styles */
.customer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.customer-card {
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  background: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  overflow: hidden;
}

.customer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.avatar-container {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #eef5ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: #0071EB;
  font-weight: 800;
  font-size: 1.25rem;
  font-family: 'Mona Sans', sans-serif;
}

.customer-name {
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.services-count {
  color: #757575;
  font-size: 0.95rem;
  margin-top: 0.2rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #555;
  font-size: 1rem;
}

.detail-item i {
  color: #8c99a8;
  font-size: 0.9rem;
}

.card-footer {
  padding-top: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-label {
  color: #9e9e9e;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.footer-date {
  color: #1a1a1a;
  font-weight: 700;
  font-size: 1rem;
  font-family: 'Mona Sans', sans-serif;
}

/* States */
.loading-state, .empty-state {
  display: flex;
  justify-content: center;
  padding: 4rem;
  color: #888;
}

@media (max-width: 640px) {
  .view-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .customer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
