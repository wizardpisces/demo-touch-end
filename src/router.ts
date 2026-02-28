import { createRouter, createWebHistory } from 'vue-router'
import InspectionPage from './pages/InspectionPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: InspectionPage },
  ],
})

export default router
