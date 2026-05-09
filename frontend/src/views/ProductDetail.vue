<template>
  <div class="w-full detail-page max-w-md mx-auto relative bg-surface min-h-screen pb-24">
    <!-- ===== 顶部返回栏 ===== -->
    <div
      class="sticky top-0 z-20 transition-all duration-300"
      :class="scrolled ? 'glass border-b border-primary-100 shadow-card' : 'bg-transparent'"
    >
      <div class="flex justify-between items-center px-4 py-3">
        <button
          @click="$router.back()"
          :class="['w-9 h-9 rounded-full flex items-center justify-center press-effect transition-colors',
            scrolled ? 'bg-surface-muted' : 'bg-ink/30 backdrop-blur-sm']"
        >
          <ArrowLeft :class="['w-5 h-5', scrolled ? 'text-ink' : 'text-white']" />
        </button>
        <div v-if="scrolled" class="font-medium text-sm text-ink line-clamp-1 flex-1 mx-3">{{ product.title }}</div>
        <div class="flex items-center gap-2">
          <button
            :class="['w-9 h-9 rounded-full flex items-center justify-center press-effect',
              scrolled ? 'bg-surface-muted' : 'bg-ink/30 backdrop-blur-sm']"
          >
            <Share2 :class="['w-4 h-4', scrolled ? 'text-ink' : 'text-white']" />
          </button>
          <button
            :class="['w-9 h-9 rounded-full flex items-center justify-center press-effect',
              scrolled ? 'bg-surface-muted' : 'bg-ink/30 backdrop-blur-sm']"
          >
            <MoreVertical :class="['w-4 h-4', scrolled ? 'text-ink' : 'text-white']" />
          </button>
        </div>
      </div>
    </div>

    <!-- ===== 商品主图（轮播） ===== -->
    <div
      class="relative -mt-14 bg-white overflow-hidden"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <!-- 图片滑动轨道 -->
      <div
        class="flex transition-transform duration-300 ease-out"
        :style="{ transform: `translateX(-${activeImg * 100}%)` }"
      >
        <img
          v-for="(img, i) in allImages"
          :key="i"
          :src="img"
          :alt="`${product.title} - 图片${i + 1}`"
          loading="lazy"
          decoding="async"
          class="w-full h-80 object-cover flex-shrink-0"
        />
      </div>
      <!-- 图片底部渐变 -->
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none"></div>
      <!-- 图片计数器 -->
      <div class="absolute bottom-4 right-4 bg-ink/50 text-white text-xs px-3 py-1 rounded-pill backdrop-blur-sm">
        {{ activeImg + 1 }} / {{ allImages.length }}
      </div>
      <!-- 轮播指示点 -->
      <div v-if="allImages.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        <button
          v-for="(_, i) in allImages"
          :key="i"
          @click="activeImg = i"
          :class="[
            'h-1.5 rounded-full transition-all duration-300',
            i === activeImg ? 'bg-white w-5' : 'bg-white/50 w-1.5'
          ]"
        />
      </div>
    </div>

    <!-- ===== 价格 + 标题区 ===== -->
    <div class="bg-white mx-0 px-4 pt-4 pb-3">
      <!-- 价格行 -->
      <div class="flex items-end gap-3 mb-2">
        <div class="flex items-baseline gap-0.5">
          <span class="price-tag text-xs">¥</span>
          <span class="price-tag font-display text-3xl">{{ formatPrice(product.price) }}</span>
        </div>
        <span class="text-sm text-ink-muted line-through mb-0.5">¥{{ formatPrice(product.originalPrice) }}</span>
        <!-- 折扣标签 -->
        <span v-if="discountPercent" class="badge-sale mb-0.5">省{{ discountPercent }}元</span>
      </div>
      <!-- 销量信息 -->
      <div class="flex items-center gap-3 mb-3">
        <span class="text-xs text-ink-muted">已售 {{ product.sales }} 件</span>
        <!-- 星级评分 -->
        <div class="flex items-center gap-0.5">
          <Star v-for="i in 5" :key="i" class="w-3 h-3 fill-accent text-accent" />
          <span class="text-xs text-ink-muted ml-1">4.8</span>
        </div>
      </div>
      <!-- 商品标题 -->
      <h1 class="font-body text-base font-medium text-ink leading-snug mb-3">{{ product.title }}</h1>
      <!-- 标签组 -->
      <div class="flex gap-2 flex-wrap">
        <span v-for="tag in product.tags" :key="tag" class="badge-new">{{ tag }}</span>
      </div>
    </div>

    <!-- ===== 服务保障 ===== -->
    <div class="bg-white mt-2 px-4 py-3 flex items-center justify-around border-t border-surface-muted">
      <div class="flex items-center gap-1.5 text-xs text-ink-muted">
        <Shield class="w-4 h-4 text-success flex-shrink-0" />
        <span>正品保障</span>
      </div>
      <div class="w-px h-4 bg-surface-muted"></div>
      <div class="flex items-center gap-1.5 text-xs text-ink-muted">
        <Truck class="w-4 h-4 text-primary flex-shrink-0" />
        <span>免费配送</span>
      </div>
      <div class="w-px h-4 bg-surface-muted"></div>
      <div class="flex items-center gap-1.5 text-xs text-ink-muted">
        <RefreshCcw class="w-4 h-4 text-accent flex-shrink-0" />
        <span>7天退换</span>
      </div>
      <div class="w-px h-4 bg-surface-muted"></div>
      <div class="flex items-center gap-1.5 text-xs text-ink-muted">
        <CreditCard class="w-4 h-4 text-ink-muted flex-shrink-0" />
        <span>安全支付</span>
      </div>
    </div>

    <!-- ===== 商品详情 ===== -->
    <div class="bg-white mt-2 px-4 pt-4 pb-6">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-5 bg-primary rounded-full"></div>
        <h2 class="font-semibold text-ink">商品详情</h2>
      </div>
      <p class="text-sm text-ink-muted leading-relaxed mb-4">{{ product.description }}</p>
      <!-- 详情图（根据商品分类动态匹配，图文语义关联） -->
      <div class="space-y-2">
        <img
          v-for="(id, i) in detailImageIds"
          :key="i"
          :src="`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop`"
          :alt="`${product.title} - 详情${i + 1}`"
          loading="lazy"
          decoding="async"
          class="w-full rounded-xl object-cover"
        />
      </div>
    </div>

    <!-- ===== 底部操作栏 ===== -->
    <div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-primary-100 px-4 py-3 shadow-bottom-bar z-30">
      <div class="flex items-center gap-3">
        <!-- 快捷操作按钮组 -->
        <div class="flex items-center gap-4 mr-1">
          <button class="flex flex-col items-center gap-0.5 press-effect cursor-pointer">
            <Store class="w-5 h-5 text-ink-muted" />
            <span class="text-xs text-ink-muted">店铺</span>
          </button>
          <button class="flex flex-col items-center gap-0.5 press-effect cursor-pointer">
            <MessageCircle class="w-5 h-5 text-ink-muted" />
            <span class="text-xs text-ink-muted">客服</span>
          </button>
          <button @click="toggleFavorite" class="flex flex-col items-center gap-0.5 press-effect cursor-pointer">
            <Heart :class="['w-5 h-5 transition-colors', isFavorite ? 'fill-danger text-danger' : 'text-ink-muted']" />
            <span class="text-xs text-ink-muted">收藏</span>
          </button>
        </div>
        <!-- 分割线 -->
        <div class="w-px h-8 bg-surface-muted flex-shrink-0"></div>
        <!-- 主操作按钮 -->
        <div class="flex-1 flex gap-2">
          <button
            @click="addToCart"
            class="flex-1 py-3 rounded-pill font-medium text-sm text-primary border-2 border-primary hover:bg-primary-50 transition-colors press-effect cursor-pointer"
          >
            加入购物车
          </button>
          <button
            @click="buyNow"
            class="flex-1 py-3 rounded-pill font-medium text-sm text-white bg-primary hover:bg-primary-dark transition-colors press-effect cursor-pointer shadow-md"
            style="box-shadow: 0 4px 16px rgba(255,69,0,0.35)"
          >
            立即购买
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Share2, MoreVertical, Shield, Truck, RefreshCcw,
  Store, MessageCircle, Heart, Star, CreditCard
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { getProductById } from '@/api/product'
import { addToCart as addToCartAPI } from '@/api/cart'
import { addFavorite, removeFavorite, checkFavoriteStatus } from '@/api/user'
import { LOCAL_DEMO_PRODUCT_DETAIL_BY_ID, FAVORITES_LOCAL_DEMO_IDS_PREFIX } from '@/utils/favoritesLocalDemos'

