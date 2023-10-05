import { useAuthStore } from '@/stores/auth'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: () => import('../views/BookmarksView.vue')
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      children: [
        {
          path: 'edit',
          name: 'profile-edit',
          component: () => import('../views/ProfileEditView.vue')
        }
      ]
    }
  ]
})

// authentication guards
const nonAuthenticatedRoutes = ['login', 'register']
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  logEvent(getAnalytics(), 'screen_view')

  if (authStore.authenticatedUser && nonAuthenticatedRoutes.includes(to.name as string)) {
    next({ name: 'home' })
    return
  }

  if (!authStore.authenticatedUser && !nonAuthenticatedRoutes.includes(to.name as string)) {
    next({ name: 'login' })
    return
  }

  next()
})

export default router
