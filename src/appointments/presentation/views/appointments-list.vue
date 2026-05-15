<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppointmentsStore } from '../../application/appointments.store.js';
import { AppointmentStatus } from '../../domain/model/appointment.entity.js';
import AppointmentsForm from './appointments-form.vue';

const store = useAppointmentsStore();
const { t } = useI18n();

const searchQuery = ref('');
const selectedFilter = ref('ALL');
const showForm = ref(false);
const showDetail = ref(false);
const formMode = ref('create');
const selectedAppointment = ref(null);
let searchTimer = null;

const filters = computed(() => [
  { key: 'ALL', label: t('appointments.filters.all') },
  { key: 'CONFIRMED', label: t('appointments.filters.confirmed') },
  { key: 'PENDING', label: t('appointments.filters.pending') },
  { key: 'CANCELLED', label: t('appointments.filters.cancelled') },
  { key: 'COMPLETED', label: t('appointments.filters.completed') }
]);

const filteredAppointments = computed(() => {
  return store.activeAppointments.filter((appointment) => {
    if (selectedFilter.value === 'ALL') return true;
    if (selectedFilter.value === 'CONFIRMED') return appointment.isConfirmed();
    if (selectedFilter.value === 'PENDING') return appointment.status === AppointmentStatus.PENDING_APPROVAL;
    if (selectedFilter.value === 'CANCELLED') return appointment.status === AppointmentStatus.CANCELLED;
    return appointment.status === AppointmentStatus.COMPLETED;
  });
});

const statusKey = (status) => {
  const map = {
    [AppointmentStatus.SCHEDULED]: 'appointments.status.confirmed',
    [AppointmentStatus.PENDING_APPROVAL]: 'appointments.status.pending',
    [AppointmentStatus.IN_PROGRESS]: 'appointments.status.in_progress',
    [AppointmentStatus.COMPLETED]: 'appointments.status.completed',
    [AppointmentStatus.CANCELLED]: 'appointments.status.cancelled'
  };

  return map[status] || 'appointments.status.pending';
};

const statusClass = (status) => {
  const map = {
    [AppointmentStatus.SCHEDULED]: 'status-confirmed',
    [AppointmentStatus.PENDING_APPROVAL]: 'status-pending',
    [AppointmentStatus.IN_PROGRESS]: 'status-confirmed',
    [AppointmentStatus.COMPLETED]: 'status-completed',
    [AppointmentStatus.CANCELLED]: 'status-cancelled'
  };

  return map[status] || 'status-pending';
};

const openCreateForm = () => {
  formMode.value = 'create';
  selectedAppointment.value = null;
  showForm.value = true;
};

const openDetail = (appointment) => {
  selectedAppointment.value = appointment;
  store.selectAppointment(appointment);
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
};

const openEditForm = () => {
  if (!selectedAppointment.value) return;
  showDetail.value = false;
  formMode.value = 'edit';
  showForm.value = true;
};

const handleSaveAppointment = async (appointment) => {
  if (formMode.value === 'create') {
    await store.addAppointment(appointment);
  } else {
    await store.updateAppointment(appointment);
  }

  showForm.value = false;
};

watch(searchQuery, (query) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    store.searchAppointments(query.trim());
  }, 300);
});

onMounted(() => {
  store.fetchAppointments();
});
</script>

