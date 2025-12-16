<template>
  <div class="page max-w-md mx-auto relative">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">优惠券中心</h1>
      <div class="w-6"></div>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab', { active: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div class="coupon-list">
      <div v-for="coupon in coupons" :key="coupon.id" class="coupon-card">
        <div class="coupon-left">
          <div class="coupon-amount">
            <span class="symbol">¥</span>
            <span class="value">{{ coupon.amount }}</span>
          </div>
          <div class="coupon-condition">满{{ coupon.condition }}可用</div>
        </div>
        <div class="coupon-right">
          <h3 class="coupon-title">{{ coupon.title }}</h3>
          <p class="coupon-desc">{{ coupon.description }}</p>
          <p class="coupon-time">有效期至：{{ coupon.expireDate }}</p>
          <button
            @click="receiveCoupon(coupon.id)"
            :class="['receive-btn', { received: coupon.received }]"
          >
            {{ coupon.received ? '已领取' : '立即领取' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { getCoupons, receiveCoupon as receiveCouponAPI } from '@/api/coupon'

const tabs = ['全部优惠券', '店铺券', '品类券', '新人券']
const currentTab = ref('全部优惠券')
const loading = ref(false)

interface Coupon {
  id: string
  amount: number
  condition: number
  title: string
  description: string
  expireDate: string
  received: boolean
}

const coupons = ref<Coupon[]>([])

// 加载优惠券列表
const loadCoupons = async () => {
  try {
    loading.value = true
    const data = await getCoupons()
    // 处理API返回的数据
    const items = (data as any).items || data || []
    coupons.value = items.map((c: any) => ({
      id: c.id,
      amount: c.amount,
      condition: c.minAmount,
      title: c.name,
      description: c.description,
      expireDate: new Date(c.endTime).toLocaleDateString('zh-CN'),
      received: c.isReceived || false
    }))
  } catch (error) {
    console.error('加载优惠券失败:', error)
    // 使用默认数据
    coupons.value = [
      {
        id: '1',
        amount: 50,
        condition: 299,
        title: '全品类通用券',
        description: '全场商品可用',
        expireDate: '2024.12.31',
        received: false
      }
    ]
  } finally {
    loading.value = false
  }
}

// 领取优惠券
const receiveCoupon = async (id: string) => {
  const coupon = coupons.value.find(c => c.id === id)
  if (!coupon) return

  if (coupon.received) {
    ElMessage.warning('该优惠券已领取')
    return
  }

  try {
    await receiveCouponAPI(id)
    coupon.received = true
    ElMessage.success('领取成功！')
  } catch (error) {
    console.error('领取优惠券失败:', error)
    ElMessage.error('领取失败，请稍后重试')
  }
}

onMounted(() => {
  loadCoupons()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.tabs {
  display: flex;
  background: white;
  padding: 12px 16px;
  gap: 16px;
  overflow-x: auto;
}

.tab {
  padding: 6px 16px;
  border-radius: 16px;
  background: none;
  border: 1px solid #ddd;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.coupon-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-card {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  position: relative;
}

.coupon-left {
  width: 120px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
}

.coupon-amount {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.symbol {
  font-size: 16px;
}

.value {
  font-size: 36px;
  font-weight: bold;
}

.coupon-condition {
  font-size: 12px;
}

.coupon-right {
  flex: 1;
  padding: 16px;
  background: white;
  position: relative;
}

.coupon-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.coupon-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.coupon-time {
  font-size: 11px;
  color: #999;
  margin-bottom: 12px;
}

.receive-btn {
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 6px 20px;
  border-radius: 16px;
  border: none;
  background: #ff4757;
  color: white;
  font-size: 12px;
  cursor: pointer;
}

.receive-btn.received {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
}
</style>
