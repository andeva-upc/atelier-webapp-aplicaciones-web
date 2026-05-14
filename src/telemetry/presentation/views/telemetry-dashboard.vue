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

// Chart Configuration
const chartData = computed(() => {
  if (!store.snapshots || store.snapshots.length === 0) return null;

  return {
    labels: store.snapshots.map(s => s.timeLabel),
    datasets: [
      {
        label: 'RPM',
        data: store.snapshots.map(s => s.rpm),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: `${t('telemetry.metrics.temperature')} (°C)`,
        data: store.snapshots.map(s => s.temperature),
        borderColor: '#f97316',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        font: { family: 'Arimo', size: 12 }
      }
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: { display: true, text: 'RPM' },
      grid: { borderDash: [5, 5] }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: { display: true, text: 'Temperature (°C)' },
      grid: { drawOnChartArea: false }
    }
  }
};

const getSeverityClass = (severity) => {
  const map = {
    'CRITICAL': 'alert-critical',
    'MEDIUM': 'alert-medium',
    'LOW': 'alert-low'
  };
  return map[severity] || 'alert-low';
};
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
      <div v-if="store.isLoading && !store.selectedVehicleId" class="flex justify-content-center p-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>

      <div v-else class="flex flex-column gap-5">
        <!-- Metric Cards -->
        <section class="metrics-row grid m-0">
          <div class="col-12 md:col-3 p-2">
            <pv-card class="metric-card">
              <template #content>
                <div class="flex align-items-center gap-3">
                  <div class="metric-icon rpm-bg flex align-items-center justify-content-center">
                    <i class="pi pi-chart-line"></i>
                  </div>
                  <div>
                    <p class="m-0 text-xs text-500 font-bold uppercase tracking-wider">RPM</p>
                    <h2 class="m-0 text-2xl font-800">{{ store.latestSnapshot?.rpm || '---' }}</h2>
                    <p class="m-0 text-xs text-500">RPM</p>
                  </div>
                </div>
              </template>
            </pv-card>
          </div>
          <div class="col-12 md:col-3 p-2">
            <pv-card class="metric-card">
              <template #content>
                <div class="flex align-items-center gap-3">
                  <div class="metric-icon temp-bg flex align-items-center justify-content-center">
                    <i class="pi pi-thermometer"></i>
                  </div>
                  <div>
                    <p class="m-0 text-xs text-500 font-bold uppercase tracking-wider">{{ t('telemetry.metrics.temperature') }}</p>
                    <h2 class="m-0 text-2xl font-800">{{ store.latestSnapshot?.temperature || '---' }}</h2>
                    <p class="m-0 text-xs text-500">°C</p>
                  </div>
                </div>
              </template>
            </pv-card>
          </div>
          <div class="col-12 md:col-3 p-2">
            <pv-card class="metric-card">
              <template #content>
                <div class="flex align-items-center gap-3">
                  <div class="metric-icon fuel-bg flex align-items-center justify-content-center">
                    <i class="pi pi-filter"></i>
                  </div>
                  <div>
                    <p class="m-0 text-xs text-500 font-bold uppercase tracking-wider">{{ t('telemetry.metrics.fuel') }}</p>
                    <h2 class="m-0 text-2xl font-800">{{ store.latestSnapshot?.fuelLevel || '---' }}</h2>
                    <p class="m-0 text-xs text-500">%</p>
                  </div>
                </div>
              </template>
            </pv-card>
          </div>
          <div class="col-12 md:col-3 p-2">
            <pv-card class="metric-card">
              <template #content>
                <div class="flex align-items-center gap-3">
                  <div class="metric-icon speed-bg flex align-items-center justify-content-center">
                    <i class="pi pi-gauge"></i>
                  </div>
                  <div>
                    <p class="m-0 text-xs text-500 font-bold uppercase tracking-wider">{{ t('telemetry.metrics.speed') }}</p>
                    <h2 class="m-0 text-2xl font-800">{{ store.latestSnapshot?.speed || '---' }}</h2>
                    <p class="m-0 text-xs text-500">km/h</p>
                  </div>
                </div>
              </template>
            </pv-card>
          </div>
        </section>

        <!-- History Chart -->
        <section class="chart-section p-4 bg-white border-round-2xl border-1 border-100 shadow-sm relative">
          <div v-if="store.isLoading" class="overlay flex align-items-center justify-content-center border-round-2xl">
            <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
          </div>
          <h3 class="m-0 mb-4">{{ t('telemetry.history_title') }}</h3>
          <div class="h-20rem">
            <pv-chart v-if="chartData" type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
            <div v-else class="h-full flex align-items-center justify-content-center text-500">
              No history data available for this vehicle
            </div>
          </div>
        </section>

        <!-- DTC Alerts -->
        <section class="alerts-section">
          <h3 class="m-0 mb-4">{{ t('telemetry.alerts_title') }}</h3>
          <div class="flex flex-column gap-3">
            <div v-if="store.activeAlerts.length === 0" class="p-5 text-center text-500 border-1 border-dashed border-300 border-round-xl bg-white">
              No active DTC alerts detected
            </div>
            <div 
              v-for="alert in store.activeAlerts" 
              :key="alert.id" 
              class="alert-card p-4 border-round-2xl border-1 shadow-sm flex align-items-center justify-content-between"
              :class="getSeverityClass(alert.severity)"
            >
              <div class="flex align-items-start gap-4">
                <div class="alert-indicator mt-1"></div>
                <div>
                  <div class="flex align-items-center gap-2 mb-1">
                    <span class="font-800 text-lg">{{ alert.code }}</span>
                    <pv-tag :value="alert.severity" :severity="alert.severity === 'CRITICAL' ? 'danger' : (alert.severity === 'MEDIUM' ? 'warn' : 'info')" rounded />
                  </div>
                  <h4 class="m-0 text-xl font-800 mb-1">{{ alert.description }}</h4>
                  <p class="m-0 text-sm text-500">
                    {{ store.selectedVehicle?.brand }} {{ store.selectedVehicle?.model }} {{ store.selectedVehicle?.plate_number }} • 5/14/26, 4:34 PM
                  </p>
                </div>
              </div>
              <div class="alert-action">
                <i class="pi pi-exclamation-circle text-2xl"></i>
              </div>
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

/* Metrics */
.metric-card {
  border-radius: 20px !important;
  border: 1px solid #f1f5f9 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  font-size: 1.25rem;
}

.rpm-bg { background-color: #eff6ff; color: #3b82f6; }
.temp-bg { background-color: #fff7ed; color: #f97316; }
.fuel-bg { background-color: #f0fdf4; color: #22c55e; }
.speed-bg { background-color: #faf5ff; color: #a855f7; }

/* Alerts */
.alert-card {
  transition: transform 0.2s ease;
}

.alert-card:hover {
  transform: translateX(4px);
}

.alert-critical {
  background-color: #fef2f2;
  border-color: #fee2e2;
}

.alert-critical .alert-indicator {
  width: 10px;
  height: 10px;
  background-color: #ef4444;
  border-radius: 50%;
}

.alert-medium {
  background-color: #fffbeb;
  border-color: #fef3c7;
}

.alert-medium .alert-indicator {
  width: 10px;
  height: 10px;
  background-color: #f59e0b;
  border-radius: 50%;
}

.alert-low {
  background-color: #f0f9ff;
  border-color: #e0f2fe;
}

.alert-low .alert-indicator {
  width: 10px;
  height: 10px;
  background-color: #0ea5e9;
  border-radius: 50%;
}

.alert-action {
  color: #94a3b8;
}

.alert-critical .alert-action { color: #ef4444; }
.alert-medium .alert-action { color: #f59e0b; }

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 5;
}
</style>
