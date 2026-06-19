const fleetRoutes = [
  {
    path: '/appointments',
    redirect: '/fleet/appointments'
  },
  {
    path: '/appointments/new',
    redirect: '/fleet/appointments/new'
  },
  {
    path: '/appointments/:id/edit',
    redirect: to => `/fleet/appointments/${to.params.id}/edit`
  },
  {
    path: '/vehicles',
    redirect: '/fleet/vehicles'
  },
  {
    path: '/workbays',
    redirect: '/fleet/workbays'
  },

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
  },
  {
    path: '/fleet/workbays',
    name: 'workbays',
    component: () => import('./views/workbays-list.vue')
  }
];

export { fleetRoutes };