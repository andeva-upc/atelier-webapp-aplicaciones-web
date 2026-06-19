import { createRouter, createWebHistory } from 'vue-router';
import { customersRoutes } from '../customers/presentation/customers-routes.js';
import { dashboardRoutes } from '../home/presentation/dashboard-routes.js';
import { appointmentsRoutes } from '../fleet/presentation/appointments-routes.js';
import { inventoryRoutes } from '../inventory/presentation/inventory-routes.js';
import { telemetryRoutes } from '../telemetry/presentation/telemetry-routes.js';
import { billingRoutes } from '../billing/presentation/billing-routes.js';

/**
 * Main Application Router.
 * Centralizes all bounded context routes.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    ...dashboardRoutes,
    ...customersRoutes,
    ...appointmentsRoutes,
    ...inventoryRoutes,
    ...telemetryRoutes,
    ...billingRoutes
  ]
});

export default router;