<template>
  <section class="appointments-page">
    <header class="view-header">
      <div class="title-container">
        <h1 class="view-title">{{ t('appointments.title') }}</h1>
        <p class="view-subtitle">{{ t('appointments.subtitle', { count: store.totalAppointments }) }}</p>
      </div>

      <pv-button
        :label="t('appointments.actions.new')"
        icon="pi pi-plus"
        class="new-appointment-btn"
        @click="openCreateForm"
      />
    </header>

    <section class="summary-grid" :aria-label="t('appointments.aria.summary')">
      <article class="summary-card summary-total">
        <strong>{{ store.totalAppointments }}</strong>
        <span>{{ t('appointments.stats.total') }}</span>
      </article>

      <article class="summary-card summary-confirmed">
        <strong>{{ store.confirmedAppointments }}</strong>
        <span>{{ t('appointments.stats.confirmed') }}</span>
      </article>

      <article class="summary-card summary-pending">
        <strong>{{ store.pendingAppointments }}</strong>
        <span>{{ t('appointments.stats.pending') }}</span>
      </article>

      <article class="summary-card summary-completed">
        <strong>{{ store.completedAppointments }}</strong>
        <span>{{ t('appointments.stats.completed') }}</span>
      </article>
    </section>

    <section class="toolbar-row">
      <nav class="filter-tabs" :aria-label="t('appointments.aria.filters')">
        <button
          v-for="filter in filters"
          :key="filter.key"
          type="button"
          :class="{ active: selectedFilter === filter.key }"
          @click="selectedFilter = filter.key"
        >
          {{ filter.label }}
        </button>
      </nav>

      <pv-icon-field iconPosition="left" class="search-box">
        <pv-input-icon class="pi pi-search" />
        <pv-input-text
          v-model="searchQuery"
          :placeholder="t('appointments.search_placeholder')"
          class="search-input"
        />
      </pv-icon-field>
    </section>

    <div v-if="store.isLoading && store.appointments.length === 0" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
    </div>

    <p v-else-if="store.error" class="empty-state error-state">
      {{ store.error }}
    </p>

    <p v-else-if="filteredAppointments.length === 0" class="empty-state">
      {{ t('appointments.empty') }}
    </p>

    <section v-else class="appointments-list" :aria-label="t('appointments.aria.list')">
      <article
        v-for="appointment in filteredAppointments"
        :key="appointment.id"
        class="appointment-card"
        :class="{ highlight: appointment.isToday() }"
        @click="openDetail(appointment)"
      >
        <div class="time-box" :class="{ 'time-highlight': appointment.isToday() }">
          <i class="pi pi-calendar calendar-icon"></i>
          <strong>{{ appointment.getTimeLabel() }}</strong>
        </div>

        <div class="appointment-info">
          <div class="title-row">
            <h3>{{ appointment.customerName }}</h3>
            <span v-if="appointment.isToday()" class="today-chip">
              {{ t('appointments.today') }}
            </span>
          </div>

          <div class="meta-row">
            <span><i class="pi pi-car"></i> {{ appointment.vehicleSummary }}</span>
            <span><i class="pi pi-clock"></i> {{ appointment.getDateLabel() }} · {{ appointment.getTimeLabel() }}</span>
            <span><i class="pi pi-user"></i> {{ appointment.mechanicName }}</span>
          </div>

          <span class="service-chip">{{ appointment.serviceType }}</span>
        </div>

        <span class="status-chip" :class="statusClass(appointment.status)">
          {{ t(statusKey(appointment.status)) }}
        </span>
      </article>
    </section>

    <AppointmentsForm
      v-model:visible="showForm"
      :mode="formMode"
      :appointment="selectedAppointment"
      :saving="store.isSaving"
      @save="handleSaveAppointment"
    />

    <pv-dialog
      :visible="showDetail"
      @update:visible="showDetail = $event"
      :modal="true"
      class="appointment-detail-dialog"
      :style="{ width: '680px' }"
      :draggable="false"
      appendTo="body"
    >
      <template #header>
        <h2 class="dialog-title">{{ t('appointments.detail.title') }}</h2>
      </template>

      <section v-if="selectedAppointment" class="detail-grid">
        <div>
          <span>{{ t('appointments.fields.customer') }}</span>
          <strong>{{ selectedAppointment.customerName }}</strong>
        </div>

        <div>
          <span>{{ t('appointments.fields.phone') }}</span>
          <strong>{{ selectedAppointment.customerPhone }}</strong>
        </div>

        <div>
          <span>{{ t('appointments.fields.vehicle') }}</span>
          <strong>{{ selectedAppointment.vehicleSummary }}</strong>
        </div>

        <div>
          <span>{{ t('appointments.fields.service') }}</span>
          <strong>{{ selectedAppointment.serviceType }}</strong>
        </div>

        <div>
          <span>{{ t('appointments.fields.date') }}</span>
          <strong>{{ selectedAppointment.getDateLabel() }}</strong>
        </div>

        <div>
          <span>{{ t('appointments.fields.time') }}</span>
          <strong>{{ selectedAppointment.getTimeLabel() }}</strong>
        </div>

        <div>
          <span>{{ t('appointments.fields.mechanic') }}</span>
          <strong>{{ selectedAppointment.mechanicName }}</strong>
        </div>

        <div>
          <span>{{ t('appointments.fields.status') }}</span>
          <strong class="status-chip detail-status" :class="statusClass(selectedAppointment.status)">
            {{ t(statusKey(selectedAppointment.status)) }}
          </strong>
        </div>

        <div class="detail-full">
          <span>{{ t('appointments.fields.notes') }}</span>
          <strong>{{ selectedAppointment.notes || t('appointments.notes.empty') }}</strong>
        </div>
      </section>

      <template #footer>
        <div class="detail-actions">
          <button type="button" class="btn-secondary" @click="closeDetail">
            {{ t('appointments.actions.close') }}
          </button>
          <button type="button" class="btn-edit" @click="openEditForm">
            <i class="pi pi-pencil"></i>
            {{ t('appointments.actions.edit') }}
          </button>
        </div>
      </template>
    </pv-dialog>
  </section>
