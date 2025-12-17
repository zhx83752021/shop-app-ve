<template>
  <div class="page max-w-md mx-auto relative min-h-screen bg-gray-50">
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
        @click="enterLiveRoom(stream.id)"
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
              :src="stream.anchorAvatar"
              :alt="stream.anchorName"
              class-name="anchor-avatar"
            />
            <span class="anchor-name">{{ stream.anchorName }}</span>
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
import { ElMessage } from 'element-plus'
import ImageWithFallback from '@/components/ImageWithFallback.vue'

const router = useRouter()

interface LiveStream {
  id: string
  title: string
  cover: string
  anchorName: string
  anchorAvatar: string
  viewers: number
  tags: string[]
}

const liveStreams = ref<LiveStream[]>([
  {
    id: '1',
    title: '【限时抢购】Apple iPhone 15 Pro 超值优惠',
    cover: 'https://images.unsplash.com/photo-1592286927505-c5d39f747cc6?w=400&h=300&fit=crop',
    anchorName: '科技数码精选',
    anchorAvatar: 'https://ui-avatars.com/api/?name=Tech&background=667eea&color=fff',
    viewers: 12580,
    tags: ['数码', '限时优惠', '热卖']
  },
  {
    id: '2',
    title: '美妆护肤专场 大牌好物直降',
    cover: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    anchorName: '美妆小姐姐',
    anchorAvatar: 'https://ui-avatars.com/api/?name=Beauty&background=f093fb&color=fff',
    viewers: 8763,
    tags: ['美妆', '护肤', '新品']
  },
  {
    id: '3',
    title: 'Nike运动鞋专场 全场5折起',
    cover: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    anchorName: '运动达人',
    anchorAvatar: 'https://ui-avatars.com/api/?name=Sports&background=4ADE80&color=fff',
    viewers: 15420,
    tags: ['运动', '服饰', '折扣']
  },
  {
    id: '4',
    title: '家电节能补贴 爆款直降千元',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    anchorName: '家电小管家',
    anchorAvatar: 'https://ui-avatars.com/api/?name=Home&background=3B9BFF&color=fff',
    viewers: 6234,
    tags: ['家电', '节能', '补贴']
  },
  {
    id: '5',
    title: '食品生鲜 新鲜直达 限时秒杀',
    cover: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
    anchorName: '生鲜小哥',
    anchorAvatar: 'https://ui-avatars.com/api/?name=Food&background=FFD93D&color=333',
    viewers: 9876,
    tags: ['生鲜', '食品', '秒杀']
  },
  {
    id: '6',
    title: '母婴用品专场 品质好货',
    cover: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
    anchorName: '辣妈团长',
    anchorAvatar: 'https://ui-avatars.com/api/?name=Baby&background=FB7185&color=fff',
    viewers: 5678,
    tags: ['母婴', '用品', '品质']
  }
])

const formatViewers = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  return count.toString()
}

const enterLiveRoom = (id: string) => {
  ElMessage.info('直播间功能开发中，敬请期待')
}

onMounted(() => {
  // 可以在这里加载直播列表
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

@media (max-width: 640px) {
  .live-streams {
    grid-template-columns: 1fr;
  }

  .stream-cover {
    height: 200px;
  }
}
</style>
