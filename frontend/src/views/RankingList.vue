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

    <div class="ranking-list" v-if="!loading">
      <div
        v-for="(item, index) in rankings"
        :key="item.id"
        class="ranking-item"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div
          @click="$router.push(`/product/${item.id}`)"
          class="item-content"
        >
          <div :class="['rank-badge', `rank-${index + 1}`]">
            {{ index + 1 }}
          </div>
          <ImageWithFallback
            :src="item.image"
            :alt="item.title"
            class-name="item-img"
          />
          <div class="item-info">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-desc">{{ item.description }}</p>
            <div class="item-meta">
              <span class="price">¥{{ item.price }}</span>
              <span class="sales">已售{{ item.sales }}件</span>
            </div>
          </div>
          <div class="trend">
            <div class="trend-icon">
              <TrendingUp v-if="item.trend === 'up'" class="w-4 h-4 text-red-500" />
              <TrendingDown v-if="item.trend === 'down'" class="w-4 h-4 text-green-500" />
              <Minus v-if="item.trend === 'unchanged'" class="w-4 h-4 text-gray-400" />
            </div>
            <span :class="['trend-text', {
              'text-red-500': item.trend === 'up',
              'text-green-500': item.trend === 'down',
              'text-gray-400': item.trend === 'unchanged'
            }]">
              {{ item.trend === 'up' ? '上升' : item.trend === 'down' ? '下降' : '持平' }}
            </span>
          </div>
        </div>
        <button
          @click.stop="addToCart(item.id)"
          class="add-cart-btn"
        >
          <ShoppingCart class="w-4 h-4" />
          加购
        </button>
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
import { ArrowLeft, TrendingUp, TrendingDown, ShoppingCart, Minus } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import { addToCart as addToCartAPI } from '@/api/cart'
import { getRankingList } from '@/api/ranking'

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

// 加载排行榜数据
const loadRankings = async () => {
  try {
    loading.value = true
    const type = tabTypeMap[currentTab.value]
    const response = await getRankingList(type)

    // 适应新的API响应格式
    if (response && response.code === 200 && response.data) {
      rankings.value = response.data || []
    } else if (Array.isArray(response)) {
      // 兼容旧的API响应格式
      rankings.value = response || []
    } else {
      // 未知格式
      console.error('不支持的数据格式:', response)
      rankings.value = []
    }
  } catch (error) {
    console.error('加载排行榜失败:', error)
    ElMessage.error('加载失败')
    rankings.value = []
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
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.title {
  font-size: 18px;
  font-weight: 600;
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

.ranking-list {
  padding: 16px;
}

.ranking-item {
  background: white;
  margin-bottom: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
}

.item-content:active {
  opacity: 0.7;
}

.rank-badge {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
}

.rank-2 {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #333;
}

.rank-3 {
  background: linear-gradient(135deg, #cd7f32, #e8b87a);
  color: white;
}

.rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: #f5f5f5;
  color: #666;
}

.item-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #ff4757;
}

.sales {
  font-size: 12px;
  color: #999;
}

.trend {
  flex-shrink: 0;
}

.add-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: calc(100% - 24px);
  margin: 0 12px 12px 12px;
  padding: 10px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.add-cart-btn:active {
  opacity: 0.8;
}
/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 71, 87, 0.1);
  border-radius: 50%;
  border-top-color: #ff4757;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 14px;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 添加动画效果 */
.ranking-item {
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.trend {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.trend-icon {
  margin-bottom: 4px;
}

.trend-text {
  font-size: 12px;
  white-space: nowrap;
}
</style>
