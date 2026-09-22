import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { KEYS, readLS, writeLS, removeLS, makeId } from 'src/utils/storage.js'

// Hash passwords before saving them to Local Storage (falls back to plain text
// only when the browser has no Web Crypto, e.g. an insecure http:// LAN address)
async function hashPassword(password) {
  if (!globalThis.crypto?.subtle) return `plain:${password}`
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const useAuthStore = defineStore('auth', () => {
  const users = ref(readLS(KEYS.users, []))
  const sessionUserId = ref(readLS(KEYS.session, null))

  const currentUser = computed(() => {
    const user = users.value.find((u) => u.id === sessionUserId.value)
    if (!user) return null
    // never expose the password hash to the UI
    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...safe } = user
    return safe
  })

  const isLoggedIn = computed(() => currentUser.value !== null)

  function persistUsers() {
    writeLS(KEYS.users, users.value)
  }

  async function register({ name, email, phone, password }) {
    const cleanEmail = email.trim().toLowerCase()
    if (users.value.some((u) => u.email === cleanEmail)) {
      throw new Error('This email is already registered')
    }
    const user = {
      id: makeId('usr'),
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    }
    users.value.push(user)
    persistUsers()
    return user.email
  }

  async function login(email, password) {
    const cleanEmail = email.trim().toLowerCase()
    const user = users.value.find((u) => u.email === cleanEmail)
    if (!user) throw new Error('No account found with this email. Please register first.')
    if (user.passwordHash !== (await hashPassword(password))) {
      throw new Error('Incorrect password')
    }
    sessionUserId.value = user.id
    writeLS(KEYS.session, user.id)
    return currentUser.value
  }

  function logout() {
    sessionUserId.value = null
    removeLS(KEYS.session)
  }

  return { users, currentUser, isLoggedIn, register, login, logout }
})
