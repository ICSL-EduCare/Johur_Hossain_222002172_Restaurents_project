<template>
  <q-page padding class="eg-page-bg items-bg">
    <div class="page-wrap">
      <PageHeader
        title="All Items"
        :subtitle="`${menu.items.length} items on your menu`"
        icon="restaurant_menu"
      >
        <template #actions>
          <q-btn
            unelevated
            color="secondary"
            class="eg-btn"
            icon="add"
            label="Add new item"
            @click="openAdd"
          />
        </template>
      </PageHeader>

      <!-- Search & filter bar -->
      <q-card flat class="eg-card q-mb-lg">
        <q-card-section class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-5">
            <q-input
              v-model="search"
              dense
              outlined
              clearable
              placeholder="Search items by name..."
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="col-6 col-md-3">
            <q-select
              v-model="category"
              dense
              outlined
              emit-value
              map-options
              :options="categoryOptions"
              label="Category"
            />
          </div>
          <div class="col-6 col-md-2">
            <q-select
              v-model="sortBy"
              dense
              outlined
              emit-value
              map-options
              :options="sortOptions"
              label="Sort"
            />
          </div>
          <div class="col-12 col-md-2 text-right eg-muted text-caption">
            Showing {{ visibleItems.length }} of {{ menu.items.length }}
          </div>
        </q-card-section>
      </q-card>

      <div v-if="visibleItems.length" class="row q-col-gutter-md">
        <div v-for="item in visibleItems" :key="item.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <MenuItemCard :item="item" @edit="openEdit" @delete="confirmDelete" />
        </div>
      </div>

      <q-card v-else flat class="eg-card">
        <EmptyState
          v-if="!menu.items.length"
          icon="restaurant_menu"
          title="Your menu is empty"
          message="Add your first dish, or load a sample menu to try the POS quickly."
        >
          <div class="row q-gutter-sm justify-center">
            <q-btn
              unelevated
              color="primary"
              class="eg-btn"
              icon="add"
              label="Add item"
              @click="openAdd"
            />
            <q-btn
              outline
              color="secondary"
              class="eg-btn"
              icon="auto_awesome"
              label="Load sample menu"
              @click="loadSample"
            />
          </div>
        </EmptyState>
        <EmptyState
          v-else
          icon="search_off"
          title="No matching items"
          message="Try another name or category."
        />
      </q-card>
    </div>

    <MenuItemDialog
      v-model="dialog"
      :item="editingItem"
      :categories="menu.categories"
      @save="saveItem"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMenuStore } from 'stores/menu.js'
import PageHeader from 'components/common/PageHeader.vue'
import EmptyState from 'components/common/EmptyState.vue'
import MenuItemCard from 'components/menu/MenuItemCard.vue'
import MenuItemDialog from 'components/menu/MenuItemDialog.vue'

const $q = useQuasar()
const menu = useMenuStore()

const search = ref('')
const category = ref('all')
const sortBy = ref('newest')
const dialog = ref(false)
const editingItem = ref(null)

const categoryOptions = computed(() => [
  { label: 'All categories', value: 'all' },
  ...menu.categories.map((c) => ({ label: c, value: c })),
])

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Name A-Z', value: 'name' },
  { label: 'Price: low to high', value: 'priceAsc' },
  { label: 'Price: high to low', value: 'priceDesc' },
]

const sorters = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  name: (a, b) => a.name.localeCompare(b.name),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
}

const visibleItems = computed(() => {
  const term = (search.value || '').trim().toLowerCase()
  return menu.items
    .filter((i) => category.value === 'all' || i.category === category.value)
    .filter((i) => !term || i.name.toLowerCase().includes(term))
    .slice()
    .sort(sorters[sortBy.value])
})

function openAdd() {
  editingItem.value = null
  dialog.value = true
}

function openEdit(item) {
  editingItem.value = item
  dialog.value = true
}

function saveItem(data) {
  if (editingItem.value) {
    menu.updateItem(editingItem.value.id, data)
    $q.notify({ type: 'positive', message: `"${data.name}" updated` })
  } else {
    menu.addItem(data)
    $q.notify({ type: 'positive', message: `"${data.name}" added to the menu` })
  }
}

function confirmDelete(item) {
  $q.dialog({
    title: 'Delete item',
    message: `Remove "${item.name}" from the menu?`,
    cancel: { flat: true, label: 'Cancel' },
    ok: { color: 'negative', unelevated: true, label: 'Delete' },
  }).onOk(() => {
    menu.deleteItem(item.id)
    $q.notify({ type: 'info', message: `"${item.name}" deleted` })
  })
}

function loadSample() {
  menu.loadSampleMenu()
  $q.notify({ type: 'positive', message: 'Sample menu loaded' })
}
</script>

<style scoped>
/* Fresh food / menu background */
.items-bg {
  --eg-bg: url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1920&q=75');
}
</style>
