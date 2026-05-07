<template>
  <div class="login-wrapper">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="login-box">
      <div class="login-left">
        <div class="brand">
          <div class="logo-box">
            <el-icon :size="32" color="#fff"><Shop /></el-icon>
          </div>
          <h1>ShopApp</h1>
        </div>
        <div class="welcome-text">
          <h2>欢迎回来</h2>
          <p>请登录您的管理账号以继续</p>
        </div>
        
        <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="0" class="login-form">
          <el-form-item prop="username">
            <div class="input-label">用户名</div>
            <el-input
              v-model="loginForm.username"
              placeholder="admin"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
  
          <el-form-item prop="password">
            <div class="input-label">密码</div>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="admin123"
              :prefix-icon="Lock"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
  
          <el-form-item class="submit-item">
            <el-button
              type="primary"
              size="large"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="test-notice">
          <el-icon><InfoFilled /></el-icon>
          <span>测试账号：admin / admin123</span>
        </div>
      </div>
      
      <div class="login-right">
        <div class="glass-overlay">
          <div class="quote-content">
            <h3 class="quote-text">高效管理，智启未来</h3>
            <p class="quote-sub">ShopApp 提供极致的数字化商业运营体验</p>
            <div class="quote-line"></div>
            <span class="quote-author">ShopApp Admin Team</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Shop, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { login } from '@/api/admin'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: 'admin123'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    const data = await login(loginForm)
    localStorage.setItem('admin_token', data.accessToken)
    localStorage.setItem('admin_info', JSON.stringify(data.admin))

    ElMessage.success('登录成功')
    router.push('/')
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f172a;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: rgba(30, 64, 175, 0.3);
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: rgba(124, 58, 237, 0.2);
  bottom: -50px;
  right: -50px;
}

.circle-3 {
  width: 250px;
  height: 250px;
  background: rgba(14, 165, 233, 0.2);
  top: 50%;
  left: 60%;
}

.login-box {
  width: 960px;
  height: 600px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  display: flex;
  z-index: 10;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.login-left {
  flex: 1.2;
  padding: 60px;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 48px;
}

.logo-box {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.brand h1 {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  margin: 0;
}

.welcome-text h2 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.welcome-text p {
  color: #94a3b8;
  font-size: 15px;
  margin: 0 0 40px 0;
}

.input-label {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 10px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.04) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 14px !important;
  padding: 0 18px !important;
  transition: all 0.3s;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6 !important;
  background-color: rgba(255, 255, 255, 0.06) !important;
}

:deep(.el-input__inner) {
  color: #fff !important;
  height: 52px !important;
}

.submit-item {
  margin-top: 32px;
}

.login-btn {
  width: 100%;
  height: 52px !important;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%) !important;
  border: none !important;
  border-radius: 14px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  transition: all 0.3s !important;
  letter-spacing: 2px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.4);
}

.test-notice {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 13px;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.login-right {
  flex: 0.8;
  background-image: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=compress&cs=tinysrgb&w=800');
  background-size: cover;
  background-position: center;
  position: relative;
}

.glass-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.quote-content {
  text-align: center;
}

.quote-text {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.quote-sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 24px;
}

.quote-line {
  width: 40px;
  height: 2px;
  background: #3b82f6;
  margin: 0 auto 24px;
}

.quote-author {
  color: #3b82f6;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
}

@media (max-width: 1024px) {
  .login-box {
    width: 480px;
  }
  .login-right {
    display: none;
  }
}
</style>
