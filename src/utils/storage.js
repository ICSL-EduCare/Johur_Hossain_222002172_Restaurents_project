import { LocalStorage } from 'quasar'

// All keys used by the app live under one prefix so they are easy to find in DevTools
const PREFIX = 'emberGrill'

export const KEYS = {
  users: `${PREFIX}:users`,
  session: `${PREFIX}:session`,
  theme: `${PREFIX}:theme`,
  // per-user data (restaurant, menu, orders) is namespaced with the user id
  scoped: (userId, name) => `${PREFIX}:${userId}:${name}`,
}

export function readLS(key, fallback) {
  const value = LocalStorage.getItem(key)
  return value === null || value === undefined ? fallback : value
}

export function writeLS(key, value) {
  LocalStorage.set(key, value)
}

export function removeLS(key) {
  LocalStorage.remove(key)
}

export function makeId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}
