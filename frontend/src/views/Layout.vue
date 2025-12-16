<template>
  <div class="flex flex-col h-screen bg-white max-w-md mx-auto relative">
    <!-- 主内容区 -->
    <div class="flex-1 overflow-y-auto h-0">
      <RouterView />
    </div>

    <!-- 悬浮客服按钮 -->
    <FloatingServiceButton />

    <!-- 底部导航栏 -->
    <nav class="sticky bottom-0 bg-white border-t border-gray-200 px-2 py-2 pb-safe z-50">
      <div class="flex items-center justify-around">
        <button
          v-for="tab in tabs"
          :key="tab.path"
          @click="router.push(tab.path)"
          :class="[
            'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
            isActive(tab.path) ? 'bg-orange-50' : ''
          ]"
        >
          <component
            :is="tab.icon"
            :class="[
              'w-6 h-6',
              isActive(tab.path) ? 'text-primary' : 'text-gray-400'
            ]"
            :stroke-width="isActive(tab.path) ? 2.5 : 2"
          />
          <span
            :class="[
              'text-xs',
              isActive(tab.path) ? 'text-primary' : 'text-gray-600'
            ]"
          >
            {{ tab.label }}
          </span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'
import { Home, Compass, ShoppingCart, User } from 'lucide-vue-next'
import FloatingServiceButton from '@/components/FloatingServiceButton.vue'

const router = useRouter()
const route = useRoute()

const tabs = [
  { path: '/home', label: '首页', icon: Home },
  { path: '/discover', label: '发现', icon: Compass },
  { path: '/cart', label: '购物车', icon: ShoppingCart },
  { path: '/profile', label: '我的', icon: User },
]

const isActive = (path: string) => {
  return route.path === path
}
</script>
