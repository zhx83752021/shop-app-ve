<template>
  <el-dialog
    v-model="visible"
    title="评论"
    :close-on-click-modal="false"
    @close="handleClose"
    class="comment-dialog"
  >
    <!-- 评论列表 -->
    <div class="comment-list overflow-y-auto mb-4">
      <div v-if="loading" class="text-center py-8 text-gray-500">
        加载中...
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-400">
        还没有评论，快来抢沙发吧~
      </div>

      <div v-else>
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item border-b border-gray-100 py-3 last:border-b-0"
        >
          <div class="flex gap-3">
            <!-- 头像 -->
            <img
              :src="comment.user?.avatar || 'https://picsum.photos/40/40'"
              :alt="comment.user?.nickname"
              class="w-10 h-10 rounded-full flex-shrink-0"
            />

            <!-- 评论内容 -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium">{{ comment.user?.nickname || '匿名用户' }}</span>
                <span class="text-xs text-gray-400">{{ formatTime(comment.createdAt) }}</span>
              </div>
              <p class="text-sm text-gray-700 mb-2">{{ comment.content }}</p>

              <!-- 操作按钮 -->
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <button
                  @click="handleReply(comment)"
                  class="hover:text-primary transition-colors"
                >
                  回复
                </button>
                <button
                  v-if="comment.userId === currentUserId"
                  @click="handleDelete(comment.id)"
                  class="hover:text-red-500 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发表评论 -->
    <div class="comment-input border-t pt-4">
      <el-input
        v-model="commentContent"
        type="textarea"
        :rows="3"
        :placeholder="replyTo ? `回复 @${replyTo.user?.nickname}` : '写下你的评论...'"
        maxlength="500"
        show-word-limit
      />
      <div class="flex justify-between items-center mt-3">
        <button
          v-if="replyTo"
          @click="cancelReply"
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          取消回复
        </button>
        <div v-else></div>
        <button
          @click="handleSubmit"
          :disabled="!commentContent.trim() || submitting"
          :class="[
            'px-6 py-2 rounded-full text-white text-sm font-medium transition-colors',
            commentContent.trim() && !submitting
              ? 'bg-primary hover:bg-primary-dark cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          ]"
        >
          {{ submitting ? '发送中...' : '发送' }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getComments, createComment, deleteComment } from '@/api/post'

interface Comment {
  id: string
  content: string
  userId: string
  user?: {
    nickname: string
    avatar?: string
  }
  createdAt: string
  parentId?: string
}

interface Props {
  postId: string
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'refresh'])

const visible = ref(false)
const comments = ref<Comment[]>([])
const commentContent = ref('')
const loading = ref(false)
const submitting = ref(false)
const replyTo = ref<Comment | null>(null)
const currentUserId = ref('')

// 同步v-model
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    loadComments()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 加载评论列表
const loadComments = async () => {
  try {
    loading.value = true
    const data = await getComments(props.postId, 1, 50)
    // 转换类型以兼容
    comments.value = (data.items || []).map((item: any) => ({
      id: item.id,
      content: item.content,
      userId: item.userId,
      user: item.user ? {
        nickname: item.user.nickname,
        avatar: item.user.avatar || undefined
      } : undefined,
      createdAt: item.createdAt,
      parentId: item.parentId
    }))
  } catch (error: any) {
    console.error('加载评论失败:', error)
    if (error?.response?.status !== 401) {
      ElMessage.error('加载评论失败')
    }
  } finally {
    loading.value = false
  }
}

// 发表评论
const handleSubmit = async () => {
  if (!commentContent.value.trim()) {
    return
  }

  try {
    submitting.value = true
    await createComment(
      props.postId,
      commentContent.value.trim(),
      replyTo.value?.id
    )

    ElMessage.success('评论成功')
    commentContent.value = ''
    replyTo.value = null

    // 重新加载评论列表
    await loadComments()
    emit('refresh')
  } catch (error: any) {
    console.error('发表评论失败:', error)
    if (error?.response?.status === 401) {
      ElMessage.warning('请先登录')
    } else {
      ElMessage.error(error?.response?.data?.message || '评论失败')
    }
  } finally {
    submitting.value = false
  }
}

// 回复评论
const handleReply = (comment: Comment) => {
  replyTo.value = comment
  commentContent.value = ''
}

// 取消回复
const cancelReply = () => {
  replyTo.value = null
  commentContent.value = ''
}

// 删除评论
const handleDelete = async (commentId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteComment(commentId)
    ElMessage.success('删除成功')

    // 重新加载评论列表
    await loadComments()
    emit('refresh')
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
      ElMessage.error(error?.response?.data?.message || '删除失败')
    }
  }
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 关闭对话框
const handleClose = () => {
  commentContent.value = ''
  replyTo.value = null
}

// 获取当前用户ID（从localStorage）
const loadCurrentUserId = () => {
  // 这里可以从你的用户状态管理中获取
  // 暂时使用localStorage
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      currentUserId.value = user.id || ''
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  }
}

loadCurrentUserId()
</script>

<style>
/* 全局样式 - 防止弹窗导致body横向滚动 */
body:has(.el-dialog) {
  overflow-x: hidden !important;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
}

.el-overlay {
  overflow-x: hidden !important;
}
</style>

<style scoped>
/* 基础样式 - 使用更激进的宽度限制 */
:deep(.el-overlay) {
  overflow-x: hidden !important;
}

:deep(.el-dialog) {
  width: 95% !important;
  max-width: 600px !important;
  margin: 5vh auto !important;
  box-sizing: border-box !important;
}

:deep(.el-dialog__header) {
  padding: 16px 20px;
  box-sizing: border-box;
}

:deep(.el-dialog__body) {
  padding: 20px;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: hidden;
}

/* 评论列表高度 */
.comment-list {
  max-height: 400px;
}

/* 移动端适配 - 更严格的宽度控制 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: calc(100vw - 32px) !important;
    max-width: 448px !important;
    margin: 5vh auto !important;
    box-sizing: border-box !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }

  :deep(.el-dialog__header) {
    padding: 12px 16px;
    box-sizing: border-box;
  }

  :deep(.el-dialog__body) {
    padding: 16px;
    box-sizing: border-box;
    max-width: 100%;
    overflow-x: hidden;
  }

  :deep(.el-textarea) {
    width: 100% !important;
    box-sizing: border-box !important;
  }

  :deep(.el-textarea__inner) {
    box-sizing: border-box !important;
    width: 100% !important;
  }

  .comment-list {
    max-height: 50vh;
    box-sizing: border-box;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  :deep(.el-dialog) {
    width: calc(100vw - 24px) !important;
    max-width: 100% !important;
    margin: 3vh auto !important;
  }

  :deep(.el-dialog__header) {
    padding: 10px 12px;
  }

  :deep(.el-dialog__body) {
    padding: 12px;
  }
}

.comment-list::-webkit-scrollbar {
  width: 6px;
}

.comment-list::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.comment-list::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 20px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-textarea__inner) {
  border-color: #e5e7eb;
  font-size: 14px;
}

:deep(.el-textarea__inner:focus) {
  border-color: #ff6b6b;
}
</style>