const route = useRoute()
const router = useRouter()

/* 页面滚动状态（用于透明/实体顶栏切换） */
const scrolled = ref(false)
const handleScroll = () => {
  const el = document.querySelector('.detail-page')?.parentElement
  scrolled.value = (el?.scrollTop || 0) > 80
}

/* 图片轮播状态 */
const activeImg = ref(0)
let touchStartX = 0

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
}

const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 40) {
    if (dx < 0 && activeImg.value < allImages.value.length - 1) {
      activeImg.value++
    } else if (dx > 0 && activeImg.value > 0) {
      activeImg.value--
    }
  }
}

/* 按商品分类预设详情图 ID（高质量、主题贴合 Pexels 图） */
const CATEGORY_IMAGE_POOLS: Record<string, number[]> = {
  '手机':    [1092644,  607812, 1038000],
  '美妆':    [3373736, 2693617, 3825517],
  '运动':    [2529148, 1598505, 2048548],
  '服装':    [1536619, 1068349, 1536612],
  '数码':    [1779487, 5082579, 3825540],
  '食品':    [1640777, 1640772, 699953],
  'default': [5632399, 3735173, 1600698],
}

/* 根据商品标签动态匹配详情图 */
const detailImageIds = computed(() => {
  const primaryTag = product.value.tags?.[0]
  return CATEGORY_IMAGE_POOLS[primaryTag] || CATEGORY_IMAGE_POOLS['default']
})

