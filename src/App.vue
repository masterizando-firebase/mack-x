<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
  <Toast></Toast>
</template>

<style>
html {
  font-size: 14px;
  height: 100%;
  width: 100%;

  --border-color: rgba(70, 77, 84, 0.5);
}

body {
  font-family: var(--font-family);
  font-weight: normal;
  background: var(--surface-ground);
  color: var(--text-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 !important;
}

.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
</style>
