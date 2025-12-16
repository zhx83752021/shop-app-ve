<template>
  <div class="chat-page">
    <!-- 顶部导航 -->
    <div class="chat-header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <div class="header-info">
        <h1 class="title">在线客服</h1>
        <p class="status">
          <span class="status-dot"></span>
          客服在线
        </p>
      </div>
      <div class="w-6"></div>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container" ref="messagesContainer">
      <div class="date-divider">
        <span>{{ currentDate }}</span>
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message-item', msg.isUser ? 'user' : 'service']"
      >
        <div class="avatar">
          <img
            v-if="!msg.isUser"
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
            alt="客服"
          />
          <User v-else class="w-6 h-6 text-gray-400" />
        </div>
        <div class="message-content">
          <div class="message-bubble">{{ msg.text }}</div>
          <div class="message-time">{{ msg.time }}</div>
        </div>
      </div>

      <!-- 快捷回复建议 -->
      <div v-if="showQuickReplies" class="quick-replies">
        <p class="quick-title">您可以问我：</p>
        <button
          v-for="(reply, index) in quickReplies"
          :key="index"
          @click="sendQuickReply(reply)"
          class="quick-reply-btn"
        >
          {{ reply }}
        </button>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="input-container">
      <button @click="showMoreOptions = !showMoreOptions" class="icon-btn">
        <Plus class="w-6 h-6" />
      </button>
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="输入消息..."
        class="message-input"
      />
      <button @click="sendMessage" :disabled="!inputMessage.trim()" class="send-btn">
        <Send class="w-5 h-5" />
      </button>
    </div>

    <!-- 更多选项 -->
    <div v-if="showMoreOptions" class="more-options">
      <button @click="handleAction('image')" class="option-btn">
        <Image class="w-6 h-6" />
        <span>图片</span>
      </button>
      <button @click="handleAction('order')" class="option-btn">
        <Package class="w-6 h-6" />
        <span>订单</span>
      </button>
      <button @click="handleAction('product')" class="option-btn">
        <ShoppingBag class="w-6 h-6" />
        <span>商品</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ArrowLeft, User, Plus, Send, Image, Package, ShoppingBag } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

interface Message {
  id: number
  text: string
  isUser: boolean
  time: string
}

const messages = ref<Message[]>([
  {
    id: 1,
    text: '您好！我是智能客服小助手，很高兴为您服务😊',
    isUser: false,
    time: '14:30'
  },
  {
    id: 2,
    text: '请问有什么可以帮助您的吗？',
    isUser: false,
    time: '14:30'
  }
])

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const showMoreOptions = ref(false)
const showQuickReplies = ref(true)

const quickReplies = [
  '查询订单',
  '退换货问题',
  '优惠券使用',
  '支付问题',
  '物流查询'
]

const currentDate = new Date().toLocaleDateString('zh-CN', {
  month: 'long',
  day: 'numeric'
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const getCurrentTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    text: inputMessage.value,
    isUser: true,
    time: getCurrentTime()
  })

  const userMsg = inputMessage.value
  inputMessage.value = ''
  showQuickReplies.value = false
  scrollToBottom()

  // 模拟客服回复
  setTimeout(() => {
    let reply = '感谢您的咨询，我们的客服人员会尽快为您解答。'

    if (userMsg.includes('订单')) {
      reply = '您可以在"我的订单"页面查看订单详情和物流信息哦～'
    } else if (userMsg.includes('退换货')) {
      reply = '如需退换货，请在订单详情页申请售后服务，我们会在24小时内处理。'
    } else if (userMsg.includes('优惠券')) {
      reply = '您可以在"我的优惠券"页面查看可用优惠券，下单时自动抵扣哦～'
    } else if (userMsg.includes('支付')) {
      reply = '我们支持微信支付、支付宝等多种支付方式，安全便捷！'
    }

    messages.value.push({
      id: Date.now(),
      text: reply,
      isUser: false,
      time: getCurrentTime()
    })
    scrollToBottom()
  }, 1000)
}

const sendQuickReply = (text: string) => {
  inputMessage.value = text
  sendMessage()
}

const handleAction = (type: string) => {
  showMoreOptions.value = false
  ElMessage.info(`${type === 'image' ? '图片' : type === 'order' ? '订单' : '商品'}功能开发中`)
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.header-info {
  flex: 1;
  text-align: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 2px;
}

.status {
  font-size: 12px;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
}

.date-divider {
  text-align: center;
  margin: 16px 0;
}

.date-divider span {
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: #999;
}

.message-item {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message-item.user .message-content {
  align-items: flex-end;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  word-wrap: break-word;
  font-size: 15px;
  line-height: 1.5;
}

.message-item.service .message-bubble {
  background: white;
  color: #333;
  border-radius: 4px 12px 12px 12px;
}

.message-item.user .message-bubble {
  background: #4f46e5;
  color: white;
  border-radius: 12px 4px 12px 12px;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
}

.quick-replies {
  margin-top: 20px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.quick-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.quick-reply-btn {
  display: inline-block;
  padding: 8px 16px;
  margin: 0 8px 8px 0;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-reply-btn:hover {
  background: #e5e5e5;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.message-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  font-size: 15px;
  outline: none;
}

.message-input:focus {
  border-color: #4f46e5;
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #4f46e5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  color: white;
  transition: all 0.2s;
}

.send-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  background: #4338ca;
}

.more-options {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.option-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f9fafb;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  background: #f3f4f6;
}

.option-btn span {
  font-size: 13px;
  color: #666;
}
</style>
