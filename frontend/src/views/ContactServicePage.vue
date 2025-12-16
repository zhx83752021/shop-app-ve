<template>
  <div class="page max-w-md mx-auto relative">
    <!-- 顶部导航栏 -->
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">联系客服</h1>
      <div class="w-6"></div>
    </div>

    <!-- 客服信息 -->
    <div class="service-info">
      <div class="avatar-section">
        <div class="avatar-bg">
          <Headphones class="w-12 h-12 text-white" />
        </div>
        <h2 class="service-name">在线客服</h2>
        <p class="service-status online">
          <span class="dot"></span>
          在线
        </p>
      </div>

      <!-- 快捷服务 -->
      <div class="quick-services">
        <div class="service-card" @click="handleService('订单问题')">
          <Package class="w-6 h-6 text-primary" />
          <span>订单问题</span>
        </div>
        <div class="service-card" @click="handleService('物流查询')">
          <Truck class="w-6 h-6 text-primary" />
          <span>物流查询</span>
        </div>
        <div class="service-card" @click="handleService('退换货')">
          <RotateCcw class="w-6 h-6 text-primary" />
          <span>退换货</span>
        </div>
        <div class="service-card" @click="handleService('商品咨询')">
          <MessageSquare class="w-6 h-6 text-primary" />
          <span>商品咨询</span>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="contact-methods">
        <div class="method-title">其他联系方式</div>

        <div class="method-item">
          <div class="method-info">
            <Phone class="w-5 h-5 text-gray-500" />
            <div>
              <p class="method-name">客服热线</p>
              <p class="method-value">400-888-8888</p>
            </div>
          </div>
          <button @click="callPhone" class="method-btn">
            拨打
          </button>
        </div>

        <div class="method-item">
          <div class="method-info">
            <Mail class="w-5 h-5 text-gray-500" />
            <div>
              <p class="method-name">客服邮箱</p>
              <p class="method-value">service@example.com</p>
            </div>
          </div>
          <button @click="copyEmail" class="method-btn">
            复制
          </button>
        </div>

        <div class="method-item">
          <div class="method-info">
            <Clock class="w-5 h-5 text-gray-500" />
            <div>
              <p class="method-name">服务时间</p>
              <p class="method-value">周一至周日 9:00-22:00</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 在线客服按钮 -->
      <div class="fixed-bottom">
        <button @click="startChat" class="chat-btn">
          <MessageCircle class="w-5 h-5" />
          开始在线咨询
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Headphones, Package, Truck, RotateCcw, MessageSquare, Phone, Mail, Clock, MessageCircle } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const router = useRouter()

const handleService = (_type: string) => {
  // 直接跳转到聊天页面
  router.push('/customer-chat')
}

const callPhone = () => {
  window.location.href = 'tel:400-888-8888'
}

const copyEmail = () => {
  navigator.clipboard.writeText('service@example.com')
  ElMessage.success('邮箱已复制到剪贴板')
}

const startChat = () => {
  router.push('/customer-chat')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
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

.service-info {
  padding: 16px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
}

.avatar-bg {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.service-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.service-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #52c41a;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #52c41a;
}

.quick-services {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.service-card:active {
  transform: scale(0.95);
}

.service-card span {
  font-size: 12px;
  color: #666;
}

.contact-methods {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.method-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.method-item:last-child {
  border-bottom: none;
}

.method-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.method-name {
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
}

.method-value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.method-btn {
  padding: 6px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 448px;
  margin: 0 auto;
  padding: 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.chat-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}
</style>
