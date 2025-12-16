<template>
  <div class="page max-w-md mx-auto relative">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">新品首发</h1>
      <div class="w-6"></div>
    </div>

    <div class="filters-bar">
      <div
        v-for="filter in filters"
        :key="filter.id"
        @click="activeFilter = filter.id"
        :class="['filter-item', activeFilter === filter.id ? 'active' : '']"
      >
        {{ filter.name }}
      </div>
    </div>

    <div class="products-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <div class="product-image-container">
          <ImageWithFallback
            :src="product.image"
            :alt="product.title"
            class-name="product-image"
          />
          <div class="new-badge">新品</div>
        </div>
        <div class="product-info">
          <h3 class="product-title">{{ product.title }}</h3>
          <p class="product-brief">{{ product.brief }}</p>
          <div class="product-meta">
            <span class="product-price">¥{{ product.price }}</span>
            <button @click="addToCart(product.id)" class="add-btn">
              <ShoppingCart class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ArrowLeft, ShoppingCart } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';
import ImageWithFallback from '@/components/ImageWithFallback.vue';
import { getProducts } from '@/api/product';
import { addToCart as addToCartAPI } from '@/api/cart';

const products = ref<any[]>([]);
const loading = ref(true);
const filters = [
  { id: 'all', name: '全部' },
  { id: 'latest', name: '最新上架' },
  { id: 'popular', name: '人气新品' },
  { id: 'tech', name: '科技新品' },
  { id: 'home', name: '家居新品' },
  { id: 'clothes', name: '服饰新品' }
];
const activeFilter = ref('all');

const loadProducts = async () => {
  try {
    loading.value = true;

    // 获取产品数据 - 根据 createdAt 降序排列获取最新产品
    const response = await getProducts({
      page: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    // 兼容不同的API响应格式
    const items = Array.isArray(response) ? response : (response.items || []);

    products.value = items.map((item: any) => ({
      id: item.id,
      title: item.title,
      brief: item.description ? item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '') : '暂无描述',
      price: item.price,
      image: item.mainImage || 'https://placehold.co/400x400?text=NoImage',
      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '新上架'
    }));
  } catch (error) {
    console.error('加载新品首发数据失败:', error);
    ElMessage.error('加载失败，请稍后重试');
  } finally {
    loading.value = false;
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

onMounted(() => {
  loadProducts();
});
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

.filters-bar {
  display: flex;
  overflow-x: auto;
  background: white;
  padding: 12px;
  gap: 12px;
  margin-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filters-bar::-webkit-scrollbar {
  display: none;
}

.filter-item {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  white-space: nowrap;
  border: 1px solid #eee;
  cursor: pointer;
}

.filter-item.active {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.products-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.product-image-container {
  position: relative;
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.new-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4757;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.product-info {
  padding: 12px;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  height: 2.6em;
}

.product-brief {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff4757;
}

.add-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #eee;
  border-top-color: #ff4757;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
