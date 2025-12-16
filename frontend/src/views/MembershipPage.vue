<template>
  <div class="page max-w-md mx-auto relative min-h-screen">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">会员专属</h1>
      <div class="w-6"></div>
    </div>

    <!-- 会员卡片 -->
    <div class="member-card">
      <div class="card-bg">
        <div class="card-content">
          <div class="member-level">
            <Crown class="w-6 h-6" />
            <span>黄金会员</span>
          </div>
          <div class="member-info">
            <p class="member-name">{{ userInfo.nickname || '尊贵的会员' }}</p>
            <p class="member-expire">有效期至 2025-12-31</p>
          </div>
          <div class="member-benefits">
            <div class="benefit-item">
              <span class="benefit-value">9.5折</span>
              <span class="benefit-label">会员折扣</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-value">880</span>
              <span class="benefit-label">积分</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-value">免运费</span>
              <span class="benefit-label">包邮特权</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 会员特权 -->
    <div class="section">
      <h2 class="section-title">会员特权</h2>
      <div class="privileges-grid">
        <div
          v-for="privilege in privileges"
          :key="privilege.id"
          class="privilege-card"
        >
          <component :is="privilege.icon" class="privilege-icon" />
          <p class="privilege-name">{{ privilege.name }}</p>
          <p class="privilege-desc">{{ privilege.desc }}</p>
        </div>
      </div>
    </div>

    <!-- 专属商品 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">专属商品</h2>
        <button class="more-btn" @click="$router.push('/products?member=true')">
          更多
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      <div class="products-grid">
        <div
          v-for="product in memberProducts"
          :key="product.id"
          class="product-card"
          @click="$router.push(`/product/${product.id}`)"
        >
          <ImageWithFallback
            :src="product.image"
            :alt="product.title"
            class-name="product-image"
          />
          <div class="member-badge">会员专享</div>
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <div class="product-price">
              <span class="current-price">¥{{ product.memberPrice }}</span>
              <span class="original-price">¥{{ product.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 升级会员 -->
    <div class="upgrade-section">
      <button class="upgrade-btn" @click="showUpgradeDialog = true">
        <Zap class="w-5 h-5" />
        升级至白金会员
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Crown, Zap, Gift, Truck, Tag, Heart, Star, ChevronRight } from 'lucide-vue-next'
import ImageWithFallback from '@/components/ImageWithFallback.vue'

const userInfo = ref({
  nickname: '会员用户'
})

const showUpgradeDialog = ref(false)

const privileges = [
  { id: 1, name: '专属折扣', desc: '全场9.5折', icon: Tag },
  { id: 2, name: '包邮特权', desc: '免运费', icon: Truck },
  { id: 3, name: '生日礼包', desc: '专属好礼', icon: Gift },
  { id: 4, name: '优先购买', desc: '新品首发', icon: Star },
  { id: 5, name: '积分翻倍', desc: '购物双倍积分', icon: Heart },
  { id: 6, name: '专属客服', desc: '1对1服务', icon: Crown }
]

const memberProducts = ref([
  {
    id: '1',
    title: 'Apple AirPods Pro 2代',
    image: 'https://placehold.co/300x300/667eea/FFF?text=AirPods+Pro',
    price: 1999,
    memberPrice: 1899
  },
  {
    id: '2',
    title: 'Nike Air Max 270',
    image: 'https://placehold.co/300x300/4ADE80/FFF?text=Nike+Air+Max',
    price: 1299,
    memberPrice: 1199
  },
  {
    id: '3',
    title: 'Dyson吹风机',
    image: 'https://placehold.co/300x300/3B9BFF/FFF?text=Dyson',
    price: 2990,
    memberPrice: 2690
  },
  {
    id: '4',
    title: 'SK-II神仙水',
    image: 'https://placehold.co/300x300/f093fb/FFF?text=SK-II',
    price: 1590,
    memberPrice: 1390
  }
])
</script>

<style scoped>
.page {
  background: #f5f5f5;
  padding-bottom: 80px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: white;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.member-card {
  margin: 16px;
}

.card-bg {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 8px 24px rgba(245, 87, 108, 0.3);
}

.member-level {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.member-info {
  margin-bottom: 20px;
}

.member-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.member-expire {
  font-size: 12px;
  opacity: 0.9;
}

.member-benefits {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.benefit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.benefit-value {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.benefit-label {
  font-size: 11px;
  opacity: 0.9;
}

.section {
  margin: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
}

.more-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  color: #666;
  font-size: 13px;
  cursor: pointer;
}

.privileges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.privilege-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.privilege-icon {
  width: 32px;
  height: 32px;
  color: #f5576c;
  margin: 0 auto 8px;
}

.privilege-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.privilege-desc {
  font-size: 11px;
  color: #999;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.member-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.product-info {
  padding: 12px;
}

.product-title {
  font-size: 13px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.current-price {
  color: #f5576c;
  font-size: 16px;
  font-weight: 700;
}

.original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.upgrade-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
  max-width: 448px;
  margin: 0 auto;
}

.upgrade-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.upgrade-btn:active {
  transform: scale(0.98);
}
</style>
