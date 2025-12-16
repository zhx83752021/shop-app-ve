<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in statsCards" :key="card.title">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-content">
            <div class="stats-left">
              <p class="stats-title">{{ card.title }}</p>
              <h2 class="stats-value">{{ card.value }}</h2>
            </div>
            <div class="stats-icon" :style="{ background: card.color }">
              <el-icon size="30">
                <component :is="card.icon" />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最近订单</span>
          </template>
          <el-table :data="recentOrders" stripe>
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="userName" label="用户" />
            <el-table-column prop="totalAmount" label="金额" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>待处理事项</span>
          </template>
          <el-table :data="pendingTasks" stripe>
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="count" label="数量">
              <template #default="{ row }">
                <el-tag type="warning">{{ row.count }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="small">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ShoppingCart, User, DocumentCopy, Wallet } from '@element-plus/icons-vue'
import { getDashboard } from '@/api/admin'
import { ElMessage } from 'element-plus'

const statsCards = ref([
  { title: '今日订单', value: '0', icon: ShoppingCart, color: '#409EFF' },
  { title: '总用户数', value: '0', icon: User, color: '#67C23A' },
  { title: '待发货订单', value: '0', icon: DocumentCopy, color: '#E6A23C' },
  { title: '今日销售额', value: '¥0', icon: Wallet, color: '#F56C6C' }
])

const recentOrders = ref([])
const pendingTasks = ref([
  { type: '待发货订单', count: 0 },
  { type: '退款申请', count: 0 },
  { type: '待审核内容', count: 0 }
])

const getStatusType = (status: string) => {
  const typeMap: any = {
    PENDING_PAYMENT: 'warning',
    PENDING_SHIPMENT: 'primary',
    PENDING_RECEIVE: 'info',
    COMPLETED: 'success',
    CANCELLED: 'danger'
  }
  return typeMap[status] || 'info'
}

const loadDashboard = async () => {
  try {
    const data = await getDashboard()

    statsCards.value[0].value = String(data.todayOrders || 0)
    statsCards.value[1].value = String(data.totalUsers || 0)
    statsCards.value[2].value = String(data.pendingShipment || 0)
    statsCards.value[3].value = `¥${data.todaySales || 0}`

    recentOrders.value = (data.recentOrders || []).map((order: any) => ({
      ...order,
      statusText: getStatusText(order.status)
    }))

    pendingTasks.value[0].count = data.pendingShipment || 0
    pendingTasks.value[1].count = data.pendingRefunds || 0
    pendingTasks.value[2].count = data.pendingReview || 0
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  }
}

const getStatusText = (status: string) => {
  const textMap: any = {
    PENDING_PAYMENT: '待付款',
    PENDING_SHIPMENT: '待发货',
    PENDING_RECEIVE: '待收货',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
  }
  return textMap[status] || status
}

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-card {
  margin-bottom: 20px;
}

.stats-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-title {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #909399;
}

.stats-value {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
