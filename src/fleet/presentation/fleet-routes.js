const fleetRoutes = [
  {
    path: '/fleet/appointments',
    name: 'appointments',
    component: () => import('./views/appointments-list.vue')
  },
  {
    path: '/fleet/appointments/new',
    name: 'appointments-new',
    component: () => import('./views/appointments-list.vue')
  },
  {
    path: '/fleet/appointments/:id/edit',
    name: 'appointments-edit',
    component: () => import('./views/appointments-list.vue')
  },
  {
    path: '/fleet/vehicles',
    name: 'vehicles',
    component: () => import('./views/vehicles-list.vue')
  },
  {
    path: '/fleet/vehicles/new',
    name: 'vehicles-new',
    component: () => import('./views/vehicles-list.vue')
  },
  {
    path: '/fleet/vehicles/:id/edit',
    name: 'vehicles-edit',
    component: () => import('./views/vehicles-list.vue')
  }
];

export { fleetRoutes };