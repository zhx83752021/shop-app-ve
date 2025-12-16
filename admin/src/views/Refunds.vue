<template>
  <div class="page">
    <el-card>
      <template #header><span>退款管理</span></template>
      <el-table :data="refunds" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column prop="amount" label="退款金额" width="100" />
        <el-table-column prop="reason" label="退款原因" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'PENDING' ? 'warning' : row.status === 'APPROVED' ? 'success' : 'danger'">
              {{ row.status === 'PENDING' ? '待审核' : row.status === 'APPROVED' ? '已通过' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button v-if="row.status === 'PENDING'" size="small" type="success" @click="handleApprove(row.id)">
              通过
            </el-button>
            <el-button v-if="row.status === 'PENDING'" size="small" type="danger" @click="handleReject(row.id)">
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRefunds, processRefund } from '@/api/admin'

const loading = ref(false)
const refunds = ref([])

const loadRefunds = async () => {
  try {
    loading.value = true
    const data = await getRefunds()
    refunds.value = data.items || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleApprove = async (id: string) => {
  try {
    await processRefund(id, { action: 'APPROVE' })
    ElMessage.success('已通过')
    loadRefunds()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

const handleReject = async (id: string) => {
  try {
    await processRefund(id, { action: 'REJECT' })
    ElMessage.success('已拒绝')
    loadRefunds()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

onMounted(() => {
  loadRefunds()
})
</script>

<style scoped>
.page { padding: 20px; }
</style>
