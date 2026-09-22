<template>
  <div class="column items-center text-center q-pa-xl">
    <q-avatar size="88px" class="eg-chip-soft">
      <q-icon :name="icon" size="44px" />
    </q-avatar>
    <div class="text-h6 q-mt-md">{{ title }}</div>
    <div class="eg-muted q-mb-md" style="max-width: 380px">{{ message }}</div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'inbox' },
  title: { type: String, required: true },
  message: { type: String, default: '' },
})
</script>
