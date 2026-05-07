<template>
  <router-view />
</template>

<script setup lang="ts">
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #1f2937;
}

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.el-card {
  border-radius: 12px !important;
  border: none !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.el-button--primary {
  background-color: #111827 !important;
  border-color: #111827 !important;
}

.el-button--primary:hover {
  background-color: #374151 !important;
  border-color: #374151 !important;
}
</style>
