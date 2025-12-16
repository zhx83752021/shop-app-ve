<template>
  <div
    ref="container"
    class="virtual-list-container"
    :style="{ height: containerHeight + 'px' }"
    @scroll="onScroll"
  >
    <div
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px' }"
    >
      <div
        class="virtual-list-items"
        :style="{ transform: `translateY(${startOffset}px)` }"
      >
        <slot
          v-for="item in visibleItems"
          :key="item.id || item._index"
          :item="item"
        />
      </div>
    </div>
    <div v-if="loading" class="loading-indicator">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-if="!loading && noMore" class="end-of-list">
      已经到底啦，没有更多了~
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface VirtualListProps {
  items: any[]
  itemHeight: number
  containerHeight: number
  buffer?: number
  loading?: boolean
  noMore?: boolean
  dynamicItemHeight?: boolean
}

// 定义属性
const props = withDefaults(defineProps<VirtualListProps>(), {
  buffer: 5,
  loading: false,
  noMore: false,
  dynamicItemHeight: false
})

// 定义事件
const emit = defineEmits<{
  (e: 'load-more'): void
}>()

// 滚动容器引用
const container = ref<HTMLElement | null>(null)

// 滚动位置
const scrollTop = ref(0)

// 计算总高度
const totalHeight = computed(() => {
  return props.items.length * props.itemHeight
})

// 计算开始索引
const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
})

// 计算结束索引
const endIndex = computed(() => {
  if (!container.value) return 0
  const visibleCount = Math.ceil(container.value.clientHeight / props.itemHeight)
  return Math.min(props.items.length - 1, startIndex.value + visibleCount + props.buffer * 2)
})

// 计算可见项目
const visibleItems = computed(() => {
  return props.items
    .slice(startIndex.value, endIndex.value + 1)
    .map((item, index) => {
      // 为每个项目添加索引，便于Vue的key绑定
      return {
        ...item,
        _index: startIndex.value + index
      }
    })
})

// 计算偏移量
const startOffset = computed(() => {
  return startIndex.value * props.itemHeight
})

// 监听滚动事件
const onScroll = () => {
  if (container.value) {
    scrollTop.value = container.value.scrollTop

    // 加载更多逻辑
    if (!props.loading &&
        !props.noMore &&
        container.value.scrollTop + container.value.clientHeight >=
        container.value.scrollHeight - 200) {
      emit('load-more')
    }
  }
}

// 滚动到指定索引项
const scrollToIndex = (index: number) => {
  if (container.value) {
    container.value.scrollTop = index * props.itemHeight
  }
}

// 滚动到顶部
const scrollToTop = () => {
  if (container.value) {
    container.value.scrollTop = 0
  }
}

// 提供方法给父组件使用
defineExpose({
  scrollToIndex,
  scrollToTop
})

// 初始化和销毁时的事件绑定
onMounted(() => {
  if (container.value) {
    // 如果浏览器支持ResizeObserver，可以监听容器大小变化
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        // 容器大小变化时重新计算可见项
        if (container.value) {
          scrollTop.value = container.value.scrollTop
        }
      })
      resizeObserver.observe(container.value)

      // 销毁时取消监听
      onUnmounted(() => {
        resizeObserver.disconnect()
      })
    }
  }
})

// 监听items变化，如果是首次加载或items完全改变，滚动到顶部
watch(() => props.items, (newItems, oldItems) => {
  if (!oldItems || oldItems.length === 0 || newItems.length < oldItems.length) {
    scrollToTop()
  }
}, { deep: false })
</script>

<style scoped>
.virtual-list-container {
  overflow-y: auto;
  position: relative;
  overflow-anchor: none;
}

.virtual-list-phantom {
  position: relative;
  width: 100%;
}

.virtual-list-items {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  color: #999;
  font-size: 14px;
  padding: 10px 0;
  position: relative;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 71, 87, 0.3);
  border-top-color: #ff4757;
  animation: spin 0.8s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.end-of-list {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px 0;
}
</style>
