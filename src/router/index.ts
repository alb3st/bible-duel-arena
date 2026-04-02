import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/lobby/:roomCode',
      name: 'lobby',
      component: () => import('../views/LobbyView.vue'),
    },
    {
      path: '/duel/:roomCode',
      name: 'duel',
      component: () => import('../views/DuelView.vue'),
    },
  ],
})

export default router
