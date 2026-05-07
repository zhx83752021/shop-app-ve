<template>
  <div class="h-full overflow-y-auto overflow-x-hidden relative bg-[#FDF8F5]">
    <!-- ===== 背景装饰 (Header Background Decoration) ===== -->
    <div class="fixed inset-x-0 top-0 h-[300px] pointer-events-none z-0 overflow-hidden">
      <!-- 顶部基础渐变 -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#FFF2E6] to-transparent"></div>
      <!-- 顶部艺术光晕 -->
      <div class="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
      <div class="absolute -top-10 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]"></div>
      <!-- 极简底纹 (Subtle Pattern) -->
      <div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(#FF4500 0.5px, transparent 0.5px); background-size: 24px 24px;"></div>
    </div>
    <!-- ===== 顶部搜索栏 ===== -->
    <div class="sticky top-0 z-20 px-4 py-3 bg-[#FDF8F5]/90 backdrop-blur-md border-b border-black/[0.03] transition-all duration-300">
      <div class="flex items-center gap-3">
        <!-- 品牌Logo -->
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <div class="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <ShoppingBag class="w-4 h-4 text-white" />
          </div>
          <span class="font-display font-bold text-ink text-sm tracking-tight">ShopNow</span>
        </div>
        <!-- 搜索框 -->
        <div class="relative flex-1">
          <div
            class="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-pill px-4 py-2 border border-white/50 focus-within:border-primary/50 focus-within:bg-white/90 transition-all duration-300 shadow-sm"
          >
            <Search class="w-4 h-4 text-ink-muted flex-shrink-0" />
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜手机、口红、运动鞋…"
              class="flex-1 bg-transparent border-none outline-none text-sm text-ink placeholder:text-ink-muted font-body"
              @keyup.enter="handleSearch"
              @focus="showSearchSuggestions = true"
              @blur="hideSearchSuggestions"
            />
          </div>
          <!-- 搜索建议下拉 -->
          <div
            v-if="showSearchSuggestions && searchSuggestions.length > 0"
            class="absolute left-0 right-0 mt-2 bg-white rounded-card shadow-float border border-primary-100 z-30 overflow-hidden animate-slide-up"
          >
            <button
              v-for="suggestion in searchSuggestions"
              :key="suggestion"
              @mousedown="selectSuggestion(suggestion)"
              class="w-full text-left px-4 py-3 hover:bg-primary-50 flex items-center gap-2.5 transition-colors press-effect cursor-pointer"
            >
              <Search class="w-4 h-4 text-ink-muted" />
              <!-- 搜索关键词高亮匹配 -->
              <span class="text-sm text-ink" v-html="highlightKeyword(suggestion, searchKeyword)"></span>
            </button>
          </div>
        </div>
        <!-- 消息图标 -->
        <button class="relative w-9 h-9 flex items-center justify-center flex-shrink-0 press-effect">
          <Bell class="w-5 h-5 text-ink-muted" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse-dot"></span>
        </button>
      </div>
    </div>

    <!-- ===== 横幅轮播 ===== -->
    <div class="px-4 pt-3 pb-2">
      <div class="relative overflow-hidden rounded-card h-44 shadow-card">
        <div
          v-for="(banner, index) in localBanners"
          :key="index"
          :class="[
            'absolute inset-0 transition-all duration-500',
            index === currentBanner ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          ]"
        >
          <img
            :src="banner.image"
            :alt="banner.title"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-cover"
          />
          <!-- Banner文字叠层（根据 maskDir 动态调整方向，文字落在图片空白区） -->
          <div
            :class="[
              'absolute inset-0 px-5 flex items-end pb-5',
              banner.maskDir === 'right'
                ? 'bg-gradient-to-l from-ink/70 via-ink/25 to-transparent justify-end text-right'
                : banner.maskDir === 'bottom'
                ? 'bg-gradient-to-t from-ink/75 via-ink/15 to-transparent justify-start'
                : 'bg-gradient-to-r from-ink/70 via-ink/25 to-transparent justify-start'
            ]"
          >
            <div class="text-white">
              <p class="text-xs font-medium opacity-80 mb-1">{{ banner.sub }}</p>
              <h2 class="font-display font-bold text-xl leading-tight">{{ banner.title }}</h2>
              <button class="mt-2.5 bg-white/90 text-primary text-xs font-semibold px-3 py-1.5 rounded-pill hover:bg-white transition press-effect cursor-pointer">
                {{ banner.cta }}
              </button>
            </div>
          </div>
        </div>
        <!-- 指示器 -->
        <div class="absolute bottom-3 right-4 flex gap-1.5">
          <button
            v-for="(_, index) in localBanners"
            :key="index"
            @click="currentBanner = index"
            :class="[
              'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
              index === currentBanner ? 'bg-white w-5' : 'bg-white/50 w-1.5'
            ]"
          />
        </div>
      </div>
    </div>

    <!-- ===== 金刚区（快捷入口）===== -->
    <div class="bg-white mx-4 mb-2 rounded-card px-4 py-4 shadow-card">
      <div class="grid grid-cols-4 gap-y-4 gap-x-2">
        <button
          v-for="(action, index) in quickActions"
          :key="index"
          @click="handleQuickAction(action)"
          class="flex flex-col items-center gap-1.5 press-effect group"
        >
          <div
            :style="{ background: action.bg }"
            class="w-12 h-12 rounded-[20px] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.12)] group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
          >
            <Icon :icon="action.iconName" :class="['w-7 h-7 relative z-10', action.iconColor]" />
          </div>
          <span class="text-xs text-ink font-medium group-hover:text-primary transition-colors">{{ action.label }}</span>
        </button>
      </div>
    </div>

    <!-- ===== 品牌专场 (Brand Grid) ===== -->
    <BrandGrid />

    <!-- ===== 直播热卖 ===== -->
    <div class="bg-white mx-4 mb-2 rounded-card p-4 shadow-card">
      <div class="section-header">
        <div class="section-title">
          <!-- 红点+直播标识 -->
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 bg-danger rounded-full animate-pulse-dot"></span>
            直播热卖
          </span>
        </div>
        <button class="section-more">更多 <ChevronRight class="w-4 h-4" /></button>
      </div>
      <div class="flex gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
        <div
          v-for="(live, index) in liveStreams"
          :key="index"
          class="flex-shrink-0 w-28 cursor-pointer press-effect"
          @click="$router.push('/live-stream')"
        >
          <div class="relative rounded-xl overflow-hidden">
            <img
              :src="live.cover"
              :alt="live.title"
              loading="lazy"
              decoding="async"
              class="w-full h-36 object-cover"
            />
            <!-- LIVE标签 -->
            <div class="absolute top-2 left-2 bg-danger text-white text-xs px-2 py-0.5 rounded-pill font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse-dot"></span>
              LIVE
            </div>
            <!-- 渐变遮层 -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/70 to-transparent p-2">
              <p class="text-white text-xs font-medium">{{ live.viewers }}人在看</p>
            </div>
          </div>
          <p class="text-xs text-ink mt-1.5 line-clamp-2 leading-tight">{{ live.title }}</p>
        </div>
      </div>
    </div>

    <!-- ===== 限时秒杀 ===== -->
    <div class="mx-4 mb-2 rounded-card overflow-hidden shadow-card">
      <!-- 标题栏：暗色渐变 -->
      <div class="bg-gradient-to-r from-[#1A1A2E] to-[#2D1818] px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Zap class="w-5 h-5 text-accent animate-pulse" />
          <span class="text-white font-display font-bold">限时秒杀</span>
          <!-- 倒计时 -->
          <div class="flex items-center gap-0.5 ml-1">
            <span class="bg-accent text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded">
              {{ countdown.hours }}
            </span>
            <span class="text-accent font-bold text-xs">:</span>
            <span class="bg-accent text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded">
              {{ countdown.minutes }}
            </span>
            <span class="text-accent font-bold text-xs">:</span>
            <span class="bg-accent text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded">
              {{ countdown.seconds }}
            </span>
          </div>
        </div>
        <button class="text-white/70 text-xs flex items-center gap-0.5 hover:text-white transition-colors">
          更多 <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>
      <!-- 商品横滑 -->
      <div class="bg-white px-3 py-3">
        <div class="flex gap-2.5 overflow-x-auto scrollbar-hide">
          <div
            v-for="product in products.slice(0, 5)"
            :key="product.id"
            @click="$router.push(`/product/${product.id}`)"
            class="flex-shrink-0 w-28 cursor-pointer press-effect group"
          >
            <div class="relative rounded-xl overflow-hidden mb-2">
              <img
                :src="product.image"
                :alt="product.title"
                loading="lazy"
                decoding="async"
                class="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-danger/80 to-transparent px-2 py-1.5">
                <p class="text-white text-xs font-medium">限量</p>
              </div>
            </div>
            <p class="text-xs text-ink line-clamp-1 mb-1">{{ product.title }}</p>
            <div class="flex items-baseline gap-1">
              <!-- 价格统一格式化，避免模板层字符替换 -->
              <span class="text-danger font-display font-bold text-sm">¥{{ formatDisplayPrice(product.price) }}</span>
            </div>
            <!-- 已抢购进度条 -->
            <div class="mt-1.5 h-1.5 bg-surface-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-danger to-accent rounded-full"
                :style="{ width: `${Math.floor(Math.random() * 40) + 50}%` }"
              ></div>
            </div>
            <p class="text-center text-danger text-xs mt-0.5 font-medium">已抢</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 为你推荐 ===== -->
    <div class="bg-white mx-4 mb-4 rounded-card p-4 shadow-card">
      <div class="section-header">
        <div class="section-title">为你推荐</div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          class="product-card cursor-pointer press-effect group animate-fade-in-up"
          :style="{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }"
          @click="$router.push(`/product/${product.id}`)"
        >
          <!-- 商品图 -->
          <div class="relative overflow-hidden">
            <img
              :src="product.image"
              :alt="product.title"
              loading="lazy"
              decoding="async"
              class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <!-- 标签 -->
            <span class="badge-new absolute top-2 left-2">{{ product.tag }}</span>
            <!-- 收藏按钮 -->
            <button
              @click.stop="toggleFavorite(product.id)"
              class="absolute top-2 right-2 w-8 h-8 glass rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors press-effect"
            >
              <Heart :class="['w-4 h-4 transition-colors', product.isFavorite ? 'fill-danger text-danger' : 'text-ink-muted']" />
            </button>
          </div>
          <!-- 商品信息 -->
          <div class="p-3">
            <h3 class="text-sm text-ink line-clamp-2 h-10 leading-snug mb-2">{{ product.title }}</h3>
            <div class="flex items-baseline gap-1.5 mb-1">
              <span class="price-tag text-lg">
                <span class="price-tag-symbol">¥</span>{{ formatDisplayPrice(product.price) }}
              </span>
              <span class="text-xs text-ink-muted line-through">{{ product.originalPrice }}</span>
            </div>
            <p class="text-xs text-ink-muted mb-2">{{ product.sales }}</p>
            <button
              @click.stop="addToCart(product.id)"
              class="btn-cart w-full text-xs py-1.5"
            >
              <ShoppingBag class="w-3.5 h-3.5" />
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
import { Search, ChevronRight, Zap, TrendingUp, Video, Gift, Crown, Award, Star, Heart, ShoppingBag, Bell } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'
import BrandGrid from '@/components/BrandGrid.vue'

