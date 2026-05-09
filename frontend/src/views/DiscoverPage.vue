<template>
  <div class="flex flex-col min-h-full bg-white relative">
    <!-- 顶部Tab栏 -->
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3 w-full">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="handleTabChange(index)"
          :class="[
            'pb-1 transition-colors cursor-pointer text-[15px] font-medium whitespace-nowrap',
            currentTab === index ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- 内容流 (瀑布流双栏布局) -->
    <div class="flex-1 overflow-auto bg-[#F9F9F9]">
      <div v-if="loading" class="grid grid-cols-2 gap-3 p-3">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
          <div class="aspect-[3/4] bg-gray-100"></div>
          <div class="p-3 space-y-2">
            <div class="h-4 bg-gray-100 rounded w-3/4"></div>
            <div class="flex items-center justify-between">
              <div class="h-4 bg-gray-100 rounded-full w-8"></div>
              <div class="h-4 bg-gray-100 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="posts.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
        <div class="w-16 h-16 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <ShoppingBag class="w-8 h-8 opacity-20" />
        </div>
        <p class="text-sm font-light">还没人分享动态哦~</p>
      </div>

      <div v-else class="grid grid-cols-2 gap-3 p-3">
        <div
          v-for="(post, index) in posts"
          :key="post.id"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col active:scale-[0.98] cursor-pointer"
          @click="handleBuyProduct(post.products[0]?.id || post.id)"
        >
          <!-- 图片/视频 区域 -->
          <div class="relative aspect-[3/4] overflow-hidden">
            <ImageWithFallback
              :src="post.image"
              :alt="post.title"
              class-name="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            
            <!-- 视频角标 -->
            <div
              v-if="post.type === 'VIDEO'"
              class="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"
            >
              <Play class="w-3 h-3 text-white fill-current" />
            </div>

            <!-- 商品挂载提示 -->
            <div
              v-if="post.hasProduct"
              class="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm"
            >
              <ShoppingBag class="w-3 h-3 text-primary" />
              <span class="text-[10px] font-bold text-ink">同款</span>
            </div>
          </div>

          <!-- 底部文案区 -->
          <div class="p-3 flex flex-col justify-between flex-1">
            <h2 class="text-sm font-semibold text-ink line-clamp-2 leading-snug mb-2">{{ post.title }}</h2>
            
            <div class="flex items-center justify-between gap-2 mt-auto">
              <!-- 作者信息 -->
              <div class="flex items-center gap-1.5 flex-1 min-w-0">
                <ImageWithFallback
                  :src="post.avatar"
                  :alt="post.username"
                  class-name="w-5 h-5 rounded-full object-cover border border-gray-100"
                />
                <span class="text-[11px] text-ink-muted truncate font-medium">{{ post.username }}</span>
              </div>

              <!-- 点赞数 -->
              <button
                @click.stop="handleLike(post.id, index)"
                :class="[
                  'flex items-center gap-0.5 transition-colors',
                  post.isLiked ? 'text-danger' : 'text-ink-muted'
                ]"
              >
                <Heart :class="['w-3.5 h-3.5', post.isLiked ? 'fill-current' : '']" />
                <span class="text-[11px] font-medium">{{ post.likesDisplay }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论对话框 -->
    <CommentDialog
      v-model="showCommentDialog"
      :post-id="currentCommentPostId"
      @refresh="handleCommentRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, MessageCircle, ShoppingBag, Play } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import CommentDialog from '@/components/CommentDialog.vue'
import { getPosts, toggleLike } from '@/api/post'
import { followUser, unfollowUser, getUserProfile } from '@/api/user'

const router = useRouter()
const tabs = ['推荐', '关注', '时尚', '美食', '旅行', '数码', '家居']
const loading = ref(false)
const currentTab = ref(0)

interface PostData {
  id: string
  userId: string
  type: 'IMAGE' | 'VIDEO'
  image: string
  avatar: string
  username: string
  title: string
  content: string
  likes: number
  likesDisplay: string
  comments: number
  commentsDisplay: string
  hasProduct: boolean
  duration?: string
  isLiked: boolean
  isFollowing: boolean
  products: any[]
}

const posts = ref<PostData[]>([])
const showCommentDialog = ref(false)
const currentCommentPostId = ref('')
const currentUserId = ref<string>('')

// 切换Tab
const handleTabChange = (index: number) => {
  currentTab.value = index
  // TODO: 根据不同的tab加载不同的内容
  loadPosts()
}

const DEMO_DISCOVER_POSTS: PostData[] = [
  {
    id: 'demo-post-1',
    userId: 'demo-user-1',
    type: 'IMAGE',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    username: '穿搭小达人',
    title: '春季出街必备，这双跑鞋太好穿了！',
    content: '今天去公园散步，穿了这双新买的跑鞋，真的超级舒服...',
    likes: 1250,
    likesDisplay: '1250',
    comments: 88,
    commentsDisplay: '88',
    hasProduct: true,
    isLiked: false,
    isFollowing: false,
    products: [{ id: 'demo-prod-1' }]
  },
  {
    id: 'demo-post-2',
    userId: 'demo-user-2',
    type: 'IMAGE',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    username: '护肤日记',
    title: '干皮救星！最近大爱的面霜分享',
    content: '换季皮肤特别干，用了这款面霜之后真的改善了很多...',
    likes: 3400,
    likesDisplay: '3400',
    comments: 210,
    commentsDisplay: '210',
    hasProduct: true,
    isLiked: false,
    isFollowing: false,
    products: [{ id: 'demo-prod-2' }]
  },
  {
    id: 'demo-post-3',
    userId: 'demo-user-3',
    type: 'VIDEO',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    username: '数码宅',
    title: '沉浸式桌面开箱，氛围感拉满',
    content: '新买的键盘垫和鼠标，终于把桌面布置成了自己喜欢的样子...',
    likes: 890,
    likesDisplay: '890',
    comments: 45,
    commentsDisplay: '45',
    hasProduct: false,
    duration: '01:20',
    isLiked: false,
    isFollowing: false,
    products: []
  },
  {
    id: 'demo-post-4',
    userId: 'demo-user-4',
    type: 'IMAGE',
    image: 'https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    username: '家居美学',
    title: '提升幸福感的家居好物',
    content: '生活需要仪式感，这些小物件让家里变得更温馨了。',
    likes: 5600,
    likesDisplay: '5.6万',
    comments: 320,
    commentsDisplay: '320',
    hasProduct: true,
    isLiked: false,
    isFollowing: false,
    products: [{ id: 'demo-prod-4' }]
  }
]

// 加载帖子数据
const loadPosts = async () => {
  try {
    loading.value = true
    const currentTabName = tabs[currentTab.value]
    const data = await getPosts({ page: 1, pageSize: 20, tab: currentTabName })
    console.log('获取帖子数据成功:', data)

    let itemsToProcess = []
    let isMock = false

    if (!data || !data.items || data.items.length === 0) {
      itemsToProcess = [...DEMO_DISCOVER_POSTS]
      isMock = true
    } else {
      itemsToProcess = data.items
    }
    
    // 前端直接进行 Tab 过滤（避免因后端未重启导致参数被忽略）
    if (currentTabName && currentTabName !== '推荐' && currentTabName !== '关注') {
      const keywordMap: Record<string, string[]> = {
        '时尚': ['穿搭', '裙', '妆', '护肤', '时尚', '出游', '面霜'],
        '美食': ['探店', '咖啡', '食', '餐', '美食'],
        '旅行': ['旅行', '出游', '游'],
        '数码': ['桌面', '键盘', '耳机', '数码', '体验', '测评'],
        '家居': ['卧室', '客厅', '家居', '四件套', '绿植', '好物']
      }
      const keywords = keywordMap[currentTabName] || []
      itemsToProcess = itemsToProcess.filter((p: any) => 
        keywords.some(kw => p.title?.includes(kw) || p.content?.includes(kw))
      )
    }

    if (isMock) {
      posts.value = itemsToProcess
    } else {
      posts.value = itemsToProcess.map((post: any) => ({
        id: post.id,
        userId: post.userId,
        type: post.type,
        image: post.images?.[0] || post.image || 'https://picsum.photos/800/800',
        avatar: post.user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        username: post.user?.nickname || post.username || '匿名用户',
        title: post.title,
        content: post.content,
        likes: post.likeCount || 0,
        likesDisplay: formatCount(post.likeCount || 0),
        comments: post.commentCount || 0,
        commentsDisplay: String(post.commentCount || 0),
        hasProduct: post.hasProduct || false,
        duration: post.duration,
        isLiked: post.isLiked || false,
        isFollowing: post.isFollowing || false,
        products: post.products || []
      }))
    }
  } catch (error: any) {
    console.error('加载帖子失败 - 详细错误:', error)
    
    // 接口失败时也兜底展示 mock 数据
    let itemsToProcess = [...DEMO_DISCOVER_POSTS]
    const currentTabName = tabs[currentTab.value]
    if (currentTabName && currentTabName !== '推荐' && currentTabName !== '关注') {
      const keywordMap: Record<string, string[]> = {
        '时尚': ['穿搭', '裙', '妆', '护肤', '时尚', '出游', '面霜'],
        '美食': ['探店', '咖啡', '食', '餐', '美食'],
        '旅行': ['旅行', '出游', '游'],
        '数码': ['桌面', '键盘', '耳机', '数码', '体验', '测评'],
        '家居': ['卧室', '客厅', '家居', '四件套', '绿植', '好物']
      }
      const keywords = keywordMap[currentTabName] || []
      itemsToProcess = itemsToProcess.filter((p: any) => 
        keywords.some(kw => p.title?.includes(kw) || p.content?.includes(kw))
      )
    }
    posts.value = itemsToProcess
  } finally {
    loading.value = false
  }
}

// 格式化数字显示
const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return String(count)
}

