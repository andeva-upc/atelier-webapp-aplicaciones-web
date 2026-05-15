export const dashboardRoutes = [
  {
    path: '/home',
    name: 'Dashboard',
    component: () => import('./views/dashboard-home.vue'),
    meta: {
      title: 'Dashboard'
    }
  }
];


