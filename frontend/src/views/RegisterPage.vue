<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 to-purple-50 flex items-center justify-center p-4 max-w-md mx-auto relative">
    <div class="w-full max-w-md">
      <!-- Logo和标题 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
          <ShoppingBag class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">创建账户</h1>
        <p class="text-gray-600">注册成为会员，享受更多优惠</p>
      </div>

      <!-- 注册表单 -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleRegister">
          <!-- 手机号 -->
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              手机号
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="registerForm.phone"
                type="tel"
                placeholder="请输入手机号"
                maxlength="11"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                :class="{ 'border-red-500': errors.phone }"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-red-500">{{ errors.phone }}</p>
          </div>

          <!-- 验证码 -->
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              验证码
            </label>
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="registerForm.code"
                  type="text"
                  placeholder="请输入验证码"
                  maxlength="6"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  :class="{ 'border-red-500': errors.code }"
                />
              </div>
              <button
                type="button"
                @click="sendCode"
                :disabled="countdown > 0 || sendingCode"
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {{ countdown > 0 ? `${countdown}秒` : '发送验证码' }}
              </button>
            </div>
            <p v-if="errors.code" class="mt-1 text-sm text-red-500">{{ errors.code }}</p>
            <p v-if="devCode" class="mt-1 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              ✅ 测试环境验证码：<span class="font-mono font-bold">{{ devCode }}</span>
            </p>
          </div>

          <!-- 密码 -->
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              设置密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请设置6-20位密码"
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

          <!-- 用户协议 -->
          <div class="mb-6">
            <label class="flex items-start">
              <input
                v-model="agreedToTerms"
                type="checkbox"
                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
              />
              <span class="ml-2 text-sm text-gray-600">
                我已阅读并同意
                <button type="button" class="text-primary hover:text-primary-dark">用户协议</button>
                和
                <button type="button" class="text-primary hover:text-primary-dark">隐私政策</button>
              </span>
            </label>
            <p v-if="errors.terms" class="mt-1 text-sm text-red-500">{{ errors.terms }}</p>
          </div>

          <!-- 注册按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Loader v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5" />
            {{ loading ? '注册中...' : '注册' }}
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

        <!-- 登录链接 -->
        <div class="text-center">
          <p class="text-gray-600">
            已有账户？
            <button
              @click="$router.push('/login')"
              class="text-primary font-medium hover:text-primary-dark"
            >
              立即登录
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingBag, Phone, Shield, Lock, Eye, EyeOff, Loader, AlertCircle } from 'lucide-vue-next'
import { register, sendCode as sendVerifyCode } from '@/api/auth'

const router = useRouter()

const registerForm = ref({
  phone: '',
  code: '',
  password: ''
})

const errors = ref({
  phone: '',
  code: '',
  password: '',
  terms: ''
})

const showPassword = ref(false)
const agreedToTerms = ref(false)
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const errorMessage = ref('')
const devCode = ref('') // 开发环境验证码

// 表单验证
const validateForm = () => {
  errors.value = {
    phone: '',
    code: '',
    password: '',
    terms: ''
  }

  let isValid = true

  // 验证手机号
  if (!registerForm.value.phone) {
    errors.value.phone = '请输入手机号'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    errors.value.phone = '请输入正确的手机号'
    isValid = false
  }

  // 验证验证码
  if (!registerForm.value.code) {
    errors.value.code = '请输入验证码'
    isValid = false
  } else if (registerForm.value.code.length !== 6) {
    errors.value.code = '请输入6位验证码'
    isValid = false
  }

  // 验证密码
  if (!registerForm.value.password) {
    errors.value.password = '请设置密码'
    isValid = false
  } else if (registerForm.value.password.length < 6 || registerForm.value.password.length > 20) {
    errors.value.password = '密码长度为6-20位'
    isValid = false
  }

  // 验证协议
  if (!agreedToTerms.value) {
    errors.value.terms = '请阅读并同意用户协议和隐私政策'
    isValid = false
  }

  return isValid
}

// 发送验证码
const sendCode = async () => {
  // 验证手机号
  if (!registerForm.value.phone) {
    errors.value.phone = '请输入手机号'
    return
  }
  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    errors.value.phone = '请输入正确的手机号'
    return
  }

  try {
    sendingCode.value = true
    errors.value.phone = ''

    const result = await sendVerifyCode(registerForm.value.phone)

    // 在开发环境下显示验证码
    if (result.code) {
      devCode.value = result.code
      alert(`测试环境验证码：${result.code}`)
    }

    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error: any) {
    errors.value.phone = error.message || '发送验证码失败'
  } finally {
    sendingCode.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    const data = await register(registerForm.value)

    // 保存Token
    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)

    // 保存用户信息
    localStorage.setItem('user_info', JSON.stringify(data.user))

    // 跳转到首页
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
