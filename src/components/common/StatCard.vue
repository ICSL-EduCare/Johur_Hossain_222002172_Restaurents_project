<template>
  <q-card flat class="eg-card stat-card">
    <q-card-section class="row items-center no-wrap">
      <q-avatar size="48px" :color="color" text-color="white" rounded>
        <q-icon :name="icon" size="24px" />
      </q-avatar>
      <div class="q-ml-md">
        <div class="eg-muted text-caption text-uppercase">{{ label }}</div>
        <div class="text-h6 text-weight-bold">{{ value }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, required: true },
  color: { type: String, default: 'primary' },
})
</script>
