<template>
  <div class="product-list-container">
    <VirtualList
      :items="products"
      :item-height="itemHeight"
      :container-height="containerHeight"
      :buffer="5"
      :loading="loading"
      :no-more="noMore"
      @load-more="loadMore"
    >
      <template v-slot="{ item }">
        <div class="product-item">
          <div
            class="product-card"
            @click="navigateToDetail(item.id)"
          >
            <ImageWithFallback
              :src="item.image || item.mainImage"
              :alt="item.title"
              class-name="product-image"
              format="webp"
              :quality="85"
            />

            <div v-if="item.tag" class="product-tag" :class="`tag-${item.tag}`">
              {{ item.tag }}
            </div>

            <div class="product-info">
              <h3 class="product-title">{{ item.title }}</h3>
              <p class="product-desc">{{ item.description }}</p>
              <div class="product-price-row">
                <span class="product-price">¥{{ formatPrice(item.price) }}</span>
                <span v-if="item.originalPrice && item.originalPrice > item.price" class="product-original-price">
                  ¥{{ formatPrice(item.originalPrice) }}
                </span>
              </div>
              <div class="product-meta">
                <span class="product-sales">已售{{ formatSales(item.sales) }}</span>
                <div class="rating" v-if="item.rating">
                  <span class="star-rating">
                    <span
                      v-for="i in 5"
                      :key="i"
                      :class="['star', { 'filled': i <= Math.round(item.rating) }]"
                    >★</span>
                  </span>
                  <span class="rating-value">{{ item.rating.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            class="add-cart-btn"
            @click.stop="addToCart(item.id)"
          >
            <ShoppingCart class="w-4 h-4" />
          </button>
        </div>
      </template>
    </VirtualList>

    <div v-if="products.length === 0 && !loading" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>暂无商品</p>
      <p class="empty-desc">试试其他筛选条件吧</p>
    </div>

    <button
      v-if="showScrollTop"
      class="scroll-top-btn"
      @click="scrollToTop"
    >
      <ArrowUp class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowUp, ShoppingCart } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { addToCart as addToCartAPI } from '@/api/cart'
import VirtualList from './VirtualList.vue'
import ImageWithFallback from './ImageWithFallback.vue'

interface Props {
  products: any[]
  loading?: boolean
  noMore?: boolean
  itemHeight?: number
  containerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  noMore: false,
  itemHeight: 300,
  containerHeight: 600
})

const emit = defineEmits<{
  (e: 'load-more'): void
}>()

const router = useRouter()
const showScrollTop = ref(false)

// 商品详情跳转
const navigateToDetail = (id: string) => {
  router.push(`/product/${id}`)
}

// 加入购物车
const addToCart = async (productId: string) => {
  try {
    await addToCartAPI(productId, 1)
    ElMessage.success('已加入购物车')
  } catch (error) {
    console.error('加入购物车失败:', error)
    ElMessage.error('添加失败，请稍后重试')
  }
}

// 格式化价格
const formatPrice = (price: number) => {
  return typeof price === 'number' ? price.toFixed(2) : '0.00'
}

// 格式化销量
const formatSales = (sales: number) => {
  if (!sales) return '0'
  if (sales >= 10000) {
    return (sales / 10000).toFixed(1) + 'w'
  }
  return sales.toString()
}

// 处理加载更多
const loadMore = () => {
  if (props.loading || props.noMore) return
  emit('load-more')
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 处理滚动事件
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.product-list-container {
  position: relative;
  margin-bottom: 20px;
}

.product-item {
  padding: 12px;
  position: relative;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.product-card:active {
  transform: scale(0.98);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.product-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.tag-新品 {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.tag-热销 {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.tag-促销 {
  background: linear-gradient(135deg, #f39c12, #d35400);
}

.product-info {
  padding: 12px;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 36px;
}

.product-desc {
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.product-price {
  color: #ff4757;
  font-size: 18px;
  font-weight: bold;
}

.product-original-price {
  margin-left: 6px;
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-sales {
  font-size: 12px;
  color: #999;
}

.rating {
  display: flex;
  align-items: center;
}

.star-rating {
  color: #ddd;
  position: relative;
  display: inline-block;
  font-size: 14px;
}

.star {
  display: inline-block;
}

.star.filled {
  color: #f1c40f;
}

.rating-value {
  margin-left: 4px;
  font-size: 12px;
  color: #f1c40f;
}

.add-cart-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ff4757;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.add-cart-btn:hover {
  transform: scale(1.1);
}

.add-cart-btn:active {
  transform: scale(0.9);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-desc {
  color: #999;
  font-size: 14px;
  margin-top: 8px;
}

.scroll-top-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 71, 87, 0.9);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.scroll-top-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .product-image {
    height: 150px;
  }

  .product-title {
    font-size: 13px;
    height: 34px;
  }
}
</style>
