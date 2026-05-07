<template>
  <div class="categories-page">
    <el-card class="header-card">
      <div class="header-content">
        <h2>分类管理</h2>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加分类
        </el-button>
      </div>
    </el-card>

    <el-card class="table-card">
      <!-- 表格 -->
      <el-table :data="categories" v-loading="loading" style="width: 100%" row-key="id" :tree-props="{children: 'children'}">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="图标" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.icon && row.icon.startsWith('http')"
              :src="row.icon"
              :preview-src-list="[row.icon]"
              fit="cover"
              style="width: 40px; height: 40px; border-radius: 8px"
            >
              <template #error>
                <div class="category-icon-placeholder" :style="{ backgroundColor: getCategoryColor(row.name) }">
                  {{ row.name.charAt(0) }}
                </div>
              </template>
            </el-image>
            <div v-else class="category-icon-placeholder" :style="{ backgroundColor: getCategoryColor(row.name) }">
              {{ row.icon || row.name.charAt(0) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column label="商品数量" width="120">
          <template #default="{ row }">
            <el-tag type="info">{{ row.productCount || 0 }}</el-tag>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handleAddChild(row)">添加子分类</el-button>
            <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="getDialogTitle()"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="上级分类">
          <el-select v-model="formData.parentId" placeholder="请选择上级分类（不选则为顶级分类）" clearable>
            <el-option label="顶级分类" value="" />
            <el-option
              v-for="cat in topCategories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标URL" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入图标URL（可选）" />
          <div v-if="formData.icon" class="icon-preview">
            <el-image :src="formData.icon" fit="cover" />
          </div>
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
          {{ editingCategory ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import http from '@/api/http'

interface Category {
  id: string
  name: string
  icon: string
  parentId: string | null
  sort: number
  status: string
  productCount: number
  createdAt: string
  children?: Category[]
}

const loading = ref(false)
const submitting = ref(false)
const showAddDialog = ref(false)
const editingCategory = ref<Category | null>(null)
const parentForNewChild = ref<Category | null>(null)
const formRef = ref<FormInstance>()

const categories = ref<Category[]>([])

const formData = reactive({
  name: '',
  icon: '',
  parentId: '',
  sort: 0,
  status: 'ACTIVE'
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

// 顶级分类列表（用于选择父分类）
const topCategories = computed(() => {
  return categories.value.filter(cat => !cat.parentId)
})

// 对话框标题
const getDialogTitle = () => {
  if (editingCategory.value) return '编辑分类'
  if (parentForNewChild.value) return `添加子分类 - ${parentForNewChild.value.name}`
  return '添加分类'
}

// 加载分类列表
const loadCategories = async () => {
  try {
    loading.value = true
    const data = await http.get('/admin/categories')
    // 构建树形结构
    categories.value = buildTree(data)
  } catch (error) {
    console.error('加载分类失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 构建树形结构
const buildTree = (list: Category[]): Category[] => {
  const map: Record<string, Category> = {}
  const roots: Category[] = []

  // 创建映射
  list.forEach(item => {
    map[item.id] = { ...item, children: [] }
  })

  // 构建树
  list.forEach(item => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children!.push(map[item.id])
    } else {
      roots.push(map[item.id])
    }
  })

  // 按sort排序
  const sortTree = (nodes: Category[]) => {
    nodes.sort((a, b) => a.sort - b.sort)
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortTree(node.children)
      }
    })
  }
  sortTree(roots)

  return roots
}

// 编辑分类
const handleEdit = (category: Category) => {
  editingCategory.value = category
  parentForNewChild.value = null
  formData.name = category.name
  formData.icon = category.icon
  formData.parentId = category.parentId || ''
  formData.sort = category.sort
  formData.status = category.status
  showAddDialog.value = true
}

// 添加子分类
const handleAddChild = (category: Category) => {
  editingCategory.value = null
  parentForNewChild.value = category
  formData.parentId = category.id
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
        name: formData.name,
        icon: formData.icon || undefined,
        parentId: formData.parentId || undefined,
        sort: formData.sort,
        status: formData.status
      }

      if (editingCategory.value) {
        await http.put(`/admin/categories/${editingCategory.value.id}`, payload)
        ElMessage.success('更新成功')
      } else {
        await http.post('/admin/categories', payload)
        ElMessage.success('创建成功')
      }

      showAddDialog.value = false
      loadCategories()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// 状态切换
const handleStatusChange = async (category: Category) => {
  try {
    const newStatus = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    await http.put(`/admin/categories/${category.id}`, {
      name: category.name,
      icon: category.icon,
      parentId: category.parentId,
      sort: category.sort,
      status: newStatus
    })
    category.status = newStatus
    ElMessage.success('状态更新成功')
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 删除分类
const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？如果有子分类也会一并删除！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await http.delete(`/admin/categories/${id}`)
    ElMessage.success('删除成功')
    loadCategories()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 重置表单
const resetForm = () => {
  editingCategory.value = null
  parentForNewChild.value = null
  formData.name = ''
  formData.icon = ''
  formData.parentId = ''
  formData.sort = 0
  formData.status = 'ACTIVE'
  formRef.value?.resetFields()
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

// 获取分类颜色
const getCategoryColor = (name: string) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
    '#F06292', '#AED581', '#FFD54F', '#4DB6AC', '#7986CB'
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.categories-page {
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

.icon-preview {
  margin-top: 10px;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.icon-preview :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.category-icon-placeholder {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
</style>
