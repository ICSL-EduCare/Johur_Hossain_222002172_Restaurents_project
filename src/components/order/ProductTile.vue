<template>
  <q-card
    flat
    v-ripple
    class="eg-card product-tile cursor-pointer q-hoverable"
    :class="{ 'product-tile--picked': qty > 0 }"
    @click="emit('pick', item)"
  >
    <span class="q-focus-helper" />
    <q-badge v-if="qty" floating rounded color="secondary" class="qty-badge">{{ qty }}</q-badge>
    <q-card-section class="q-pa-sm text-center">
      <q-icon name="restaurant" size="26px" color="primary" class="q-mb-xs" />
      <div class="text-weight-medium ellipsis-2-lines tile-name">{{ item.name }}</div>
      <div class="eg-price text-body2">{{ money(item.price) }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { money } from 'src/utils/format.js'

defineProps({
  item: { type: Object, required: true },
  qty: { type: Number, default: 0 },
})
const emit = defineEmits(['pick'])
</script>

<style scoped>
.product-tile {
  position: relative;
  height: 100%;
  border-width: 2px;
  transition:
    transform 0.15s,
    border-color 0.15s;
}
.product-tile:active {
  transform: scale(0.97);
}
.product-tile--picked {
  border-color: var(--eg-ember);
}
.tile-name {
  min-height: 2.6em;
  line-height: 1.3em;
}
.qty-badge {
  font-size: 13px;
  padding: 5px 8px;
}
</style>
