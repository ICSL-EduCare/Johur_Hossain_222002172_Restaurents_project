const routes = [
  {
    path: '/',
    component: () => import('layouts/GuestLayout.vue'),
    meta: { guestOnly: true },
    children: [{ path: '', name: 'login', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/app',
    component: () => import('layouts/AppShell.vue'),
    meta: { requiresAuth: true },
    redirect: { name: 'restaurant' },
    children: [
      {
        path: 'restaurant',
        name: 'restaurant',
        component: () => import('pages/RestaurantPage.vue'),
        meta: { title: 'My Restaurant' },
      },
      {
        path: 'items',
        name: 'items',
        component: () => import('pages/MenuItemsPage.vue'),
        meta: { title: 'All Items' },
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('pages/NewOrderPage.vue'),
        meta: { title: 'New Order' },
      },
      {
        path: 'invoices',
        name: 'invoices',
        component: () => import('pages/InvoicesPage.vue'),
        meta: { title: 'Invoices' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/NotFound.vue'),
  },
]

export default routes
