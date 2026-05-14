<script setup>
import { onMounted, computed, ref } from 'vue';
import { useTelemetryStore } from '../../application/telemetry.store.js';
import { useI18n } from 'vue-i18n';

const store = useTelemetryStore();
const { t } = useI18n();

onMounted(() => {
  store.initialize();
});

const selectVehicle = (id) => {
  store.selectVehicle(id);
};

// Logic for charts and metrics will be added in Phase 4
</script>

<template>
  <div class="telemetry-layout">
    <!-- Left Sidebar: Vehicle List -->
    <aside class="vehicle-sidebar">
      <div class="sidebar-header">
        <h2 class="m-0">{{ t('telemetry.vehicles_title') }}</h2>
      </div>
      
      <div class="vehicle-list mt-4">
        <div 
          v-for="vehicle in store.vehicles" 
          :key="vehicle.id"
          class="vehicle-item flex align-items-center justify-content-between p-3 mb-2"
          :class="{ 'active-vehicle': store.selectedVehicleId === vehicle.id }"
          @click="selectVehicle(vehicle.id)"
        >
          <div class="flex align-items-center gap-3">
            <div class="vehicle-icon-box flex align-items-center justify-content-center">
              <i class="pi pi-car"></i>
            </div>
            <div class="vehicle-info">
              <h4 class="m-0">{{ vehicle.plate_number }}</h4>
              <p class="m-0 text-sm text-500">{{ vehicle.brand }} {{ vehicle.model }}</p>
              <button class="unlink-btn p-0 border-none bg-transparent text-xs text-primary cursor-pointer">Unlink</button>
            </div>
          </div>
          <div class="status-indicator flex align-items-center gap-1">
            <span class="status-dot"></span>
            <span class="text-xs font-bold text-green-500">Active</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="telemetry-content flex-1 p-5">
      <!-- Placeholder for metrics, chart, and alerts (Phase 4) -->
      <div class="flex flex-column gap-5">
        <section class="metrics-row grid m-0">
          <!-- Metric cards will go here -->
          <div class="col-12 text-center text-500 p-8 border-1 border-dashed border-300 border-round-xl">
             Loading Metrics...
          </div>
        </section>

        <section class="chart-section p-4 bg-white border-round-2xl border-1 border-100 shadow-sm">
          <h3 class="m-0 mb-4">{{ t('telemetry.history_title') }}</h3>
          <div class="h-20rem flex align-items-center justify-content-center text-500">
             Loading History Chart...
          </div>
        </section>

        <section class="alerts-section">
          <h3 class="m-0 mb-4">{{ t('telemetry.alerts_title') }}</h3>
          <div class="flex flex-column gap-3">
             <div class="p-5 text-center text-500 border-1 border-dashed border-300 border-round-xl">
               Loading Active Alerts...
             </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.telemetry-layout {
  display: flex;
  height: 100%;
  background-color: #f8fafc;
}

.vehicle-sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 1.5rem;
  overflow-y: auto;
}

.sidebar-header h2 {
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
}

.vehicle-item {
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.vehicle-item:hover {
  background-color: #f1f5f9;
}

.active-vehicle {
  background-color: #eff6ff !important;
  border-color: #3b82f6 !important;
}

.vehicle-icon-box {
  width: 44px;
  height: 44px;
  background-color: #f1f5f9;
  border-radius: 10px;
  color: #64748b;
}

.active-vehicle .vehicle-icon-box {
  background-color: #3b82f6;
  color: white;
}

.vehicle-info h4 {
  font-family: 'Mona Sans', sans-serif;
  font-weight: 700;
  color: #1e293b;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
}

.unlink-btn {
  font-family: 'Arimo', sans-serif;
  text-decoration: underline;
}

.telemetry-content {
  overflow-y: auto;
}
</style>
