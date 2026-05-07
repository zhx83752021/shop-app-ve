<template>
  <div class="banners-page">
    <el-card class="header-card">
      <div class="header-content">
        <h2>Banner管理</h2>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加Banner
        </el-button>
      </div>
    </el-card>

    <el-card class="table-card">
      <!-- 表格 -->
      <el-table :data="banners" v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="预览" width="200">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              :preview-src-list="[row.image]"
              fit="cover"
              style="width: 160px; height: 80px; border-radius: 4px"
            >
              <template #error>
                <div style="width: 160px; height: 80px; display: flex; align-items: center; justify-content: center; background: #f5f7fa; border-radius: 4px; font-size: 36px;">
                  🖼️
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="link" label="跳转链接" min-width="250" show-overflow-tooltip />
        <el-table-column label="排序" width="100">
          <template #default="{ row }">
            {{ row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 'ACTIVE'"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingBanner ? '编辑Banner' : '添加Banner'"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入Banner标题" />
        </el-form-item>
        <el-form-item label="图片URL" prop="image">
          <el-input v-model="formData.image" placeholder="请输入图片URL" />
          <div v-if="formData.image" class="image-preview">
            <el-image :src="formData.image" fit="cover" />
          </div>
        </el-form-item>
        <el-form-item label="跳转链接" prop="link">
          <el-input v-model="formData.link" placeholder="请输入跳转链接（可选）" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="9999" />
          <el-text type="info" size="small" style="margin-left: 10px">数字越小越靠前</el-text>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="ACTIVE">启用</el-radio>
            <el-radio label="INACTIVE">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ editingBanner ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import http from '@/api/http'

interface Banner {
  id: string
  title: string
  image: string
  link: string
  sort: number
  status: string
  createdAt: string
}

const loading = ref(false)
const submitting = ref(false)
const showAddDialog = ref(false)
const editingBanner = ref<Banner | null>(null)
const formRef = ref<FormInstance>()

const banners = ref<Banner[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const formData = reactive({
  title: '',
  image: '',
  link: '',
  sort: 0,
  status: 'ACTIVE'
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入Banner标题', trigger: 'blur' }],
  image: [
    { required: true, message: '请输入图片URL', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  sortOrder: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}

// 加载Banner列表
const loadBanners = async () => {
  try {
    loading.value = true
    const data = await http.get('/admin/banners', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    banners.value = data.items
    total.value = data.total
  } catch (error) {
    console.error('加载Banner失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 编辑Banner
const handleEdit = (banner: Banner) => {
  editingBanner.value = banner
  formData.title = banner.title
  formData.image = banner.image
  formData.link = banner.link
  formData.sort = banner.sort
  formData.status = banner.status
  showAddDialog.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      submitting.value = true
      const payload = {
        title: formData.title,
        image: formData.image,
        link: formData.link,
        sort: formData.sort,
        status: formData.status
      }

      if (editingBanner.value) {
        await http.put(`/admin/banners/${editingBanner.value.id}`, payload)
        ElMessage.success('更新成功')
      } else {
        await http.post('/admin/banners', payload)
        ElMessage.success('创建成功')
      }

      showAddDialog.value = false
      loadBanners()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// 状态切换
const handleStatusChange = async (banner: Banner) => {
  try {
    const newStatus = banner.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    await http.put(`/admin/banners/${banner.id}`, {
      ...banner,
      status: newStatus
    })
    banner.status = newStatus
    ElMessage.success('状态更新成功')
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 删除Banner
const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该Banner吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await http.delete(`/admin/banners/${id}`)
    ElMessage.success('删除成功')
    loadBanners()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 重置表单
const resetForm = () => {
  editingBanner.value = null
  formData.title = ''
  formData.image = ''
  formData.link = ''
  formData.sort = 0
  formData.status = 'ACTIVE'
  formRef.value?.resetFields()
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadBanners()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadBanners()
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

onMounted(() => {
  loadBanners()
})
</script>

<style scoped>
.banners-page {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.table-card {
  min-height: 600px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.image-preview {
  margin-top: 10px;
  width: 100%;
  max-height: 200px;
  border-radius: 4px;
  overflow: hidden;
}

.image-preview :deep(.el-image) {
  width: 100%;
  height: 200px;
}
</style>
