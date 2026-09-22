<template>
  <q-card flat class="eg-card eg-lift order-card column">
    <q-card-section class="row items-center no-wrap q-pb-sm">
      <q-avatar
        size="42px"
        :class="isUpcoming ? 'eg-ember-gradient' : 'bg-positive text-white'"
        rounded
      >
        <q-icon :name="isUpcoming ? 'schedule' : 'task_alt'" />
      </q-avatar>
      <div class="q-ml-sm col">
        <div class="text-weight-bold">{{ order.invoiceNo }}</div>
        <div class="text-caption eg-muted">
          {{ dateTime(order.createdAt) }} · {{ timeAgo(order.createdAt) }}
        </div>
      </div>
      <q-badge
        :color="isUpcoming ? 'secondary' : 'positive'"
        :label="isUpcoming ? 'Upcoming' : 'Completed'"
        class="q-py-xs q-px-sm"
      />
    </q-card-section>

    <q-card-section class="q-py-sm col">
      <div class="row items-center q-gutter-x-md text-body2">
        <div><q-icon name="person" class="q-mr-xs" />{{ order.customer.name }}</div>
        <div class="eg-muted"><q-icon name="call" class="q-mr-xs" />{{ order.customer.phone }}</div>
      </div>
      <div class="row q-gutter-xs q-mt-sm">
        <q-chip dense class="eg-chip-soft" icon="table_restaurant">Table {{ order.table }}</q-chip>
        <q-chip dense class="eg-chip-soft" icon="event_seat">Seat {{ order.seat }}</q-chip>
        <q-chip v-if="order.branch" dense class="eg-chip-soft" icon="location_on">{{
          order.branch
        }}</q-chip>
      </div>
      <div class="text-caption eg-muted q-mt-sm ellipsis">
        {{ order.lines.map((l) => `${l.qty}× ${l.name}`).join(', ') }}
      </div>
    </q-card-section>

    <q-card-section class="row items-center q-pt-none">
      <span class="eg-muted">Total</span>
      <q-space />
      <span class="text-h6 eg-price">{{ money(order.total) }}</span>
    </q-card-section>

    <q-separator />
    <q-card-actions class="row q-px-sm">
      <q-btn
        flat
        dense
        no-caps
        color="primary"
        icon="visibility"
        label="View"
        @click="emit('view', order)"
      />
      <q-btn
        flat
        dense
        no-caps
        color="primary"
        icon="download"
        label="Download"
        @click="emit('download', order)"
      />
      <q-btn
        flat
        dense
        no-caps
        color="primary"
        icon="print"
        label="Print"
        @click="emit('print', order)"
      />
      <q-space />
      <q-btn
        v-if="isUpcoming"
        unelevated
        dense
        no-caps
        color="positive"
        icon="done_all"
        label="Served"
        class="eg-btn q-px-sm"
        @click="emit('complete', order)"
      />
      <q-btn
        v-else
        flat
        round
        dense
        color="negative"
        icon="delete_outline"
        @click="emit('delete', order)"
      >
        <q-tooltip>Delete</q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { money, dateTime, timeAgo } from 'src/utils/format.js'

const props = defineProps({ order: { type: Object, required: true } })
const emit = defineEmits(['view', 'download', 'print', 'complete', 'delete'])

const isUpcoming = computed(() => props.order.status === 'upcoming')
</script>

<style scoped>
.order-card {
  height: 100%;
}
</style>
