<template>
  <div class="w-full page max-w-md mx-auto relative min-h-screen bg-gray-50">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">直播好物</h1>
      <div class="w-6"></div>
    </div>

    <!-- 直播间列表 -->
    <div class="live-streams">
      <div
        v-for="stream in liveStreams"
        :key="stream.id"
        class="stream-card"
        @click="enterRoom(stream)"
      >
        <div class="stream-cover">
          <ImageWithFallback
            :src="stream.cover"
            :alt="stream.title"
            class-name="cover-image"
          />
          <div class="live-badge">
            <div class="live-dot"></div>
            直播中
          </div>
          <div class="viewers-count">
            <Users class="w-3 h-3" />
            {{ formatViewers(stream.viewers) }}
          </div>
        </div>
        <div class="stream-info">
          <div class="anchor-info">
            <ImageWithFallback
              :src="stream.anchor?.avatar || ''"
              :alt="stream.anchor?.nickname || '主播'"
              class-name="anchor-avatar"
            />
            <span class="anchor-name">{{ stream.anchor?.nickname ?? '主播' }}</span>
          </div>
          <h3 class="stream-title">{{ stream.title }}</h3>
          <div class="stream-tags">
            <span
              v-for="tag in stream.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="liveStreams.length === 0" class="empty-state">
      <div class="empty-icon">📹</div>
      <p>暂无直播</p>
      <p class="empty-desc">敬请期待精彩直播</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Users } from 'lucide-vue-next'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import { getLiveStreams } from '@/api/livestream'
import type { LiveStream } from '@/api/livestream'

const router = useRouter()

const liveStreams = ref<LiveStream[]>([])
const loading = ref(false)

/** 接口失败或暂无直播时的示例列表（与空列表分支一致） */
const DEMO_LIVE_STREAMS = [
  {
    id: '1',
    anchorId: 'demo-anchor',
    title: 'iPhone 15 Pro 系列直播特惠',
    cover: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    viewers: 23500,
    tags: ['数码', '特惠'],
    status: 'LIVE' as const,
    startTime: null,
    endTime: null,
    createdAt: '',
    updatedAt: '',
    anchor: {
      id: 'demo-anchor',
      nickname: '数码达人阿强',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  },
  {
    id: '2',
    anchorId: 'demo-anchor',
    title: '美妆护肤专场 大牌买一送一',
    cover: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    viewers: 18200,
    tags: ['美妆', '正品'],
    status: 'LIVE' as const,
    startTime: null,
    endTime: null,
    createdAt: '',
    updatedAt: '',
    anchor: {
      id: 'demo-anchor-2',
      nickname: '美妆天后琳达',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  },
  {
    id: '3',
    anchorId: 'demo-anchor',
    title: '潮流运动鞋 限量联名首发',
    cover: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    viewers: 35000,
    tags: ['潮鞋', '首发'],
    status: 'LIVE' as const,
    startTime: null,
    endTime: null,
    createdAt: '',
    updatedAt: '',
    anchor: {
      id: 'demo-anchor-3',
      nickname: '潮流合伙人',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  },
  {
    id: '4',
    anchorId: 'demo-anchor',
    title: '精致家居好物 提升生活幸福感',
    cover: 'https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    viewers: 12000,
    tags: ['家居', '美学'],
    status: 'LIVE' as const,
    startTime: null,
    endTime: null,
    createdAt: '',
    updatedAt: '',
    anchor: {
      id: 'demo-anchor-4',
      nickname: '家居设计师小雅',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  },
  {
    id: '5',
    anchorId: 'demo-anchor',
    title: '夏日穿搭专场 显瘦显高不二之选',
    cover: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    viewers: 28000,
    tags: ['时尚', '穿搭'],
    status: 'LIVE' as const,
    startTime: null,
    endTime: null,
    createdAt: '',
    updatedAt: '',
    anchor: {
      id: 'demo-anchor-5',
      nickname: '穿搭博主可儿',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  },
  {
    id: '6',
    anchorId: 'demo-anchor',
    title: '智能办公利器 效率提升秘籍',
    cover: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    viewers: 9500,
    tags: ['办公', '效率'],
    status: 'LIVE' as const,
    startTime: null,
    endTime: null,
    createdAt: '',
    updatedAt: '',
    anchor: {
      id: 'demo-anchor-6',
      nickname: '效率专家雷蒙',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  }
] satisfies LiveStream[]

const formatViewers = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  return count.toString()
}

const enterRoom = (stream: any) => {
  router.push(`/live-stream/${stream.id}`)
}

const loadStreams = async () => {
  try {
    loading.value = true
    const response = await getLiveStreams({ page: 1, pageSize: 20, status: 'LIVE' })
    const items = Array.isArray((response as any)?.items) ? (response as any).items : []

    if (items.length === 0) {
      liveStreams.value = [...DEMO_LIVE_STREAMS]
    } else {
      liveStreams.value = items as LiveStream[]
    }
  } catch (error) {
    console.error('Failed to load live streams', error)
    liveStreams.value = [...DEMO_LIVE_STREAMS]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStreams()
})
</script>

<style scoped>
.page {
  padding-bottom: 20px;
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
  z-index: 50;
  border-bottom: 1px solid #f0f0f0;
  max-width: 448px;
  margin: 0 auto;
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

.live-streams {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

.stream-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stream-card:active {
  transform: scale(0.98);
}

.stream-cover {
  position: relative;
  width: 100%;
  height: 160px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 71, 87, 0.95);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.viewers-count {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stream-info {
  padding: 12px;
}

.anchor-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.anchor-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.anchor-name {
  font-size: 12px;
  color: #666;
}

.stream-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 36px;
}

.stream-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  background: #f0f0f0;
  color: #666;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-desc {
  color: #999;
  font-size: 14px;
  margin-top: 8px;
}


</style>