/* 所有可展示图片：主图 + 分类匹配的详情图 */
const allImages = computed(() => {
  const mainImg = product.value.mainImage || product.value.image
  const detailImgs = detailImageIds.value.map(
    id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop`
  )
  return [mainImg, ...detailImgs].filter(Boolean)
})

const product = ref<any>({
  id: '', title: '加载中…', price: 0, originalPrice: 0,
  image: '', mainImage: '', sales: 0, tags: [], description: '商品详情加载中…'
})

const isFavorite = ref(false)
const loading = ref(false)
const hasError = ref(false)

/* 统一价格格式化，消除模板层 replace 调用 */
const formatPrice = (price: any): string => {
  if (price === undefined || price === null) return '0.00'
  const num = parseFloat(String(price).replace(/[¥￥,\s]/g, ''))
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

/* 计算节省金额 */
const discountPercent = computed(() => {
  const cur = parseFloat(String(product.value.price)) || 0
  const ori = parseFloat(String(product.value.originalPrice)) || 0
  const saved = ori - cur
  return saved > 0 ? saved.toFixed(0) : null
})

const isLocalDemoProductId = (pid: string) => String(pid).startsWith(FAVORITES_LOCAL_DEMO_IDS_PREFIX)

/* 加载商品详情 */
const loadProduct = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    const local = LOCAL_DEMO_PRODUCT_DETAIL_BY_ID[id]
    if (local) {
      product.value = { ...product.value, ...local }
      isFavorite.value = true
      await checkFavorite(id)
      return
    }
    const data = await getProductById(id)
    product.value = data
    await checkFavorite(id)
  } catch (error) {
    hasError.value = true
    product.value.title = '商品不存在或已下架'
    product.value.description = '您查看的商品可能已经被移除'
    ElMessage.error('商品不存在或已下架')
  } finally {
    loading.value = false
  }
}

const checkFavorite = async (productId: string) => {
  try {
    const result = await checkFavoriteStatus(productId)
    isFavorite.value = result.isFavorite
  } catch {
    isFavorite.value = false
  }
}

const toggleFavorite = async () => {
  if (isLocalDemoProductId(product.value.id)) {
    ElMessage.warning('示例商品无法改收藏状态')
    return
  }
  try {
    if (isFavorite.value) {
      await removeFavorite(product.value.id)
      ElMessage.success('已取消收藏')
    } else {
      await addFavorite(product.value.id)
      ElMessage.success('收藏成功')
    }
    isFavorite.value = !isFavorite.value
  } catch {
    ElMessage.error('操作失败')
  }
}

const addToCart = async () => {
  if (isLocalDemoProductId(product.value.id)) {
    ElMessage.warning('示例商品无法加购')
    return
  }
  try {
    await addToCartAPI(product.value.id, 1)
    ElMessage.success('已加入购物车')
  } catch {
    ElMessage.error('添加失败')
  }
}

const buyNow = () => {
  if (isLocalDemoProductId(product.value.id)) {
    ElMessage.warning('示例商品无法下单')
    return
  }
  const checkoutItem = {
    id: `temp_${Date.now()}`,
    productId: product.value.id,
    productTitle: product.value.title,
    productImage: product.value.mainImage || product.value.image,
    price: product.value.price,
    quantity: 1,
    skuSpecs: null // 后续可支持规格选择
  }
  
  sessionStorage.setItem('checkout_items', JSON.stringify([checkoutItem]))
  router.push('/checkout')
}

onMounted(() => {
  loadProduct()
  const scrollEl = document.querySelector('.detail-page')?.parentElement
  scrollEl?.addEventListener('scroll', handleScroll)
})

watch(
  () => route.params.id,
  () => {
    activeImg.value = 0
    scrolled.value = false
    loadProduct()
  }
)

onUnmounted(() => {
  const scrollEl = document.querySelector('.detail-page')?.parentElement
  scrollEl?.removeEventListener('scroll', handleScroll)
})
</script>
