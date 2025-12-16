<template>
  <div class="page max-w-md mx-auto relative min-h-screen bg-gray-50">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">我的收藏</h1>
      <button v-if="favorites.length > 0" class="edit-btn" @click="isEditing = !isEditing">
        {{ isEditing ? '完成' : '编辑' }}
      </button>
      <div v-else class="w-12"></div>
    </div>

    <!-- 收藏列表 -->
    <div v-if="favorites.length > 0" class="favorites-list">
      <div
        v-for="item in favorites"
        :key="item.id"
        class="favorite-item"
      >
        <div
          v-if="isEditing"
          class="checkbox-wrapper"
          @click="toggleSelect(item.id)"
        >
          <div :class="['checkbox', { checked: selectedItems.includes(item.id) }]">
            <Check v-if="selectedItems.includes(item.id)" class="w-4 h-4" />
          </div>
        </div>
        <div
          class="item-content"
          @click="!isEditing && $router.push(`/product/${item.id}`)"
        >
          <ImageWithFallback
            :src="item.image"
            :alt="item.title"
            class-name="item-image"
          />
          <div class="item-info">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-desc">{{ item.description }}</p>
            <div class="item-footer">
              <span class="item-price">¥{{ item.price }}</span>
              <button
                v-if="!isEditing"
                class="add-cart-btn"
                @click.stop="addToCart(item.id)"
              >
                <ShoppingCart class="w-4 h-4" />
                加购
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <Heart class="w-20 h-20 text-gray-300" />
      </div>
      <p class="empty-text">还没有收藏任何商品</p>
      <p class="empty-desc">快去发现心仪的好物吧</p>
      <button class="go-shopping-btn" @click="$router.push('/')">
        去逛逛
      </button>
    </div>

    <!-- 底部操作栏 -->
    <div v-if="isEditing && favorites.length > 0" class="bottom-bar">
      <label class="select-all">
        <input
          type="checkbox"
          :checked="isAllSelected"
          @change="toggleSelectAll"
        />
        <span>全选</span>
      </label>
      <button
        class="delete-btn"
        :disabled="selectedItems.length === 0"
        @click="deleteFavorites"
      >
        删除 {{ selectedItems.length > 0 ? `(${selectedItems.length})` : '' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, Heart, ShoppingCart, Check } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import { addToCart as addToCartAPI } from '@/api/cart'

interface FavoriteItem {
  id: string
  title: string
  description: string
  image: string
  price: number
}

const favorites = ref<FavoriteItem[]>([
  {
    id: '1',
    title: 'Apple iPhone 15 Pro Max',
    description: '钛金属设计，A17 Pro芯片',
    image: 'https://placehold.co/400x400/667eea/FFF?text=iPhone+15+Pro',
    price: 9999
  },
  {
    id: '2',
    title: 'Nike Air Jordan 1',
    description: '经典配色，限量发售',
    image: 'https://placehold.co/400x400/4ADE80/FFF?text=Air+Jordan+1',
    price: 1399
  },
  {
    id: '3',
    title: 'Sony WH-1000XM5 降噪耳机',
    description: '业界领先降噪技术',
    image: 'https://placehold.co/400x400/3B9BFF/FFF?text=Sony+WH-1000XM5',
    price: 2499
  },
  {
    id: '4',
    title: 'Dyson V15吸尘器',
    description: '激光探测微尘',
    image: 'https://placehold.co/400x400/FFD93D/333?text=Dyson+V15',
    price: 4990
  }
])

const isEditing = ref(false)
const selectedItems = ref<string[]>([])

const isAllSelected = computed(() => {
  return favorites.value.length > 0 &&
         selectedItems.value.length === favorites.value.length
})

const toggleSelect = (id: string) => {
  const index = selectedItems.value.indexOf(id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = favorites.value.map(item => item.id)
  }
}

const deleteFavorites = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的${selectedItems.value.length}件商品吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    favorites.value = favorites.value.filter(
      item => !selectedItems.value.includes(item.id)
    )
    selectedItems.value = []
    isEditing.value = false

    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

const addToCart = async (productId: string) => {
  try {
    await addToCartAPI(productId, 1)
    ElMessage.success('已加入购物车')
  } catch (error) {
    console.error('加入购物车失败:', error)
    ElMessage.error('添加失败，请稍后重试')
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 80px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn,
.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 15px;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.favorites-list {
  padding: 12px;
}

.favorite-item {
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.checkbox-wrapper {
  cursor: pointer;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox.checked {
  background: #ff4757;
  border-color: #ff4757;
  color: white;
}

.item-content {
  flex: 1;
  display: flex;
  gap: 12px;
  cursor: pointer;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  color: #ff4757;
  font-size: 18px;
  font-weight: 700;
}

.add-cart-btn {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-weight: 500;
}

.add-cart-btn:active {
  transform: scale(0.95);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.go-shopping-btn {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.go-shopping-btn:active {
  transform: scale(0.95);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #f0f0f0;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 448px;
  margin: 0 auto;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.select-all input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.delete-btn {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.delete-btn:disabled {
  background: #ddd;
  cursor: not-allowed;
}

.delete-btn:not(:disabled):active {
  transform: scale(0.95);
}
</style>
