<template>
  <div
    class="brand-showroom mx-4 mb-3 rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(26,26,46,0.04)]"
  >
    <div class="px-5 pt-6 pb-2">
      <div class="flex items-baseline justify-between mb-5">
        <h2 class="font-display font-bold text-xl text-[#1A1A2E] tracking-tight flex items-center gap-2">
          品牌馆
          <span
            class="text-[10px] font-normal uppercase tracking-[0.2em] text-[#5c5c6e] bg-black/[0.05] px-2 py-0.5 rounded-full"
            >Showroom</span
          >
        </h2>
        <button
          type="button"
          class="text-xs text-[#6b6b7b] hover:text-[#1A1A2E] transition-colors flex items-center gap-1 group"
          @click="emit('clearAll')"
        >
          全部品牌
          <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div class="grid grid-cols-4 gap-x-3 gap-y-5">
        <button
          v-for="brand in brands"
          :key="brand.name"
          type="button"
          class="brand-card group text-left w-full rounded-2xl focus:outline-none focus-visible:ring-0"
          @click="emit('select', brand.name)"
        >
          <div class="relative mb-2.5">
            <div
              class="aspect-square rounded-2xl flex items-center justify-center p-3 transition-[transform] duration-500 group-active:scale-[0.97]"
              :style="{ backgroundColor: brand.tileBg }"
            >
              <Icon
                :icon="brand.icon"
                class="w-full h-full transition-transform duration-500 group-hover:scale-110"
                :style="{ color: brand.iconColor }"
              />
            </div>
            <span
              class="absolute -top-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-lg shadow-sm"
              :style="{ backgroundColor: brand.badgeBg, color: brand.badgeFg }"
            >
              {{ brand.discount }}
            </span>
          </div>
          <div class="text-center px-0.5">
            <p class="text-[11px] font-bold text-[#1A1A2E] mb-0.5 truncate">{{ brand.name }}</p>
            <p class="text-[10px] font-medium truncate" :style="{ color: brand.tagColor }">{{ brand.tag }}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'

const emit = defineEmits<{
  select: [name: string]
  clearAll: []
}>()

/** 品牌色：背景微染 + 边框 + 图标 + 角标 */
const brands = [
  {
    name: 'Apple',
    icon: 'simple-icons:apple',
    discount: '8.5折',
    tag: '数码巅峰',
    tileBg: '#ececee',
    border: '#c5c5ca',
    iconColor: '#1d1d1f',
    tagColor: '#3a3a3c',
    badgeBg: '#1d1d1f',
    badgeFg: '#f5f5f7',
    glow: 'rgba(29,29,31,0.12)',
    accent: '#1d1d1f',
  },
  {
    name: 'Samsung',
    icon: 'simple-icons:samsung',
    discount: '7.5折',
    tag: '科技领航',
    tileBg: '#e8eef9',
    border: '#1428A0',
    iconColor: '#1428A0',
    tagColor: '#1428A0',
    badgeBg: '#1428A0',
    badgeFg: '#ffffff',
    glow: 'rgba(20,40,160,0.18)',
    accent: '#1428A0',
  },
  {
    name: 'Nike',
    icon: 'simple-icons:nike',
    discount: '6折起',
    tag: '运动美学',
    tileBg: '#f7f7f7',
    border: '#111111',
    iconColor: '#111111',
    tagColor: '#FF5000',
    badgeBg: '#FF5000',
    badgeFg: '#ffffff',
    glow: 'rgba(255,80,0,0.15)',
    accent: '#FF5000',
  },
  {
    name: 'Adidas',
    icon: 'simple-icons:adidas',
    discount: '5折起',
    tag: '经典重塑',
    tileBg: '#f0f0f0',
    border: '#000000',
    iconColor: '#000000',
    tagColor: '#005eb8',
    badgeBg: '#000000',
    badgeFg: '#ffffff',
    glow: 'rgba(0,0,0,0.14)',
    accent: '#000000',
  },
  {
    name: 'Huawei',
    icon: 'simple-icons:huawei',
    discount: '8折',
    tag: '国货之光',
    tileBg: '#fdecec',
    border: '#C7000B',
    iconColor: '#C7000B',
    tagColor: '#C7000B',
    badgeBg: '#C7000B',
    badgeFg: '#ffffff',
    glow: 'rgba(199,0,11,0.2)',
    accent: '#C7000B',
  },
  {
    name: 'Xiaomi',
    icon: 'simple-icons:xiaomi',
    discount: '7折',
    tag: '智能生活',
    tileBg: '#fff3e6',
    border: '#FF6900',
    iconColor: '#FF6900',
    tagColor: '#E65100',
    badgeBg: '#FF6900',
    badgeFg: '#ffffff',
    glow: 'rgba(255,105,0,0.2)',
    accent: '#FF6900',
  },
  {
    name: 'Puma',
    icon: 'simple-icons:puma',
    discount: '6.5折',
    tag: '潮流先锋',
    tileBg: '#f5f5eb',
    border: '#1a1a1a',
    iconColor: '#111111',
    tagColor: '#4a5d23',
    badgeBg: '#d4ff00',
    badgeFg: '#111111',
    glow: 'rgba(26,26,26,0.12)',
    accent: '#d4ff00',
  },
  {
    name: 'Sony',
    icon: 'simple-icons:sony',
    discount: '8折',
    tag: '影音极致',
    tileBg: '#e8f4fc',
    border: '#004D99',
    iconColor: '#004D99',
    tagColor: '#004D99',
    badgeBg: '#004D99',
    badgeFg: '#ffffff',
    glow: 'rgba(0,77,153,0.18)',
    accent: '#004D99',
  },
]
</script>
