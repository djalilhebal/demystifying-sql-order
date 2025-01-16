import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'expt-one', component: () => import('pages/ExptOnePage.vue') },
      { path: 'expt-two', component: () => import('pages/ExptTwoPage.vue') },
      { path: '', component: () => import('pages/ExptListPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
