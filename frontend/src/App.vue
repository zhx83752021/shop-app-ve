<template>
  <div id="app">
    <!-- min-h-0：flex 子项默认 min-height:auto 会把内容高度顶满外层，导致外层 overflow 截断且无法滚动 -->
    <RouterView class="app-route-view" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-route-view {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
