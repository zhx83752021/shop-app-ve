<template>
  <div class="detail-page max-w-md mx-auto relative">
    <!-- 顶部返回栏 -->
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <div class="header-actions">
        <Share2 class="w-5 h-5" />
        <MoreVertical class="w-5 h-5" />
      </div>
    </div>

    <!-- 商品图片轮播 -->
    <div class="product-images">
      <div class="swiper-container">
        <ImageWithFallback
          :src="product.mainImage || product.image || ''"
          :alt="product.title"
          class-name="product-img"
        />
      </div>
      <div class="image-indicator">1/1</div>
    </div>

    <!-- 价格信息 -->
    <div class="price-section">
      <div class="price-row">
        <span class="current-price">¥{{ product.price }}</span>
        <span class="original-price">¥{{ product.originalPrice }}</span>
      </div>
      <div class="sales-info">已售{{ product.sales }}件</div>
    </div>

    <!-- 商品标题 -->
    <div class="title-section">
      <h1 class="product-title">{{ product.title }}</h1>
      <div class="product-tags">
        <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

    <!-- 服务保障 -->
    <div class="service-section">
      <div class="service-item">
        <Shield class="w-4 h-4" />
        <span>正品保障</span>
      </div>
      <div class="service-item">
        <Truck class="w-4 h-4" />
        <span>免费配送</span>
      </div>
      <div class="service-item">
        <RefreshCcw class="w-4 h-4" />
        <span>7天退换</span>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="detail-section">
      <div class="section-title">商品详情</div>
      <div class="detail-content">
        <p>{{ product.description }}</p>
        <ImageWithFallback
          v-for="i in 3"
          :key="i"
          :src="`https://picsum.photos/800/600?random=${i}`"
          :alt="`商品详情图${i}`"
          class-name="detail-img"
        />
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <div class="bar-actions">
        <button class="action-btn">
          <Store class="w-5 h-5" />
          <span>店铺</span>
        </button>
        <button class="action-btn">
          <MessageCircle class="w-5 h-5" />
          <span>客服</span>
        </button>
        <button @click="toggleFavorite" class="action-btn">
          <Heart :class="['w-5 h-5', isFavorite ? 'fill-red-500 text-red-500' : '']" />
          <span>收藏</span>
        </button>
      </div>
      <div class="bar-buttons">
        <button @click="addToCart" class="btn-cart">加入购物车</button>
        <button @click="buyNow" class="btn-buy">立即购买</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Share2, MoreVertical, Shield, Truck, RefreshCcw, Store, MessageCircle, Heart } from 'lucide-vue-next'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import { ElMessage } from 'element-plus'
import { getProductById } from '@/api/product'
import { addToCart as addToCartAPI } from '@/api/cart'
import { addFavorite, removeFavorite, checkFavoriteStatus } from '@/api/user'

const route = useRoute()
const router = useRouter()

const product = ref<any>({
  id: '',
  title: '加载中...',
  price: 0,
  originalPrice: 0,
  image: '',
  mainImage: '',
  sales: 0,
  tags: [],
  description: '商品详情加载中...'
})

const isFavorite = ref(false)
const loading = ref(false)

// 加载商品详情
const loadProduct = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    const data = await getProductById(id)
    product.value = data

    // 检查收藏状态
    await checkFavorite(id)
  } catch (error) {
    console.error('加载商品失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 检查收藏状态
const checkFavorite = async (productId: string) => {
  try {
    const result = await checkFavoriteStatus(productId)
    isFavorite.value = result.isFavorite
  } catch (error) {
    console.error('检查收藏状态失败:', error)
    // 忽略错误，默认未收藏
    isFavorite.value = false
  }
}

const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await removeFavorite(product.value.id)
      ElMessage.success('已取消收藏')
    } else {
      await addFavorite(product.value.id)
      ElMessage.success('收藏成功')
    }
    isFavorite.value = !isFavorite.value
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const addToCart = async () => {
  try {
    await addToCartAPI(product.value.id, 1)
    ElMessage.success('已加入购物车')
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const buyNow = () => {
  addToCart()
  setTimeout(() => {
    router.push('/cart')
  }, 500)
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.product-images {
  position: relative;
  background: white;
}

.product-img {
  width: 100%;
  height: 375px;
  object-fit: cover;
}

.image-indicator {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0,0,0,0.5);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.price-section {
  background: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 28px;
  font-weight: bold;
  color: #ff4757;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.sales-info {
  font-size: 14px;
  color: #666;
}

.title-section {
  background: white;
  padding: 16px;
  margin-top: 8px;
}

.product-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 12px;
}

.product-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 8px;
  background: #fff3f3;
  color: #ff4757;
  border-radius: 4px;
  font-size: 12px;
}

.service-section {
  background: white;
  padding: 16px;
  margin-top: 8px;
  display: flex;
  justify-content: space-around;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
}

.detail-section {
  background: white;
  padding: 16px;
  margin-top: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.detail-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.detail-img {
  width: 100%;
  margin-bottom: 8px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 448px;
  margin: 0 auto;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  padding: 8px 16px;
  gap: 12px;
}

.bar-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  font-size: 11px;
  color: #666;
  cursor: pointer;
}

.bar-buttons {
  flex: 1;
  display: flex;
  gap: 8px;
}

.btn-cart, .btn-buy {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 24px;
  font-weight: 500;
  cursor: pointer;
}

.btn-cart {
  background: #ffd93d;
  color: #333;
}

.btn-buy {
  background: #ff4757;
  color: white;
}
</style>
