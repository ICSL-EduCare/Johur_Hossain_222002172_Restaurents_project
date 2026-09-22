<template>
  <q-dialog v-model="open" persistent @hide="emit('closed')">
    <q-card class="eg-card dialog-card">
      <q-card-section class="row items-center eg-gradient">
        <q-icon :name="item ? 'edit_note' : 'add_circle'" size="26px" class="q-mr-sm" />
        <div class="text-h6">{{ item ? 'Edit item' : 'Add new item' }}</div>
        <q-space />
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-form ref="formRef" @submit.prevent="submit">
        <q-card-section class="q-gutter-y-sm">
          <q-input
            v-model="form.name"
            outlined
            autofocus
            label="Item name"
            :rules="[required('Item name')]"
          >
            <template #prepend><q-icon name="fastfood" /></template>
          </q-input>

          <q-select
            v-model="form.category"
            outlined
            label="Category"
            :options="categories"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            new-value-mode="add-unique"
            hint="Pick one or type a new category"
            :rules="[required('Category')]"
            @input-value="(v) => (form.category = v)"
          >
            <template #prepend><q-icon name="category" /></template>
          </q-select>

          <q-input
            v-model.number="form.price"
            outlined
            type="number"
            min="0"
            step="0.01"
            label="Price (BDT)"
            :rules="[required('Price'), positiveNumber]"
          >
            <template #prepend><span class="text-weight-bold q-px-xs">৳</span></template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn
            type="submit"
            unelevated
            color="primary"
            class="eg-btn"
            :icon="item ? 'save' : 'add'"
            :label="item ? 'Save changes' : 'Add item'"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { required, positiveNumber } from 'src/utils/validators.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'save', 'closed'])

const open = ref(props.modelValue)
const formRef = ref(null)
const form = reactive({ name: '', category: '', price: null })

watch(
  () => props.modelValue,
  (v) => {
    open.value = v
    if (v) {
      form.name = props.item?.name || ''
      form.category = props.item?.category || ''
      form.price = props.item?.price ?? null
    }
  },
)
watch(open, (v) => emit('update:modelValue', v))

async function submit() {
  if (!(await formRef.value.validate())) return
  emit('save', { ...form })
  open.value = false
}
</script>

<style scoped>
.dialog-card {
  width: 100%;
  max-width: 440px;
  overflow: hidden;
}
</style>
