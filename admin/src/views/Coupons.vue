<template>
  <div class="coupons-page">
    <el-card class="header-card">
      <div class="header-content">
        <h2>优惠券管理</h2>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          创建优惠券
        </el-button>
      </div>
    </el-card>

    <el-card class="table-card">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索优惠券名称"
          style="width: 300px"
          clearable
          @clear="loadCoupons"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="状态筛选" style="width: 150px" @change="loadCoupons">
          <el-option label="全部" value="" />
          <el-option label="未开始" value="PENDING" />
          <el-option label="进行中" value="ACTIVE" />
          <el-option label="已结束" value="EXPIRED" />
        </el-select>
        <el-button type="primary" @click="loadCoupons">搜索</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="coupons" v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="优惠券名称" min-width="200" />
        <el-table-column label="优惠金额" width="120">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.discountAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用条件" width="150">
          <template #default="{ row }">
            满 ¥{{ row.minAmount }} 可用
          </template>
        </el-table-column>
        <el-table-column label="发放/使用" width="150">
          <template #default="{ row }">
            {{ row.receivedCount }} / {{ row.usedCount }}
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="200">
          <template #default="{ row }">
            {{ formatDate(row.startTime) }} ~ {{ formatDate(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
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
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="loadCoupons"
          @size-change="loadCoupons"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingCoupon ? '编辑优惠券' : '创建优惠券'"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="优惠金额" prop="discountAmount">
          <el-input-number v-model="formData.discountAmount" :min="1" :max="10000" :step="10" />
        </el-form-item>
        <el-form-item label="最低消费" prop="minAmount">
          <el-input-number v-model="formData.minAmount" :min="0" :max="100000" :step="10" />
        </el-form-item>
        <el-form-item label="发放总量" prop="totalCount">
          <el-input-number v-model="formData.totalCount" :min="1" :max="100000" :step="100" />
        </el-form-item>
        <el-form-item label="有效期" prop="dateRange">
          <el-date-picker
            v-model="formData.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入优惠券描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ editingCoupon ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import http from '@/api/http'

interface Coupon {
  id: string
  name: string
  discountAmount: number
  minAmount: number
  totalCount: number
  receivedCount: number
  usedCount: number
  startTime: string
  endTime: string
  status: string
  description: string
}

const loading = ref(false)
const submitting = ref(false)
const showAddDialog = ref(false)
const editingCoupon = ref<Coupon | null>(null)
const formRef = ref<FormInstance>()

const coupons = ref<Coupon[]>([])
const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const formData = reactive({
  name: '',
  discountAmount: 10,
  minAmount: 100,
  totalCount: 1000,
  dateRange: [] as Date[],
  description: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  discountAmount: [{ required: true, message: '请输入优惠金额', trigger: 'blur' }],
  minAmount: [{ required: true, message: '请输入最低消费', trigger: 'blur' }],
  totalCount: [{ required: true, message: '请输入发放总量', trigger: 'blur' }],
  dateRange: [{ required: true, message: '请选择有效期', trigger: 'change' }]
}

// 加载优惠券列表
const loadCoupons = async () => {
  try {
    loading.value = true
    const data = await http.get('/admin/coupons', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        keyword: searchKeyword.value,
        status: filterStatus.value
      }
    })
    coupons.value = data.items
    total.value = data.total
  } catch (error) {
    console.error('加载优惠券失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 编辑优惠券
const handleEdit = (coupon: Coupon) => {
  editingCoupon.value = coupon
  formData.name = coupon.name
  formData.discountAmount = coupon.discountAmount
  formData.minAmount = coupon.minAmount
  formData.totalCount = coupon.totalCount
  formData.dateRange = [new Date(coupon.startTime), new Date(coupon.endTime)]
  formData.description = coupon.description
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
        discountAmount: formData.discountAmount,
        minAmount: formData.minAmount,
        totalCount: formData.totalCount,
        startTime: formData.dateRange[0].toISOString(),
        endTime: formData.dateRange[1].toISOString(),
        description: formData.description
      }

      if (editingCoupon.value) {
        await http.put(`/admin/coupons/${editingCoupon.value.id}`, payload)
        ElMessage.success('更新成功')
      } else {
        await http.post('/admin/coupons', payload)
        ElMessage.success('创建成功')
      }

      showAddDialog.value = false
      loadCoupons()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// 删除优惠券
const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该优惠券吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await http.delete(`/admin/coupons/${id}`)
    ElMessage.success('删除成功')
    loadCoupons()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 重置表单
const resetForm = () => {
  editingCoupon.value = null
  formData.name = ''
  formData.discountAmount = 10
  formData.minAmount = 100
  formData.totalCount = 1000
  formData.dateRange = []
  formData.description = ''
  formRef.value?.resetFields()
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 状态类型
const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    PENDING: 'info',
    ACTIVE: 'success',
    EXPIRED: 'danger'
  }
  return map[status] || 'info'
}

// 状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    PENDING: '未开始',
    ACTIVE: '进行中',
    EXPIRED: '已结束'
  }
  return map[status] || status
}

onMounted(() => {
  loadCoupons()
})
</script>

<style scoped>
.coupons-page {
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

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.amount-text {
  color: #f56c6c;
  font-weight: 600;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
