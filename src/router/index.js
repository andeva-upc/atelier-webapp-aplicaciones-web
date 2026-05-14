import { createRouter, createWebHistory } from 'vue-router';
import { customersRoutes } from '../customers/presentation/customers-routes.js';
import { appointmentsRoutes } from '../appointments/presentation/appointments-routes.js';

/**
 * Main Application Router.
 * Centralizes all bounded context routes.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/customers'
    },
    ...customersRoutes,
    ...appointmentsRoutes
  ]
});

export default router;
