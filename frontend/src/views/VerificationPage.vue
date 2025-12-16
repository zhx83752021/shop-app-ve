<template>
  <div class="page max-w-md mx-auto relative min-h-screen bg-gray-50">
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">实名认证</h1>
      <div class="w-6"></div>
    </div>

    <!-- 认证状态 -->
    <div v-if="verificationStatus === 'verified'" class="status-card verified">
      <CheckCircle class="w-16 h-16 text-green-500 mb-4" />
      <h2 class="status-title">认证成功</h2>
      <p class="status-desc">您已完成实名认证</p>
      <div class="verified-info">
        <div class="info-item">
          <span class="label">姓名</span>
          <span class="value">{{ verificationData.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">身份证号</span>
          <span class="value">{{ maskIdCard(verificationData.idCard) }}</span>
        </div>
        <div class="info-item">
          <span class="label">认证时间</span>
          <span class="value">{{ verificationData.verifiedAt }}</span>
        </div>
      </div>
    </div>

    <!-- 认证中 -->
    <div v-else-if="verificationStatus === 'pending'" class="status-card pending">
      <Clock class="w-16 h-16 text-orange-500 mb-4" />
      <h2 class="status-title">审核中</h2>
      <p class="status-desc">您的认证信息正在审核中，请耐心等待</p>
      <p class="status-desc text-sm">预计1-3个工作日完成审核</p>
    </div>

    <!-- 认证失败 -->
    <div v-else-if="verificationStatus === 'rejected'" class="status-card rejected">
      <XCircle class="w-16 h-16 text-red-500 mb-4" />
      <h2 class="status-title">认证失败</h2>
      <p class="status-desc">{{ verificationData.rejectReason || '身份信息验证失败' }}</p>
      <button @click="verificationStatus = 'unverified'" class="retry-btn">
        重新认证
      </button>
    </div>

    <!-- 未认证 - 认证表单 -->
    <div v-else class="verification-form">
      <!-- 提示信息 -->
      <div class="tips-card">
        <AlertCircle class="w-5 h-5 text-blue-500" />
        <div class="tips-content">
          <p class="tips-title">为什么要实名认证？</p>
          <ul class="tips-list">
            <li>• 保障账户安全</li>
            <li>• 享受更多服务权益</li>
            <li>• 提升交易可信度</li>
          </ul>
        </div>
      </div>

      <!-- 认证表单 -->
      <div class="form-container">
        <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
          <el-form-item label="真实姓名" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入真实姓名"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="form.idCard"
              placeholder="请输入18位身份证号"
              maxlength="18"
              :prefix-icon="CreditCard"
            />
          </el-form-item>

          <!-- 身份证照片上传 -->
          <el-form-item label="身份证人像面" prop="idCardFront">
            <div class="upload-area" @click="selectIdCardFront">
              <div v-if="form.idCardFrontPreview" class="image-preview">
                <img :src="form.idCardFrontPreview" alt="身份证人像面" />
                <div class="image-mask">
                  <Camera class="w-8 h-8" />
                  <p>重新上传</p>
                </div>
              </div>
              <div v-else class="upload-placeholder">
                <Camera class="w-12 h-12 text-gray-400 mb-2" />
                <p class="text-sm text-gray-500">上传身份证人像面</p>
                <p class="text-xs text-gray-400 mt-1">请确保照片清晰完整</p>
              </div>
              <input
                ref="idCardFrontInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleIdCardFrontChange"
              />
            </div>
          </el-form-item>

          <el-form-item label="身份证国徽面" prop="idCardBack">
            <div class="upload-area" @click="selectIdCardBack">
              <div v-if="form.idCardBackPreview" class="image-preview">
                <img :src="form.idCardBackPreview" alt="身份证国徽面" />
                <div class="image-mask">
                  <Camera class="w-8 h-8" />
                  <p>重新上传</p>
                </div>
              </div>
              <div v-else class="upload-placeholder">
                <Camera class="w-12 h-12 text-gray-400 mb-2" />
                <p class="text-sm text-gray-500">上传身份证国徽面</p>
                <p class="text-xs text-gray-400 mt-1">请确保照片清晰完整</p>
              </div>
              <input
                ref="idCardBackInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleIdCardBackChange"
              />
            </div>
          </el-form-item>

          <!-- 协议 -->
          <el-form-item>
            <el-checkbox v-model="form.agreed">
              我已阅读并同意
              <a href="#" class="link">《实名认证协议》</a>
            </el-checkbox>
          </el-form-item>

          <el-button
            type="primary"
            class="submit-btn"
            @click="handleSubmit"
            :loading="submitting"
            :disabled="!form.agreed"
          >
            提交认证
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  CreditCard,
  Camera
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 认证状态: unverified | pending | verified | rejected
const verificationStatus = ref<'unverified' | 'pending' | 'verified' | 'rejected'>('unverified')

// 认证数据
const verificationData = ref({
  name: '张三',
  idCard: '110101199001011234',
  verifiedAt: '2024-12-16',
  rejectReason: ''
})

// 表单数据
const form = reactive({
  name: '',
  idCard: '',
  idCardFront: null as File | null,
  idCardBack: null as File | null,
  idCardFrontPreview: '',
  idCardBackPreview: '',
  agreed: false
})

// 验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2-20个字符', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, message: '请输入正确的身份证号', trigger: 'blur' }
  ]
}

