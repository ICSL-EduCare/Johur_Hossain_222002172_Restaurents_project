<template>
  <q-card flat class="eg-card eg-lift item-card column">
    <div class="item-thumb" :style="{ background: tone.bg }">
      <q-icon :name="tone.icon" size="46px" :style="{ color: tone.fg }" />
      <q-badge class="cat-badge" :style="{ background: tone.fg }" :label="item.category" />
    </div>

    <q-card-section class="col">
      <div class="text-subtitle1 text-weight-bold ellipsis-2-lines">{{ item.name }}</div>
      <div class="text-h6 eg-price q-mt-xs">{{ money(item.price) }}</div>
    </q-card-section>

    <q-separator />
    <q-card-actions class="q-px-sm">
      <q-btn
        flat
        no-caps
        dense
        color="primary"
        icon="edit"
        label="Edit"
        @click="emit('edit', item)"
      />
      <q-space />
      <q-btn
        flat
        no-caps
        dense
        color="negative"
        icon="delete_outline"
        label="Delete"
        @click="emit('delete', item)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { money } from 'src/utils/format.js'

const props = defineProps({ item: { type: Object, required: true } })
const emit = defineEmits(['edit', 'delete'])

// every category gets its own icon + colour so the menu is easy to scan
const TONES = {
  Starters: { icon: 'tapas', fg: '#e8702a', bg: 'rgba(232,112,42,.12)' },
  'Fast Food': { icon: 'fastfood', fg: '#d64545', bg: 'rgba(214,69,69,.12)' },
  'Main Course': { icon: 'dinner_dining', fg: '#1e6f50', bg: 'rgba(30,111,80,.12)' },
  'Rice & Biryani': { icon: 'rice_bowl', fg: '#b7791f', bg: 'rgba(244,185,66,.18)' },
  Drinks: { icon: 'local_bar', fg: '#2f86c9', bg: 'rgba(47,134,201,.12)' },
  Desserts: { icon: 'icecream', fg: '#c2417a', bg: 'rgba(194,65,122,.12)' },
}
const tone = computed(
  () =>
    TONES[props.item.category] || {
      icon: 'lunch_dining',
      fg: '#5b6b64',
      bg: 'rgba(91,107,100,.12)',
    },
)
</script>

<style scoped>
.item-card {
  height: 100%;
  overflow: hidden;
}
.item-thumb {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.cat-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 8px;
  padding: 4px 8px;
}
</style>
