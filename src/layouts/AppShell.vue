<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Top bar -->
    <q-header class="shell-header">
      <q-toolbar class="q-py-xs">
        <q-btn class="lt-md" flat round dense icon="menu" @click="drawer = !drawer" />

        <q-avatar size="38px" class="q-ml-xs brand-logo">
          <img v-if="restaurant.profile?.logo" :src="restaurant.profile.logo" alt="logo" />
          <q-icon v-else name="local_fire_department" color="accent" size="24px" />
        </q-avatar>

        <q-toolbar-title class="q-pl-sm">
          <div class="text-weight-bold ellipsis title-line">{{ restaurant.displayName }}</div>
          <div class="text-caption subtitle-line gt-xs">{{ route.meta.title }}</div>
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          :icon="theme.mode === 'dark' ? 'light_mode' : 'dark_mode'"
          @click="theme.toggle()"
        >
          <q-tooltip>Switch to {{ theme.mode === 'dark' ? 'light' : 'dark' }} mode</q-tooltip>
        </q-btn>

        <q-btn flat no-caps class="q-ml-sm user-btn" padding="4px 8px">
          <q-avatar size="30px" color="accent" text-color="dark" class="text-weight-bold">
            {{ initials }}
          </q-avatar>
          <span class="q-ml-sm gt-sm">{{ auth.currentUser?.name }}</span>
          <q-icon name="expand_more" size="18px" />
          <q-menu anchor="bottom right" self="top right" :offset="[0, 6]">
            <q-list style="min-width: 220px">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{
                    auth.currentUser?.name
                  }}</q-item-label>
                  <q-item-label caption>{{ auth.currentUser?.email }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="signOut">
                <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                <q-item-section>Log out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Side navigation (desktop) / slide-in drawer (mobile) -->
    <q-drawer v-model="drawer" show-if-above :width="240" :breakpoint="1024" class="shell-drawer">
      <q-list class="q-pa-sm q-pt-md">
        <q-item-label header class="text-uppercase text-caption nav-header"
          >Point of Sale</q-item-label
        >
        <q-item
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          clickable
          v-ripple
          class="nav-link"
          active-class="nav-link--active"
        >
          <q-item-section avatar><q-icon :name="link.icon" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ link.label }}</q-item-label>
            <q-item-label caption class="nav-caption">{{ link.hint }}</q-item-label>
          </q-item-section>
          <q-item-section v-if="link.name === 'invoices' && orders.upcoming.length" side>
            <q-badge color="secondary" rounded :label="orders.upcoming.length" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade-page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <!-- Bottom tabs on phones -->
    <q-footer class="lt-md shell-footer" bordered>
      <q-tabs
        dense
        no-caps
        active-color="secondary"
        indicator-color="transparent"
        class="text-grey-5"
      >
        <q-route-tab
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          :icon="link.icon"
          :label="link.short"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.js'
import { useRestaurantStore } from 'stores/restaurant.js'
import { useMenuStore } from 'stores/menu.js'
import { useOrdersStore } from 'stores/orders.js'
import { useThemeStore } from 'stores/theme.js'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const auth = useAuthStore()
const restaurant = useRestaurantStore()
const menu = useMenuStore()
const orders = useOrdersStore()
const theme = useThemeStore()

// load this user's data from Local Storage into the stores
restaurant.hydrate()
menu.hydrate()
orders.hydrate()

const drawer = ref(false)

const links = [
  {
    name: 'restaurant',
    label: 'My Restaurant',
    short: 'Home',
    icon: 'storefront',
    hint: 'Setup & overview',
  },
  {
    name: 'items',
    label: 'All Items',
    short: 'Items',
    icon: 'restaurant_menu',
    hint: 'Manage menu',
  },
  {
    name: 'orders',
    label: 'New Order',
    short: 'Order',
    icon: 'point_of_sale',
    hint: 'Take an order',
  },
  {
    name: 'invoices',
    label: 'Invoices',
    short: 'Invoices',
    icon: 'receipt_long',
    hint: 'Bills & history',
  },
]

const initials = computed(() =>
  (auth.currentUser?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)

function signOut() {
  $q.dialog({
    title: 'Log out',
    message: 'Do you want to log out from The EmberGrill POS?',
    cancel: { flat: true, label: 'Stay' },
    ok: { color: 'negative', label: 'Log out', unelevated: true },
  }).onOk(() => {
    auth.logout()
    router.replace({ name: 'login' })
  })
}
</script>

<style scoped lang="scss">
.shell-header {
  background: linear-gradient(90deg, #154d38 0%, #1e6f50 70%, #2c8f67 100%);
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.12);
}
.brand-logo {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.title-line {
  font-size: 17px;
  line-height: 1.1;
}
.subtitle-line {
  opacity: 0.75;
  line-height: 1.1;
}
.user-btn {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
}
.shell-drawer {
  background: var(--eg-surface);
  border-right: 1px solid var(--eg-border);
}
.nav-header {
  color: var(--eg-muted);
  letter-spacing: 1px;
}
.nav-link {
  border-radius: 12px;
  margin-bottom: 4px;
}
.nav-caption {
  color: var(--eg-muted);
}
.nav-link--active {
  background: rgba(30, 111, 80, 0.12);
  color: var(--eg-green);
  font-weight: 600;
  box-shadow: inset 4px 0 0 var(--eg-ember);
}
.body--dark .nav-link--active {
  color: #7fdcb4;
  background: rgba(76, 200, 150, 0.12);
}
.shell-footer {
  background: var(--eg-surface);
}
.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.18s ease;
}
.fade-page-enter-from,
.fade-page-leave-to {
  opacity: 0;
}
</style>
