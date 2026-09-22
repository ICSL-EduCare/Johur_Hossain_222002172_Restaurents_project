<template>
  <q-page padding class="eg-page-bg orders-bg">
    <div class="page-wrap">
      <PageHeader
        title="New Order"
        subtitle="Choose items, add table details and place the order"
        icon="point_of_sale"
      />

      <div class="row q-col-gutter-lg">
        <!-- Menu picker -->
        <div class="col-12 col-md-7">
          <q-card flat class="eg-card">
            <q-card-section class="q-pb-sm">
              <q-input v-model="search" dense outlined clearable placeholder="Search menu...">
                <template #prepend><q-icon name="search" /></template>
              </q-input>
              <div class="row q-gutter-xs q-mt-sm no-wrap scroll-x">
                <q-chip
                  v-for="c in ['All', ...menu.categories]"
                  :key="c"
                  clickable
                  :outline="activeCategory !== c"
                  :color="activeCategory === c ? 'primary' : undefined"
                  :text-color="activeCategory === c ? 'white' : undefined"
                  @click="activeCategory = c"
                >
                  {{ c }}
                </q-chip>
              </div>
            </q-card-section>

            <q-card-section class="picker">
              <div v-if="pickable.length" class="row q-col-gutter-sm">
                <div v-for="item in pickable" :key="item.id" class="col-6 col-sm-4 col-lg-3">
                  <ProductTile :item="item" :qty="qtyOf(item.id)" @pick="addToCart" />
                </div>
              </div>
              <EmptyState
                v-else-if="!menu.items.length"
                icon="no_food"
                title="No items yet"
                message="Add dishes on the All Items page first."
              >
                <q-btn
                  unelevated
                  color="primary"
                  class="eg-btn"
                  label="Go to All Items"
                  :to="{ name: 'items' }"
                />
              </EmptyState>
              <EmptyState
                v-else
                icon="search_off"
                title="Nothing found"
                message="Try a different search."
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Cart -->
        <div class="col-12 col-md-5">
          <CartPanel
            ref="cartRef"
            :cart="cart"
            :branches="restaurant.profile?.branches || []"
            :busy="busy"
            @change="changeQty"
            @remove="removeLine"
            @clear="clearCart"
            @submit="placeOrder"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMenuStore } from 'stores/menu.js'
import { useOrdersStore } from 'stores/orders.js'
import { useRestaurantStore } from 'stores/restaurant.js'
import PageHeader from 'components/common/PageHeader.vue'
import EmptyState from 'components/common/EmptyState.vue'
import ProductTile from 'components/order/ProductTile.vue'
import CartPanel from 'components/order/CartPanel.vue'

const $q = useQuasar()
const router = useRouter()
const menu = useMenuStore()
const orders = useOrdersStore()
const restaurant = useRestaurantStore()

const search = ref('')
const activeCategory = ref('All')
const cart = ref([])
const busy = ref(false)
const cartRef = ref(null)

const pickable = computed(() => {
  const term = (search.value || '').trim().toLowerCase()
  return menu.items.filter(
    (i) =>
      (activeCategory.value === 'All' || i.category === activeCategory.value) &&
      (!term || i.name.toLowerCase().includes(term)),
  )
})

const qtyOf = (id) => cart.value.find((l) => l.id === id)?.qty || 0

function addToCart(item) {
  const line = cart.value.find((l) => l.id === item.id)
  if (line) line.qty++
  else cart.value.push({ id: item.id, name: item.name, price: item.price, qty: 1 })
}

function changeQty(id, step) {
  const line = cart.value.find((l) => l.id === id)
  if (!line) return
  line.qty += step
  if (line.qty <= 0) removeLine(id)
}

function removeLine(id) {
  cart.value = cart.value.filter((l) => l.id !== id)
}

function clearCart() {
  cart.value = []
}

function placeOrder(details) {
  if (!cart.value.length) {
    $q.notify({ type: 'warning', message: 'Add at least one item' })
    return
  }
  busy.value = true
  const order = orders.placeOrder({
    customer: { name: details.name, phone: details.phone },
    table: details.table,
    seat: details.seat,
    branch: details.branch,
    cart: cart.value,
  })
  cart.value = []
  cartRef.value.reset()
  busy.value = false

  $q.notify({
    type: 'positive',
    icon: 'receipt_long',
    message: `Order placed · ${order.invoiceNo}`,
  })
  // requirement: after submit, go to the Invoice page
  router.push({ name: 'invoices', query: { open: order.id } })
}
</script>

<style scoped>
/* Dining table with menu - ordering background */
.orders-bg {
  --eg-bg: url('https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1920&q=75');
}

.picker {
  max-height: calc(100vh - 290px);
  min-height: 320px;
  overflow-y: auto;
}
.scroll-x {
  overflow-x: auto;
  padding-bottom: 4px;
}
@media (max-width: 1023px) {
  .picker {
    max-height: none;
  }
}
</style>
