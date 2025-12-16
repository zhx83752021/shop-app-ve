<template>
  <div class="h-full overflow-y-auto overflow-x-hidden bg-gray-50">
    <!-- 头部 -->
    <div class="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-200">
      <h1 class="text-xl font-semibold">购物车 ({{ cartItems.length }})</h1>
    </div>

    <!-- 优惠券提示 -->
    <div
      v-if="availableCoupons > 0"
      class="bg-gradient-to-r from-orange-50 to-red-50 mx-4 mt-3 p-3 rounded-xl flex items-center gap-3"
    >
      <div class="bg-primary w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
        <Tag class="w-5 h-5 text-white" />
      </div>
      <div class="flex-1">
        <p class="text-sm">
          <span class="text-primary font-semibold">{{ availableCoupons }}张优惠券</span> 可用
        </p>
        <p class="text-xs text-gray-500">最高可省 ¥{{ maxCouponSavings }}</p>
      </div>
      <ChevronRight class="w-5 h-5 text-gray-400" />
    </div>

    <!-- 购物车列表 -->
    <div class="flex-1 overflow-auto pb-32">
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
              class="flex-shrink-0 mt-1"
            >
              <div
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  item.selected ? 'bg-primary border-primary' : 'border-gray-300'
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
              class-name="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />

            <!-- 商品信息 -->
            <div class="flex-1 flex flex-col">
              <h3 class="text-sm mb-1 line-clamp-2">{{ item.title }}</h3>
              <p class="text-xs text-gray-500 mb-2">{{ item.specs }}</p>
              <div class="flex items-end justify-between mt-auto">
                <div>
                  <div class="flex items-baseline gap-2">
                    <span class="text-primary font-semibold">¥{{ item.price }}</span>
                    <span class="text-xs text-gray-400 line-through">¥{{ item.originalPrice }}</span>
                  </div>
                </div>
                <!-- 数量控制 -->
                <div class="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                  <button
                    @click="updateQuantity(item.id, -1)"
                    class="w-6 h-6 flex items-center justify-center"
                    :disabled="item.quantity <= 1"
                  >
                    <Minus class="w-4 h-4 text-gray-600" />
                  </button>
                  <span class="text-sm w-6 text-center">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(item.id, 1)"
                    class="w-6 h-6 flex items-center justify-center"
                  >
                    <Plus class="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 删除按钮 -->
            <button
              @click="removeItem(item.id)"
              class="flex-shrink-0 self-start mt-1"
            >
              <Trash2 class="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <!-- 猜你喜欢 -->
      <div class="mt-4 bg-white px-4 py-4">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-5 bg-primary rounded-full"></div>
          <h2 class="text-lg font-semibold">猜你喜欢</h2>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="product in recommendProducts"
            :key="product.id"
            class="border border-gray-200 rounded-xl overflow-hidden"
          >
            <div class="relative">
              <ImageWithFallback
                :src="product.image"
                :alt="product.title"
                class-name="w-full h-40 object-cover"
              />
              <div class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {{ product.tag }}
              </div>
            </div>
            <div class="p-3">
              <p class="text-sm mb-2 line-clamp-2">{{ product.title }}</p>
              <div class="flex items-center justify-between">
                <span class="text-primary font-semibold">{{ product.price }}</span>
                <button
                  @click="addRecommendToCart(product.id)"
                  class="text-primary text-xs px-3 py-1 rounded-full border border-primary hover:bg-primary hover:text-white transition-colors"
                >
                  加购
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-safe max-w-md mx-auto">
      <!-- 优惠信息 -->
      <div class="flex items-center justify-between mb-2 text-xs">
        <span class="text-gray-600">已优惠</span>
        <span class="text-primary font-semibold">-¥{{ totalSavings }}</span>
      </div>

      <div class="flex items-center gap-3">
        <!-- 全选 -->
        <button
          @click="toggleSelectAll"
          class="flex items-center gap-2"
        >
          <div
            :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              allSelected ? 'bg-primary border-primary' : 'border-gray-300'
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
          <span class="text-sm">全选</span>
        </button>

        <!-- 合计 -->
        <div class="flex-1 flex items-baseline justify-end gap-1">
          <span class="text-sm text-gray-600">合计:</span>
          <span class="text-primary text-xs">¥</span>
          <span class="text-primary text-xl font-semibold">{{ totalPrice }}</span>
        </div>

        <!-- 结算按钮 -->
        <button
          :disabled="selectedItems.length === 0"
          :class="[
            'px-8 py-3 rounded-full text-white font-medium',
            selectedItems.length > 0 ? 'bg-primary active:bg-primary-dark' : 'bg-gray-300'
          ]"
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
import { ShoppingCart, Plus, Minus, Trash2, Tag, ChevronRight } from 'lucide-vue-next'
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

const cartItems = ref<CartItem[]>([])
const allSelected = ref(false)
const availableCoupons = ref(0)
const maxCouponSavings = ref(50)
const loading = ref(false)
const recommendProducts = ref<any[]>([])

// 加载购物车
const loadCart = async () => {
  try {
    loading.value = true
    const data = await getCart()

    // 转换后端数据结构为前端需要的格式
    cartItems.value = (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.product.title,
      image: item.product.mainImage,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      specs: '默认规格', // 后端暂无规格信息
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

// 加载推荐商品
const loadRecommendProducts = async () => {
  try {
    const data = await getRecommendProductsAPI()
    recommendProducts.value = (data || []).slice(0, 2).map((item: any) => ({
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

// 更新购物车数量
const updateQuantityAPI = async (id: number, delta: number) => {
  const item = cartItems.value.find(item => item.id === id)
  if (!item) return

  const newQuantity = Math.max(1, item.quantity + delta)
  try {
    await updateCartItemAPI(String(id), newQuantity)
    item.quantity = newQuantity
    ElMessage.success('已更新')
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('更新失败')
  }
}

// 删除购物车项
const removeItemAPI = async (id: number) => {
  try {
    await deleteCartItemAPI(String(id))
    const index = cartItems.value.findIndex(item => item.id === id)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
    }
    ElMessage.success('已删除')
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

// 全选/取消全选
const toggleSelectAllAPI = async () => {
  const newValue = !allSelected.value
  try {
    await selectAllAPI(newValue)
    allSelected.value = newValue
    cartItems.value.forEach(item => {
      item.selected = newValue
    })
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 添加推荐商品到购物车
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
