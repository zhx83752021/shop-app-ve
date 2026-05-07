<template>
  <div class="brand-showroom bg-white mx-4 mb-4 rounded-3xl overflow-hidden shadow-sm border border-black/[0.03]">
    <div class="px-5 pt-6 pb-2">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="font-display font-bold text-xl text-ink tracking-tight flex items-center gap-2">
          品牌馆
          <span class="text-[10px] font-normal uppercase tracking-widest text-ink-muted bg-ink/[0.04] px-2 py-0.5 rounded-full">Showroom</span>
        </h2>
        <button class="text-xs text-ink-muted hover:text-primary transition-colors flex items-center gap-1 group">
          全部品牌
          <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div class="grid grid-cols-4 gap-x-3 gap-y-6">
        <div
          v-for="brand in brands"
          :key="brand.name"
          class="brand-card group cursor-pointer"
          @click="handleBrandClick(brand)"
        >
          <div class="relative mb-3">
            <!-- Logo Container with Editorial Glass Style -->
            <div class="aspect-square rounded-2xl bg-[#F8F9FA] flex items-center justify-center p-3.5 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-black/[0.04] transition-all duration-500 border border-black/[0.01]">
              <Icon :icon="brand.icon" class="w-full h-full text-ink opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            </div>
            <!-- Discount Badge - Small & Elegant -->
            <div class="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg shadow-sm transform group-hover:rotate-12 transition-transform duration-500">
              {{ brand.discount }}
            </div>
          </div>
          <div class="text-center">
            <p class="text-[11px] font-bold text-ink mb-0.5 truncate">{{ brand.name }}</p>
            <p class="text-[10px] text-primary font-medium">{{ brand.tag }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bottom Decorative Line -->
    <div class="h-1 bg-gradient-to-r from-transparent via-black/[0.02] to-transparent mt-4"></div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'

const brands = [
  { name: 'Apple', icon: 'simple-icons:apple', discount: '8.5折', tag: '数码巅峰' },
  { name: 'Samsung', icon: 'simple-icons:samsung', discount: '7.5折', tag: '科技领航' },
  { name: 'Nike', icon: 'simple-icons:nike', discount: '6折起', tag: '运动美学' },
  { name: 'Adidas', icon: 'simple-icons:adidas', discount: '5折起', tag: '经典重塑' },
  { name: 'Huawei', icon: 'simple-icons:huawei', discount: '8折', tag: '国货之光' },
  { name: 'Xiaomi', icon: 'simple-icons:xiaomi', discount: '7折', tag: '智能生活' },
  { name: 'Puma', icon: 'simple-icons:puma', discount: '6.5折', tag: '潮流先锋' },
  { name: 'Sony', icon: 'simple-icons:sony', discount: '8折', tag: '影音极致' }
]

const handleBrandClick = (brand: any) => {
  // 导航到品牌页或搜索
  console.log('Brand clicked:', brand.name)
}
</script>

<style scoped>
.brand-card {
  perspective: 1000px;
}

.brand-card:active .rounded-2xl {
  transform: scale(0.95);
}
</style>
