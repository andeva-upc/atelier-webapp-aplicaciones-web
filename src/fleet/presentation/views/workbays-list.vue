<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useFleetStore } from '../../application/fleet.store.js';
import { BayStatus } from '../../domain/model/workbay.entity.js';
import WorkBaysForm from './workbays-form.vue';

const store = useFleetStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const searchQuery = ref('');
const showForm = ref(false);
const formMode = ref('create');
const selectedWorkBay = ref(null);
let searchTimer = null;

const filteredWorkBays = computed(() => {
  if (!searchQuery.value) {
    return store.workbays;
  }
  const normalizedQuery = searchQuery.value.toLowerCase();
  return store.workbays.filter(workBay =>
    String(workBay.internalNumber).includes(normalizedQuery) ||
    workBay.status.toLowerCase().includes(normalizedQuery)
  );
});

const statusKey = (status) => {
  const map = {
    [BayStatus.VACANT]: 'workbays.status.vacant',
    [BayStatus.OCCUPIED]: 'workbays.status.occupied',
    [BayStatus.NOT_AVAILABLE]: 'workbays.status.not_available'
  };
  return map[status] || 'workbays.status.vacant';
};

const statusClass = (status) => {
  const map = {
    [BayStatus.VACANT]: 'status-vacant',
    [BayStatus.OCCUPIED]: 'status-occupied',
    [BayStatus.NOT_AVAILABLE]: 'status-not-available'
  };
  return map[status] || 'status-vacant';
};

const syncFormWithRoute = () => {
  if (route.name === 'workbays-new') {
    formMode.value = 'create';
    selectedWorkBay.value = null;
    showForm.value = true;
    return;
  }

  if (route.name === 'workbays-edit') {
    const workBayId = route.params.id;
    const workBay = store.workbays.find((item) => item.id === workBayId);

    if (workBay) {
      formMode.value = 'edit';
      selectedWorkBay.value = workBay;
      showForm.value = true;
    }
    return;
  }

  showForm.value = false;
};

const openCreateForm = () => {
  router.push({ name: 'workbays-new' });
};

const openEditForm = (workBay) => {
  router.push({
    name: 'workbays-edit',
    params: { id: workBay.id }
  });
};

const handleFormVisibility = (value) => {
  showForm.value = value;
  if (!value && (route.name === 'workbays-new' || route.name === 'workbays-edit')) {
    router.push({ name: 'workbays' });
  }
};

const handleSaveWorkBay = async (workBay) => {
  if (formMode.value === 'create') {
    await store.addWorkBay(workBay);
  } else {
    await store.updateWorkBay(workBay);
  }
  showForm.value = false;
  selectedWorkBay.value = null;
  await router.push({ name: 'workbays' });
};

const handleDeleteWorkBay = async (id) => {
  if (confirm(t('workbays.confirm_delete'))) {
    await store.deleteWorkBay(id);
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
    () => store.workbays.length,
    () => {
      syncFormWithRoute();
    }
);

onMounted(async () => {
  await store.fetchWorkBays();
  syncFormWithRoute();
});
</script>

<template>
  <section class="workbays-page">
    <header class="view-header">
      <div class="title-container">
        <h1 class="view-title">{{ t('workbays.title') }}</h1>
        <p class="view-subtitle">{{ t('workbays.subtitle', { count: store.totalWorkBays }) }}</p>
      </div>

      <pv-button
        :label="t('workbays.actions.new')"
        icon="pi pi-plus"
        class="new-workbay-btn"
        @click="openCreateForm"
      />
    </header>

    <section class="toolbar-row">
      <pv-icon-field iconPosition="left" class="search-box">
        <pv-input-icon class="pi pi-search" />
        <pv-input-text
          v-model="searchQuery"
          :placeholder="t('workbays.search_placeholder')"
          class="search-input"
        />
      </pv-icon-field>
    </section>

    <div v-if="store.isLoadingWorkBays && store.workbays.length === 0" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
    </div>

    <p v-else-if="store.errorWorkBays" class="empty-state error-state">
      {{ store.errorWorkBays }}
    </p>

    <p v-else-if="filteredWorkBays.length === 0" class="empty-state">
      {{ t('workbays.empty') }}
    </p>

    <section v-else class="workbays-list">
      <article
        v-for="workBay in filteredWorkBays"
        :key="workBay.id"
        class="workbay-card"
      >
        <div class="workbay-info">
          <h3>{{ t('workbays.card.bay_number', { number: workBay.internalNumber }) }}</h3>
          <p class="meta-info">
            <span><i class="pi pi-tag"></i> {{ workBay.branchId }}</span>
          </p>
        </div>
        <span class="status-chip" :class="statusClass(workBay.status)">
          {{ t(statusKey(workBay.status)) }}
        </span>
        <div class="workbay-actions">
          <pv-button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text"
            @click="openEditForm(workBay)"
          />
          <pv-button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger"
            @click="handleDeleteWorkBay(workBay.id)"
          />
        </div>
      </article>
    </section>

    <WorkBaysForm
        :visible="showForm"
        :mode="formMode"
        :work-bay="selectedWorkBay"
        :saving="store.isSavingWorkBay"
        @update:visible="handleFormVisibility"
        @save="handleSaveWorkBay"
    />
  </section>
</template>

<style scoped>
.workbays-page {
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

.new-workbay-btn {
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

.workbays-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workbay-card {
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

.workbay-card:hover {
  border-color: #79b5ff;
  box-shadow: 0 12px 30px rgba(0, 113, 235, 0.03);
  transform: translateY(-1px);
}

.workbay-info h3 {
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

.status-chip {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-family: 'Arimo', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.status-vacant {
  background: #dff8ef;
  color: #00a972;
}

.status-occupied {
  background: #fff0e8;
  color: #ff5b0a;
}

.status-not-available {
  background: #f3f4f6;
  color: #6b7280;
}

.workbay-actions {
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

  .workbay-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .workbay-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>