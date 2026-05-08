<template>
  <div class="page max-w-md mx-auto relative">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">排行榜</h1>
      <div class="w-6"></div>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab', { active: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div class="ranking-grid" v-if="!loading">
      <div
        v-for="(item, index) in rankings"
        :key="item.id"
        class="ranking-card"
        :style="{ animationDelay: `${index * 50}ms` }"
        @click="openProduct(item.id)"
      >
        <div class="card-image-wrapper">
          <ImageWithFallback
            :src="item.image"
            :alt="item.title"
            class-name="card-img"
          />
          <div :class="['rank-badge', `rank-${index + 1}`]">
            {{ index + 1 }}
          </div>
          <!-- 趋势显示在角落 -->
          <div class="card-trend">
            <TrendingUp v-if="item.trend === 'up'" class="w-3 h-3 text-red-500" />
            <TrendingDown v-if="item.trend === 'down'" class="w-3 h-3 text-green-500" />
            <span :class="['trend-text', {
              'text-red-500': item.trend === 'up',
              'text-green-500': item.trend === 'down',
              'text-gray-400': item.trend === 'unchanged'
            }]">
              {{ item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '-' }}
            </span>
          </div>
        </div>
        
        <div class="card-info">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-meta">
            <span class="card-price">¥{{ item.price }}</span>
            <span class="card-sales">已售{{ item.sales }}</span>
          </div>
          <button
            @click.stop="addToCart(item.id)"
            class="card-add-btn"
          >
            <ShoppingCart class="w-3.5 h-3.5" />
            加购
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && rankings.length === 0" class="empty-state">
      <div class="empty-icon">😔</div>
      <p>暂无排行榜数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, TrendingUp, TrendingDown, ShoppingCart, Minus } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import { addToCart as addToCartAPI } from '@/api/cart'
import { getRankingList } from '@/api/ranking'
import { getProducts } from '@/api/product'
import { rankingDemoVisuals } from '@/utils/demoProductVisuals'

const router = useRouter()

const tabs = ['热销榜', '好评榜', '新品榜', '收藏榜']
const currentTab = ref('热销榜')
const rankings = ref<any[]>([])
const loading = ref(false)

// Tab类型映射
const tabTypeMap: Record<string, string> = {
  '热销榜': 'hot',
  '好评榜': 'rating',
  '新品榜': 'new',
  '收藏榜': 'favorite'
}

function normalizeRankingPayload(raw: unknown): any[] {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object' && Array.isArray((raw as { data?: unknown }).data)) {
    return (raw as { data: any[] }).data
  }
  return []
}

/** 无商品数据时的占位（与接口返回结构一致） */
const DEMO_RANKINGS = rankingDemoVisuals.map((row, i) => ({
  id: `demo-rank-${i + 1}`,
  title: row.title,
  image: row.image,
  price: [128, 299, 79, 59, 88, 359][i],
  sales: [3200, 2100, 5600, 8900, 1400, 980][i],
  trend: (['up', 'down', 'up', 'up', 'down', 'up'] as const)[i],
}))

function openProduct(id: string | number) {
  const sid = String(id)
  if (sid.startsWith('demo-')) {
    ElMessage.warning('示例商品暂无详情页')
    return
  }
  router.push(`/product/${sid}`)
}

async function fillRankingsFromProducts() {
  try {
    const res = await getProducts({ page: 1, pageSize: 10 })
    const items = Array.isArray((res as any)?.items) ? (res as any).items : []
    if (!items.length) return
    rankings.value = items.map((p: any, i: number) => ({
      id: p.id,
      title: p.title,
      image: p.mainImage,
      price: Math.round(Number(p.price)),
      sales: typeof p.sales === 'number' ? p.sales : Number(p.sales) || 0,
      trend: i % 2 === 0 ? 'up' : 'down'
    }))
  } catch {
    rankings.value = []
  }
}

// 加载排行榜数据
const loadRankings = async () => {
  try {
    loading.value = true
    const type = tabTypeMap[currentTab.value]
    const response = await getRankingList(type)
    const list = normalizeRankingPayload(response)
    rankings.value = list

    if (rankings.value.length === 0) {
      await fillRankingsFromProducts()
    }
    if (rankings.value.length === 0) {
      rankings.value = [...DEMO_RANKINGS]
    }
  } catch (error) {
    console.error('加载排行榜失败:', error)
    await fillRankingsFromProducts()
    if (rankings.value.length === 0) {
      rankings.value = [...DEMO_RANKINGS]
    }
  } finally {
    loading.value = false
  }
}

// 监听tab切换
watch(currentTab, () => {
  loadRankings()
})

// 加入购物车
const addToCart = async (productId: string | number) => {
  if (String(productId).startsWith('demo-')) {
    ElMessage.warning('示例商品无法加购')
    return
  }
  try {
    await addToCartAPI(String(productId), 1)
    ElMessage.success('已加入购物车')
  } catch (error) {
    console.error('加入购物车失败:', error)
    ElMessage.error('添加失败，请稍后重试')
  }
}

onMounted(() => {
  loadRankings()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  color: #1A1A2E;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #1A1A2E;
}

.title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.tabs {
  display: flex;
  background: white;
  padding: 12px 16px;
  gap: 16px;
}

.tab {
  padding: 6px 16px;
  border-radius: 16px;
  background: none;
  border: 1px solid #ddd;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.ranking-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.ranking-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 1;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rank-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  font-size: 13px;
  z-index: 2;
}

.rank-1 {
  background: #FFD700;
  color: #333;
}

.rank-2 {
  background: #C0C0C0;
  color: #333;
}

.rank-3 {
  background: #CD7F32;
  color: white;
}

.rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  color: white;
}

.card-trend {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255,255,255,0.9);
  padding: 2px 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
  z-index: 2;
}

.trend-text {
  font-size: 10px;
  font-weight: bold;
}

.card-info {
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  height: 2.6em;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  margin-bottom: 8px;
}

.card-price {
  font-size: 15px;
  font-weight: bold;
  color: #ff4757;
}

.card-sales {
  font-size: 11px;
  color: #999;
}

.card-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 6px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
