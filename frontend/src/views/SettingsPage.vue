<template>
  <div class="page max-w-md mx-auto relative">
    <!-- 顶部导航栏 -->
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">账号设置</h1>
      <div class="w-6"></div>
    </div>

    <!-- 设置列表 -->
    <div class="settings-list">
      <!-- 账号信息 -->
      <div class="section">
        <div class="section-title">账号信息</div>
        <div class="setting-item" @click="showAvatarDialog = true">
          <span class="label">头像</span>
          <div class="value">
            <ImageWithFallback
              :src="userInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'"
              alt="头像"
              class-name="avatar"
            />
            <ChevronRight class="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div class="setting-item" @click="handleClick('修改昵称')">
          <span class="label">昵称</span>
          <div class="value">
            <span class="text">{{ userInfo?.nickname || '未设置' }}</span>
            <ChevronRight class="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div class="setting-item">
          <span class="label">手机号</span>
          <div class="value">
            <span class="text">{{ userInfo?.phone || '未绑定' }}</span>
          </div>
        </div>
      </div>

      <!-- 安全设置 -->
      <div class="section">
        <div class="section-title">安全设置</div>
        <div class="setting-item" @click="handleClick('修改密码')">
          <span class="label">修改密码</span>
          <div class="value">
            <ChevronRight class="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div class="setting-item" @click="handleClick('实名认证')">
          <span class="label">实名认证</span>
          <div class="value">
            <span class="status unverified">未认证</span>
            <ChevronRight class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- 消息通知 -->
      <div class="section">
        <div class="section-title">消息通知</div>
        <div class="setting-item">
          <span class="label">订单消息</span>
          <div class="value">
            <input type="checkbox" v-model="settings.orderNotify" class="toggle" />
          </div>
        </div>
        <div class="setting-item">
          <span class="label">优惠活动</span>
          <div class="value">
            <input type="checkbox" v-model="settings.promotionNotify" class="toggle" />
          </div>
        </div>
        <div class="setting-item">
          <span class="label">物流消息</span>
          <div class="value">
            <input type="checkbox" v-model="settings.logisticsNotify" class="toggle" />
          </div>
        </div>
      </div>
    </div>

    <!-- 修改头像对话框 -->
    <el-dialog
      v-model="showAvatarDialog"
      title="修改头像"
      width="380px"
      :close-on-click-modal="false"
    >
      <div class="avatar-upload">
        <!-- 图片预览 -->
        <div class="avatar-preview" v-if="previewAvatar">
          <img :src="previewAvatar" alt="头像预览" />
        </div>
        <div class="avatar-preview empty" v-else>
          <User class="w-16 h-16 text-gray-300" />
          <p class="text-sm text-gray-400 mt-2">选择图片</p>
        </div>

        <!-- 上传按钮 -->
        <div class="upload-actions">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
          <el-button @click="selectFile" class="w-full mb-2">
            <Upload class="w-4 h-4 mr-2" />
            选择本地图片
          </el-button>
          <p class="text-xs text-gray-400 text-center">支持 JPG、PNG 格式，建议尺寸 200x200</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="cancelUpload">取消</el-button>
        <el-button type="primary" @click="updateAvatar" :disabled="!previewAvatar">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ChevronRight, User, Upload } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { getUserProfile } from '@/api/user'
import ImageWithFallback from '@/components/ImageWithFallback.vue'

const router = useRouter()
const userInfo = ref<any>(null)
const showAvatarDialog = ref(false)
const fileInput = ref<HTMLInputElement>()
const previewAvatar = ref('')
const selectedFile = ref<File | null>(null)
const settings = ref({
  orderNotify: true,
  promotionNotify: true,
  logisticsNotify: true
})

const loadUserInfo = async () => {
  try {
    const data = await getUserProfile()
    userInfo.value = data
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const handleClick = (label: string) => {
  if (label === '实名认证') {
    router.push('/verification')
  } else {
    ElMessage.info(`${label}功能开发中`)
  }
}

const selectFile = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }

  // 检查文件大小（限制为2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过2MB')
    return
  }

  selectedFile.value = file

  // 生成预览
  const reader = new FileReader()
  reader.onload = (e) => {
    previewAvatar.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const updateAvatar = () => {
  if (!previewAvatar.value) {
    ElMessage.warning('请先选择图片')
    return
  }

  // TODO: 上传图片到服务器
  // 暂时使用base64作为头像
  if (userInfo.value) {
    userInfo.value.avatar = previewAvatar.value
  }

  ElMessage.success('头像已更新')
  cancelUpload()
}

const cancelUpload = () => {
  showAvatarDialog.value = false
  previewAvatar.value = ''
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
  overflow-y: auto;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.settings-list {
  padding: 16px;
  overflow-y: visible;
}

.section {
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
}

.section-title {
  padding: 12px 16px;
  font-size: 14px;
  color: #999;
  background: #fafafa;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:active {
  background: #f5f5f5;
}

.label {
  font-size: 15px;
  color: #333;
}

.value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.text {
  font-size: 14px;
  color: #666;
}

.text.gray {
  color: #999;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  object-fit: cover;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.unverified {
  background: #fff3cd;
  color: #856404;
}

.toggle {
  width: 44px;
  height: 24px;
  cursor: pointer;
}

.avatar-upload {
  padding: 20px 0;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-preview.empty {
  flex-direction: column;
  background: #f5f5f5;
}

.upload-actions {
  text-align: center;
}
</style>
