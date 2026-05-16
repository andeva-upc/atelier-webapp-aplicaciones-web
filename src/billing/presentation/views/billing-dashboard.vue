<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import QuoteForm from './quote-form.vue';
import PaymentForm from './payment-form.vue';
import { useBillingStore } from '../../application/billing.store.js';

const { t } = useI18n();
const billingStore = useBillingStore();

const activeTab = ref('income_expenses');
const showQuoteForm = ref(false);
const showPaymentForm = ref(false);
const selectedQuote = ref(null);

onMounted(async () => {
  await billingStore.fetchBillingData();
});

const openNewQuoteForm = () => {
  showQuoteForm.value = true;
};

const openPaymentForm = (quote) => {
  selectedQuote.value = quote;
  showPaymentForm.value = true;
};

const handleSaveQuote = async (quoteData) => {
  await billingStore.saveQuote(quoteData);
};

const handlePaymentSuccess = async (paymentData) => {
  await billingStore.registerPayment(paymentData);
};

const tabOptions = ref([
  { label: t('billing.tabs.income_expenses'), value: 'income_expenses' },
  { label: t('billing.tabs.quotes'), value: 'quotes' },
  { label: t('billing.tabs.vouchers'), value: 'vouchers' }
]);

const billingStats = computed(() => [
  {
    label: 'billing.cards.total_income',
    value: `S/ ${billingStore.totalIncome.toLocaleString()}`,
    icon: 'pi pi-chart-line',
    colorClass: 'income-stat',
    iconBgClass: 'income-icon-bg'
  },
  {
    label: 'billing.cards.total_expenses',
    value: 'S/ 17,500',
    icon: 'pi pi-dollar',
    colorClass: 'expense-stat',
    iconBgClass: 'expense-icon-bg'
  },
  {
    label: 'billing.cards.approved_quotes',
    value: billingStore.quotes.filter(q => q.status === 'approved').length.toString(),
    icon: 'pi pi-check-circle',
    colorClass: 'approved-stat',
    iconBgClass: 'approved-icon-bg'
  },
  {
    label: 'billing.cards.pending_quotes',
    value: billingStore.pendingQuotesCount.toString(),
    icon: 'pi pi-clock',
    colorClass: 'pending-stat',
    iconBgClass: 'pending-icon-bg'
  }
]);

const chartData = ref(null);
const chartOptions = ref(null);

const setChartData = () => {
  const mayIncome = billingStore.vouchers
    .filter(v => v.created_at?.includes('2026-05'))
    .reduce((acc, v) => acc + v.total_amount, 0);

  return {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
    datasets: [
      {
        label: t('billing.chart.legend.income'),
        data: [5400, 3250, 7020, 6200, mayIncome || 5500],
        backgroundColor: '#0071EB',
        borderColor: '#0071EB',
        borderWidth: 0,
        borderRadius: 4,
        barPercentage: 0.5,
        categoryPercentage: 0.5
      },
      {
        label: t('billing.chart.legend.expenses'),
        data: [2200, 3100, 2800, 4400, (mayIncome || 5500) * 0.3],
        backgroundColor: '#B3D4F8',
        borderColor: '#B3D4F8',
        borderWidth: 0,
        borderRadius: 4,
        barPercentage: 0.5,
        categoryPercentage: 0.5
      }
    ]
  };
};

const setChartOptions = () => {
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          usePointStyle: true,
          pointStyle: 'rectRounded',
          padding: 20,
          font: { family: 'Arimo', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#111827',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderRadius: 8
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          font: { family: 'Arimo', size: 12, weight: 500 }
        },
        grid: { display: false, drawBorder: false }
      },
      y: {
        ticks: {
          color: '#9ca3af',
          font: { family: 'Arimo', size: 11 },
          callback: (value) => 'S/' + (value / 1000) + 'k'
        },
        grid: { color: '#f3f4f6', drawBorder: false }
      }
    }
  };
};

watch(() => billingStore.vouchers, () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
}, { immediate: true });

