/**
 * Telemetry Routes.
 * Isolated routes for the Telemetry Bounded Context.
 */
export const telemetryRoutes = [
  {
    path: '/telemetry',
    name: 'telemetry',
    component: () => import('./views/telemetry-dashboard.vue'),
    meta: { title: 'Telemetry' }
  }
];
