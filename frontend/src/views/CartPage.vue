<template>
  <div class="relative bg-surface min-h-full">
    <!-- 头部（统一 glass 效果） -->
    <div class="sticky top-0 z-10 glass border-b border-primary-100 px-4 py-3 noise-bg">
      <h1 class="text-lg font-display font-bold text-ink">
        购物车
        <span class="text-sm font-normal text-ink-muted ml-1">({{ cartItems.length }})</span>
      </h1>
    </div>

    <!-- 优惠券提示 -->
    <div
      v-if="availableCoupons > 0"
      class="bg-gradient-to-r from-primary-50 to-accent/10 mx-4 mt-3 p-3 rounded-card flex items-center gap-3 cursor-pointer"
    >
      <div class="bg-primary w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
        <Tag class="w-5 h-5 text-white" />
      </div>
      <div class="flex-1">
        <p class="text-sm">
          <span class="text-primary font-semibold">{{ availableCoupons }}张优惠券</span> 可用
        </p>
        <p class="text-xs text-ink-muted">最高可省 ¥{{ maxCouponSavings }}</p>
      </div>
      <ChevronRight class="w-5 h-5 text-ink-muted" />
    </div>

    <!-- 空购物车状态（任务8：插画引导） -->
    <div
      v-if="cartItems.length === 0 && !loading"
      class="flex flex-col items-center justify-center py-24 px-8"
    >
      <div class="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 relative">
        <div class="absolute inset-0 border border-primary/10 rounded-full animate-ping opacity-20"></div>
        <ShoppingBag class="w-10 h-10 text-primary/40" />
      </div>
      <h3 class="font-display font-bold text-ink text-lg mb-2">还没有商品</h3>
      <p class="text-ink-muted text-sm mb-6 text-center leading-relaxed">
        快去首页挑选你心仪的好物吧
      </p>
      <button
        @click="$router.push('/')"
        class="btn-primary px-8 cursor-pointer"
      >
        <ShoppingBag class="w-4 h-4" />
        去逛逛
      </button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="flex-1 overflow-auto pb-32">
      <div class="mt-3">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="bg-white mb-2 px-4 py-3"
        >
          <div class="flex gap-3">
            <!-- 选择框 -->
            <button
              @click="toggleSelect(item.id)"
              class="flex-shrink-0 mt-1 cursor-pointer"
            >
              <div
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                  item.selected ? 'bg-primary border-primary' : 'border-surface-muted bg-white'
                ]"
              >
                <svg
                  v-if="item.selected"
                  class="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </button>

            <!-- 商品图片 -->
            <ImageWithFallback
              :src="item.image"
              :alt="item.title"
              class-name="w-24 h-24 rounded-card object-cover flex-shrink-0"
            />

            <!-- 商品信息 -->
            <div class="flex-1 flex flex-col">
              <h3 class="text-sm mb-1 line-clamp-2 text-ink">{{ item.title }}</h3>
              <p class="text-xs text-ink-muted mb-2">{{ item.specs }}</p>
              <div class="flex items-end justify-between mt-auto">
                <div>
                  <div class="flex items-baseline gap-2">
                    <span class="price-tag text-base">¥{{ item.price }}</span>
                    <span class="text-xs text-ink-muted line-through">¥{{ item.originalPrice }}</span>
                  </div>
                </div>
                <!-- 数量控制 -->
                <div class="flex items-center gap-3 bg-surface-muted rounded-pill px-2 py-1">
                  <button
                    @click="updateQuantity(item.id, -1)"
                    class="w-6 h-6 flex items-center justify-center cursor-pointer press-effect"
                    :disabled="item.quantity <= 1"
                  >
                    <Minus class="w-4 h-4 text-ink-soft" />
                  </button>
                  <span class="text-sm w-6 text-center text-ink font-medium">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(item.id, 1)"
                    class="w-6 h-6 flex items-center justify-center cursor-pointer press-effect"
                  >
                    <Plus class="w-4 h-4 text-ink-soft" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 删除按钮 -->
            <button
              @click="removeItem(item.id)"
              class="flex-shrink-0 self-start mt-1 cursor-pointer press-effect"
            >
              <Trash2 class="w-5 h-5 text-ink-muted hover:text-danger transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <!-- 猜你喜欢 -->
      <div class="mt-4 bg-white px-4 py-4">
        <div class="section-header">
          <div class="section-title">猜你喜欢</div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="product in recommendProducts"
            :key="product.id"
            class="product-card cursor-pointer press-effect group"
          >
            <div class="relative overflow-hidden">
              <ImageWithFallback
                :src="product.image"
                :alt="product.title"
                class-name="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span class="badge-new absolute top-2 left-2">{{ product.tag }}</span>
            </div>
            <div class="p-3">
              <p class="text-sm mb-2 line-clamp-2 text-ink">{{ product.title }}</p>
              <div class="flex items-center justify-between">
                <span class="price-tag text-base">{{ product.price }}</span>
                <button
                  @click="addRecommendToCart(product.id)"
                  class="text-primary text-xs px-3 py-1 rounded-pill border border-primary hover:bg-primary hover:text-white transition-colors cursor-pointer press-effect"
                >
                  加购
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部结算栏（统一设计系统） -->
    <div class="fixed bottom-0 left-0 right-0 glass border-t border-primary-100 px-4 py-3 pb-safe max-w-md mx-auto shadow-bottom-bar">
      <!-- 优惠信息 -->
      <div class="flex items-center justify-between mb-2 text-xs">
        <span class="text-ink-muted">已优惠</span>
        <span class="text-danger font-semibold">-¥{{ totalSavings }}</span>
      </div>

      <div class="flex items-center gap-3">
        <!-- 全选 -->
        <button
          @click="toggleSelectAll"
          class="flex items-center gap-2 cursor-pointer"
        >
          <div
            :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
              allSelected ? 'bg-primary border-primary' : 'border-surface-muted bg-white'
            ]"
          >
            <svg
              v-if="allSelected"
              class="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span class="text-sm text-ink">全选</span>
        </button>

        <!-- 合计 -->
        <div class="flex-1 flex items-baseline justify-end gap-1">
          <span class="text-sm text-ink-muted">合计:</span>
          <span class="price-tag text-xs">¥</span>
          <span class="price-tag text-xl">{{ totalPrice }}</span>
        </div>

        <!-- 结算按钮 -->
        <button
          :disabled="selectedItems.length === 0"
          @click="handleCheckout"
          :class="[
            'px-8 py-3 rounded-pill text-white font-medium transition-all duration-200 cursor-pointer',
            selectedItems.length > 0 ? 'bg-primary hover:bg-primary-dark shadow-md press-effect' : 'bg-surface-muted text-ink-muted cursor-not-allowed'
          ]"
          :style="selectedItems.length > 0 ? 'box-shadow: 0 4px 16px rgba(255,69,0,0.35)' : ''"
        >
          结算 ({{ selectedItems.length }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, Plus, Minus, Trash2, Tag, ChevronRight, ShoppingBag } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import type { CartItem } from '@/types'
import {
  getCart,
  addToCart,
  updateCartItem as updateCartItemAPI,
  deleteCartItem as deleteCartItemAPI,
  selectAll as selectAllAPI,
  getRecommendProducts as getRecommendProductsAPI
} from '@/api/cart'

const router = useRouter()
const cartItems = ref<CartItem[]>([])
const allSelected = ref(false)
const availableCoupons = ref(0)
const maxCouponSavings = ref(50)
const loading = ref(false)
const recommendProducts = ref<any[]>([])

/* 加载购物车 */
const loadCart = async () => {
  try {
    loading.value = true
    const data = await getCart()

    /* 转换后端数据结构为前端需要的格式 */
    cartItems.value = (data.items || []).map((item: any) => ({
      id: item.id,
      productId: item.product.id,
      title: item.product.title,
      image: item.product.mainImage,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      specs: '默认规格',
      quantity: item.quantity,
      selected: item.selected
    }))
  } catch (error) {
    console.error('加载购物车失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

/* 加载推荐商品 */
const loadRecommendProducts = async () => {
  try {
    const data = await getRecommendProductsAPI()
    recommendProducts.value = (data || []).slice(0, 4).map((item: any) => ({
      id: item.id,
      image: item.mainImage || item.image,
      title: item.title || item.name,
      price: `¥${item.price}`,
      tag: '推荐'
    }))
  } catch (error) {
    console.error('加载推荐商品失败:', error)
  }
}

const updateQuantity = (id: number, delta: number) => {
  const item = cartItems.value.find(item => item.id === id)
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta)
  }
}

const toggleSelect = (id: number) => {
  const item = cartItems.value.find(item => item.id === id)
  if (item) {
    item.selected = !item.selected
  }
}

const toggleSelectAll = () => {
  const newValue = !allSelected.value
  allSelected.value = newValue
  cartItems.value.forEach(item => {
    item.selected = newValue
  })
}

const removeItem = (id: number) => {
  const index = cartItems.value.findIndex(item => item.id === id)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

const selectedItems = computed(() =>
  cartItems.value.filter(item => item.selected)
)

const totalPrice = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const totalSavings = computed(() =>
  selectedItems.value.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  )
)

/* 结算选中的商品 */
const handleCheckout = () => {
  if (selectedItems.value.length === 0) return
  
  const checkoutItems = selectedItems.value.map(item => ({
    id: item.id,
    productId: item.productId,
    productTitle: item.title,
    productImage: item.image,
    price: item.price,
    quantity: item.quantity,
    skuSpecs: item.specs
  }))
  
  sessionStorage.setItem('checkout_items', JSON.stringify(checkoutItems))
  router.push('/checkout')
}

/* 添加推荐商品到购物车 */
const addRecommendToCart = async (productId: number) => {
  try {
    await addToCart(String(productId), 1)
    ElMessage.success('已加入购物车')
    await loadCart()
  } catch (error) {
    console.error('加入购物车失败:', error)
    ElMessage.error('添加失败，请稍后重试')
  }
}

onMounted(() => {
  loadCart()
  loadRecommendProducts()
})
</script>
