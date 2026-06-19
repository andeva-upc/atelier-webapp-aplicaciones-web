<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useFleetStore } from '../../application/fleet.store.js';

const store = useFleetStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const searchQuery = ref('');
let searchTimer = null;

const filteredCustomerRegistrations = computed(() => {
  if (!searchQuery.value) {
    return store.customerRegistrations;
  }
  const normalizedQuery = searchQuery.value.toLowerCase();
  return store.customerRegistrations.filter(reg =>
    reg.customerId.toLowerCase().includes(normalizedQuery) || // Assuming customerId is searchable
    reg.branchId.toLowerCase().includes(normalizedQuery) || // Assuming branchId is searchable
    reg.registeredAt.toLowerCase().includes(normalizedQuery)
  );
});

const syncFormWithRoute = () => {
  // No form for customer registrations yet, but keeping the structure for future expansion
  // if (route.name === 'customer-registrations-new') { ... }
};

const handleDeleteCustomerRegistration = async (id) => {
  if (confirm(t('customer_registrations.confirm_delete'))) {
    await store.deleteCustomerRegistration(id);
  }
};

watch(searchQuery, (query) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    // No specific search action in store for now, filtering locally
  }, 300);
});

watch(
    () => route.fullPath,
    () => {
      syncFormWithRoute();
    }
);

watch(
    () => store.customerRegistrations.length,
    () => {
      syncFormWithRoute();
    }
);

onMounted(async () => {
  await store.fetchCustomerRegistrations();
  syncFormWithRoute();
});
</script>

<template>
  <section class="customer-registrations-page">
    <header class="view-header">
      <div class="title-container">
        <h1 class="view-title">{{ t('customer_registrations.title') }}</h1>
        <p class="view-subtitle">{{ t('customer_registrations.subtitle', { count: store.totalCustomerRegistrations }) }}</p>
      </div>

      <!-- Add button for new registration if needed -->
      <!-- <pv-button
        :label="t('customer_registrations.actions.new')"
        icon="pi pi-plus"
        class="new-registration-btn"
        @click="openCreateForm"
      /> -->
    </header>

    <section class="toolbar-row">
      <pv-icon-field iconPosition="left" class="search-box">
        <pv-input-icon class="pi pi-search" />
        <pv-input-text
          v-model="searchQuery"
          :placeholder="t('customer_registrations.search_placeholder')"
          class="search-input"
        />
      </pv-icon-field>
    </section>

    <div v-if="store.isLoadingCustomerRegistrations && store.customerRegistrations.length === 0" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
    </div>

    <p v-else-if="store.errorCustomerRegistrations" class="empty-state error-state">
      {{ store.errorCustomerRegistrations }}
    </p>

    <p v-else-if="filteredCustomerRegistrations.length === 0" class="empty-state">
      {{ t('customer_registrations.empty') }}
    </p>

    <section v-else class="customer-registrations-list">
      <article
        v-for="registration in filteredCustomerRegistrations"
        :key="registration.id"
        class="registration-card"
      >
        <div class="registration-info">
          <h3>{{ t('customer_registrations.card.customer_id', { id: registration.customerId }) }}</h3>
          <p class="meta-info">
            <span><i class="pi pi-building"></i> {{ registration.branchId }}</span>
            <span><i class="pi pi-calendar"></i> {{ registration.registeredAt }}</span>
            <span v-if="registration.unregisteredAt"><i class="pi pi-calendar-times"></i> {{ registration.unregisteredAt }}</span>
          </p>
        </div>
        <div class="registration-actions">
          <!-- Edit button if needed -->
          <!-- <pv-button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text"
            @click="openEditForm(registration)"
          /> -->
          <pv-button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger"
            @click="handleDeleteCustomerRegistration(registration.id)"
          />
        </div>
      </article>
    </section>

    <!-- CustomerRegistrationForm if needed -->
    <!-- <CustomerRegistrationForm
        :visible="showForm"
        :mode="formMode"
        :registration="selectedCustomerRegistration"
        :saving="store.isSavingCustomerRegistration"
        @update:visible="handleFormVisibility"
        @save="handleSaveCustomerRegistration"
    /> -->
  </section>
</template>

<style scoped>
.customer-registrations-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  color: #0f172a;
  font-family: 'Mona Sans', sans-serif;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.title-container {
  flex-grow: 1;
}

.view-title {
  margin: 0;
  color: #111827;
  font-family: 'Mona Sans', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.view-subtitle {
  margin-top: 0.25rem;
  color: #6b7280;
  font-family: 'Arimo', sans-serif;
  font-size: 1.1rem;
}

.new-registration-btn {
  background: #0071EB !important;
  border: none !important;
  border-radius: 14px !important;
  padding: 0.85rem 1.75rem !important;
  color: #ffffff !important;
  font-family: 'Arimo', sans-serif !important;
  font-size: 0.95rem !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(0, 113, 235, 0.2) !important;
}

.toolbar-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.search-box {
  width: min(100%, 360px);
}

:deep(.search-input) {
  width: 100%;
  height: 48px;
  border-radius: 14px !important;
  border: 1px solid #dbe3ee !important;
  background: #ffffff !important;
  color: #334155;
  font-family: 'Arimo', sans-serif;
  font-size: 1rem;
  padding-left: 2.8rem !important;
}

:deep(.p-inputicon) {
  left: 1rem !important;
  color: #94a3b8;
}

.customer-registrations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.registration-card {
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  background: #ffffff;
  padding: 1.2rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.registration-card:hover {
  border-color: #79b5ff;
  box-shadow: 0 12px 30px rgba(0, 113, 235, 0.03);
  transform: translateY(-1px);
}

.registration-info h3 {
  margin: 0 0 0.4rem 0;
  color: #1e293b;
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
}

.meta-info {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  color: #475569;
  font-family: 'Arimo', sans-serif;
  font-size: 0.9rem;
}

.meta-info span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.registration-actions {
  display: flex;
  gap: 0.5rem;
}

.loading-state,
.empty-state {
  display: flex;
  justify-content: center;
  padding: 5rem;
  color: #94a3b8;
  font-family: 'Arimo', sans-serif;
  font-size: 1rem;
}

.loading-state i {
  font-size: 2rem;
}

.error-state {
  color: #dc2626;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar-row {
    flex-direction: column;
    align-items: flex-end;
  }

  .search-box {
    width: 100%;
  }

  .registration-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .registration-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>