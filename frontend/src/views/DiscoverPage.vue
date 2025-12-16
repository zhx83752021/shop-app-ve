<template>
  <div class="flex flex-col h-full bg-white">
    <!-- 顶部Tab栏 -->
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div class="flex items-center gap-6 px-4 py-3 overflow-x-auto scrollbar-hide">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="handleTabChange(index)"
          :class="[
            'flex-shrink-0 pb-1 transition-colors cursor-pointer',
            currentTab === index ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- 内容流 -->
    <div class="flex-1 overflow-auto">
      <div v-if="loading" class="text-center py-10 text-gray-400">
        加载中...
      </div>
      <div
        v-for="(post, index) in posts"
        :key="post.id"
        class="border-b border-gray-100 pb-4 mb-4"
      >
        <!-- 用户信息 -->
        <div class="flex items-center gap-3 px-4 pt-4 mb-3">
          <ImageWithFallback
            :src="post.avatar"
            :alt="post.username"
            class-name="w-10 h-10 rounded-full object-cover"
          />
          <div class="flex-1">
            <h3 class="text-sm font-medium">{{ post.username }}</h3>
          </div>
          <button
            v-if="post.userId !== currentUserId"
            @click="handleFollow(post.userId, index)"
            :class="[
              'text-sm px-4 py-1 rounded-full border transition-colors',
              post.isFollowing
                ? 'bg-gray-100 text-gray-600 border-gray-300'
                : 'text-primary border-primary hover:bg-primary hover:text-white'
            ]"
          >
            {{ post.isFollowing ? '已关注' : '关注' }}
          </button>
        </div>

        <!-- 图片/视频 -->
        <div class="relative mb-3">
          <ImageWithFallback
            :src="post.image"
            :alt="post.title"
            class-name="w-full h-96 object-cover"
          />
          <div
            v-if="post.type === 'VIDEO'"
            class="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play class="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            </div>
          </div>
          <div
            v-if="post.duration"
            class="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded"
          >
            {{ post.duration }}
          </div>
        </div>

        <!-- 标题和内容 -->
        <div class="px-4 mb-3">
          <h2 class="mb-2 font-semibold">{{ post.title }}</h2>
          <p class="text-sm text-gray-600 line-clamp-2">{{ post.content }}</p>
        </div>

        <!-- 互动栏 -->
        <div class="flex items-center gap-6 px-4 mb-3">
          <button
            @click="handleLike(post.id, index)"
            :class="[
              'flex items-center gap-2 transition-colors',
              post.isLiked ? 'text-red-500' : 'text-gray-600'
            ]"
          >
            <Heart :class="['w-5 h-5', post.isLiked ? 'fill-current' : '']" />
            <span class="text-sm">{{ post.likesDisplay }}</span>
          </button>
          <button
            @click="handleComment(post.id)"
            class="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <MessageCircle class="w-5 h-5" />
            <span class="text-sm">{{ post.commentsDisplay }}</span>
          </button>
        </div>

        <!-- 商品链接区 -->
        <div
          v-if="post.hasProduct && post.products && post.products.length > 0"
          class="mx-4 p-3 bg-gray-50 rounded-xl flex items-center gap-3"
        >
          <ImageWithFallback
            :src="post.products[0].mainImage"
            :alt="post.products[0].title"
            class-name="w-16 h-16 rounded-lg object-cover"
          />
          <div class="flex-1">
            <p class="text-sm mb-1 line-clamp-2">{{ post.products[0].title }}</p>
            <p class="text-primary font-semibold">¥{{ post.products[0].price }}</p>
          </div>
          <button
            @click="handleBuyProduct(post.products[0].id)"
            class="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-1 text-sm hover:bg-primary-dark transition-colors"
          >
            <ShoppingBag class="w-4 h-4" />
            购买
          </button>
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

// 加载帖子数据
const loadPosts = async () => {
  try {
    loading.value = true
    const data = await getPosts({ page: 1, pageSize: 20 })
    console.log('获取帖子数据成功:', data)

    posts.value = data.items.map((post: any) => ({
      id: post.id,
      userId: post.userId,
      type: post.type,
      image: post.images?.[0] || post.image || 'https://picsum.photos/800/800',
      avatar: post.user?.avatar || 'https://picsum.photos/100/100',
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
  } catch (error: any) {
    console.error('加载帖子失败 - 详细错误:', error)
    console.error('错误响应:', error?.response)
    console.error('错误状态码:', error?.response?.status)
    console.error('错误消息:', error?.response?.data)
    ElMessage.error(error?.response?.data?.message || error?.message || '加载失败，请稍后重试')
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
