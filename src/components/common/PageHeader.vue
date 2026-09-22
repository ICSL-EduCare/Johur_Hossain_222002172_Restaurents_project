<template>
  <div class="row items-center q-col-gutter-md q-mb-lg">
    <div class="col-12 col-sm">
      <div class="row items-center no-wrap">
        <q-avatar v-if="icon" size="46px" class="eg-gradient q-mr-md" rounded>
          <q-icon :name="icon" size="26px" />
        </q-avatar>
        <div>
          <div class="text-h5 text-weight-bold">{{ title }}</div>
          <div v-if="subtitle" class="eg-muted">{{ subtitle }}</div>
        </div>
      </div>
    </div>
    <div v-if="$slots.actions" class="col-12 col-sm-auto row q-gutter-sm justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
})
</script>
