import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Dark } from 'quasar'
import { KEYS, readLS, writeLS } from 'src/utils/storage.js'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref(readLS(KEYS.theme, 'light')) // 'light' | 'dark'

  function apply() {
    Dark.set(mode.value === 'dark')
  }

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    writeLS(KEYS.theme, mode.value)
    apply()
  }

  return { mode, apply, toggle }
})
