import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes.js'
import { useAuthStore } from 'stores/auth.js'

export default defineRouter(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Route guard: only registered + logged-in users can open the POS screens
  Router.beforeEach((to) => {
    const auth = useAuthStore(store)

    if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isLoggedIn) {
      return { name: 'login' }
    }
    if (to.matched.some((r) => r.meta.guestOnly) && auth.isLoggedIn) {
      return { name: 'restaurant' }
    }
    return true
  })

  Router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} | The EmberGrill` : 'The EmberGrill POS'
  })

  return Router
})
