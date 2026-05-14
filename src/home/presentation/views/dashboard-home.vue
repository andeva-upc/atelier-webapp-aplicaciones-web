<template>
  <div class="dashboard-container" v-if="!dashboardStore.loading && dashboardStore.data">

    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-text">
        <h1>{{ $t('dashboard.greeting', { name: 'Juan' }) }}</h1>
        <p class="subtitle">{{ $t('dashboard.summary-date', { date: currentDate }) }}</p>
      </div>
    </header>

    <!-- KPIs Grid -->
    <section class="kpis-grid" v-if="dashboardStore.kpis">
      <div class="kpi-card">
        <div class="card-content-inner">
          <div class="kpi-header">
            <span class="kpi-title">{{ $t('dashboard.kpi.income', 'Monthly income') }}</span>
            <div class="kpi-icon icon-blue"><i class="pi pi-dollar"></i></div>
          </div>
          <div class="kpi-value">S/ {{ dashboardStore.kpis.income }}</div>
          <div class="kpi-footer text-green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            {{ $t('dashboard.kpi.vs-last-month', { percent: dashboardStore.kpis.incomeGrowth }) }}
          </div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="card-content-inner">
          <div class="kpi-header">
            <span class="kpi-title">{{ $t('dashboard.kpi.active-orders', 'Active WOs') }}</span>
            <div class="kpi-icon icon-orange"><i class="pi pi-file"></i></div>
          </div>
          <div class="kpi-value">{{ dashboardStore.kpis.activeOrders }}</div>
          <div class="kpi-footer text-green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            {{ $t('dashboard.kpi.completed-today', { count: dashboardStore.kpis.completedToday }) }}
          </div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="card-content-inner">
          <div class="kpi-header">
            <span class="kpi-title">{{ $t('dashboard.kpi.vehicles-workshop', 'Vehicles in workshop') }}</span>
            <div class="kpi-icon icon-blue"><i class="pi pi-car"></i></div>
          </div>
          <div class="kpi-value">{{ dashboardStore.kpis.vehiclesInWorkshop }}</div>
          <div class="kpi-footer text-green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            {{ $t('dashboard.kpi.with-telemetry', { count: dashboardStore.kpis.vehiclesWithTelemetry }) }}
          </div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="card-content-inner">
          <div class="kpi-header">
            <span class="kpi-title">{{ $t('dashboard.kpi.pending-alerts', 'Pending alerts') }}</span>
            <div class="kpi-icon icon-red"><i class="pi pi-exclamation-triangle"></i></div>
          </div>
          <div class="kpi-value">{{ dashboardStore.kpis.pendingAlerts }}</div>
          <div class="kpi-footer text-green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            {{ $t('dashboard.kpi.critical-medium', { critical: dashboardStore.kpis.criticalAlerts, medium: dashboardStore.kpis.mediumAlerts }) }}
          </div>
        </div>
      </div>
    </section>

    <!-- Middle Section: Chart & Alerts -->
    <section class="middle-grid">
      <!-- Chart Card -->
      <div class="chart-card">
        <div class="card-content-inner">
          <div class="card-header">
            <h2>{{ $t('dashboard.chart.title', 'Monthly income') }}</h2>
            <span class="subtitle">{{ $t('dashboard.chart.subtitle', 'Last 5 months') }}</span>
          </div>
          <div class="chart-wrapper">
            <Chart v-if="chartDataConfig" type="line" :data="chartDataConfig" :options="chartOptions" style="height: 250px" />
          </div>
        </div>
      </div>

      <!-- Alerts Card -->
      <div class="alerts-card">
        <div class="card-content-inner">
          <div class="card-header">
            <h2>{{ $t('dashboard.alerts.title', 'DTC Alerts') }}</h2>
            <a href="#" class="link-action">{{ $t('dashboard.alerts.view-all', 'View all') }} &rarr;</a>
          </div>
          <div class="alerts-list">
            <div class="alert-item" v-for="alert in dashboardStore.alerts" :key="alert.id">
              <div class="alert-dot" :style="{ backgroundColor: getSeverityDotColor(alert.severity) }"></div>
              <div class="alert-info">
                <div class="alert-title">
                  <strong>{{ alert.dtcCode }}</strong> — {{ alert.vehiclePlate }}
                </div>
                <div class="alert-desc">{{ alert.description }}</div>
                <div class="alert-time">{{ alert.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Orders Table -->
    <div class="table-card">
      <div class="card-content-inner">
        <div class="card-header">
          <h2>{{ $t('dashboard.orders.title', 'Recent orders') }}</h2>
          <a href="#" class="link-action">{{ $t('dashboard.orders.view-all', 'View all') }} &rarr;</a>
        </div>

        <div class="table-scroll">
          <table class="orders-table">
            <thead>
              <tr>
                <th>{{ $t('dashboard.orders.table.ot', 'WO') }}</th>
                <th>{{ $t('dashboard.orders.table.customer', 'Customer') }}</th>
                <th>{{ $t('dashboard.orders.table.vehicle', 'Vehicle') }}</th>
                <th>{{ $t('dashboard.orders.table.mechanic', 'Mechanic') }}</th>
                <th>{{ $t('dashboard.orders.table.status', 'Status') }}</th>
                <th>{{ $t('dashboard.orders.table.amount', 'Amount') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dashboardStore.recentOrders" :key="row.id">
                <td class="ot-link">{{ row.id }}</td>
                <td>{{ row.customerName }}</td>
                <td>
                  {{ row.vehicleName }} <span class="plate-text">{{ row.vehiclePlate }}</span>
                </td>
                <td>{{ row.mechanicName }}</td>
                <td>
                  <span class="custom-badge" :class="getStatusClass(row.status)">
                    {{ getStatusLabel(row.status) }}
                  </span>
                </td>
                <td>S/ {{ row.totalAmount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>

  <div class="loading-overlay" v-else-if="dashboardStore.loading">
    <ProgressSpinner />
  </div>

  <div class="p-error p-4" v-else-if="dashboardStore.error">
    {{ dashboardStore.error }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDashboardStore } from '../../application/dashboard.store.js';
import { useI18n } from 'vue-i18n';

import Chart from 'primevue/chart';
import ProgressSpinner from 'primevue/progressspinner';

const { t } = useI18n();
const dashboardStore = useDashboardStore();

const currentDate = ref(new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }));

onMounted(() => {
  dashboardStore.loadDashboardData();
});

const chartDataConfig = computed(() => {
  const data = dashboardStore.chartData;
  if (!data || !data.length) return null;

  return {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: t('dashboard.kpi.income', 'Income'),
        data: data.map(d => d.income),
        fill: true,
        borderColor: '#FF6F00',
        backgroundColor: 'rgba(255, 111, 0, 0.05)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  };
});

const chartOptions = {
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) { return 'S/' + (value / 1000) + 'k'; },
        color: '#9ca3af'
      },
      grid: { color: '#f3f4f6', drawBorder: false },
      border: { display: false }
    },
    x: {
      ticks: { color: '#9ca3af' },
      grid: { display: false },
      border: { display: false }
    }
  },
  maintainAspectRatio: false
};

const getSeverityDotColor = (severity) => {
  return severity === 'CRITICAL' ? '#ef4444' : '#f59e0b';
};

const getStatusClass = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'DONE': return 'badge-completed';
    case 'IN_PROGRESS':
    case 'DOING': return 'badge-progress';
    case 'PENDING': return 'badge-pending';
    case 'SCHEDULED': return 'badge-default';
    default: return 'badge-default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'DONE': return t('dashboard.status.completed', 'Completed');
    case 'IN_PROGRESS':
    case 'DOING': return t('dashboard.status.in-progress', 'In progress');
    case 'PENDING': return t('dashboard.status.pending', 'Pending');
    case 'SCHEDULED': return t('dashboard.status.scheduled', 'Scheduled');
    default: return status;
  }
};
</script>

