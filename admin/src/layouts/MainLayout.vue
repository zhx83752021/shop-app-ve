<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <div class="logo">
        <h3>电商管理后台</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/products">
          <el-icon><ShoppingBag /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/categories">
          <el-icon><Grid /></el-icon>
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><DocumentCopy /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/refunds">
          <el-icon><RefreshLeft /></el-icon>
          <span>退款管理</span>
        </el-menu-item>
        <el-menu-item index="/posts">
          <el-icon><ChatLineSquare /></el-icon>
          <span>内容审核</span>
        </el-menu-item>
        <el-menu-item index="/coupons">
          <el-icon><Ticket /></el-icon>
          <span>优惠券管理</span>
        </el-menu-item>
        <el-menu-item index="/banners">
          <el-icon><Picture /></el-icon>
          <span>Banner管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left"></div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><Avatar /></el-icon>
              <span>{{ adminName }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const adminName = ref('管理员')

const activeMenu = computed(() => route.path)

const handleCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    ElMessage.success('退出成功')
    router.push('/login')
  }
}

onMounted(() => {
  const info = localStorage.getItem('admin_info')
  if (info) {
    const admin = JSON.parse(info)
    adminName.value = admin.username || '管理员'
  }
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: #f6f8fa;
}

.aside {
  background-color: #1a1a1a;
  height: 100vh;
  box-shadow: 4px 0 10px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.logo {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: #fff;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
}

.logo h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
}

:deep(.el-menu) {
  border-right: none;
  background-color: transparent !important;
}

:deep(.el-menu-item) {
  height: 54px;
  margin: 4px 12px;
  border-radius: 8px;
  color: #a0a0a0 !important;
}

:deep(.el-menu-item:hover) {
  background-color: #333 !important;
  color: #fff !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #409EFF !important;
  color: #fff !important;
  font-weight: 600;
}

.header {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 70px !important;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f3f4f6;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.user-info:hover {
  background: #e5e7eb;
}

.main {
  background-color: #f6f8fa;
  background-image: 
    radial-gradient(#d1d5db 0.5px, transparent 0.5px);
  background-size: 20px 20px;
  padding: 24px;
  overflow-y: auto;
}
</style>
