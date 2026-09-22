<template>
  <router-view />
</template>

<script setup>
import { useThemeStore } from 'stores/theme.js'

// restore the saved light / dark theme on start-up
useThemeStore().apply()
</script>