/* 搜索关键词高亮（转义特殊字符，防止 XSS） */
const highlightKeyword = (text: string, keyword: string): string => {
  if (!keyword.trim()) return text
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="bg-primary-50 text-primary not-italic font-medium">$1</mark>'
  )
}

/* 价格统一格式化，消除模板层 replace 调用 */
const formatDisplayPrice = (price: any): string => {
  const num = parseFloat(String(price).replace(/[¥￥,\s]/g, ''))
  return isNaN(num) ? '0' : num % 1 === 0 ? String(num) : num.toFixed(2)
}
import { ElMessage } from 'element-plus'
import type { Product, Banner, QuickAction } from '@/types'
import { getBanners } from '@/api/banner'
import { getProducts, getSearchSuggestions } from '@/api/product'
import { addToCart as addToCartAPI } from '@/api/cart'
import { addFavorite, removeFavorite } from '@/api/user'

/* 导入生成的本地图片 */
import bannerNewArrivals from '@/assets/images/banner_new_arrivals.png'
import bannerFlashSale from '@/assets/images/banner_flash_sale.png'
import bannerBeauty from '@/assets/images/banner_beauty.png'

const router = useRouter()

/* 轮播相关状态 */
const currentBanner = ref(0)
const banners = ref<Banner[]>([])
const products = ref<Product[]>([])
const loading = ref(true)
const searchKeyword = ref('')
const showSearchSuggestions = ref(false)
const searchSuggestions = ref<string[]>([])
let timer: number | null = null
let suggestionTimer: number | null = null