// 点赞功能
const handleLike = async (postId: string, index: number) => {
  try {
    const post = posts.value[index]
    const wasLiked = post.isLiked

    // 乐观更新UI
    post.isLiked = !wasLiked
    post.likes += wasLiked ? -1 : 1
    post.likesDisplay = formatCount(post.likes)

    // 调用API
    await toggleLike(postId)
    ElMessage.success(wasLiked ? '已取消点赞' : '点赞成功')
  } catch (error: any) {
    console.error('点赞失败:', error)
    // 回滚 UI状态
    const post = posts.value[index]
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
    post.likesDisplay = formatCount(post.likes)

    // 检查是否是未登录错误
    if (error?.response?.status === 401) {
      ElMessage.warning('请先登录')
      router.push('/login')
    } else {
      ElMessage.error(error?.response?.data?.message || '操作失败，请稍后重试')
    }
  }
}

// 关注功能
const handleFollow = async (userId: string, index: number) => {
  console.log('关注操作 - userId:', userId, 'index:', index)

  if (!userId) {
    ElMessage.error('用户ID无效')
    return
  }

  // 检查是否尝试关注自己
  if (userId === currentUserId.value) {
    ElMessage.warning('不能关注自己哦~')
    return
  }

  try {
    const post = posts.value[index]
    const wasFollowing = post.isFollowing

    console.log('当前关注状态:', wasFollowing)
    console.log('即将调用API:', wasFollowing ? 'unfollowUser' : 'followUser')

    // 乐观更新UI
    post.isFollowing = !wasFollowing

    // 调用API
    if (wasFollowing) {
      await unfollowUser(userId)
      ElMessage.success('已取消关注')
    } else {
      await followUser(userId)
      ElMessage.success('关注成功')
    }
  } catch (error: any) {
    console.error('关注操作失败 - 详细错误:', error)
    console.error('错误响应:', error?.response)
    console.error('错误数据:', error?.response?.data)

    // 回滚 UI状态
    const post = posts.value[index]
    post.isFollowing = !post.isFollowing

    // 检查是否是未登录错误
    if (error?.response?.status === 401) {
      ElMessage.warning('请先登录')
      router.push('/login')
    } else {
      ElMessage.error(error?.response?.data?.message || '操作失败，请稍后重试')
    }
  }
}

// 评论功能
const handleComment = (postId: string) => {
  currentCommentPostId.value = postId
  showCommentDialog.value = true
}

// 评论刷新回调
const handleCommentRefresh = () => {
  // 刷新帖子列表以更新评论数
  loadPosts()
}

// 购买商品
const handleBuyProduct = (productId: string) => {
  router.push(`/product/${productId}`)
}

// 加载当前用户信息
const loadCurrentUser = async () => {
  try {
    const userData = await getUserProfile()
    currentUserId.value = userData.id || ''
    console.log('当前用户ID:', currentUserId.value)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 获取失败时，保持currentUserId为空，允许显示所有关注按钮
    currentUserId.value = ''
  }
}

onMounted(() => {
  loadCurrentUser()
  loadPosts()
})
</script>

<style scoped>
/* 防止按钮和数字被选中 */
button {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

button span {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: pointer;
}

/* 互动按钮样式优化 */
button:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}
</style>
