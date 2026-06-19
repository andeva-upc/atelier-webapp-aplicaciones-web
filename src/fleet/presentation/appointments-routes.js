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
  },
  {
    path: '/appointments/new',
    name: 'appointments-new',
    component: () => import('./views/appointments-list.vue'),
    meta: { title: 'New Appointment' }
  },
  {
    path: '/appointments/:id/edit',
    name: 'appointments-edit',
    component: () => import('./views/appointments-list.vue'),
    meta: { title: 'Edit Appointment' }
  }
];