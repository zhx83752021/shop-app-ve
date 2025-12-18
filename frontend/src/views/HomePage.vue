<template>
  <div class="h-full overflow-y-auto overflow-x-hidden bg-gray-50">
    <!-- 搜索栏 -->
    <div class="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-200">
      <div class="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
        <Search class="w-5 h-5 text-gray-400" />
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索商品、品牌、店铺"
          class="flex-1 bg-transparent border-none outline-none text-sm"
          @keyup.enter="handleSearch"
          @focus="showSearchSuggestions = true"
          @blur="hideSearchSuggestions"
        />
      </div>
      <!-- 搜索建议 -->
      <div
        v-if="showSearchSuggestions && searchSuggestions.length > 0"
        class="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
      >
        <button
          v-for="suggestion in searchSuggestions"
          :key="suggestion"
          @mousedown="selectSuggestion(suggestion)"
          class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
        >
          <Search class="w-4 h-4 text-gray-400" />
          <span class="text-sm">{{ suggestion }}</span>
        </button>
      </div>
    </div>

    <!-- 运营横幅 -->
    <div class="px-4 py-3">
      <div class="relative overflow-hidden rounded-2xl h-40">
        <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          :class="[
            'absolute inset-0 transition-opacity duration-500',
            index === currentBanner ? 'opacity-100' : 'opacity-0'
          ]"
        >
          <ImageWithFallback
            :src="banner.image"
            :alt="banner.title"
            class-name="w-full h-40 object-cover rounded-2xl"
          />
        </div>
        <!-- 指示器 -->
        <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          <button
            v-for="(_, index) in banners"
            :key="index"
            @click="currentBanner = index"
            :class="[
              'h-1.5 rounded-full transition-all',
              index === currentBanner ? 'bg-white w-6' : 'bg-white/50 w-1.5'
            ]"
          />
        </div>
      </div>
    </div>

    <!-- 金刚区 -->
    <div class="bg-white px-4 py-5 mb-2">
      <div class="grid grid-cols-4 gap-4">
        <button
          v-for="(action, index) in quickActions"
          :key="index"
          @click="handleQuickAction(action)"
          class="flex flex-col items-center gap-2 active:opacity-70 transition-opacity"
        >
          <div :class="['bg-gradient-to-br', action.gradient, 'w-12 h-12 rounded-2xl flex items-center justify-center shadow-md']">
            <component :is="getIcon(action.iconName)" class="w-6 h-6 text-white" />
          </div>
          <span class="text-xs text-gray-700">{{ action.label }}</span>
        </button>
      </div>
    </div>

    <!-- 动态模块 - 直播 -->
    <div class="bg-white px-4 py-4 mb-2">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-1 h-5 bg-primary rounded-full"></div>
          <h2 class="text-lg font-semibold">直播热卖</h2>
        </div>
        <button class="flex items-center gap-1 text-sm text-gray-500">
          更多 <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      <div class="flex gap-3 overflow-x-auto scrollbar-hide">
        <div v-for="(live, index) in liveStreams" :key="index" class="flex-shrink-0 w-32">
          <div class="relative">
            <ImageWithFallback
              :src="live.cover"
              :alt="live.title"
              class-name="w-full h-40 object-cover rounded-xl"
            />
            <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Video class="w-3 h-3" /> 直播中
            </div>
          </div>
          <p class="text-sm mt-2 line-clamp-2">{{ live.title }}</p>
          <p class="text-xs text-gray-500">{{ live.viewers }}人观看</p>
        </div>
      </div>
    </div>

    <!-- 秒杀模块 -->
    <div class="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-4 mb-2">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <Zap class="w-5 h-5 text-white" />
          <h2 class="text-lg text-white font-semibold">限时秒杀</h2>
          <div class="flex items-center gap-1 bg-white/20 text-white text-xs px-2 py-1 rounded">
            <span>距结束</span>
            <span class="bg-white text-red-500 px-1 rounded">02</span>:
            <span class="bg-white text-red-500 px-1 rounded">34</span>:
            <span class="bg-white text-red-500 px-1 rounded">56</span>
          </div>
        </div>
        <button class="text-white text-sm flex items-center gap-1">
          更多 <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      <div class="flex gap-3 overflow-x-auto scrollbar-hide">
        <div
          v-for="product in products.slice(0, 3)"
          :key="product.id"
          class="flex-shrink-0 w-28 bg-white rounded-xl p-2"
        >
          <ImageWithFallback
            :src="product.image"
            :alt="product.title"
            class-name="w-full h-28 object-cover rounded-lg mb-2"
          />
          <p class="text-xs line-clamp-2 mb-1">{{ product.title }}</p>
          <div class="flex items-baseline gap-1">
            <span class="text-red-500 text-xs">¥</span>
            <span class="text-red-500 font-semibold">{{ product.price.replace('¥', '') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品瀑布流 -->
    <div class="bg-white px-4 py-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-1 h-5 bg-primary rounded-full"></div>
          <h2 class="text-lg font-semibold">为你推荐</h2>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-xl overflow-hidden border border-gray-200 relative"
        >
          <div
            @click="$router.push(`/product/${product.id}`)"
            class="cursor-pointer active:opacity-70"
          >
            <div class="relative">
              <ImageWithFallback
                :src="product.image"
                :alt="product.title"
                class-name="w-full h-48 object-cover"
              />
              <div class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {{ product.tag }}
              </div>
              <button
                @click.stop="toggleFavorite(product.id)"
                class="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <Heart :class="['w-4 h-4', product.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600']" />
              </button>
            </div>
            <div class="p-3">
              <h3 class="text-sm mb-2 line-clamp-2 h-10">{{ product.title }}</h3>
              <div class="flex items-baseline gap-2 mb-1">
                <span class="text-primary font-semibold">{{ product.price }}</span>
                <span class="text-xs text-gray-400 line-through">{{ product.originalPrice }}</span>
              </div>
              <p class="text-xs text-gray-500">{{ product.sales }}</p>
            </div>
          </div>
          <div class="px-3 pb-3">
            <button
              @click="addToCart(product.id)"
              class="w-full bg-primary text-white text-sm py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-1"
            >
              <ShoppingBag class="w-4 h-4" />
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronRight, Zap, TrendingUp, Video, Gift, Crown, Award, Star, Heart, ShoppingBag } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import type { Product, Banner, QuickAction } from '@/types'
import { getBanners } from '@/api/banner'
import { getProducts, getSearchSuggestions } from '@/api/product'
import { addToCart as addToCartAPI } from '@/api/cart'
import { addFavorite, removeFavorite } from '@/api/user'

const router = useRouter()

const currentBanner = ref(0)
const banners = ref<Banner[]>([])
const products = ref<Product[]>([])
const loading = ref(true)
const searchKeyword = ref('')
const showSearchSuggestions = ref(false)
const searchSuggestions = ref<string[]>([])
let timer: number | null = null
let suggestionTimer: number | null = null

// 直播热卖数据
const liveStreams = ref([
  {
    title: 'Apple iPhone 15 Pro 超值优惠',
    cover: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop',
    viewers: '2.3万'
  },
  {
    title: '美妆护肤专场 大牌好物',
    cover: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    viewers: '1.8万'
  },
  {
    title: 'Nike运动鞋 全场5折起',
    cover: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    viewers: '3.5万'
  }
])

const quickActions: QuickAction[] = [
  { iconName: 'Zap', label: '每日秒杀', gradient: 'from-[#FF5A5F] to-[#FF5A5F]' },
  { iconName: 'TrendingUp', label: '品牌闪购', gradient: 'from-[#A78BFA] to-[#A78BFA]' },
  { iconName: 'Video', label: '直播好物', gradient: 'from-[#3B9BFF] to-[#3B9BFF]' },
  { iconName: 'Gift', label: '优惠券中心', gradient: 'from-[#FFD93D] to-[#FFD93D]' },
  { iconName: 'Crown', label: '会员专属', gradient: 'from-[#B4A0E5] to-[#B4A0E5]' },
  { iconName: 'Award', label: '排行榜', gradient: 'from-[#4ADE80] to-[#4ADE80]' },
  { iconName: 'Star', label: '新品首发', gradient: 'from-[#FB7185] to-[#FB7185]' },
  { iconName: 'Heart', label: '我的收藏', gradient: 'from-[#FF8A5C] to-[#FF8A5C]' },
]

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Zap,
    TrendingUp,
    Video,
    Gift,
    Crown,
    Award,
    Star,
    Heart,
  }
  return icons[iconName]
}