const monthlyDetail = computed(() => {
  if (billingStore.vouchers.length === 0) return [];
  
  const mayIncome = billingStore.vouchers
    .filter(v => v.created_at?.includes('2026-05'))
    .reduce((acc, v) => acc + v.total_amount, 0);

  return [
    { month: 'Ene 2026', income: 8400, expenses: 3200, profit: 5200, variation: null },
    { month: 'Feb 2026', income: 9200, expenses: 3500, profit: 5700, variation: 9.6 },
    { month: 'Mar 2026', income: 7800, expenses: 2900, profit: 4900, variation: -14.0 },
    { month: 'Abr 2026', income: 11200, expenses: 4100, profit: 7100, variation: 44.9 },
    { month: 'May 2026', income: mayIncome || 4500, expenses: (mayIncome || 4500) * 0.35, profit: (mayIncome || 4500) * 0.65, variation: 12.5 }
  ];
});

const quotes = computed(() => {
  return [...billingStore.quotes].sort((a, b) => {
    const dateA = new Date(a.created_at || a.date || 0);
    const dateB = new Date(b.created_at || b.date || 0);
    return dateB - dateA;
  });
});
const recentQuotes = computed(() => quotes.value.slice(0, 5));

const goToQuotesTab = () => {
  activeTab.value = 'quotes';
};

const getVariationClass = (val) => {
  if (!val) return 'text-500';
  return val > 0 ? 'variation-up' : 'variation-down';
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'approved': return 'success';
    case 'pending': return 'warning';
    case 'sent': return 'info';
    case 'draft': return 'secondary';
    case 'paid': return 'success';
    default: return null;
  }
};
</script>