<style scoped>
/* Injecting exact Angular CSS below */
.dashboard-container {
  padding: 2.5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Mona Sans', system-ui, -apple-system, sans-serif;
  color: #1f2937;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
  width: 100%;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-text h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  color: #111827;
  letter-spacing: -0.03em;
}

.header-text .subtitle {
  font-size: 1.05rem;
  color: #9ca3af;
  margin: 0.35rem 0 0 0;
  font-weight: 400;
  font-family: 'Arimo', sans-serif;
}

/* KPIs Grid */
.kpis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.kpi-card, .chart-card, .alerts-card, .table-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.02);
  padding: 8px;
  transition:
    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0;
}

.kpi-card:hover, .chart-card:hover, .alerts-card:hover, .table-card:hover {
  box-shadow: 0 10px 25px rgba(0, 113, 235, 0.12), 0 3px 10px rgba(0, 113, 235, 0.05);
  border-color: rgba(0, 113, 235, 0.25);
}

.card-content-inner {
  padding: 16px;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-title {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.kpi-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue { background: #eff6ff; color: #3b82f6; }
.icon-orange { background: #fff7ed; color: #f97316; }
.icon-red { background: #fef2f2; color: #ef4444; }

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.kpi-footer {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-green { color: #10b981; }

/* Middle Grid */
.middle-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 24px;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.card-header .subtitle {
  color: #9ca3af;
  font-size: 13px;
}

.link-action {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

/* Chart */
.chart-wrapper {
  position: relative;
  width: 100%;
}

/* Alerts List */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 8px;
}

.alerts-list::-webkit-scrollbar { width: 6px; }
.alerts-list::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.alerts-list::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
.alerts-list::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

.alert-item {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.alert-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.alert-title {
  color: #111827;
  font-size: 14px;
  word-break: break-word;
}
.alert-title strong { font-weight: 600; }
.alert-desc { color: #6b7280; font-size: 13px; word-break: break-word; }
.alert-time { color: #9ca3af; font-size: 12px; margin-top: 4px; }

/* Table */
.table-card { margin-top: 8px; overflow: hidden; }
.table-scroll { overflow-x: auto; display: block; }
.orders-table { width: 100%; min-width: 800px; border-collapse: collapse; text-align: left; }

.orders-table th {
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 12px;
  white-space: nowrap;
}

.orders-table td {
  color: #374151;
  font-size: 14px;
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 12px;
  white-space: nowrap;
}

.ot-link { color: #3b82f6; font-weight: 600; cursor: pointer; }
.plate-text { color: #9ca3af; font-size: 12px; margin-left: 4px; }

/* Badges */
.custom-badge {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.badge-completed { background: #dcfce7; color: #166534; }
.badge-progress { background: #dbeafe; color: #1e40af; }
.badge-pending { background: #ffedd5; color: #c2410c; }
.badge-default { background: #f3f4f6; color: #374151; }

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: #6b7280;
  font-size: 16px;
}

@media (max-width: 1200px) { .middle-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .dashboard-container { padding: 1.5rem 1rem; }
  .header-text h1 { font-size: 1.75rem; }
  .dashboard-header { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>

