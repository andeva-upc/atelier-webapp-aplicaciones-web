import InventoryList from './views/inventory-list.vue';

/**
 * Inventory Context Routes.
 */
export const inventoryRoutes = [
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryList,
    meta: { title: 'Inventory' }
  }
];