<template>
  <div class="billing-container">
    <!-- Header Section -->
    <header class="flex justify-content-between align-items-start mb-6">
      <div class="title-container">
        <h1 class="m-0 view-title">{{ t('billing.title') }}</h1>
        <p class="view-subtitle mt-1">{{ t('billing.subtitle') }}</p>
      </div>
      <pv-button 
        :label="t('billing.new_quote')" 
        icon="pi pi-plus" 
        class="new-quote-btn flex align-items-center gap-2" 
        @click="openNewQuoteForm"
      />
    </header>

    <QuoteForm v-model:visible="showQuoteForm" @save="handleSaveQuote" />

    <!-- KPI Cards Grid -->
    <div class="grid mb-6">
      <div v-for="stat in billingStats" :key="stat.label" class="col-12 md:col-6 lg:col-3">
        <pv-card class="stat-card">
          <template #content>
            <div class="flex justify-content-between align-items-start mb-4">
              <span class="stat-label text-500 font-medium">{{ t(stat.label) }}</span>
              <div :class="['icon-container flex align-items-center justify-content-center', stat.iconBgClass]">
                <i :class="[stat.icon, stat.colorClass, 'text-xl']"></i>
              </div>
            </div>
            <div :class="['stat-value font-bold', stat.colorClass]">
              {{ stat.value }}
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <!-- Selection Tabs -->
    <div class="flex mb-4">
      <pv-select-button 
        v-model="activeTab" 
        :options="tabOptions" 
        optionLabel="label" 
        optionValue="value" 
        class="custom-select-button"
      />
    </div>

    <!-- Income & Expenses Content -->
    <div v-if="activeTab === 'income_expenses'" class="fadein animation-duration-300">
      <!-- Chart Section -->
      <pv-card class="chart-container-card">
        <template #content>
          <div class="flex justify-content-between align-items-center mb-6">
            <h2 class="chart-title m-0">{{ t('billing.chart.title') }}</h2>
            <pv-button 
              :label="t('billing.chart.export')" 
              icon="pi pi-download" 
              text 
              class="export-btn" 
            />
          </div>
          
          <div class="chart-wrapper">
            <pv-chart type="bar" :data="chartData" :options="chartOptions" class="h-full" />
          </div>
        </template>
      </pv-card>

      <!-- Monthly Detail Table -->
      <pv-card class="mt-6 table-container-card">
        <template #content>
          <div class="flex justify-content-between align-items-center mb-5">
            <h2 class="table-title m-0">{{ t('billing.table.title') }}</h2>
            <div class="table-actions">
              <span class="text-400 text-sm font-medium mr-3">2026</span>
            </div>
          </div>
          
          <pv-data-table :value="monthlyDetail" class="custom-table" responsiveLayout="stack">
            <pv-column field="month" :header="t('billing.table.columns.month')">
              <template #body="slotProps">
                <div class="flex align-items-center">
                  <i class="pi pi-calendar text-400 mr-2 text-sm"></i>
                  <span class="month-text">{{ slotProps.data.month }}</span>
                </div>
              </template>
            </pv-column>
            
            <pv-column field="income" :header="t('billing.table.columns.income')">
              <template #body="slotProps">
                <span class="income-text">S/ {{ slotProps.data.income.toLocaleString() }}</span>
              </template>
            </pv-column>
            
            <pv-column field="expenses" :header="t('billing.table.columns.expenses')">
              <template #body="slotProps">
                <span class="expense-text">S/ {{ slotProps.data.expenses.toLocaleString() }}</span>
              </template>
            </pv-column>
            
            <pv-column field="profit" :header="t('billing.table.columns.profit')">
              <template #body="slotProps">
                <span class="profit-text">S/ {{ slotProps.data.profit.toLocaleString() }}</span>
              </template>
            </pv-column>
            
            <pv-column field="variation" :header="t('billing.table.columns.variation')">
              <template #body="slotProps">
                <div v-if="slotProps.data.variation" :class="['variation-container', getVariationClass(slotProps.data.variation)]">
                  <i :class="['pi text-xs mr-1', slotProps.data.variation > 0 ? 'pi-arrow-up' : 'pi-arrow-down']"></i>
                  <span>{{ (slotProps.data.variation > 0 ? '+' : '') + slotProps.data.variation }}%</span>
                </div>
                <span v-else class="text-400">---</span>
              </template>
            </pv-column>
          </pv-data-table>
        </template>
      </pv-card>

      <!-- Recent Quotes Section (New) -->
      <pv-card class="mt-6 table-container-card">
        <template #content>
          <div class="flex justify-content-between align-items-center mb-5">
            <h2 class="table-title m-0">{{ t('billing.title_recent') }}</h2>
            <pv-button 
              :label="t('billing.view_all')" 
              text 
              class="view-all-btn" 
              @click="goToQuotesTab"
            />
          </div>
          
          <pv-data-table :value="recentQuotes" class="custom-table" responsiveLayout="scroll">
            <pv-column field="displayId" :header="'N°'">
              <template #body="slotProps">
                <span class="quote-id-text font-bold">{{ slotProps.data.displayId }}</span>
              </template>
            </pv-column>
            
            <pv-column field="client" :header="t('billing.quotes_table.columns.client')">
              <template #body="slotProps">
                <span class="text-600">{{ slotProps.data.client }}</span>
              </template>
            </pv-column>
            
            <pv-column field="total" :header="t('billing.quotes_table.columns.total')">
              <template #body="slotProps">
                <span class="text-700">S/ {{ slotProps.data.total.toLocaleString() }}</span>
              </template>
            </pv-column>
            
            <pv-column field="status" :header="t('billing.quotes_table.columns.status')">
              <template #body="slotProps">
                <pv-tag 
                  :value="t('billing.status.' + slotProps.data.status)" 
                  :severity="getStatusSeverity(slotProps.data.status)" 
                  rounded 
                  class="px-3 py-1 custom-status-tag"
                  :class="'status-' + slotProps.data.status"
                />
              </template>
            </pv-column>
          </pv-data-table>
        </template>
      </pv-card>
    </div>

    <!-- Quotes Content -->
    <div v-else-if="activeTab === 'quotes'" class="fadein animation-duration-300">
      <pv-card class="table-container-card">
        <template #content>
          <pv-data-table :value="quotes" class="custom-table" responsiveLayout="stack">
            <pv-column field="id" :header="t('billing.quotes_table.columns.id')">
              <template #body="slotProps">
                <span class="quote-id-text font-bold text-blue-600">{{ slotProps.data.displayId }}</span>
              </template>
            </pv-column>
            
            <pv-column field="client" :header="t('billing.quotes_table.columns.client')">
              <template #body="slotProps">
                <span class="text-700">{{ slotProps.data.client }}</span>
              </template>
            </pv-column>
            
            <pv-column field="vehicle" :header="t('billing.quotes_table.columns.vehicle')">
              <template #body="slotProps">
                <span class="text-600 text-sm">{{ slotProps.data.vehicle }}</span>
              </template>
            </pv-column>
            
            <pv-column field="items" :header="t('billing.quotes_table.columns.items')">
              <template #body="slotProps">
                <span class="text-600">{{ slotProps.data.items }} {{ t('billing.quotes_table.columns.items').toLowerCase() }}</span>
              </template>
            </pv-column>
            
            <pv-column field="total" :header="t('billing.quotes_table.columns.total')">
              <template #body="slotProps">
                <span class="font-bold text-800">S/ {{ slotProps.data.total }}</span>
              </template>
            </pv-column>
            
            <pv-column field="status" :header="t('billing.quotes_table.columns.status')">
              <template #body="slotProps">
                <pv-tag 
                  :value="t('billing.status.' + slotProps.data.status)" 
                  :severity="getStatusSeverity(slotProps.data.status)" 
                  rounded 
                  class="px-3 py-1 custom-status-tag"
                  :class="'status-' + slotProps.data.status"
                />
              </template>
            </pv-column>
            
            <pv-column field="date" :header="t('billing.quotes_table.columns.date')">
              <template #body="slotProps">
                <span class="text-600 text-sm">{{ slotProps.data.date }}</span>
              </template>
            </pv-column>
            
            <pv-column :header="t('billing.quotes_table.columns.actions')">
              <template #body="slotProps">
                <div class="flex gap-3 align-items-center">
                  <pv-button 
                    v-if="slotProps.data.status === 'pending' || slotProps.data.status === 'sent' || slotProps.data.status === 'draft'"
                    icon="pi pi-money-bill" 
                    label="Cobrar" 
                    class="p-0 checkout-btn flex align-items-center gap-1" 
                    text
                    @click="openPaymentForm(slotProps.data)"
                  />
                  <pv-button icon="pi pi-download" label="PDF" text class="p-0 pdf-btn flex flex-row-reverse align-items-center gap-1" />
                </div>
              </template>
            </pv-column>
          </pv-data-table>
        </template>
      </pv-card>
    </div>

    <!-- Vouchers Content (New) -->
    <div v-else-if="activeTab === 'vouchers'" class="fadein animation-duration-300">
      <pv-card class="table-container-card">
        <template #content>
          <div class="flex justify-content-between align-items-center mb-5 p-3">
            <h2 class="table-title m-0">{{ t('billing.tabs.vouchers') }}</h2>
          </div>
          <pv-data-table :value="billingStore.vouchers" class="custom-table" responsiveLayout="scroll">
            <pv-column field="displayId" :header="t('billing.vouchers_table.columns.id')">
              <template #body="slotProps">
                <span class="font-bold text-800">{{ slotProps.data.displayId }}</span>
              </template>
            </pv-column>
            
            <pv-column field="customerName" :header="t('billing.vouchers_table.columns.client')">
              <template #body="slotProps">
                <span class="text-700">{{ slotProps.data.customerName }}</span>
              </template>
            </pv-column>
            
            <pv-column field="displayDate" :header="t('billing.vouchers_table.columns.date')">
              <template #body="slotProps">
                <span class="text-600">{{ slotProps.data.displayDate }}</span>
              </template>
            </pv-column>
            
            <pv-column field="total_amount" :header="t('billing.vouchers_table.columns.total')">
              <template #body="slotProps">
                <span class="font-bold text-900">S/ {{ slotProps.data.total_amount.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
              </template>
            </pv-column>
            
            <pv-column field="status" :header="t('billing.vouchers_table.columns.status')">
              <template #body="slotProps">
                <pv-tag 
                  :value="t('billing.status.' + slotProps.data.status)" 
                  :severity="getStatusSeverity(slotProps.data.status)" 
                  rounded 
                  class="px-3 py-1"
                />
              </template>
            </pv-column>
            
            <pv-column :header="t('billing.vouchers_table.columns.actions')">
              <template #body>
                <pv-button icon="pi pi-download" label="PDF" text class="p-0 pdf-btn flex flex-row-reverse align-items-center gap-1" />
              </template>
            </pv-column>
          </pv-data-table>
        </template>
      </pv-card>
    </div>

    <PaymentForm 
      v-model:visible="showPaymentForm" 
      :totalToPay="selectedQuote?.total || 0" 
      :quoteId="selectedQuote?.id || ''"
      @success="handlePaymentSuccess"
    />
  </div>
</template>

<style>
/* Global overrides for SelectButton in Billing Dashboard */
.p-selectbutton.custom-select-button {
  background: #ffffff !important;
  border: 1px solid #f3f4f6 !important;
  border-radius: 9999px !important;
  padding: 6px !important;
  display: inline-flex !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03) !important;
}

.p-selectbutton.custom-select-button .p-togglebutton {
  background: transparent !important;
  border: none !important;
  color: #71717a !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  border-radius: 9999px !important;
  padding: 0.8rem 2.2rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  margin: 0 !important;
}

.p-selectbutton.custom-select-button .p-togglebutton::before {
  display: none !important;
}

.p-selectbutton.custom-select-button .p-togglebutton-checked {
  background: #0071EB !important;
  color: #ffffff !important;
  box-shadow: 0 5px 15px rgba(0, 113, 235, 0.35) !important;
}

/* Ensure no inner white backgrounds in the label area */
.p-selectbutton.custom-select-button .p-togglebutton * {
  background: transparent !important;
  color: inherit !important;
}

.p-selectbutton.custom-select-button .p-togglebutton:not(.p-togglebutton-checked):hover {
  background: #f9fafb !important;
  color: #18181b !important;
}

.p-selectbutton.custom-select-button .p-togglebutton-checked:hover {
  background: #005fcc !important;
}
</style>

<style scoped>
.billing-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

/* Header Typography */
.view-title {
  font-family: 'Mona Sans', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
}

.view-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  font-family: 'Arimo', sans-serif;
}

