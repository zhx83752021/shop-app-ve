<template>
  <div class="page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商品管理</span>
          <el-button type="primary" @click="dialogVisible = true">
            <el-icon><Plus /></el-icon>新增商品
          </el-button>
        </div>
      </template>

      <el-table :data="products" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="图片" width="100">
          <template #default="{ row }">
            <el-image :src="row.mainImage" style="width: 60px; height: 60px" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="sales" label="销量" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="total"
        @current-change="loadProducts"
        layout="total, prev, pager, next"
        style="margin-top: 20px; justify-content: center;"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" title="商品信息" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="ACTIVE">上架</el-radio>
            <el-radio label="INACTIVE">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api/admin'

const loading = ref(false)
const products = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const dialogVisible = ref(false)
const form = ref({ id: '', title: '', price: 0, stock: 0, status: 'ACTIVE' })

const loadProducts = async () => {
  try {
    loading.value = true
    const data = await getProducts({ page: page.value, pageSize: pageSize.value })
    products.value = data.items
    total.value = data.total
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = (row: any) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSave = async () => {
  try {
    if (form.value.id) {
      await updateProduct(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await createProduct(form.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadProducts()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确认删除该商品？', '提示', { type: 'warning' })
    await deleteProduct(id)
    ElMessage.success('删除成功')
    loadProducts()
  } catch {}
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.page { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
