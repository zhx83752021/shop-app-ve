<template>
  <div class="page">
    <el-card>
      <template #header><span>内容审核</span></template>
      <el-table :data="posts" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="userName" label="发布者" width="120" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }">
            <el-tag>{{ row.type === 'IMAGE' ? '图文' : '视频' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.reviewStatus === 'PENDING' ? 'warning' : row.reviewStatus === 'APPROVED' ? 'success' : 'danger'">
              {{ row.reviewStatus === 'PENDING' ? '待审核' : row.reviewStatus === 'APPROVED' ? '已通过' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button v-if="row.reviewStatus === 'PENDING'" size="small" type="success" @click="handleApprove(row.id)">
              通过
            </el-button>
            <el-button v-if="row.reviewStatus === 'PENDING'" size="small" type="danger" @click="handleReject(row.id)">
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
import { getPosts, reviewPost } from '@/api/admin'

const loading = ref(false)
const posts = ref([])

const loadPosts = async () => {
  try {
    loading.value = true
    const data = await getPosts({ reviewStatus: 'PENDING' })
    posts.value = data.items || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleApprove = async (id: string) => {
  try {
    await reviewPost(id, { reviewStatus: 'APPROVED' })
    ElMessage.success('审核通过')
    loadPosts()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

const handleReject = async (id: string) => {
  try {
    await reviewPost(id, { reviewStatus: 'REJECTED' })
    ElMessage.success('已拒绝')
    loadPosts()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.page { padding: 20px; }
</style>
