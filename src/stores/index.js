import { defineStore } from '#q-app/wrappers'
import { createPinia } from 'pinia'

// Pinia instance for the whole app (Quasar calls this before creating the router)
export default defineStore(() => {
  return createPinia()
})
