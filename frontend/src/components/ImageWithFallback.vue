<template>
  <div
    ref="imageContainer"
    :class="['image-container', className, {'loaded': !isLoading && !hasError, 'error': hasError}]"
  >
    <div v-if="hasError" class="image-placeholder">
      <span class="placeholder-text">图片加载失败</span>
    </div>
    <img
      v-else
      :src="optimizedSrc"
      :alt="alt"
      class="image-el"
      :class="{'visible': !isLoading}"
      @error="handleError"
      @load="handleLoad"
    />
    <!-- 骨架屏占位符 -->
    <div v-if="isLoading && !hasError" class="skeleton-loader"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

interface Props {
  src: string
  alt: string
  className?: string
  quality?: number  // 图片质量参数 (1-100)
  width?: number    // 指定宽度
  height?: number   // 指定高度
  format?: string   // 图片格式: 'webp' | 'jpeg' | 'png' | 'avif' | 'original'
}

const props = withDefaults(defineProps<Props>(), {
  quality: 80,
  format: 'original' // 默认不优化，直接使用原始URL
})

const imageContainer = ref<HTMLElement | null>(null)
const hasError = ref(false)
const isLoading = ref(true)
const isIntersecting = ref(false)

// 是否支持WebP格式
const supportsWebp = ref(false)

// 检查浏览器是否支持WebP
onMounted(() => {
  const canvas = document.createElement('canvas')
  supportsWebp.value = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
})

// 优化图片URL
const optimizedSrc = computed(() => {
  // 如果没有URL，直接返回
  if (!props.src) {
    return ''
  }

  // 如果是data URL、外部URL或不需要优化，直接返回原始URL
  if (props.src.startsWith('data:') ||
      props.src.startsWith('http://') ||
      props.src.startsWith('https://') ||
      props.format === 'original') {
    return props.src
  }

  // 只对本地路径进行优化
  try {
    // 确保以/开头的本地路径
    let localPath = props.src
    if (!localPath.startsWith('/')) {
      localPath = '/' + localPath
    }

    const url = new URL(localPath, window.location.origin)

    // 判断图片格式
    let format = props.format
    if (format === 'webp' && !supportsWebp.value) {
      format = 'jpeg' // 如果不支持webp，回退到jpeg
    }

    // 添加参数（仅对本地资源）
    if (format && format !== 'original') {
      url.searchParams.set('format', format)
    }
    if (props.quality) {
      url.searchParams.set('q', props.quality.toString())
    }
    if (props.width) {
      url.searchParams.set('w', props.width.toString())
    }
    if (props.height) {
      url.searchParams.set('h', props.height.toString())
    }

    return url.toString()
  } catch (e) {
    // 如果URL解析失败，返回原始URL
    return props.src
  }
})

// 监听src变化，重新加载图片
watch(() => props.src, () => {
  hasError.value = false
  isLoading.value = true
})

const handleError = () => {
  hasError.value = true
  isLoading.value = false
}

const handleLoad = () => {
  isLoading.value = false
}

// 设置Intersection Observer以实现懒加载
onMounted(() => {
  // 立即显示图片（暂时禁用懒加载以确保图片正常显示）
  isIntersecting.value = true

  // 注释掉复杂的懒加载逻辑，等图片能正常显示后再启用
  /*
  if ('IntersectionObserver' in window && imageContainer.value) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        isIntersecting.value = true
        observer.disconnect()
      }
    }, {
      rootMargin: '200px',
      threshold: 0.01
    })
    observer.observe(imageContainer.value)
  } else {
    isIntersecting.value = true
  }
  */
})
</script>

<style scoped>
.image-container {
  position: relative;
  overflow: hidden;
  background-color: #f3f4f6;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  color: #999;
  font-size: 12px;
  text-align: center;
  padding: 8px;
  height: 100%;
  width: 100%;
}

.placeholder-text {
  word-break: break-word;
  max-width: 90%;
}

.image-el {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-el.visible {
  opacity: 1;
}

.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.loaded .skeleton-loader {
  display: none;
}
</style>