/* 本地备用Banner（含文案+CTA+遮罩方向） */
/* maskDir: left=左侧遮罩(文字在左) | right=右侧遮罩(文字在右) | bottom=底部上升(文字在下) */
const localBanners = ref([
  { image: bannerNewArrivals, title: '新品首发', sub: '春夏新款已到货', cta: '立即查看', maskDir: 'left' },
  { image: bannerFlashSale,   title: '今日特价', sub: '低至 3 折 · 限量抢', cta: '立即抢购', maskDir: 'bottom' },
  { image: bannerBeauty,      title: '美妆专场', sub: '大牌正品 · 直邮到家', cta: '一键购', maskDir: 'right' },
])

/* 倒计时 */
const countdown = ref({ hours: '02', minutes: '34', seconds: '56' })

const updateCountdown = () => {
  let total = parseInt(countdown.value.hours) * 3600
    + parseInt(countdown.value.minutes) * 60
    + parseInt(countdown.value.seconds) - 1
  if (total < 0) total = 3 * 3600
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  countdown.value = {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  }
}

/* 直播数据（图片与文案语义一致，均使用 Pexels 图） */
const liveStreams = ref([
  {
    title: 'iPhone 15 Pro 直播超值优惠专场',
    /* 任务14：iPhone直播改用手机/数码类图片，替换与内容不符的本地生成图 */
    cover: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    viewers: '2.3万'
  },
  {
    title: '美妆护肤专场 大牌好物直播间',
    cover: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    viewers: '1.8万'
  },
  {
    title: 'Nike×Adidas运动鞋 全场5折起',
    cover: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    viewers: '3.5万'
  },
])

