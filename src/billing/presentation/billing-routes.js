/**
 * Billing Module Routes.
 * Defines the presentation layer routes for the Billing Bounded Context.
 * 
 * @public
 */
export const billingRoutes = [
  {
    path: '/billing',
    name: 'billing',
    component: () => import('./views/billing-dashboard.vue'),
    meta: { title: 'Billing' }
  }
];
