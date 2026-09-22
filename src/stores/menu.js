import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { KEYS, readLS, writeLS, makeId } from 'src/utils/storage.js'
import { useAuthStore } from './auth.js'

export const DEFAULT_CATEGORIES = [
  'Fast Food',
  'Main Course',
  'Rice & Biryani',
  'Drinks',
  'Desserts',
]

const SAMPLE_MENU = [
  { name: 'Chicken Tikka', category: 'Main Course', price: 320 },
  { name: 'Vegetable Pakora', category: 'Fast Food', price: 180 },
  { name: 'Chicken Burger', category: 'Fast Food', price: 280 },
  { name: 'French Fries', category: 'Fast Food', price: 150 },
  { name: 'Beef Kala Bhuna', category: 'Main Course', price: 450 },
  { name: 'Grilled Fish', category: 'Main Course', price: 520 },
  { name: 'Kacchi Biryani', category: 'Rice & Biryani', price: 390 },
  { name: 'Plain Polao', category: 'Rice & Biryani', price: 150 },
  { name: 'Mint Lemonade', category: 'Drinks', price: 120 },
  { name: 'Borhani', category: 'Drinks', price: 90 },
  { name: 'Firni', category: 'Desserts', price: 110 },
  { name: 'Rasmalai', category: 'Desserts', price: 160 },
]

export const useMenuStore = defineStore('menu', () => {
  const items = ref([])
  const ownerId = ref(null)

  const key = () => KEYS.scoped(ownerId.value, 'menu')
  const persist = () => writeLS(key(), items.value)

  const categories = computed(() => {
    const used = items.value.map((i) => i.category)
    return [...new Set([...DEFAULT_CATEGORIES, ...used])]
  })

  function hydrate() {
    ownerId.value = useAuthStore().currentUser?.id || null
    items.value = ownerId.value ? readLS(key(), []) : []
  }

  function addItem({ name, category, price }) {
    items.value.unshift({
      id: makeId('itm'),
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      createdAt: new Date().toISOString(),
    })
    persist()
  }

  function updateItem(id, changes) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return
    Object.assign(item, {
      name: changes.name.trim(),
      category: changes.category.trim(),
      price: Number(changes.price),
      updatedAt: new Date().toISOString(),
    })
    persist()
  }

  function deleteItem(id) {
    items.value = items.value.filter((i) => i.id !== id)
    persist()
  }

  function loadSampleMenu() {
    SAMPLE_MENU.forEach((i) => addItem(i))
  }

  return { items, categories, hydrate, addItem, updateItem, deleteItem, loadSampleMenu }
})