// 金刚区点击处理
const handleQuickAction = (action: QuickAction) => {
  const routeMap: Record<string, string> = {
    '每日秒杀': '/flash-sale',
    '品牌闪购': '/brand-sale',
    '直播好物': '/live-stream',
    '优惠券中心': '/coupon-center',
    '会员专属': '/membership',
    '排行榜': '/ranking',
    '新品首发': '/new-products',
    '我的收藏': '/favorites'
  }

  const route = routeMap[action.label]
  if (route) {
    router.push(route)
  } else {
    alert(`即将打开：${action.label}`)
  }
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    // 并行加载Banner和商品
    const [bannersData, productsData] = await Promise.all([
      getBanners(),
      getProducts({ page: 1, pageSize: 20 })
    ])

    // 转换Banner数据格式
    banners.value = bannersData.map((b: any) => ({
      id: b.id,
      image: b.image,
      title: b.title,
      link: b.link
    }))

    // 转换商品数据格式
    products.value = productsData.items.map((p: any) => ({
      id: p.id,
      image: p.mainImage,
      title: p.title,
      price: `￥${p.price}`,
      originalPrice: `￥${p.originalPrice}`,
      sales: `已售${p.sales > 10000 ? (p.sales / 10000).toFixed(1) + '万' : p.sales}`,
      tag: p.tags?.[0] || '推荐',
      isFavorite: false
    }))
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索功能
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`)
  }
}

// 选择搜索建议
const selectSuggestion = (suggestion: string) => {
  searchKeyword.value = suggestion
  handleSearch()
}

// 隐藏搜索建议（延迟以便点击生效）
const hideSearchSuggestions = () => {
  setTimeout(() => {
    showSearchSuggestions.value = false
  }, 200)
}

// 切换收藏状态
const toggleFavorite = async (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  if (!product) return

  try {
    if (product.isFavorite) {
      await removeFavorite(productId)
      product.isFavorite = false
      ElMessage.success('已取消收藏')
    } else {
      await addFavorite(productId)
      product.isFavorite = true
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
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

// 监听搜索关键词，获取搜索建议
watch(searchKeyword, (newValue) => {
  if (suggestionTimer) {
    clearTimeout(suggestionTimer)
  }

  if (newValue.trim().length > 0) {
    suggestionTimer = window.setTimeout(async () => {
      try {
        const suggestions = await getSearchSuggestions(newValue)
        searchSuggestions.value = Array.isArray(suggestions) ? suggestions : []
        showSearchSuggestions.value = true
      } catch (error) {
        console.error('获取搜索建议失败:', error)
        searchSuggestions.value = []
      }
    }, 300)
  } else {
    searchSuggestions.value = []
    showSearchSuggestions.value = false
  }
})

onMounted(() => {
  // 加载数据
  loadData()

  // 启动轮播定时器
  timer = window.setInterval(() => {
    if (banners.value.length > 0) {
      currentBanner.value = (currentBanner.value + 1) % banners.value.length
    }
  }, 3000)
})

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer)
  }
  if (suggestionTimer !== null) {
    clearTimeout(suggestionTimer)
  }
})
</script>
