<template>
  <q-card flat class="eg-card cart-panel">
    <q-card-section class="eg-gradient row items-center">
      <q-icon name="receipt" size="24px" class="q-mr-sm" />
      <div class="text-h6">Current order</div>
      <q-space />
      <q-badge
        color="accent"
        text-color="dark"
        :label="`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`"
      />
    </q-card-section>

    <q-form ref="formRef" @submit.prevent="submit">
      <!-- Customer & table details -->
      <q-card-section class="row q-col-gutter-sm q-pb-none">
        <div class="col-12 col-sm-6">
          <q-input
            v-model="details.name"
            dense
            outlined
            label="Customer name *"
            :rules="[required('Customer name')]"
          >
            <template #prepend><q-icon name="person" /></template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="details.phone"
            dense
            outlined
            type="tel"
            label="Phone number *"
            :rules="[required('Phone'), phoneRule]"
          >
            <template #prepend><q-icon name="call" /></template>
          </q-input>
        </div>
        <div class="col-6">
          <q-input
            v-model.number="details.table"
            dense
            outlined
            type="number"
            min="1"
            label="Table no. *"
            :rules="[positiveInt('Table')]"
          >
            <template #prepend><q-icon name="table_restaurant" /></template>
          </q-input>
        </div>
        <div class="col-6">
          <q-input
            v-model.number="details.seat"
            dense
            outlined
            type="number"
            min="1"
            label="Seat no. *"
            :rules="[positiveInt('Seat')]"
          >
            <template #prepend><q-icon name="event_seat" /></template>
          </q-input>
        </div>
        <div v-if="branches.length > 1" class="col-12">
          <q-select v-model="details.branch" dense outlined :options="branches" label="Branch">
            <template #prepend><q-icon name="account_tree" /></template>
          </q-select>
        </div>
      </q-card-section>

      <!-- Chosen items -->
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold q-mb-sm">Chosen items</div>
        <div v-if="!cart.length" class="empty-cart column items-center q-pa-lg eg-muted">
          <q-icon name="touch_app" size="36px" />
          <div class="q-mt-sm">Tap items on the left to add them</div>
        </div>
        <q-list v-else separator class="cart-list">
          <q-item v-for="line in cart" :key="line.id" class="q-px-sm">
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ line.name }}</q-item-label>
              <q-item-label caption>{{ money(line.price) }} each</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row items-center no-wrap qty-box">
                <q-btn
                  round
                  dense
                  flat
                  size="sm"
                  icon="remove"
                  @click="emit('change', line.id, -1)"
                />
                <span class="q-px-sm text-weight-bold">{{ line.qty }}</span>
                <q-btn round dense flat size="sm" icon="add" @click="emit('change', line.id, 1)" />
              </div>
            </q-item-section>
            <q-item-section side class="line-total text-weight-bold">
              {{ money(line.price * line.qty) }}
            </q-item-section>
            <q-item-section side>
              <q-btn
                round
                dense
                flat
                size="sm"
                color="negative"
                icon="close"
                @click="emit('remove', line.id)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- Totals -->
      <q-card-section class="q-pt-none">
        <div class="totals q-pa-md">
          <div class="row justify-between">
            <span>Subtotal</span><span>{{ money(subtotal) }}</span>
          </div>
          <div class="row justify-between eg-muted">
            <span>VAT (5%)</span><span>{{ money(vat) }}</span>
          </div>
          <q-separator class="q-my-sm" />
          <div class="row justify-between text-h6 text-weight-bold">
            <span>Total</span><span class="eg-price">{{ money(subtotal + vat) }}</span>
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="q-px-md q-pb-md">
        <q-btn
          flat
          no-caps
          color="negative"
          icon="delete_sweep"
          label="Clear"
          :disable="!cart.length"
          @click="emit('clear')"
        />
        <q-space />
        <q-btn
          type="submit"
          unelevated
          size="lg"
          class="eg-btn eg-ember-gradient"
          icon="send"
          label="Place order"
          :disable="!cart.length"
          :loading="busy"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { money, VAT_RATE } from 'src/utils/format.js'
import { required, phoneRule, positiveInt } from 'src/utils/validators.js'

const props = defineProps({
  cart: { type: Array, required: true },
  branches: { type: Array, default: () => [] },
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['change', 'remove', 'clear', 'submit'])

const formRef = ref(null)
const details = reactive({
  name: '',
  phone: '',
  table: null,
  seat: null,
  branch: props.branches[0] || '',
})

watch(
  () => props.branches,
  (list) => {
    if (!list.includes(details.branch)) details.branch = list[0] || ''
  },
)

const itemCount = computed(() => props.cart.reduce((n, l) => n + l.qty, 0))
const subtotal = computed(() => props.cart.reduce((s, l) => s + l.price * l.qty, 0))
const vat = computed(() => subtotal.value * VAT_RATE)

async function submit() {
  if (!(await formRef.value.validate())) return
  emit('submit', { ...details })
}

function reset() {
  Object.assign(details, { name: '', phone: '', table: null, seat: null })
  formRef.value?.resetValidation()
}

defineExpose({ reset })
</script>

<style scoped lang="scss">
.cart-panel {
  overflow: hidden;
  position: sticky;
  top: 70px;
}
.empty-cart {
  border: 2px dashed var(--eg-border);
  border-radius: 12px;
}
.cart-list {
  border: 1px solid var(--eg-border);
  border-radius: 12px;
  max-height: 300px;
  overflow-y: auto;
}
.qty-box {
  border: 1px solid var(--eg-border);
  border-radius: 999px;
}
.line-total {
  min-width: 86px;
  text-align: right;
}
.totals {
  border-radius: 12px;
  background: rgba(30, 111, 80, 0.06);
}
@media (max-width: 1023px) {
  .cart-panel {
    position: static;
  }
}
</style>
