<template>
  <div class="h-full overflow-y-auto overflow-x-hidden bg-gray-50">
    <!-- 用户信息卡片 -->
    <div class="bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 px-4 pt-12 pb-8">
      <div class="flex items-center gap-4 mb-6">
        <ImageWithFallback
          :src="userInfo?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop'"
          :alt="userInfo?.nickname || '用户'"
          class-name="w-16 h-16 rounded-full object-cover border-4 border-white/30"
        />
        <div class="flex-1 text-white">
          <h2 class="text-xl font-bold mb-1">{{ userInfo?.nickname || '未登录' }}</h2>
          <p class="text-sm text-white/80">{{ memberLevelText }}</p>
        </div>
        <ChevronRight class="w-6 h-6 text-white" />
      </div>

      <!-- 会员卡片 -->
      <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
        <div class="flex items-center justify-around text-white">
          <div class="text-center">
            <p class="text-sm mb-1 text-white/80">会员积分</p>
            <p class="text-2xl font-bold">{{ userInfo?.points || 0 }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm mb-1 text-white/80">账户余额</p>
            <p class="text-2xl font-bold">¥{{ userInfo?.balance || '0' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单追踪卡片 -->
    <div class="bg-white mx-4 -mt-4 rounded-2xl p-4 shadow-lg border border-gray-100 mb-3">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">我的订单</h3>
        <button
          @click="router.push('/orders')"
          class="text-sm text-gray-500 flex items-center gap-1 hover:text-primary transition-colors"
        >
          全部订单 <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="(item, index) in orderStatusItems"
          :key="index"
          @click="handleOrderClick(item.label)"
          class="flex flex-col items-center gap-2 py-2 active:opacity-70 transition-opacity relative"
        >
          <div class="relative">
            <component :is="getIcon(item.iconName)" :class="['w-6 h-6', item.color]" />
            <div
              v-if="item.count > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
            >
              {{ item.count }}
            </div>
          </div>
          <span class="text-xs text-gray-700">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- 资产卡片 -->
    <div class="bg-white mx-4 rounded-2xl p-4 mb-3">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">我的资产</h3>
      </div>
      <div class="grid grid-cols-4 gap-3">
        <button
          v-for="(item, index) in assetItems"
          :key="index"
          @click="handleAssetClick(item.label)"
          class="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div :class="['bg-gradient-to-br', item.gradient, 'w-10 h-10 rounded-full flex items-center justify-center']">
            <component :is="getIcon(item.iconName)" class="w-5 h-5 text-white" />
          </div>
          <span class="text-xs text-gray-700">{{ item.label }}</span>
          <span class="text-xs text-gray-900 font-medium">{{ item.value }}</span>
        </button>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="bg-white mx-4 rounded-2xl mb-3 overflow-hidden">
      <div class="px-4 pt-4 pb-2">
        <h3 class="text-sm text-gray-500">常用功能</h3>
      </div>
      <div>
        <button
          v-for="(item, index) in menuItems"
          :key="index"
          @click="handleMenuClick(item)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 transition-colors',
            index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
          ]"
        >
          <component :is="getIcon(item.iconName)" :class="['w-5 h-5', item.color]" />
          <span class="flex-1 text-left">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
          >
            {{ item.badge }}
          </span>
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  Tag,
  Heart,
  MapPin,
  Settings,
  Headphones,
  ChevronRight,
  ShoppingBag,
  Clock,
  RotateCcw,
  LogOut,
  Wallet
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import type { OrderStatus, AssetItem, MenuItem } from '@/types'
import { getUserProfile } from '@/api/user'
import { getOrders } from '@/api/order'
import { getMyCoupons } from '@/api/coupon'
import { getFavorites } from '@/api/user'

const router = useRouter()
const userInfo = ref<any>(null)
const orderCounts = ref({ PENDING_PAYMENT: 0, PENDING_SHIPMENT: 0, PENDING_RECEIVE: 0, PENDING_REVIEW: 0, REFUNDING: 0 })
const couponCount = ref(0)
const favoriteCount = ref(0)

const loadUserProfile = async () => {
  try {
    const data = await getUserProfile()
    userInfo.value = data
  } catch (error) {
    console.error('加载用户信息失败:', error)
    router.push('/login')
  }
}

const loadOrderStats = async () => {
  try {
    const statuses = ['PENDING_PAYMENT', 'PENDING_SHIPMENT', 'PENDING_RECEIVE', 'PENDING_REVIEW', 'REFUNDING']
    for (const status of statuses) {
      const data = await getOrders(status, 1, 1)
      orderCounts.value[status as keyof typeof orderCounts.value] = data.pagination.total
    }
  } catch (error) {
    console.error('加载订单统计失败:', error)
  }
}

const loadCouponCount = async () => {
  try {
    const data = await getMyCoupons('UNUSED', 1, 1)
    couponCount.value = data.pagination.total
  } catch (error) {
    console.error('加载优惠券数量失败:', error)
  }
}

const loadFavoriteCount = async () => {
  try {
    const data = await getFavorites(1, 1)
    favoriteCount.value = data.pagination.total
  } catch (error) {
    console.error('加载收藏数量失败:', error)
  }
}

// 订单状态点击
const handleOrderClick = (label: string) => {
  const statusMap: Record<string, string> = {
    '待付款': 'PENDING_PAYMENT',
    '待发货': 'PENDING_SHIPMENT',
    '待收货': 'PENDING_RECEIVE',
    '待评价': 'PENDING_REVIEW',
    '退换货': 'REFUNDING'
  }
  const status = statusMap[label]
  if (status) {
    router.push(`/orders?status=${status}`)
  }
}

// 资产点击
const handleAssetClick = (label: string) => {
  const routeMap: Record<string, string> = {
    '余额': '/wallet',
    '优惠券': '/coupon-center',
    '收藏': '/favorites',
    '积分': '/points'
  }
  const route = routeMap[label]
  if (route) {
    router.push(route)
  }
}

// 菜单点击
const handleMenuClick = (item: MenuItem) => {
  if (item.iconName === 'LogOut') {
    handleLogout()
    return
  }

  const routeMap: Record<string, string> = {
    'MapPin': '/addresses',
    'Settings': '/settings',
    'Headphones': '/contact-service'
  }

  const route = routeMap[item.iconName]
  if (route) {
    router.push(route)
  } else {
    ElMessage.info(`${item.label}功能开发中`)
  }
}

const orderStatusItems = computed<OrderStatus[]>(() => [
  { iconName: 'Wallet', label: '待付款', count: orderCounts.value.PENDING_PAYMENT, color: 'text-orange-500' },
  { iconName: 'Package', label: '待发货', count: orderCounts.value.PENDING_SHIPMENT, color: 'text-blue-500' },
  { iconName: 'Truck', label: '待收货', count: orderCounts.value.PENDING_RECEIVE, color: 'text-green-500' },
  { iconName: 'CheckCircle', label: '待评价', count: orderCounts.value.PENDING_REVIEW, color: 'text-yellow-500' },
  { iconName: 'RotateCcw', label: '退换货', count: orderCounts.value.REFUNDING, color: 'text-red-500' },
])

const assetItems = computed<AssetItem[]>(() => [
  { iconName: 'Wallet', label: '余额', value: `¥${userInfo.value?.balance || '0'}`, gradient: 'from-orange-400 to-orange-500' },
  { iconName: 'Tag', label: '优惠券', value: `${couponCount.value}张`, gradient: 'from-red-400 to-red-500' },
  { iconName: 'Heart', label: '收藏', value: String(favoriteCount.value), gradient: 'from-pink-400 to-pink-500' },
  { iconName: 'Clock', label: '积分', value: String(userInfo.value?.points || 0), gradient: 'from-blue-400 to-blue-500' },
])

const menuItems: MenuItem[] = [
  { iconName: 'MapPin', label: '收货地址', color: 'text-blue-500' },
  { iconName: 'Settings', label: '账号设置', color: 'text-gray-600' },
  { iconName: 'Headphones', label: '联系客服', color: 'text-green-500' },
  { iconName: 'LogOut', label: '退出登录', color: 'text-red-500' },
]

const handleLogout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_info')
  router.push('/login')
}

const memberLevelText = computed(() => {
  const level = userInfo.value?.memberLevel || 'BRONZE'
  const levelMap: Record<string, string> = {
    BRONZE: '青铜会员',
    SILVER: '白银会员',
    GOLD: '黄金会员',
    PLATINUM: '铂金会员',
    DIAMOND: '钻石会员'
  }
  return levelMap[level] || '普通会员'
})

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Wallet, ShoppingBag, Package, Truck, CheckCircle, RotateCcw,
    Tag, CreditCard, Heart, Clock, MapPin, Settings, Headphones, LogOut
  }
  return icons[iconName]
}

onMounted(async () => {
  await Promise.all([
    loadUserProfile(),
    loadOrderStats(),
    loadCouponCount(),
    loadFavoriteCount()
  ])
})
</script>
