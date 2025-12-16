<template>
  <div class="page">
    <el-card>
      <template #header>
        <span>订单管理</span>
      </template>

      <el-table :data="orders" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column prop="totalAmount" label="金额" width="100" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'PENDING_SHIPMENT'" size="small" type="primary" @click="handleShip(row)">
              发货
            </el-button>
            <el-button size="small" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="total"
        @current-change="loadOrders"
        layout="total, prev, pager, next"
        style="margin-top: 20px; justify-content: center;"
      />
    </el-card>

    <el-dialog v-model="shipDialogVisible" title="订单发货" width="500px">
      <el-form :model="shipForm" label-width="100px">
        <el-form-item label="物流公司">
          <el-input v-model="shipForm.logisticsCompany" />
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="shipForm.trackingNumber" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleShipSubmit">确认发货</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrders, shipOrder } from '@/api/admin'

const loading = ref(false)
const orders = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const shipDialogVisible = ref(false)
const shipForm = ref({ orderId: '', logisticsCompany: '', trackingNumber: '' })

const loadOrders = async () => {
  try {
    loading.value = true
    const data = await getOrders({ page: page.value, pageSize: pageSize.value })
    orders.value = data.items
    total.value = data.total
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleShip = (row: any) => {
  shipForm.value = { orderId: row.id, logisticsCompany: '', trackingNumber: '' }
  shipDialogVisible.value = true
}

const handleShipSubmit = async () => {
  try {
    await shipOrder(shipForm.value.orderId, {
      logisticsCompany: shipForm.value.logisticsCompany,
      trackingNumber: shipForm.value.trackingNumber
    })
    ElMessage.success('发货成功')
    shipDialogVisible.value = false
    loadOrders()
  } catch (error: any) {
    ElMessage.error(error.message || '发货失败')
  }
}

const handleView = (row: any) => {
  ElMessage.info('查看订单详情: ' + row.orderNo)
}

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
  loadOrders()
})
</script>

<style scoped>
.page { padding: 20px; }
</style>
