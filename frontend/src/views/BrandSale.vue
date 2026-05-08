<template>
  <div class="page max-w-md mx-auto relative">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">品牌闪购</h1>
      <div class="w-6"></div>
    </div>

    <!-- 品牌馆（从首页迁入）：点击筛选下方闪购商品 -->
    <BrandGrid @select="onShowroomSelect" @clear-all="onShowroomClearAll" />

    <!-- 闪购商品 -->
    <div class="section-title">
      <div class="title-line"></div>
      <h2>{{ selectedBrand ? `${selectedBrand} 品牌特惠` : '品牌特惠' }}</h2>
      <div class="title-line"></div>
    </div>

    <div v-if="filteredProducts.length === 0" class="empty-container">
      <p class="empty-text">{{ selectedBrand ? '暂无该品牌商品' : '暂无可抢购商品' }}</p>
      <button type="button" @click="onShowroomClearAll" class="clear-filter-btn">查看全部商品</button>
    </div>

    <div v-else class="products-container">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <div
          @click="goProductPage(product.id)"
          class="product-image-container"
        >
          <ImageWithFallback
            :src="product.image"
            :alt="product.title"
            class-name="product-image"
          />
          <div class="discount-badge">{{ product.discount }}</div>
        </div>
        <div class="product-info">
          <div class="product-brand">{{ product.brand }}</div>
          <h3 class="product-title">{{ product.title }}</h3>
          <div class="product-prices">
            <span class="current-price">¥{{ product.price }}</span>
            <span class="original-price">¥{{ product.originalPrice }}</span>
          </div>
          <button
            @click="addToCart(product.id)"
            class="buy-button"
          >
            立即抢购
          </button>
        </div>
      </div>
    </div>

    <!-- 倒计时区域 -->
    <div class="countdown-container">
      <div class="countdown-title">距离本场结束</div>
      <div class="countdown-timer">
        <div class="time-unit">{{ countdown.hours }}</div>
        <div class="colon">:</div>
        <div class="time-unit">{{ countdown.minutes }}</div>
        <div class="colon">:</div>
        <div class="time-unit">{{ countdown.seconds }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';
import ImageWithFallback from '@/components/ImageWithFallback.vue';
import BrandGrid from '@/components/BrandGrid.vue';
import { getProducts } from '@/api/product';
import { addToCart as addToCartAPI } from '@/api/cart';
import { brandSaleDemoMeta, imageForShowroomBrand } from '@/utils/demoProductVisuals';

const route = useRoute();
const router = useRouter();

const SHOWROOM_BRANDS = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Huawei', 'Xiaomi', 'Puma', 'Sony'] as const;

function singleQueryBrand(q: unknown): string {
  if (typeof q === 'string' && q.trim()) return q.trim();
  if (Array.isArray(q) && q.length > 0) {
    const v = q[0];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

const products = ref<any[]>([]);
const selectedBrand = ref<string>(''); // 当前选中的品牌
const countdown = ref({
  hours: '02',
  minutes: '34',
  seconds: '56'
});

let countdownTimer: number | null = null;

const loadProducts = async () => {
  try {
    const response = await getProducts({
      page: 1,
      pageSize: 20
    });

    const items = Array.isArray((response as any)?.items) ? (response as any).items : [];
    let productList = items.map((item: any, index: number) => {
      const discountPercent = Math.floor(Math.random() * 50) + 30;
      const discount = `${discountPercent}%`;
      const originalPrice = Number(item.price);
      const discountedPrice = Math.round(originalPrice * discountPercent / 100);

      return {
        id: item.id,
        title: item.title,
        brand: SHOWROOM_BRANDS[index % SHOWROOM_BRANDS.length],
        price: discountedPrice,
        originalPrice: originalPrice,
        discount: discount,
        image: item.mainImage
      };
    });

    if (productList.length === 0) {
      productList = buildDemoBrandSaleProducts();
    }

    products.value = productList;
  } catch (error) {
    console.error('加载品牌闪购数据失败:', error);
    products.value = buildDemoBrandSaleProducts();
  }
};

/** 接口无商品时的占位（可浏览，加购会提示） */
function buildDemoBrandSaleProducts() {
  return brandSaleDemoMeta.map((row, index) => {
    const discountPercent = 40 + (index % 5) * 8;
    const original = 299 + index * 80;
    const price = Math.round(original * (discountPercent / 100));
    return {
      id: `demo-bs-${index + 1}`,
      title: row.title,
      brand: row.brand,
      price,
      originalPrice: original,
      discount: `${discountPercent}%`,
      image: imageForShowroomBrand(row.brand),
    };
  });
}

/** 当前选中品牌在列表里一条都没有时，把第一条改成该品牌，避免空白 */
function ensureSelectedBrandHasProducts() {
  const b = selectedBrand.value;
  if (!b || products.value.length === 0) return;
  if (products.value.some((p) => p.brand === b)) return;
  const first = products.value[0];
  products.value[0] = {
    ...first,
    brand: b,
    image: imageForShowroomBrand(b),
    title: typeof first.title === 'string' && first.title.includes(b) ? first.title : `${b} 馆热卖`,
  };
}

const addToCart = async (productId: string) => {
  if (String(productId).startsWith('demo-')) {
    ElMessage.warning('示例商品无法加购');
    return;
  }
  try {
    await addToCartAPI(productId, 1);
    ElMessage.success('已加入购物车');
  } catch (error) {
    console.error('加入购物车失败:', error);
    ElMessage.error('添加失败，请稍后重试');
  }
};

// 计算属性：根据选中品牌筛选商品
const filteredProducts = computed(() => {
  if (!selectedBrand.value) {
    return products.value;
  }
  return products.value.filter(product => product.brand === selectedBrand.value);
});

const filterByBrand = (brandName: string) => {
  if (selectedBrand.value === brandName) {
    // 如果点击已选中的品牌，则取消筛选
    selectedBrand.value = '';
  } else {
    selectedBrand.value = brandName;
  }
};

const clearFilter = () => {
  selectedBrand.value = '';
};

function goProductPage(id: string) {
  if (String(id).startsWith('demo-')) {
    ElMessage.warning('示例商品暂无详情页');
    return;
  }
  router.push(`/product/${id}`);
}

function syncBrandQuery() {
  if (selectedBrand.value) {
    router.replace({ path: '/brand-sale', query: { brand: selectedBrand.value } });
  } else {
    router.replace({ path: '/brand-sale' });
  }
}

function onShowroomSelect(name: string) {
  filterByBrand(name);
  ensureSelectedBrandHasProducts();
  syncBrandQuery();
}

function onShowroomClearAll() {
  clearFilter();
  syncBrandQuery();
}

watch(
  () => route.query.brand,
  (b) => {
    selectedBrand.value = singleQueryBrand(b);
    ensureSelectedBrandHasProducts();
  }
);

const startCountdown = () => {
  let totalSeconds = 2 * 60 * 60 + 34 * 60 + 56; // 初始倒计时：02:34:56

  countdownTimer = window.setInterval(() => {
    totalSeconds--;

    if (totalSeconds <= 0) {
      if (countdownTimer) clearInterval(countdownTimer);
      return;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdown.value = {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  }, 1000);
};

onMounted(async () => {
  await loadProducts();
  selectedBrand.value = singleQueryBrand(route.query.brand);
  ensureSelectedBrandHasProducts();
  startCountdown();
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  color: #1A1A2E;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #1A1A2E;
}

.title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.brands-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;
  background: white;
}

.brand-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.brand-card:active {
  transform: scale(0.95);
}

.brand-card.selected .brand-logo {
  box-shadow: 0 4px 12px rgba(255, 75, 43, 0.4);
}

.brand-card.selected .brand-name {
  color: #ff4b2b;
  font-weight: 600;
}

.brand-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: contain;
  background: white;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.brand-name {
  font-size: 12px;
  margin-top: 6px;
}

.brand-discount {
  font-size: 10px;
  color: #ff4b2b;
  font-weight: 600;
}

.section-title {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  margin-top: 12px;
}

.title-line {
  flex: 1;
  height: 1px;
  background: #f0f0f0;
}

.section-title h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 12px;
  color: #ff4b2b;
}

.products-container {
  padding: 0 16px 16px;
  background: white;
}

.product-card {
  margin-bottom: 16px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-image-container {
  position: relative;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4b2b;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.product-info {
  padding: 12px;
}

.product-brand {
  font-size: 12px;
  color: #777;
  margin-bottom: 4px;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-prices {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.current-price {
  font-size: 16px;
  font-weight: 700;
  color: #ff4b2b;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.buy-button {
  width: 100%;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.countdown-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-title {
  font-size: 12px;
  margin-bottom: 4px;
}

.countdown-timer {
  display: flex;
  align-items: center;
}

.time-unit {
  background: #ff4b2b;
  color: white;
  font-size: 14px;
  font-weight: 700;
  padding: 4px 6px;
  border-radius: 4px;
  min-width: 28px;
  text-align: center;
}

.colon {
  margin: 0 4px;
  font-weight: 700;
}

.empty-container {
  padding: 60px 16px;
  text-align: center;
  background: white;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.clear-filter-btn {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 75, 43, 0.4);
}
</style>
