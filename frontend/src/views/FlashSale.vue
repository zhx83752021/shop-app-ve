<template>
  <div class="page max-w-md mx-auto relative">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">每日秒杀</h1>
      <div class="w-6"></div>
    </div>

    <div class="timer-section">
      <div class="timer-label">距离结束还剩</div>
      <div class="timer">
        <span class="time-unit">{{ hours }}</span>:
        <span class="time-unit">{{ minutes }}</span>:
        <span class="time-unit">{{ seconds }}</span>
      </div>
    </div>

    <div class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <div @click="$router.push(`/product/${product.id}`)">
          <ImageWithFallback
            :src="product.image"
            :alt="product.title"
            class-name="product-img"
          />
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <div class="price-row">
              <span class="flash-price">¥{{ product.flashPrice }}</span>
              <span class="original-price">¥{{ product.originalPrice }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: product.progress + '%' }"></div>
            </div>
            <div class="progress-text">已抢{{ product.progress }}%</div>
          </div>
        </div>
        <button
          @click.stop="handleFlashBuy(product.id)"
          class="buy-btn"
        >
          立即抢购
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ShoppingCart } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import { getFlashSaleProducts } from '@/api/product'
import { addToCart as addToCartAPI } from '@/api/cart'

const router = useRouter()

const hours = ref('02')
const minutes = ref('35')
const seconds = ref('48')
const loading = ref(true)

interface FlashSaleProduct {
  id: string
  image: string
  title: string
  flashPrice: number
  originalPrice: number
  progress: number
}

const products = ref<FlashSaleProduct[]>([])

let timer: number

// 加载秒杀商品数据
const loadFlashSaleProducts = async () => {
  try {
    loading.value = true
    const data = await getFlashSaleProducts(1, 20)

    products.value = data.items.map((p: any) => ({
      id: p.id,
      image: p.mainImage || 'https://picsum.photos/300/300',
      title: p.title,
      flashPrice: p.price,
      originalPrice: p.originalPrice,
      // 计算已售进度 (假设库存字段为stock，已售为sales)
      progress: p.stock > 0 ? Math.min(Math.round((p.sales / (p.sales + p.stock)) * 100), 99) : 95
    }))
  } catch (error) {
    console.error('加载秒杀商品失败:', error)
    ElMessage.error('加载失败，请稍后重试')

    // 失败时使用默认数据
    products.value = [
      {
        id: '1',
        image: 'https://picsum.photos/300/300?random=1',
        title: '限时秒杀商品',
        flashPrice: 99,
        originalPrice: 299,
        progress: 68
      }
    ]
  } finally {
    loading.value = false
  }
}

// 立即抢购
const handleFlashBuy = async (productId: string) => {
  try {
    await addToCartAPI(productId, 1)
    ElMessage.success('已加入购物车，去结算吧！')
    setTimeout(() => {
      router.push('/cart')
    }, 1000)
  } catch (error) {
    console.error('抢购失败:', error)
    ElMessage.error('抢购失败，请稍后重试')
  }
}

onMounted(() => {
  // 加载秒杀商品
  loadFlashSaleProducts()

  // 启动倒计时
  timer = window.setInterval(() => {
    let s = parseInt(seconds.value)
    let m = parseInt(minutes.value)
    let h = parseInt(hours.value)

    if (s > 0) {
      s--
    } else {
      s = 59
      if (m > 0) {
        m--
      } else {
        m = 59
        if (h > 0) {
          h--
        }
      }
    }

    hours.value = h.toString().padStart(2, '0')
    minutes.value = m.toString().padStart(2, '0')
    seconds.value = s.toString().padStart(2, '0')
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
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

.timer-section {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  padding: 20px;
  text-align: center;
  color: white;
}

.timer-label {
  font-size: 14px;
  margin-bottom: 8px;
}

.timer {
  font-size: 32px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  gap: 4px;
}

.time-unit {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 60px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:active {
  transform: scale(0.98);
}

.product-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.product-info {
  padding: 12px;
}

.product-title {
  font-size: 14px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.flash-price {
  font-size: 20px;
  font-weight: bold;
  color: #ff4757;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ff4757);
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

.buy-btn {
  width: calc(100% - 24px);
  margin: 0 12px 12px 12px;
  padding: 10px;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.buy-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>