</template>

<style scoped>
.appointments-page {
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

.new-appointment-btn {
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.6rem;
}

.summary-card {
  border-radius: 18px;
  min-height: 115px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.summary-card strong {
  font-family: 'Mona Sans', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.summary-card span {
  font-family: 'Arimo', sans-serif;
  color: #334155;
  font-size: 0.95rem;
}

.summary-total {
  background: #dbeafe;
  color: #0071EB;
}

.summary-confirmed {
  background: #dcf4f0;
  color: #08b982;
}

.summary-pending {
  background: #f6e8e2;
  color: #ff5b0a;
}

.summary-completed {
  background: #e4e9f1;
  color: #64748b;
}

.toolbar-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.filter-tabs {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: #ffffff;
  border: 1px solid #dbe3ee;
  border-radius: 14px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.03);
}

.filter-tabs button {
  border: none;
  background: transparent;
  color: #0f172a;
  border-radius: 11px;
  padding: 0.65rem 1.1rem;
  font-family: 'Arimo', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
}

.filter-tabs button.active {
  background: #0071EB;
  color: #ffffff;
  font-weight: 700;
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

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-card {
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  background: #ffffff;
  padding: 1.6rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.appointment-card:hover,
.appointment-card.highlight {
  border-color: #79b5ff;
  box-shadow: 0 12px 30px rgba(0, 113, 235, 0.08);
}

.appointment-card:hover {
  transform: translateY(-1px);
}

.time-box {
  width: 62px;
  min-height: 62px;
  border-radius: 14px;
  background: #f3f6fb;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-family: 'Arimo', sans-serif;
}

.time-box strong {
  font-family: 'Mona Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
}

.time-highlight {
  background: #0071EB;
  color: #ffffff;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.45rem;
}

.title-row h3 {
  margin: 0;
  color: #1e293b;
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  color: #475569;
  font-family: 'Arimo', sans-serif;
  font-size: 0.9rem;
  margin-bottom: 0.55rem;
}

.meta-row span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.today-chip,
.service-chip,
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

.today-chip {
  background: #0071EB;
  color: #ffffff;
}

.service-chip {
  background: #f3f6fb;
  color: #64748b;
}

.status-confirmed {
  background: #dff8ef;
  color: #00a972;
}

.status-pending {
  background: #fff0e8;
  color: #ff5b0a;
}

.status-completed {
  background: #e6f1ff;
  color: #0071EB;
}

.status-cancelled {
  background: #f3f4f6;
  color: #6b7280;
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

:global(.appointment-detail-dialog.p-dialog) {
  background: #ffffff !important;
  border-radius: 28px !important;
  border: 1px solid #e5e7eb !important;
  overflow: hidden !important;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.28) !important;
}

:global(.appointment-detail-dialog .p-dialog-header) {
  background: #ffffff !important;
  padding: 2rem 2.5rem !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

:global(.appointment-detail-dialog .p-dialog-content) {
  background: #ffffff !important;
  padding: 2rem 2.5rem !important;
}

:global(.appointment-detail-dialog .p-dialog-footer) {
  background: #f8fafc !important;
  padding: 1.5rem 2.5rem !important;
  border-top: 1px solid #f1f5f9 !important;
}

.dialog-title {
  margin: 0;
  color: #0f172a;
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.4rem 2.6rem;
}

.detail-grid div {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.detail-grid span {
  color: #64748b;
  font-family: 'Arimo', sans-serif;
  font-size: 0.95rem;
}

.detail-grid strong {
  color: #111827;
  font-family: 'Mona Sans', sans-serif;
  font-size: 1rem;
  font-weight: 700;
}

.detail-full {
  grid-column: 1 / -1;
}

.detail-status {
  align-self: flex-start;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.85rem;
}

.btn-secondary,
.btn-edit {
  height: 48px;
  border-radius: 14px;
  padding: 0 1.2rem;
  font-family: 'Mona Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
}

.btn-secondary {
  background: #ffffff;
  color: #475569;
  border: 1px solid #d9dee7;
}

.btn-edit {
  border: 1px solid #93c5fd;
  background: #ffffff;
  color: #0071EB;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 980px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .toolbar-row {
    align-items: stretch;
    flex-direction: column;
  }

  .filter-tabs {
    overflow-x: auto;
  }

  .search-box {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .view-header {
    flex-direction: column;
  }

  .view-title {
    font-size: 2rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .appointment-card {
    grid-template-columns: auto 1fr;
  }

  .status-chip {
    grid-column: 1 / -1;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>