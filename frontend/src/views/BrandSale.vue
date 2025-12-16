<template>
  <div class="page max-w-md mx-auto relative">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">品牌闪购</h1>
      <div class="w-6"></div>
    </div>

    <!-- 品牌列表 -->
    <div class="brands-container">
      <div
        v-for="(brand, index) in brands"
        :key="index"
        class="brand-card"
        @click="filterByBrand(brand.name)"
      >
        <ImageWithFallback
          :src="brand.logo"
          :alt="brand.name"
          class-name="brand-logo"
        />
        <div class="brand-name">{{ brand.name }}</div>
        <div class="brand-discount">{{ brand.discount }}</div>
      </div>
    </div>

    <!-- 闪购商品 -->
    <div class="section-title">
      <div class="title-line"></div>
      <h2>品牌特惠</h2>
      <div class="title-line"></div>
    </div>

    <div class="products-container">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <div
          @click="$router.push(`/product/${product.id}`)"
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
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';
import ImageWithFallback from '@/components/ImageWithFallback.vue';
import { getProducts } from '@/api/product';
import { addToCart as addToCartAPI } from '@/api/cart';

const brands = ref([
  {
    name: 'Apple',
    logo: 'https://placehold.co/120x120/000000/FFFFFF?text=Apple&font=roboto',
    discount: '8.5折'
  },
  {
    name: 'Samsung',
    logo: 'https://placehold.co/120x120/1428A0/FFFFFF?text=Samsung&font=roboto',
    discount: '7.5折'
  },
  {
    name: 'Nike',
    logo: 'https://placehold.co/120x120/FF6900/FFFFFF?text=Nike&font=roboto',
    discount: '6折起'
  },
  {
    name: 'Adidas',
    logo: 'https://placehold.co/120x120/000000/FFFFFF?text=Adidas&font=roboto',
    discount: '5折起'
  },
  {
    name: 'Huawei',
    logo: 'https://placehold.co/120x120/FF0000/FFFFFF?text=Huawei&font=roboto',
    discount: '8折'
  },
  {
    name: 'Xiaomi',
    logo: 'https://placehold.co/120x120/FF6900/FFFFFF?text=Xiaomi&font=roboto',
    discount: '7折'
  },
  {
    name: 'Puma',
    logo: 'https://placehold.co/120x120/000000/FFFFFF?text=Puma&font=roboto',
    discount: '6.5折'
  },
  {
    name: 'Sony',
    logo: 'https://placehold.co/120x120/0066CC/FFFFFF?text=Sony&font=roboto',
    discount: '8折'
  }
]);

const products = ref<any[]>([]);
const countdown = ref({
  hours: '02',
  minutes: '34',
  seconds: '56'
});

let countdownTimer: number | null = null;

const loadProducts = async () => {
  try {
    // 获取产品数据
    const response = await getProducts({
      page: 1,
      pageSize: 20
    });

    products.value = response.items.map((item: any) => {
      // 生成随机折扣
      const discountPercent = Math.floor(Math.random() * 50) + 30; // 30% - 80% 折扣
      const discount = `${discountPercent}%`;
      const originalPrice = item.price;
      const discountedPrice = Math.round(originalPrice * discountPercent / 100);

      return {
        id: item.id,
        title: item.title,
        brand: ['Apple', 'Samsung', 'Nike', 'Adidas', 'Huawei', 'Xiaomi', 'Puma', 'Sony'][
          Math.floor(Math.random() * 8)
        ],
        price: discountedPrice,
        originalPrice: originalPrice,
        discount: discount,
        image: item.mainImage
      };
    });
  } catch (error) {
    console.error('加载品牌闪购数据失败:', error);
    ElMessage.error('加载失败，请稍后重试');
  }
};

const addToCart = async (productId: string) => {
  try {
    await addToCartAPI(productId, 1);
    ElMessage.success('已加入购物车');
  } catch (error) {
    console.error('加入购物车失败:', error);
    ElMessage.error('添加失败，请稍后重试');
  }
};

const filterByBrand = (brandName: string) => {
  ElMessage.info(`筛选 ${brandName} 品牌商品`);
  // 这里可以实现品牌筛选逻辑
  // 例如：根据品牌名过滤products数组
};

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

onMounted(() => {
  loadProducts();
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
  background: #f5f5f5;
  padding-bottom: 80px;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
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
</style>
