<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-purple-50 flex items-center justify-center p-4 max-w-md mx-auto relative">
    <div class="w-full max-w-md">
      <!-- Logo和标题 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
          <ShoppingBag class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
        <p class="text-gray-600">登录您的账户，继续精彩购物之旅</p>
      </div>

      <!-- 登录表单 -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleLogin">
          <!-- 手机号 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              手机号
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="loginForm.phone"
                type="tel"
                placeholder="请输入手机号"
                maxlength="11"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                :class="{ 'border-red-500': errors.phone }"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-red-500">{{ errors.phone }}</p>
          </div>

          <!-- 密码 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                :class="{ 'border-red-500': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeOff v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <!-- 记住我和忘记密码 -->
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span class="ml-2 text-sm text-gray-600">记住我</span>
            </label>
            <button type="button" class="text-sm text-primary hover:text-primary-dark">
              忘记密码？
            </button>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Loader v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5" />
            {{ loading ? '登录中...' : '登录' }}
          </button>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>
        </form>

        <!-- 分割线 -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">或</span>
          </div>
        </div>

        <!-- 注册链接 -->
        <div class="text-center">
          <p class="text-gray-600">
            还没有账户？
            <button
              @click="$router.push('/register')"
              class="text-primary font-medium hover:text-primary-dark"
            >
              立即注册
            </button>
          </p>
        </div>
      </div>

      <!-- 测试账号提示 -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p class="text-sm text-blue-800 font-medium mb-2">测试账号</p>
        <div class="text-xs text-blue-600 space-y-1">
          <p>手机号: 13800138000</p>
          <p>密码: 123456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingBag, Phone, Lock, Eye, EyeOff, Loader, AlertCircle } from 'lucide-vue-next'
import { login } from '@/api/auth'

const router = useRouter()

const loginForm = ref({
  phone: '',
  password: ''
})

const errors = ref({
  phone: '',
  password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// 表单验证
const validateForm = () => {
  errors.value = {
    phone: '',
    password: ''
  }

  let isValid = true

  // 验证手机号
  if (!loginForm.value.phone) {
    errors.value.phone = '请输入手机号'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(loginForm.value.phone)) {
    errors.value.phone = '请输入正确的手机号'
    isValid = false
  }

  // 验证密码
  if (!loginForm.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  } else if (loginForm.value.password.length < 6) {
    errors.value.password = '密码至少6个字符'
    isValid = false
  }

  return isValid
}

// 处理登录
const handleLogin = async () => {
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    const data = await login(loginForm.value)

    // 保存Token
    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)

    // 保存用户信息
    localStorage.setItem('user_info', JSON.stringify(data.user))

    // 跳转到首页
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败，请检查手机号和密码'
  } finally {
    loading.value = false
  }
}
</script>
