<template>
  <div class="w-full page max-w-md mx-auto bg-surface min-h-screen pb-10">
    <!-- 顶部导航栏 -->
    <div class="sticky top-0 z-50 glass border-b border-primary-100 px-4 py-3 max-w-md mx-auto">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" class="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center press-effect">
          <ArrowLeft class="w-5 h-5 text-ink" />
        </button>
        <h1 class="text-lg font-semibold text-ink">我的订单</h1>
      </div>
    </div>

    <!-- 状态筛选 -->
    <div class="bg-white sticky top-[53px] z-40 border-b border-surface-muted max-w-md mx-auto">
      <div class="flex overflow-x-auto no-scrollbar px-2">
        <button
          v-for="tab in tabs"
          :key="tab.status"
          @click="handleTabChange(tab.status)"
          :class="[
            'px-4 py-3 text-sm whitespace-nowrap transition-all relative',
            activeStatus === tab.status ? 'text-primary font-semibold' : 'text-ink-muted'
          ]"
        >
          {{ tab.label }}
          <div
            v-if="activeStatus === tab.status"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary rounded-full"
          ></div>
        </button>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="px-4 py-4 space-y-4">
      <div v-if="loading && orders.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="loading-spinner mb-4"></div>
        <p class="text-sm text-ink-muted">加载订单中...</p>
      </div>

      <div v-else-if="orders.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="bg-surface-muted w-20 h-20 rounded-full flex items-center justify-center mb-4">
          <PackageOpen class="w-10 h-10 text-ink-soft" />
        </div>
        <p class="text-ink-muted">暂无相关订单</p>
        <button @click="$router.push('/home')" class="mt-4 text-primary font-medium">去逛逛</button>
      </div>

      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-card shadow-card border border-primary-50 overflow-hidden"
      >
        <!-- 订单头部 -->
        <div class="px-4 py-3 border-b border-surface-muted flex justify-between items-center">
          <span class="text-xs text-ink-muted">订单号: {{ order.orderNo }}</span>
          <span :class="['text-xs font-medium', getStatusColor(order.status)]">
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <!-- 订单商品 -->
        <div class="p-4 space-y-3">
          <div v-for="item in order.items" :key="item.id" class="flex gap-3">
            <img :src="item.productImage" :alt="item.productTitle" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-ink truncate">{{ item.productTitle }}</h4>
              <p v-if="item.skuSpecs" class="text-xs text-ink-muted mt-0.5">
                {{ formatSpecs(item.skuSpecs) }}
              </p>
              <div class="flex justify-between items-center mt-2">
                <span class="text-sm font-display">¥{{ item.price }}</span>
                <span class="text-xs text-ink-muted">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单金额 -->
        <div class="px-4 py-3 bg-surface-muted/30 flex justify-end items-baseline gap-2">
          <span class="text-xs text-ink-muted">共{{ totalQuantity(order) }}件商品</span>
          <span class="text-sm">实付:</span>
          <span class="text-lg font-display font-bold text-primary">¥{{ order.actualAmount }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="px-4 py-3 flex justify-end gap-2 border-t border-surface-muted">
          <button
            v-if="order.status === 'PENDING_PAYMENT'"
            @click="handlePay(order)"
            class="px-5 py-1.5 rounded-full bg-primary text-white text-sm font-medium press-effect"
          >
            立即付款
          </button>
          <button
            v-if="order.status === 'SHIPPED'"
            @click="handleConfirm(order)"
            class="px-5 py-1.5 rounded-full bg-success text-white text-sm font-medium press-effect"
          >
            确认收货
          </button>
          <button
            v-if="['PENDING_PAYMENT', 'PENDING_SHIP'].includes(order.status)"
            @click="handleCancel(order)"
            class="px-5 py-1.5 rounded-full border border-surface-muted text-ink-muted text-sm press-effect"
          >
            取消订单
          </button>
          <button
            @click="$router.push(`/order/${order.id}`)"
            class="px-5 py-1.5 rounded-full border border-surface-muted text-ink text-sm press-effect"
          >
            查看详情
          </button>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="flex justify-center py-4">
        <button
          @click="loadMore"
          class="text-sm text-ink-muted flex items-center gap-1"
          :disabled="loading"
        >
          <span v-if="loading">加载中...</span>
          <span v-else>查看更多 <ChevronDown class="w-4 h-4" /></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, PackageOpen, ChevronDown } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrders, payOrder, confirmOrder, cancelOrder } from '@/api/order'

const route = useRoute()
const router = useRouter()

const activeStatus = ref(route.query.status as string || '')
const orders = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(false)

const tabs = [
  { label: '全部', status: '' },
  { label: '待付款', status: 'PENDING_PAYMENT' },
  { label: '待发货', status: 'PENDING_SHIP' },
  { label: '待收货', status: 'SHIPPED' },
  { label: '已完成', status: 'COMPLETED' },
  { label: '售后/退款', status: 'REFUNDING' },
]

const loadData = async (refresh = false) => {
  if (refresh) {
    page.value = 1
    orders.value = []
  }

  try {
    loading.value = true
    const response = await getOrders(activeStatus.value, page.value, 10)
    
    // 兼容分页响应格式
    const newItems = response.items || []
    orders.value = [...orders.value, ...newItems]
    
    const pagination = response.pagination
    hasMore.value = pagination ? pagination.page < pagination.totalPages : false
  } catch (error) {
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

const handleTabChange = (status: string) => {
  activeStatus.value = status
  router.replace({ query: { ...route.query, status } })
}

watch(() => activeStatus.value, () => {
  loadData(true)
})

const loadMore = () => {
  page.value++
  loadData()
}

const getStatusText = (status: string) => {
  const map: any = {
    PENDING_PAYMENT: '待付款',
    PENDING_SHIP: '待发货',
    SHIPPED: '已发货',
    COMPLETED: '已完成',
    CLOSED: '已关闭',
    REFUNDING: '退款中'
  }
  return map[status] || status
}

const getStatusColor = (status: string) => {
  const map: any = {
    PENDING_PAYMENT: 'text-accent',
    PENDING_SHIP: 'text-primary',
    SHIPPED: 'text-success',
    COMPLETED: 'text-ink-soft',
    CLOSED: 'text-ink-muted',
    REFUNDING: 'text-danger'
  }
  return map[status] || 'text-ink'
}

const formatSpecs = (specs: any) => {
  if (!specs) return ''
  if (typeof specs === 'string') return specs
  return Object.values(specs).join('/')
}

const totalQuantity = (order: any) => {
  return order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
}

const handlePay = async (order: any) => {
  try {
    await ElMessageBox.confirm('是否确认支付？', '订单支付', {
      confirmButtonText: '立即支付',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    await payOrder(order.id)
    ElMessage.success('支付成功')
    loadData(true)
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('支付失败')
  }
}

const handleConfirm = async (order: any) => {
  try {
    await ElMessageBox.confirm('是否确认收到商品？', '确认收货', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await confirmOrder(order.id)
    ElMessage.success('收货成功')
    loadData(true)
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('操作失败')
  }
}

const handleCancel = async (order: any) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入取消原因', '取消订单', {
      confirmButtonText: '提交',
      cancelButtonText: '取消',
      inputPlaceholder: '如：不想买了、选错规格等'
    })
    
    await cancelOrder(order.id, reason)
    ElMessage.success('订单已取消')
    loadData(true)
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('取消失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #ff4500;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
