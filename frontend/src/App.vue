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
  background-color: #FFF8F5;
  margin: 0 auto;
}

.app-route-view {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 桌面端手机模拟模式 */
@media (min-width: 768px) {
  :global(body) {
    background-color: #e2e8f0; /* 桌面大背景色稍暗，凸显手机 */
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 24px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  
  #app {
    width: 375px !important;
    height: 812px !important;
    max-height: 90vh !important;
    border-radius: 44px;
    box-shadow: 
      0 0 0 10px #0f172a, /* 屏幕黑边 */
      0 0 0 12px #475569, /* 不锈钢中框 */
      0 0 0 13px #94a3b8, /* 边框高光 */
      0 30px 60px -15px rgba(0, 0, 0, 0.4); /* 阴影 */
    position: relative;
    /* 解决圆角溢出 */
    transform: translateZ(0);
    overflow: hidden;
  }

  /* 模拟 iPhone 底部 Home 指示条 */
  #app::after {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 134px;
    height: 5px;
    background-color: #000;
    border-radius: 100px;
    z-index: 9999;
    opacity: 0.15;
  }

  /* 桌面端将滚动条弱化，模拟手机 */
  .app-route-view::-webkit-scrollbar {
    width: 0px; /* 彻底隐藏桌面端滚动条，更像真机 */
  }
}
</style>
