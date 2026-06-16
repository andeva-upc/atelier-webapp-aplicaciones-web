import InventoryList from './views/inventory-list.vue';

/**
 * Inventory Context Routes.
 */
export const inventoryRoutes = [
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryList,
    meta: { title: 'inventory.title' }
  },
  {
    path: '/inventory/products/new',
    name: 'product-form-new',
    component: () => import('./views/product-form-view.vue'),
    meta: { title: 'inventory.productForm.newTitle' }
  },
  {
    path: '/inventory/products/:id',
    name: 'product-detail',
    component: () => import('./views/product-detail-view.vue'),
    meta: { title: 'inventory.productDetail.title' },
    props: true
  },
  {
    path: '/inventory/products/:id/batches',
    name: 'batch-list',
    component: () => import('./views/batch-list-view.vue'),
    meta: { title: 'inventory.batchList.title' },
    props: true
  },
  {
    path: '/inventory/products/:id/batches/new',
    name: 'batch-form-new',
    component: () => import('./views/batch-form-view.vue'),
    meta: { title: 'inventory.batchForm.newTitle' },
    props: true
  }
];
