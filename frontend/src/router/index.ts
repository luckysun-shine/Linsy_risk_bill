import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/bill',
    },
    {
      path: '/bill/:year?',
      name: 'bill',
      component: () => import('../views/BillView.vue'),
    },
  ],
})

export default router
