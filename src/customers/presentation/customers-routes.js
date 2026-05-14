/**
 * Customers Module Routes.
 * Defines the presentation layer routes for the Customers Bounded Context.
 * 
 * @public
 */
export const customersRoutes = [
  {
    path: '/customers',
    name: 'customers',
    component: () => import('./views/customer-list.vue'),
    meta: { title: 'Customers' }
  }
];
