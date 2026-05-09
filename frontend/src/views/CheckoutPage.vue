<template>
  <div class="w-full page max-w-md mx-auto bg-surface min-h-screen pb-24">
    <!-- 顶部导航 -->
    <div class="sticky top-0 z-50 glass border-b border-primary-100 px-4 py-3 flex items-center gap-3 max-w-md mx-auto">
      <button @click="$router.back()" class="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center press-effect">
        <ArrowLeft class="w-5 h-5 text-ink" />
      </button>
      <h1 class="text-lg font-semibold text-ink">确认订单</h1>
    </div>

    <div class="px-4 py-4 space-y-4">
      <!-- 地址选择 -->
      <div @click="handleAddressSelect" class="bg-white rounded-card p-4 shadow-card border border-primary-50 flex items-center gap-3 cursor-pointer press-effect">
        <MapPin class="w-6 h-6 text-primary flex-shrink-0" />
        <div v-if="selectedAddress" class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-ink">{{ selectedAddress.receiverName }}</span>
            <span class="text-sm text-ink-muted">{{ selectedAddress.phone }}</span>
            <span v-if="selectedAddress.isDefault" class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">默认</span>
          </div>
          <p class="text-xs text-ink-muted truncate">
            {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}
          </p>
        </div>
        <div v-else class="flex-1 text-ink font-medium">请选择收货地址</div>
        <ChevronRight class="w-5 h-5 text-ink-soft" />
      </div>

      <!-- 商品清单 -->
      <div class="bg-white rounded-card shadow-card border border-primary-50 overflow-hidden">
        <div class="px-4 py-3 border-b border-surface-muted bg-surface-muted/30">
          <h3 class="text-sm font-semibold text-ink">商品清单</h3>
        </div>
        <div class="p-4 space-y-4">
          <div v-for="item in checkoutItems" :key="item.id" class="flex gap-3">
            <img :src="item.productImage || item.mainImage" :alt="item.productTitle || item.title" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-ink line-clamp-2 mb-1">{{ item.productTitle || item.title }}</h4>
              <p v-if="item.skuSpecs" class="text-xs text-ink-muted">{{ formatSpecs(item.skuSpecs) }}</p>
              <div class="flex justify-between items-center mt-2">
                <span class="text-base font-display font-bold">¥{{ item.price }}</span>
                <span class="text-xs text-ink-muted">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 优惠券 -->
      <div class="bg-white rounded-card p-4 shadow-card border border-primary-50 flex justify-between items-center cursor-pointer press-effect">
        <div class="flex items-center gap-2">
          <Tag class="w-5 h-5 text-accent" />
          <span class="text-sm font-medium">优惠券</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-xs text-ink-muted">暂无可用</span>
          <ChevronRight class="w-4 h-4 text-ink-soft" />
        </div>
      </div>

      <!-- 订单备注 -->
      <div class="bg-white rounded-card p-4 shadow-card border border-primary-50">
        <div class="flex items-center gap-2 mb-3">
          <MessageSquare class="w-5 h-5 text-ink-muted" />
          <span class="text-sm font-medium">订单备注</span>
        </div>
        <textarea
          v-model="buyerMessage"
          placeholder="给商家留言（选填）"
          class="w-full h-20 bg-surface-muted rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
        ></textarea>
      </div>

      <!-- 费用明细 -->
      <div class="bg-white rounded-card p-4 shadow-card border border-primary-50 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-ink-muted">商品总额</span>
          <span class="font-display">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-ink-muted">运费</span>
          <span class="font-display">¥0.00</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-ink-muted">优惠减免</span>
          <span class="font-display text-danger">-¥0.00</span>
        </div>
        <div class="pt-2 border-t border-surface-muted flex justify-end items-baseline gap-2">
          <span class="text-sm font-medium">合计:</span>
          <span class="text-xl font-display font-bold text-primary">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-primary-100 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] flex items-center justify-between z-30">
      <div class="flex flex-col">
        <span class="text-xs text-ink-muted">合计:</span>
        <span class="text-xl font-display font-bold text-primary">¥{{ totalAmount.toFixed(2) }}</span>
      </div>
      <button
        @click="handleSubmit"
        :disabled="submitting || !selectedAddress"
        class="bg-primary text-white px-8 py-3 rounded-pill font-bold press-effect disabled:opacity-50 disabled:grayscale"
      >
        <span v-if="submitting">提交中...</span>
        <span v-else>提交订单</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MapPin, ChevronRight, Tag, MessageSquare } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { getAddresses } from '@/api/address'
import { createOrder } from '@/api/order'

const router = useRouter()
const route = useRoute()

const selectedAddress = ref<any>(null)
const checkoutItems = ref<any[]>([])
const buyerMessage = ref('')
const submitting = ref(false)

const totalAmount = computed(() => {
  return checkoutItems.value.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
})

const handleAddressSelect = () => {
  router.push('/addresses?select=1')
}

const formatSpecs = (specs: any) => {
  if (!specs) return ''
  if (typeof specs === 'string') return specs
  return Object.values(specs).join('/')
}

const loadData = async () => {
  try {
    // 加载地址
    const addresses = await getAddresses()
    if (addresses && addresses.length > 0) {
      selectedAddress.value = addresses.find((a: any) => a.isDefault) || addresses[0]
    }

    // 从路由或本地存储获取待结算商品
    const itemsJson = sessionStorage.getItem('checkout_items')
    if (itemsJson) {
      checkoutItems.value = JSON.parse(itemsJson)
    } else {
      ElMessage.warning('订单信息缺失')
      router.replace('/cart')
    }
  } catch (error) {
    ElMessage.error('初始化失败')
  }
}

const handleSubmit = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货Address')
    return
  }

  try {
    submitting.value = true
    const params = {
      addressId: selectedAddress.value.id,
      buyerMessage: buyerMessage.value,
      // 这里的逻辑可能需要根据后端接口调整，是传购物车ID还是商品详情
      cartItemIds: checkoutItems.value.map(item => item.id).filter(id => !id.startsWith('temp_')),
      // 如果是直接购买（非购物车），后端接口可能需要额外字段，或者我们可以先统一存入临时购物车
    }

    const order = await createOrder(params)
    ElMessage.success('订单创建成功')
    
    // 清除结算缓存
    sessionStorage.removeItem('checkout_items')
    
    // 跳转到订单列表或支付页
    router.replace(`/orders?status=PENDING_PAYMENT`)
  } catch (error: any) {
    ElMessage.error(error.message || '提交订单失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
