import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { KEYS, readLS, writeLS, removeLS } from 'src/utils/storage.js'
import { useAuthStore } from './auth.js'

export const useRestaurantStore = defineStore('restaurant', () => {
  const profile = ref(null)
  const ownerId = ref(null)

  const hasProfile = computed(() => !!profile.value)
  const displayName = computed(() => profile.value?.name || 'The EmberGrill')

  const key = () => KEYS.scoped(ownerId.value, 'restaurant')

  // Load the logged-in user's restaurant from Local Storage
  function hydrate() {
    const auth = useAuthStore()
    ownerId.value = auth.currentUser?.id || null
    profile.value = ownerId.value ? readLS(key(), null) : null
  }

  function save(data) {
    const now = new Date().toISOString()
    profile.value = {
      name: data.name.trim(),
      logo: data.logo || '',
      address: data.address.trim(),
      phone: data.phone.trim(),
      branches: [...new Set(data.branches.map((b) => b.trim()).filter(Boolean))],
      createdAt: profile.value?.createdAt || now,
      updatedAt: now,
    }
    writeLS(key(), profile.value)
  }

  function remove() {
    profile.value = null
    removeLS(key())
  }

  return { profile, hasProfile, displayName, hydrate, save, remove }
})
