<template>
  <div class="w-full min-h-screen relative overflow-hidden flex flex-col max-w-md mx-auto">
    <!-- 顶部装饰背景 -->
    <div class="relative h-64 flex-shrink-0 overflow-hidden">
      <!-- 背景图 -->
      <img
        :src="loginBg"
        alt="登录背景"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- 渐变遮层 -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/40"></div>
      <!-- Logo区 -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 shadow-float border border-white/30">
          <ShoppingBag class="w-8 h-8 text-white" />
        </div>
        <h1 class="font-display font-bold text-2xl tracking-wide">ShopNow</h1>
        <p class="text-white/70 text-sm mt-1">发现更多，购得更好</p>
      </div>
      <!-- 波浪底部装饰 -->
      <div class="absolute -bottom-1 left-0 right-0">
        <svg viewBox="0 0 375 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40L375 40L375 15C300 35 200 5 100 20C50 27 20 35 0 40Z" fill="#FFF8F5"/>
        </svg>
      </div>
    </div>

    <!-- 登录卡片 -->
    <div class="flex-1 bg-surface px-6 pb-8 -mt-2 relative z-10">
      <h2 class="font-display font-bold text-2xl text-ink mb-1 mt-2">欢迎回来</h2>
      <p class="text-ink-muted text-sm mb-6">登录账户，继续精彩购物</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- 手机号输入 -->
        <div>
          <label class="block text-xs font-medium text-ink-muted mb-1.5">手机号</label>
          <div
            class="flex items-center gap-3 bg-white border-2 rounded-card px-4 py-3 transition-all duration-200"
            :class="errors.phone ? 'border-danger' : 'border-transparent shadow-card focus-within:border-primary focus-within:shadow-card-hover'"
          >
            <Phone class="w-5 h-5 text-ink-muted flex-shrink-0" />
            <input
              v-model="loginForm.phone"
              type="tel"
              placeholder="请输入手机号"
              maxlength="11"
              class="flex-1 border-none outline-none text-sm text-ink bg-transparent placeholder:text-ink-muted/60"
            />
          </div>
          <p v-if="errors.phone" class="mt-1 text-xs text-danger flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5" />{{ errors.phone }}
          </p>
        </div>

        <!-- 密码输入 -->
        <div>
          <label class="block text-xs font-medium text-ink-muted mb-1.5">密码</label>
          <div
            class="flex items-center gap-3 bg-white border-2 rounded-card px-4 py-3 transition-all duration-200"
            :class="errors.password ? 'border-danger' : 'border-transparent shadow-card focus-within:border-primary focus-within:shadow-card-hover'"
          >
            <Lock class="w-5 h-5 text-ink-muted flex-shrink-0" />
            <input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              class="flex-1 border-none outline-none text-sm text-ink bg-transparent placeholder:text-ink-muted/60"
            />
            <button type="button" @click="showPassword = !showPassword" class="press-effect">
              <Eye v-if="!showPassword" class="w-5 h-5 text-ink-muted" />
              <EyeOff v-else class="w-5 h-5 text-ink-muted" />
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-xs text-danger flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5" />{{ errors.password }}
          </p>
        </div>

        <!-- 记住我 & 忘记密码 -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <div
              @click="rememberMe = !rememberMe"
              :class="['w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer',
                rememberMe ? 'bg-primary border-primary' : 'border-gray-300 bg-white']"
            >
              <Check v-if="rememberMe" class="w-3 h-3 text-white" />
            </div>
            <span class="text-sm text-ink-muted">记住我</span>
          </label>
          <button type="button" class="text-sm text-primary font-medium hover:text-primary-dark transition-colors">
            忘记密码？
          </button>
        </div>

        <!-- 登录按钮 -->
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary w-full mt-2"
          :class="loading ? 'opacity-60 cursor-not-allowed' : ''"
        >
          <Loader v-if="loading" class="animate-spin w-5 h-5" />
          <span>{{ loading ? '登录中…' : '立即登录' }}</span>
        </button>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="p-3 bg-danger/5 border border-danger/20 rounded-card flex items-start gap-2 animate-slide-up">
          <AlertCircle class="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
          <p class="text-sm text-danger">{{ errorMessage }}</p>
        </div>
      </form>

      <!-- 分割线 -->
      <div class="flex items-center gap-3 my-5">
        <div class="flex-1 h-px bg-surface-muted"></div>
        <span class="text-xs text-ink-muted">还没有账户？</span>
        <div class="flex-1 h-px bg-surface-muted"></div>
      </div>

      <!-- 注册入口 -->
      <button
        @click="$router.push('/register')"
        class="w-full py-3 rounded-card border-2 border-primary text-primary font-medium text-sm hover:bg-primary-50 transition-colors press-effect"
      >
        免费注册新账户
      </button>

      <!-- 测试账号提示 -->
      <div class="mt-4 p-3 bg-ink/5 border border-ink/10 rounded-card">
        <p class="text-xs text-ink-muted font-medium mb-1">测试账号（快速体验）</p>
        <div class="text-xs text-ink-muted space-y-0.5">
          <p>手机号：<span class="text-ink font-mono">13800138000</span></p>
          <p>密码：<span class="text-ink font-mono">123456</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingBag, Phone, Lock, Eye, EyeOff, Loader, AlertCircle, Check } from 'lucide-vue-next'
import { login } from '@/api/auth'
import loginBg from '@/assets/images/login_hero_bg.png'

const router = useRouter()

const loginForm = ref({ phone: '13800138000', password: '123456' })
const errors = ref({ phone: '', password: '' })
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')

/* 表单验证 */
const validateForm = () => {
  errors.value = { phone: '', password: '' }
  let isValid = true

  if (!loginForm.value.phone) {
    errors.value.phone = '请输入手机号'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(loginForm.value.phone)) {
    errors.value.phone = '请输入正确的手机号'
    isValid = false
  }

  if (!loginForm.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  } else if (loginForm.value.password.length < 6) {
    errors.value.password = '密码至少6个字符'
    isValid = false
  }

  return isValid
}

/* 处理登录 */
const handleLogin = async () => {
  errorMessage.value = ''
  if (!validateForm()) return

  try {
    loading.value = true
    const data = await login(loginForm.value)
    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)
    localStorage.setItem('user_info', JSON.stringify(data.user))
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败，请检查手机号和密码'
  } finally {
    loading.value = false
  }
}
</script>
