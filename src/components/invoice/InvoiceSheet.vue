<template>
  <div class="invoice-sheet">
    <!-- Header -->
    <div class="row items-center q-col-gutter-md sheet-head">
      <div class="col-auto">
        <q-avatar size="64px" rounded class="sheet-logo">
          <img v-if="restaurant?.logo" :src="restaurant.logo" alt="logo" />
          <q-icon v-else name="local_fire_department" color="secondary" size="36px" />
        </q-avatar>
      </div>
      <div class="col">
        <div class="text-h5 text-weight-bold text-primary">
          {{ restaurant?.name || 'The EmberGrill' }}
        </div>
        <div class="eg-muted text-caption">
          <span v-if="order.branch">{{ order.branch }} · </span>{{ restaurant?.address }}
        </div>
        <div v-if="restaurant?.phone" class="eg-muted text-caption">
          Phone: {{ restaurant.phone }}
        </div>
      </div>
      <div class="col-12 col-sm-auto text-sm-right">
        <div class="text-overline eg-muted">Invoice</div>
        <div class="text-subtitle1 text-weight-bold">{{ order.invoiceNo }}</div>
        <q-badge :color="order.status === 'upcoming' ? 'secondary' : 'positive'">
          {{ order.status === 'upcoming' ? 'Upcoming' : 'Completed' }}
        </q-badge>
      </div>
    </div>

    <!-- Meta -->
    <div class="row q-col-gutter-md q-my-md">
      <div class="col-12 col-sm-6">
        <div class="meta-box">
          <div class="text-caption eg-muted">Billed to</div>
          <div class="text-weight-bold">{{ order.customer.name }}</div>
          <div>{{ order.customer.phone }}</div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="meta-box">
          <div class="text-caption eg-muted">Table / Seat</div>
          <div class="text-weight-bold">Table {{ order.table }} · Seat {{ order.seat }}</div>
          <div>{{ dateTime(order.createdAt) }}</div>
        </div>
      </div>
    </div>

    <!-- Lines -->
    <q-markup-table flat bordered dense separator="horizontal" class="lines-table">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Item</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Price</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(line, i) in order.lines" :key="line.itemId + i">
          <td>{{ i + 1 }}</td>
          <td>{{ line.name }}</td>
          <td class="text-right">{{ line.qty }}</td>
          <td class="text-right">{{ money(line.price) }}</td>
          <td class="text-right">{{ money(line.price * line.qty) }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <!-- Totals -->
    <div class="row justify-end q-mt-md">
      <div class="totals-box">
        <div class="row justify-between">
          <span>Subtotal</span><span>{{ money(order.subtotal) }}</span>
        </div>
        <div class="row justify-between eg-muted">
          <span>VAT (5%)</span><span>{{ money(order.vat) }}</span>
        </div>
        <q-separator class="q-my-sm" />
        <div class="row justify-between text-h6 text-weight-bold">
          <span>Total</span><span class="eg-price">{{ money(order.total) }}</span>
        </div>
      </div>
    </div>

    <div class="text-center eg-muted q-mt-lg text-caption">Thank you for dining with us!</div>
  </div>
</template>

<script setup>
import { money, dateTime } from 'src/utils/format.js'

defineProps({
  order: { type: Object, required: true },
  restaurant: { type: Object, default: null },
})
</script>

<style scoped lang="scss">
.sheet-head {
  border-bottom: 3px solid var(--eg-green);
  padding-bottom: 12px;
}
.sheet-logo {
  background: rgba(30, 111, 80, 0.08);
}
.meta-box {
  border: 1px solid var(--eg-border);
  border-radius: 12px;
  padding: 10px 14px;
  height: 100%;
}
.lines-table {
  border-radius: 12px;
  overflow: hidden;
  thead tr {
    background: rgba(30, 111, 80, 0.1);
  }
}
.totals-box {
  width: 100%;
  max-width: 300px;
}
</style>
