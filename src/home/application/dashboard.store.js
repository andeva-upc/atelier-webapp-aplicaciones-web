import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DashboardApi } from '../infrastructure/dashboard-api.js';

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const api = new DashboardApi();

  const loadDashboardData = async () => {
    loading.value = true;
    error.value = null;
    try {
      data.value = await api.getDashboardData();
    } catch (err) {
      error.value = err.message || 'Error fetching dashboard data';
    } finally {
      loading.value = false;
    }
  };

  const kpis = computed(() => data.value?.kpis || null);
  const chartData = computed(() => data.value?.chartData || []);
  const alerts = computed(() => data.value?.alerts || []);
  const recentOrders = computed(() => data.value?.recentOrders || []);

  return {
    data,
    loading,
    error,
    loadDashboardData,
    kpis,
    chartData,
    alerts,
    recentOrders
  };
});

