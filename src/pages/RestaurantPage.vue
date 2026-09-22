<template>
  <q-page padding class="eg-page-bg dashboard-bg">
    <div class="page-wrap">
      <PageHeader
        title="My Restaurant"
        :subtitle="`Hello ${auth.currentUser?.name?.split(' ')[0] || ''}, here is your restaurant at a glance`"
        icon="storefront"
      />

      <!-- quick stats -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-6 col-md-3">
          <StatCard
            label="Menu items"
            :value="menu.items.length"
            icon="restaurant_menu"
            color="primary"
          />
        </div>
        <div class="col-6 col-md-3">
          <StatCard
            label="Upcoming"
            :value="orders.upcoming.length"
            icon="pending_actions"
            color="secondary"
          />
        </div>
        <div class="col-6 col-md-3">
          <StatCard
            label="Completed"
            :value="orders.previous.length"
            icon="task_alt"
            color="positive"
          />
        </div>
        <div class="col-6 col-md-3">
          <StatCard label="Revenue" :value="money(orders.revenue)" icon="payments" color="info" />
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Restaurant info: Add / Edit / Delete -->
        <div class="col-12 col-lg-8">
          <RestaurantForm
            v-if="editing || !restaurant.hasProfile"
            :key="formKey"
            :initial="editing ? restaurant.profile : null"
            @save="saveInfo"
            @cancel="editing = false"
          />
          <RestaurantProfile
            v-else
            :profile="restaurant.profile"
            @edit="editing = true"
            @delete="confirmDelete"
          />
        </div>

        <!-- Navigation buttons -->
        <div class="col-12 col-lg-4">
          <q-card flat class="eg-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold">Go to</div>
              <div class="eg-muted text-caption">Jump straight to a POS screen</div>
            </q-card-section>
            <q-card-section class="q-pt-none column q-gutter-sm">
              <q-btn
                v-for="nav in navButtons"
                :key="nav.name"
                unelevated
                no-caps
                align="left"
                class="nav-btn eg-btn"
                :class="nav.cls"
                :to="{ name: nav.name }"
              >
                <q-icon :name="nav.icon" size="28px" class="q-mr-md" />
                <div class="text-left">
                  <div class="text-subtitle1 text-weight-bold">{{ nav.label }}</div>
                  <div class="text-caption nav-sub">{{ nav.caption }}</div>
                </div>
                <q-space />
                <q-icon name="chevron_right" />
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.js'
import { useRestaurantStore } from 'stores/restaurant.js'
import { useMenuStore } from 'stores/menu.js'
import { useOrdersStore } from 'stores/orders.js'
import { money } from 'src/utils/format.js'
import PageHeader from 'components/common/PageHeader.vue'
import StatCard from 'components/common/StatCard.vue'
import RestaurantForm from 'components/restaurant/RestaurantForm.vue'
import RestaurantProfile from 'components/restaurant/RestaurantProfile.vue'

const $q = useQuasar()
const auth = useAuthStore()
const restaurant = useRestaurantStore()
const menu = useMenuStore()
const orders = useOrdersStore()

const editing = ref(false)
const formKey = ref(0)

const navButtons = computed(() => [
  {
    name: 'items',
    label: 'All Items',
    caption: `${menu.items.length} items on the menu`,
    icon: 'restaurant_menu',
    cls: 'bg-primary text-white',
  },
  {
    name: 'orders',
    label: 'Orders',
    caption: 'Take a new table order',
    icon: 'point_of_sale',
    cls: 'eg-ember-gradient',
  },
  {
    name: 'invoices',
    label: 'Invoices',
    caption: `${orders.upcoming.length} upcoming · ${orders.previous.length} previous`,
    icon: 'receipt_long',
    cls: 'bg-dark text-white',
  },
])

function saveInfo(data) {
  const isNew = !restaurant.hasProfile
  restaurant.save(data)
  editing.value = false
  $q.notify({ type: 'positive', message: isNew ? 'Restaurant added' : 'Restaurant info updated' })
}

function confirmDelete() {
  $q.dialog({
    title: 'Delete restaurant info?',
    message: 'Name, logo, address, phone and branches will be removed. Items and orders are kept.',
    cancel: { flat: true, label: 'Cancel' },
    ok: { color: 'negative', unelevated: true, label: 'Delete' },
    persistent: true,
  }).onOk(() => {
    restaurant.remove()
    formKey.value++
    $q.notify({ type: 'info', message: 'Restaurant info deleted' })
  })
}
</script>

<style scoped>
/* Restaurant interior background */
.dashboard-bg {
  --eg-bg: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=75');
}

.nav-btn {
  padding: 14px 16px;
}
.nav-sub {
  opacity: 0.8;
}
</style>
