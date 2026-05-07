<template>
  <div class="h-screen w-full max-w-md mx-auto bg-black text-white relative overflow-hidden flex flex-col">
    <!-- 视频层 (模拟) -->
    <div class="absolute inset-0 z-0">
      <img
        :src="streamInfo.cover"
        class="w-full h-full object-cover opacity-80"
        alt="Live Stream"
      />
      <!-- 渐变遮罩以看清文字 -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
    </div>

    <!-- 顶部信息 -->
    <div class="relative z-10 px-4 py-12 flex justify-between items-start">
      <div class="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full pr-4 p-1">
        <div class="w-8 h-8 rounded-full overflow-hidden border border-white/20">
          <img :src="streamInfo.avatar" alt="avatar" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-medium">{{ streamInfo.anchorName }}</span>
          <span class="text-[10px] text-white/70">{{ streamInfo.viewers }} 观看</span>
        </div>
        <button class="ml-2 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-medium">关注</button>
      </div>
      
      <button @click="$router.back()" class="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- 观众列表和热度 -->
    <div class="relative z-10 px-4 flex justify-end gap-1 mb-auto">
      <div class="flex -space-x-2">
        <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full border border-black/50 bg-gray-300 overflow-hidden">
          <img :src="`https://i.pravatar.cc/100?img=${i+10}`" class="w-full h-full" />
        </div>
      </div>
      <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">
        +
      </div>
    </div>

    <!-- 聊天区 -->
    <div class="relative z-10 px-4 h-64 overflow-y-auto mb-4 no-scrollbar flex flex-col-reverse">
      <div class="space-y-2">
        <div v-for="(msg, index) in messages" :key="index" class="flex gap-2">
          <span class="text-white/60 text-sm font-medium">{{ msg.name }}:</span>
          <span class="text-white text-sm">{{ msg.text }}</span>
        </div>
      </div>
    </div>

    <!-- 底部操作区 -->
    <div class="relative z-10 px-4 pb-8 flex items-center gap-3">
      <!-- 购物车/商品列表按钮 -->
      <button @click="showProducts = true" class="relative w-10 h-10 rounded-full bg-white text-ink flex items-center justify-center shadow-lg">
        <ShoppingBag class="w-5 h-5" />
        <span class="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
      </button>
      
      <!-- 聊天输入框 -->
      <div class="flex-1 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
        <input type="text" placeholder="说点什么..." class="bg-transparent w-full text-sm text-white focus:outline-none placeholder-white/50" />
      </div>
      
      <!-- 点赞按钮 -->
      <button class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/20 text-primary">
        <Heart class="w-5 h-5" fill="currentColor" />
      </button>
    </div>

    <!-- 商品列表 Drawer -->
    <div v-if="showProducts" class="absolute inset-0 z-50 flex flex-col justify-end">
      <div class="absolute inset-0 bg-black/50" @click="showProducts = false"></div>
      <div class="bg-white rounded-t-3xl h-2/3 relative flex flex-col">
        <div class="p-4 border-b border-surface-muted flex justify-between items-center">
          <h3 class="font-bold text-ink">直播商品 (3)</h3>
          <button @click="showProducts = false" class="text-ink-muted p-1">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-for="i in 3" :key="i" class="flex gap-3 bg-surface p-3 rounded-xl border border-primary-50">
            <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
              <img :src="`https://picsum.photos/200?random=${i}`" class="w-full h-full object-cover" />
              <div class="absolute top-0 left-0 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-br-lg">
                {{ i }}号链接
              </div>
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <h4 class="text-sm font-medium text-ink line-clamp-2">精选商品示例测试标题内容展示多行截断效果</h4>
              <div class="flex items-center justify-between mt-2">
                <span class="text-primary font-bold">¥99.00</span>
                <button class="bg-primary/10 text-primary px-3 py-1 text-xs rounded-full font-medium">去抢购</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { X, ShoppingBag, Heart } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { getLiveStreamById } from '@/api/livestream'

const route = useRoute()
const router = useRouter()
const showProducts = ref(false)

const streamInfo = ref({
  anchorName: '主播加载中...',
  avatar: 'https://i.pravatar.cc/150',
  viewers: '0',
  cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
})

const messages = ref([
  { name: '用户A', text: '主播今天推荐什么？' },
  { name: '用户B', text: '前排支持！' },
  { name: '用户C', text: '刚买了这个，期待发货。' },
  { name: '用户D', text: '还有优惠券吗？' },
])

onMounted(async () => {
  const id = route.params.id as string
  try {
    const stream = await getLiveStreamById(id)
    streamInfo.value = {
      anchorName: stream.anchor?.nickname || '匿名主播',
      avatar: stream.anchor?.avatar || 'https://i.pravatar.cc/150?img=11',
      viewers: stream.viewers >= 10000 ? (stream.viewers / 10000).toFixed(1) + 'w' : stream.viewers.toString(),
      cover: stream.cover || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
    }
  } catch (error) {
    // 如果 API 失败，尝试匹配 Mock 数据供演示
    const mockStreams: any[] = [
      {
        id: '1',
        title: 'iPhone 15 Pro 系列直播特惠',
        cover: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 23500,
        anchor: { nickname: '数码达人阿强', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      {
        id: '2',
        title: '美妆护肤专场 大牌买一送一',
        cover: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 18200,
        anchor: { nickname: '美妆天后琳达', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      {
        id: '3',
        title: '潮流运动鞋 限量联名首发',
        cover: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 35000,
        anchor: { nickname: '潮流合伙人', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      {
        id: '4',
        title: '精致家居好物 提升生活幸福感',
        cover: 'https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 12000,
        anchor: { nickname: '家居设计师小雅', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      {
        id: '5',
        title: '夏日穿搭专场 显瘦显高不二之选',
        cover: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 28000,
        anchor: { nickname: '穿搭博主可儿', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      {
        id: '6',
        title: '智能办公利器 效率提升秘籍',
        cover: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 9500,
        anchor: { nickname: '效率专家雷蒙', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' }
      }
    ]
    
    const mock = mockStreams.find(s => s.id === id)
    if (mock) {
      streamInfo.value = {
        anchorName: mock.anchor.nickname,
        avatar: mock.anchor.avatar,
        viewers: mock.viewers >= 10000 ? (mock.viewers / 10000).toFixed(1) + 'w' : mock.viewers.toString(),
        cover: mock.cover
      }
    } else {
      console.error('获取直播间信息失败:', error)
      ElMessage.error('获取直播间信息失败')
      router.back()
    }
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
