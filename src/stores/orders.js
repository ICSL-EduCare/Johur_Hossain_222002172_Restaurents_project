import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { KEYS, readLS, writeLS, makeId } from 'src/utils/storage.js'
import { VAT_RATE } from 'src/utils/format.js'
import { useAuthStore } from './auth.js'

const round2 = (n) => Math.round(n * 100) / 100
const byNewest = (field) => (a, b) => new Date(b[field]) - new Date(a[field])

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])
  const ownerId = ref(null)

  const key = () => KEYS.scoped(ownerId.value, 'orders')
  const persist = () => writeLS(key(), orders.value)

  // Upcoming = still being served, latest first
  const upcoming = computed(() =>
    orders.value.filter((o) => o.status === 'upcoming').sort(byNewest('createdAt')),
  )

  // Previous = already served / closed (older orders)
  const previous = computed(() =>
    orders.value.filter((o) => o.status === 'completed').sort(byNewest('completedAt')),
  )

  const revenue = computed(() => previous.value.reduce((sum, o) => sum + o.total, 0))

  function hydrate() {
    ownerId.value = useAuthStore().currentUser?.id || null
    orders.value = ownerId.value ? readLS(key(), []) : []
  }

  function nextInvoiceNo() {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const count = orders.value.filter((o) => o.invoiceNo.includes(today)).length + 1
    return `EG-${today}-${String(count).padStart(3, '0')}`
  }

  function placeOrder({ customer, table, seat, branch, cart }) {
    const lines = cart.map((c) => ({
      itemId: c.id,
      name: c.name,
      price: Number(c.price),
      qty: c.qty,
    }))
    const subtotal = round2(lines.reduce((sum, l) => sum + l.price * l.qty, 0))
    const vat = round2(subtotal * VAT_RATE)

    const order = {
      id: makeId('ord'),
      invoiceNo: nextInvoiceNo(),
      customer: { name: customer.name.trim(), phone: customer.phone.trim() },
      table: String(table),
      seat: String(seat),
      branch: branch || '',
      lines,
      subtotal,
      vat,
      total: round2(subtotal + vat),
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    orders.value.push(order)
    persist()
    return order
  }

  function completeOrder(id) {
    const order = orders.value.find((o) => o.id === id)
    if (!order) return
    order.status = 'completed'
    order.completedAt = new Date().toISOString()
    persist()
  }

  function deleteOrder(id) {
    orders.value = orders.value.filter((o) => o.id !== id)
    persist()
  }

  const findById = (id) => orders.value.find((o) => o.id === id)

  return {
    orders,
    upcoming,
    previous,
    revenue,
    hydrate,
    placeOrder,
    completeOrder,
    deleteOrder,
    findById,
  }
})
