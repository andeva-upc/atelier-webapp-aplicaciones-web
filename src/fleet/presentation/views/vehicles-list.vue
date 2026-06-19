<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useFleetStore } from '../../application/fleet.store.js';
import VehiclesForm from './vehicles-form.vue';

const store = useFleetStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const searchQuery = ref('');
const showForm = ref(false);
const formMode = ref('create');
const selectedVehicle = ref(null);
let searchTimer = null;

const filteredVehicles = computed(() => {
  if (!searchQuery.value) {
    return store.vehicles;
  }
  const normalizedQuery = searchQuery.value.toLowerCase();
  return store.vehicles.filter(vehicle =>
    vehicle.plateNumber.toLowerCase().includes(normalizedQuery) ||
    vehicle.brand.toLowerCase().includes(normalizedQuery) ||
    vehicle.model.toLowerCase().includes(normalizedQuery)
  );
});

const syncFormWithRoute = () => {
  if (route.name === 'vehicles-new') {
    formMode.value = 'create';
    selectedVehicle.value = null;
    showForm.value = true;
    return;
  }

  if (route.name === 'vehicles-edit') {
    const vehicleId = route.params.id;
    const vehicle = store.vehicles.find((item) => item.id === vehicleId);

    if (vehicle) {
      formMode.value = 'edit';
      selectedVehicle.value = vehicle;
      showForm.value = true;
    }
    return;
  }

  showForm.value = false;
};

const openCreateForm = () => {
  router.push({ name: 'vehicles-new' });
};

const openEditForm = (vehicle) => {
  router.push({
    name: 'vehicles-edit',
    params: { id: vehicle.id }
  });
};

const handleFormVisibility = (value) => {
  showForm.value = value;
  if (!value && (route.name === 'vehicles-new' || route.name === 'vehicles-edit')) {
    router.push({ name: 'vehicles' });
  }
};

const handleSaveVehicle = async (vehicle) => {
  if (formMode.value === 'create') {
    await store.addVehicle(vehicle);
  } else {
    await store.updateVehicle(vehicle);
  }
  showForm.value = false;
  selectedVehicle.value = null;
  await router.push({ name: 'vehicles' });
};

const handleDeleteVehicle = async (id) => {
  if (confirm(t('vehicles.confirm_delete'))) {
    await store.deleteVehicle(id);
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
    () => store.vehicles.length,
    () => {
      syncFormWithRoute();
    }
);

onMounted(async () => {
  await store.fetchVehicles();
  syncFormWithRoute();
});
</script>

<template>
  <section class="vehicles-page">
    <header class="view-header">
      <div class="title-container">
        <h1 class="view-title">{{ t('vehicles.title') }}</h1>
        <p class="view-subtitle">{{ t('vehicles.subtitle', { count: store.totalVehicles }) }}</p>
      </div>

      <pv-button
        :label="t('vehicles.actions.new')"
        icon="pi pi-plus"
        class="new-vehicle-btn"
        @click="openCreateForm"
      />
    </header>

    <section class="toolbar-row">
      <pv-icon-field iconPosition="left" class="search-box">
        <pv-input-icon class="pi pi-search" />
        <pv-input-text
          v-model="searchQuery"
          :placeholder="t('vehicles.search_placeholder')"
          class="search-input"
        />
      </pv-icon-field>
    </section>

    <div v-if="store.isLoadingVehicles && store.vehicles.length === 0" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
    </div>

    <p v-else-if="store.errorVehicles" class="empty-state error-state">
      {{ store.errorVehicles }}
    </p>

    <p v-else-if="filteredVehicles.length === 0" class="empty-state">
      {{ t('vehicles.empty') }}
    </p>

    <section v-else class="vehicles-list">
      <article
        v-for="vehicle in filteredVehicles"
        :key="vehicle.id"
        class="vehicle-card"
      >
        <div class="vehicle-info">
          <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>
          <p class="meta-info">
            <span><i class="pi pi-tag"></i> {{ vehicle.plateNumber }}</span>
            <span><i class="pi pi-calendar"></i> {{ vehicle.year }}</span>
            <span><i class="pi pi-road"></i> {{ vehicle.currentMileage }} km</span>
          </p>
        </div>
        <div class="vehicle-actions">
          <pv-button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text"
            @click="openEditForm(vehicle)"
          />
          <pv-button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger"
            @click="handleDeleteVehicle(vehicle.id)"
          />
        </div>
      </article>
    </section>

    <VehiclesForm
        :visible="showForm"
        :mode="formMode"
        :vehicle="selectedVehicle"
        :saving="store.isSavingVehicle"
        @update:visible="handleFormVisibility"
        @save="handleSaveVehicle"
    />
  </section>
</template>

<style scoped>
.vehicles-page {
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

.new-vehicle-btn {
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

.vehicles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vehicle-card {
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

.vehicle-card:hover {
  border-color: #79b5ff;
  box-shadow: 0 12px 30px rgba(0, 113, 235, 0.03);
  transform: translateY(-1px);
}

.vehicle-info h3 {
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

.vehicle-actions {
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

  .vehicle-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .vehicle-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>