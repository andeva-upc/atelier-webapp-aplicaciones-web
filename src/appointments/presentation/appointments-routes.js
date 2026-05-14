/**
 * Appointments Module Routes.
 * Defines the presentation layer routes for the Appointments Bounded Context.
 */
export const appointmentsRoutes = [
  {
    path: '/appointments',
    name: 'appointments',
    component: () => import('./views/appointments-list.vue'),
    meta: { title: 'Appointments' }
  }
];