const idCardFrontInput = ref<HTMLInputElement>()
const idCardBackInput = ref<HTMLInputElement>()

// 选择身份证人像面
const selectIdCardFront = () => {
  idCardFrontInput.value?.click()
}

// 选择身份证国徽面
const selectIdCardBack = () => {
  idCardBackInput.value?.click()
}

// 处理身份证人像面上传
const handleIdCardFrontChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    form.idCardFront = file
    const reader = new FileReader()
    reader.onload = (e) => {
      form.idCardFrontPreview = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 处理身份证国徽面上传
const handleIdCardBackChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    form.idCardBack = file
    const reader = new FileReader()
    reader.onload = (e) => {
      form.idCardBackPreview = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 提交认证
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (!form.idCardFront || !form.idCardBack) {
      ElMessage.warning('请上传身份证正反面照片')
      return
    }

    try {
      submitting.value = true

      // 模拟上传
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 这里应该调用实名认证API
      // await submitVerification({
      //   name: form.name,
      //   idCard: form.idCard,
      //   idCardFront: form.idCardFront,
      //   idCardBack: form.idCardBack
      // })

      ElMessage.success('认证信息已提交，请等待审核')
      verificationStatus.value = 'pending'
    } catch (error) {
      console.error('提交认证失败:', error)
      ElMessage.error('提交失败，请稍后重试')
    } finally {
      submitting.value = false
    }
  })
}

// 身份证号脱敏
const maskIdCard = (idCard: string) => {
  if (!idCard || idCard.length !== 18) return idCard
  return idCard.substring(0, 6) + '********' + idCard.substring(14)
}
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
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
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

.status-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  background: white;
  margin: 16px;
  border-radius: 16px;
  text-align: center;
}

.status-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.status-desc {
  color: #666;
  margin-bottom: 4px;
}

.verified-info {
  width: 100%;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
}

.info-item .label {
  color: #666;
}

.retry-btn {
  margin-top: 24px;
  padding: 10px 32px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:active {
  transform: scale(0.98);
}

.tips-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #e3f2fd;
  margin: 16px;
  border-radius: 12px;
}

.tips-content {
  flex: 1;
}

.tips-title {
  font-weight: 500;
  margin-bottom: 8px;
  color: #1976d2;
}

.tips-list {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

.form-container {
  background: white;
  margin: 16px;
  padding: 20px;
  border-radius: 16px;
}

.upload-area {
  width: 100%;
  height: 180px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #ff4757;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview:hover .image-mask {
  opacity: 1;
}

.link {
  color: #ff4757;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-checkbox__label) {
  font-size: 13px;
}
</style>