/* 金刚区数据 - 精确提取参考图色值，采用扁平化设计 */
const quickActions: any[] = [
  { iconName: 'solar:bolt-bold', label: '每日秒杀', bg: '#FF6200', iconColor: 'text-white' },
  { iconName: 'solar:tag-price-bold', label: '品牌闪购', bg: '#765DFF', iconColor: 'text-white' },
  { iconName: 'solar:play-circle-bold', label: '直播好物', bg: '#FF4D6A', iconColor: 'text-white' },
  { iconName: 'solar:ticket-sale-bold', label: '优惠券', bg: '#FFA500', iconColor: 'text-white' },
  { iconName: 'solar:crown-bold', label: '会员专属', bg: '#3E86FF', iconColor: 'text-white' },
  { iconName: 'solar:ranking-bold', label: '排行榜', bg: '#4CD964', iconColor: 'text-white' },
  { iconName: 'solar:star-bold', label: '新品首发', bg: '#FFCC00', iconColor: 'text-white' },
  { iconName: 'solar:heart-bold', label: '我的收藏', bg: '#B167FF', iconColor: 'text-white' },
]

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Zap, TrendingUp, Video, Gift, Crown, Award, Star, Heart,
  }
  return icons[iconName]
}

/* 金刚区点击处理 */
const handleQuickAction = (action: QuickAction) => {
  const routeMap: Record<string, string> = {
    '每日秒杀': '/flash-sale',
    '品牌闪购': '/brand-sale',
    '直播好物': '/live-stream',
    '优惠券': '/coupon-center',
    '会员专属': '/membership',
    '排行榜': '/ranking',
    '新品首发': '/new-products',
    '我的收藏': '/favorites'
  }
  const route = routeMap[action.label]
  if (route) router.push(route)
}

/* 加载数据 */
const loadData = async () => {
  try {
    loading.value = true
    const [bannersData, productsData] = await Promise.all([
      getBanners(),
      getProducts({ page: 1, pageSize: 20 })
    ])

    /* Banner：若API有数据则叠加，否则用本地图 */
    if (bannersData && bannersData.length > 0) {
      banners.value = bannersData.map((b: any) => ({
        id: b.id, image: b.image, title: b.title, link: b.link
      }))
    }

    /* 商品数据格式转换 */
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

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`)
  }
}

const selectSuggestion = (suggestion: string) => {
  searchKeyword.value = suggestion
  handleSearch()
}

const hideSearchSuggestions = () => {
  setTimeout(() => { showSearchSuggestions.value = false }, 200)
}

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
    ElMessage.error('操作失败，请稍后重试')
  }
}

const addToCart = async (productId: string) => {
  try {
    await addToCartAPI(productId, 1)
    ElMessage.success('已加入购物车')
  } catch (error) {
    ElMessage.error('添加失败，请稍后重试')
  }
}

/* 监听搜索关键词 */
watch(searchKeyword, (newValue) => {
  if (suggestionTimer) clearTimeout(suggestionTimer)
  if (newValue.trim().length > 0) {
    suggestionTimer = window.setTimeout(async () => {
      try {
        const suggestions = await getSearchSuggestions(newValue)
        searchSuggestions.value = Array.isArray(suggestions) ? suggestions : []
        showSearchSuggestions.value = true
      } catch {
        searchSuggestions.value = []
      }
    }, 300)
  } else {
    searchSuggestions.value = []
    showSearchSuggestions.value = false
  }
})

let countdownTimer: number | null = null

onMounted(() => {
  loadData()
  /* 启动轮播 */
  timer = window.setInterval(() => {
    if (localBanners.value.length > 0) {
      currentBanner.value = (currentBanner.value + 1) % localBanners.value.length
    }
  }, 4000)
  /* 启动倒计时 */
  countdownTimer = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer !== null) clearInterval(timer)
  if (suggestionTimer !== null) clearTimeout(suggestionTimer)
  if (countdownTimer !== null) clearInterval(countdownTimer)
})
</script>
