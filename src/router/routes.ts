import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/products',
  },
  {
    path: '/products',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'create',
        name: 'products-create',
        component: () => import('pages/ProductCreate.vue'),
      },
      {
        path: ':id/edit',
        name: 'products-edit',
        component: () => import('pages/ProductEdit.vue'),
      },
      {
        path: ':id',
        name: 'products-detail',
        component: () => import('pages/ProductDetail.vue'),
      },
      {
        path: '',
        name: 'products-list',
        component: () => import('pages/ProductList.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
