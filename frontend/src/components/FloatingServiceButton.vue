<template>
  <div class="floating-service">
    <button @click="openService" class="service-btn">
      <Headphones class="w-6 h-6" />
      <span v-if="hasUnread" class="badge">{{ unreadCount }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Headphones } from 'lucide-vue-next'

const router = useRouter()
const hasUnread = ref(false)
const unreadCount = ref(0)

const openService = () => {
  router.push('/customer-chat')
}
</script>

<style scoped>
.floating-service {
  position: fixed;
  right: 16px;
  bottom: 80px;
  z-index: 999;
  max-width: 448px; /* max-w-md = 28rem = 448px */
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 448px) {
  .floating-service {
    right: calc(50% - 224px + 16px); /* 居中容器内偏右16px */
  }
}

.service-btn {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s;
  position: relative;
}

.service-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.5);
}

.service-btn:active {
  transform: scale(0.95);
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  background: #ff4d4f;
  color: white;
  border-radius: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border: 2px solid white;
}
</style>
