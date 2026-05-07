<template>
  <div
    ref="imageContainer"
    :class="['image-container', className, {'loaded': !isLoading && !hasError, 'error': hasError}]"
  >
    <!-- 任务2：语义化占位（哈希渐变色＋商品首字），替代无意义平底图 -->
    <div v-if="hasError"
      :style="{ background: generateGradient(alt) }"
      class="image-placeholder"
    >
      <span class="placeholder-char">{{ alt?.slice(0, 2) }}</span>
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

  // 拼接基础路径 (针对本地存储的图片)
  let finalSrc = props.src
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL
  if (imageBaseUrl && !props.src.startsWith('http') && !props.src.startsWith('data:')) {
    finalSrc = imageBaseUrl + (props.src.startsWith('/') ? '' : '/') + props.src
  }

  // 如果是data URL、外部URL或不需要优化，直接返回
  if (finalSrc.startsWith('data:') ||
      finalSrc.startsWith('http://') ||
      finalSrc.startsWith('https://') ||
      props.format === 'original') {
    return finalSrc
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

/* 任务2：根据文字哈希生成确定性渐变色，图片加载失败时占位显示商品相关颜色 */
const generateGradient = (text: string): string => {
  const hash = [...(text || '')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0)
  const hue1 = Math.abs(hash) % 360
  const hue2 = (hue1 + 40) % 360
  return `linear-gradient(135deg, hsl(${hue1},65%,58%), hsl(${hue2},65%,48%))`
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
  height: 100%;
  width: 100%;
}

/* 商品首字占位（白色大字带部分透明） */
.placeholder-char {
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 4px rgba(0,0,0,0.2);
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
