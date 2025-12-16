<template>
  <div class="page">
    <el-card>
      <template #header><span>用户管理</span></template>
      <el-table :data="users" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="memberLevel" label="等级" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" :type="row.status === 'ACTIVE' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)">
              {{ row.status === 'ACTIVE' ? '禁用' : '启用' }}
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
import { getUsers, updateUserStatus } from '@/api/admin'

const loading = ref(false)
const users = ref([])

const loadUsers = async () => {
  try {
    loading.value = true
    const data = await getUsers()
    users.value = data.items || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleToggleStatus = async (row: any) => {
  try {
    const newStatus = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    await updateUserStatus(row.id, newStatus)
    ElMessage.success('操作成功')
    loadUsers()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.page { padding: 20px; }
</style>
