<template>
  <q-page padding class="eg-page-bg invoices-bg">
    <div class="page-wrap">
      <PageHeader
        title="Invoices"
        :subtitle="`${orders.orders.length} ${orders.orders.length === 1 ? 'order' : 'orders'} saved`"
        icon="receipt_long"
      >
        <template #actions>
          <q-btn
            unelevated
            color="secondary"
            class="eg-btn"
            icon="add"
            label="New order"
            :to="{ name: 'orders' }"
          />
        </template>
      </PageHeader>

      <!-- Search & filter -->
      <q-card flat class="eg-card q-mb-md">
        <q-card-section class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-6">
            <q-input
              v-model="search"
              dense
              outlined
              clearable
              placeholder="Search invoice no, customer, phone or table..."
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="col-6 col-md-3">
            <q-select
              v-model="period"
              dense
              outlined
              emit-value
              map-options
              :options="periodOptions"
              label="Date"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-select
              v-model="branch"
              dense
              outlined
              emit-value
              map-options
              :options="branchOptions"
              label="Branch"
              :disable="branchOptions.length <= 1"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Separate sections: Upcoming / Previous -->
      <q-tabs
        v-model="tab"
        no-caps
        align="left"
        active-color="primary"
        indicator-color="secondary"
        class="q-mb-md"
      >
        <q-tab name="upcoming" icon="pending_actions">
          <div class="row items-center q-gutter-x-sm">
            <span>Upcoming orders</span>
            <q-badge color="secondary" rounded :label="upcomingList.length" />
          </div>
        </q-tab>
        <q-tab name="previous" icon="history">
          <div class="row items-center q-gutter-x-sm">
            <span>Previous orders</span>
            <q-badge color="positive" rounded :label="previousList.length" />
          </div>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <q-tab-panel
          v-for="section in sections"
          :key="section.name"
          :name="section.name"
          class="q-pa-none"
        >
          <div class="text-caption eg-muted q-mb-sm">{{ section.note }}</div>
          <div v-if="section.list.length" class="row q-col-gutter-md">
            <div v-for="order in section.list" :key="order.id" class="col-12 col-sm-6 col-lg-4">
              <OrderCard
                :order="order"
                @view="view"
                @download="download"
                @print="print"
                @complete="complete"
                @delete="remove"
              />
            </div>
          </div>
          <q-card v-else flat class="eg-card">
            <EmptyState
              :icon="section.emptyIcon"
              :title="section.emptyTitle"
              message="Orders you place will appear here."
            />
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- View invoice -->
    <q-dialog
      v-model="viewer"
      :maximized="$q.screen.lt.sm"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card v-if="selected" class="eg-card viewer-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 text-weight-bold">Invoice preview</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <InvoiceSheet :order="selected" :restaurant="restaurant.profile" />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            outline
            no-caps
            color="primary"
            icon="download"
            label="Download"
            class="eg-btn"
            @click="download(selected)"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="print"
            label="Print"
            class="eg-btn"
            @click="print(selected)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useOrdersStore } from 'stores/orders.js'
import { useRestaurantStore } from 'stores/restaurant.js'
import { downloadInvoice, printInvoice } from 'src/utils/invoice.js'
import PageHeader from 'components/common/PageHeader.vue'
import EmptyState from 'components/common/EmptyState.vue'
import OrderCard from 'components/invoice/OrderCard.vue'
import InvoiceSheet from 'components/invoice/InvoiceSheet.vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const orders = useOrdersStore()
const restaurant = useRestaurantStore()

const tab = ref('upcoming')
const search = ref('')
const period = ref('all')
const branch = ref('all')
const viewer = ref(false)
const selected = ref(null)

const periodOptions = [
  { label: 'All time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'week' },
  { label: 'Last 30 days', value: 'month' },
]

const branchOptions = computed(() => [
  { label: 'All branches', value: 'all' },
  ...(restaurant.profile?.branches || []).map((b) => ({ label: b, value: b })),
])

function matches(order) {
  const term = (search.value || '').trim().toLowerCase()
  const haystack = [
    order.invoiceNo,
    order.customer.name,
    order.customer.phone,
    `table ${order.table}`,
  ]
    .join(' ')
    .toLowerCase()
  if (term && !haystack.includes(term)) return false

  if (branch.value !== 'all' && order.branch !== branch.value) return false

  if (period.value !== 'all') {
    const created = new Date(order.createdAt)
    const now = new Date()
    if (period.value === 'today' && created.toDateString() !== now.toDateString()) return false
    const days = { week: 7, month: 30 }[period.value]
    if (days && now - created > days * 86400000) return false
  }
  return true
}

const upcomingList = computed(() => orders.upcoming.filter(matches))
const previousList = computed(() => orders.previous.filter(matches))

const sections = computed(() => [
  {
    name: 'upcoming',
    list: upcomingList.value,
    note: 'Orders still being served — latest first.',
    emptyIcon: 'hourglass_empty',
    emptyTitle: 'No upcoming orders',
  },
  {
    name: 'previous',
    list: previousList.value,
    note: 'Served and closed orders (older orders).',
    emptyIcon: 'history_toggle_off',
    emptyTitle: 'No previous orders',
  },
])

function view(order) {
  selected.value = order
  viewer.value = true
}

function download(order) {
  downloadInvoice(order, restaurant.profile)
  $q.notify({
    type: 'positive',
    icon: 'download_done',
    message: `${order.invoiceNo}.txt downloaded`,
  })
}

function print(order) {
  printInvoice(order, restaurant.profile)
}

function complete(order) {
  $q.dialog({
    title: 'Mark as served',
    message: `Move ${order.invoiceNo} to previous orders?`,
    cancel: { flat: true, label: 'Cancel' },
    ok: { color: 'positive', unelevated: true, label: 'Yes, served' },
  }).onOk(() => {
    orders.completeOrder(order.id)
    $q.notify({ type: 'positive', message: `${order.invoiceNo} completed` })
  })
}

function remove(order) {
  $q.dialog({
    title: 'Delete invoice',
    message: `Delete ${order.invoiceNo} permanently?`,
    cancel: { flat: true, label: 'Cancel' },
    ok: { color: 'negative', unelevated: true, label: 'Delete' },
  }).onOk(() => orders.deleteOrder(order.id))
}

// coming from the Order page: open the new invoice right away
onMounted(() => {
  const id = route.query.open
  if (!id) return
  const order = orders.findById(id)
  // clean the URL first - a Quasar dialog closes itself when the route changes
  router.replace({ query: {} }).then(() => {
    if (order) view(order)
  })
})
</script>

<style scoped>
/* Invoice / bill background */
.invoices-bg {
  --eg-bg: url('../assets/backgrounds/invoice-bg.webp');
}

.viewer-card {
  width: 100%;
  max-width: 760px;
}
</style>