.new-quote-btn {
  background: #0071EB !important;
  border: none !important;
  border-radius: 14px !important;
  padding: 0.8rem 1.75rem !important;
  font-weight: 600 !important;
  font-family: 'Arimo', sans-serif !important;
  font-size: 0.95rem !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 113, 235, 0.2) !important;
  transition: all 0.2s ease !important;
}

.new-quote-btn:hover {
  background: #005fcc !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 18px rgba(0, 113, 235, 0.3) !important;
}

/* Card Styling */
.stat-card {
  border-radius: 18px;
  border: 1px solid #f3f4f6;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08);
  border-color: #e5e7eb;
}

.stat-label {
  font-family: 'Arimo', sans-serif;
  font-size: 0.9rem;
  color: #6b7280;
}

.stat-value {
  font-family: 'Mona Sans', sans-serif;
  font-size: 2rem;
  letter-spacing: -0.02em;
}

.icon-container {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

/* Tab Selection Styling */
:deep(.p-selectbutton.custom-select-button) {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 9999px !important;
  padding: 4px !important;
  display: inline-flex !important;
  box-shadow: none !important;
}

:deep(.p-selectbutton.custom-select-button .p-button) {
  background: transparent !important;
  border: none !important;
  color: #64748b !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  border-radius: 9999px !important;
  padding: 0.6rem 1.5rem !important;
  transition: all 0.2s ease !important;
  margin: 0 !important;
}

:deep(.p-selectbutton.custom-select-button .p-button::before) {
  display: none !important;
}

:deep(.p-selectbutton.custom-select-button .p-button.p-highlight) {
  background: #0071EB !important;
  color: #ffffff !important;
  box-shadow: 0 4px 10px rgba(0, 113, 235, 0.25) !important;
}

:deep(.p-selectbutton.custom-select-button .p-button:not(.p-highlight):hover) {
  background: #f8fafc !important;
  color: #1e293b !important;
}

:deep(.p-selectbutton.custom-select-button .p-button.p-highlight:hover) {
  background: #005fcc !important;
}

/* Chart Container Styling */
.chart-container-card {
  border-radius: 20px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.chart-title {
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.export-btn {
  font-family: 'Arimo', sans-serif;
  font-weight: 600;
  color: #6b7280 !important;
  font-size: 0.9rem;
  background: #f9fafb !important;
  padding: 0.5rem 1rem;
  border-radius: 10px;
}

.chart-wrapper {
  height: 350px;
  width: 100%;
}

/* Table Styling Improvement */
.table-container-card {
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  background: #ffffff;
  box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-title {
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.4rem;
  letter-spacing: -0.01em;
}

:deep(.custom-table) {
  font-family: 'Arimo', sans-serif;
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.custom-table .p-datatable-thead > tr > th) {
  background: #fcfdfe;
  color: #64748b;
  font-weight: 600;
  padding: 1.25rem 1.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #f8fafc;
}

:deep(.custom-table .p-datatable-tbody > tr) {
  transition: background 0.2s ease;
}

:deep(.custom-table .p-datatable-tbody > tr:hover) {
  background: #f8fafc !important;
}

:deep(.custom-table .p-datatable-tbody > tr > td) {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.month-text {
  font-family: 'Mona Sans', sans-serif;
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.income-text {
  color: #10b981;
  font-weight: 600;
}

.expense-text {
  color: #f43f5e;
  font-weight: 500;
}

.profit-text {
  color: #0f172a;
  font-weight: 800;
}

.variation-container {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.variation-up {
  background: #ecfdf5;
  color: #059669;
}

.variation-down {
  background: #fff1f2;
  color: #e11d48;
}

/* Quotes Table Specifics */
.quote-id-text {
  color: #0071EB;
  font-weight: 700;
  font-family: 'Mona Sans', sans-serif;
}

.pdf-btn {
  color: #0071EB !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  transition: all 0.2s ease;
}

.checkout-btn {
  color: #10b981 !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
}

.custom-status-tag {
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  border: none !important;
}

.status-draft {
  background: #FFF4E5 !important;
  color: #FF9800 !important;
  box-shadow: 0 2px 4px rgba(255, 152, 0, 0.1) !important;
}

.pdf-btn:hover, .checkout-btn:hover {
  text-decoration: underline !important;
  opacity: 0.8;
}

.view-all-btn {
  font-family: 'Arimo', sans-serif !important;
  font-weight: 700 !important;
  color: #0071EB !important;
  font-size: 0.9rem !important;
  padding: 0.5rem 1rem !important;
}

.view-all-btn:hover {
  text-decoration: underline !important;
}

:deep(.p-tag.p-tag-success) {
  background: #ecfdf5 !important;
  color: #10b981 !important;
}

:deep(.p-tag.p-tag-warning) {
  background: #fffbeb !important;
  color: #f59e0b !important;
}

:deep(.p-tag.p-tag-info) {
  background: #eff6ff !important;
  color: #3b82f6 !important;
}

/* Color Palettes */
.income-stat { color: #10b981 !important; }
.income-icon-bg { background-color: #ecfdf5; }

.expense-stat { color: #ef4444 !important; }
.expense-icon-bg { background-color: #fef2f2; }

.approved-stat { color: #3b82f6 !important; }
.approved-icon-bg { background-color: #eff6ff; }

.pending-stat { color: #f59e0b !important; }
.pending-icon-bg { background-color: #fffbeb; }

/* PrimeVue Overrides */
:deep(.p-card-body) {
  padding: 2rem !important;
}

:deep(.p-card-content) {
  padding: 0 !important;
}
</style>
