<template>
  <div class="page max-w-md mx-auto relative">
    <!-- 顶部导航栏 -->
    <div class="header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="title">收货地址</h1>
      <div class="w-6"></div>
    </div>

    <!-- 地址列表 -->
    <div class="address-list">
      <div v-if="addresses.length === 0" class="empty-state">
        <MapPin class="w-16 h-16 text-gray-300 mb-4" />
        <p class="text-gray-500">暂无收货地址</p>
        <button @click="showAddDialog = true" class="add-btn-empty">
          添加新地址
        </button>
      </div>

      <div v-else>
        <div
          v-for="address in addresses"
          :key="address.id"
          class="address-card"
        >
          <div class="address-header">
            <div class="address-info">
              <span class="name">{{ address.name }}</span>
              <span class="phone">{{ address.phone }}</span>
            </div>
            <span v-if="address.isDefault" class="default-badge">默认</span>
          </div>
          <div class="address-detail">
            <MapPin class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p class="address-text">
              {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
            </p>
          </div>
          <div class="address-actions">
            <button @click="editAddress(address)" class="action-btn">
              <Edit2 class="w-4 h-4" />
              <span>编辑</span>
            </button>
            <button @click="deleteAddress(address.id)" class="action-btn">
              <Trash2 class="w-4 h-4" />
              <span>删除</span>
            </button>
            <button
              v-if="!address.isDefault"
              @click="setDefault(address.id)"
              class="action-btn"
            >
              <Star class="w-4 h-4" />
              <span>设为默认</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加地址按钮 -->
    <div v-if="addresses.length > 0" class="fixed-bottom">
      <button @click="showAddDialog = true" class="add-btn">
        <Plus class="w-5 h-5" />
        添加新地址
      </button>
    </div>

    <!-- 添加/编辑地址对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingAddress ? '编辑地址' : '新增地址'"
      width="380px"
      :close-on-click-modal="false"
    >
      <el-form :model="addressForm" label-width="80px">
        <el-form-item label="收货人">
          <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addressForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="省市区">
          <el-cascader
            v-model="selectedRegion"
            :options="regionData"
            placeholder="请选择省市区"
            @change="handleRegionChange"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            v-model="addressForm.detail"
            type="textarea"
            :rows="3"
            placeholder="请输入详细地址（街道、门牌号等）"
          />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="addressForm.isDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowLeft, MapPin, Edit2, Trash2, Star, Plus } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getAddresses as getAddressesAPI,
  addAddress as addAddressAPI,
  updateAddress as updateAddressAPI,
  deleteAddress as deleteAddressAPI,
  setDefaultAddress as setDefaultAddressAPI
} from '@/api/address'
import { regionData } from '@/data/regions'

interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

const addresses = ref<Address[]>([])
const showAddDialog = ref(false)
const editingAddress = ref<Address | null>(null)
const loading = ref(false)

// 地址表单数据
const addressForm = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

// 地区选择器的值
const selectedRegion = ref<string[]>([])

// 加载地址列表
const loadAddresses = async () => {
  try {
    loading.value = true
    const data = await getAddressesAPI()
    // 处理可能的数据格式
    if (Array.isArray(data)) {
      addresses.value = data
    } else if (data && data.items) {
      addresses.value = data.items
    } else if (data && data.data) {
      addresses.value = data.data
    } else {
      addresses.value = []
    }
  } catch (error: any) {
    console.error('加载地址列表失败:', error)
    // 不是401错误才提示
    if (error?.response?.status !== 401) {
      ElMessage.error('加载失败')
    }
    addresses.value = []
  } finally {
    loading.value = false
  }
}

// 编辑地址
const editAddress = (address: Address) => {
  editingAddress.value = address
  addressForm.value = {
    name: address.name,
    phone: address.phone,
    province: address.province,
    city: address.city,
    district: address.district,
    detail: address.detail,
    isDefault: address.isDefault
  }
  // 设置地区选择器的值
  selectedRegion.value = [address.province, address.city, address.district]
  showAddDialog.value = true
}

// 删除地址
const deleteAddress = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteAddressAPI(id)
    ElMessage.success('删除成功')
    await loadAddresses()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除地址失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 设为默认
const setDefault = async (id: string) => {
  try {
    await setDefaultAddressAPI(id)
    ElMessage.success('已设为默认地址')
    await loadAddresses()
  } catch (error) {
    console.error('设置默认地址失败:', error)
    ElMessage.error('设置失败')
  }
}

// 保存地址
const saveAddress = async () => {
  if (!addressForm.value.name || !addressForm.value.phone || !addressForm.value.detail) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    const data = {
      name: addressForm.value.name,
      phone: addressForm.value.phone,
      province: addressForm.value.province || '未选择',
      city: addressForm.value.city || '未选择',
      district: addressForm.value.district || '未选择',
      detail: addressForm.value.detail,
      isDefault: addressForm.value.isDefault
    }

    if (editingAddress.value) {
      await updateAddressAPI(editingAddress.value.id, data)
      ElMessage.success('地址已更新')
    } else {
      await addAddressAPI(data)
      ElMessage.success('地址已添加')
    }

    showAddDialog.value = false
    resetForm()
    await loadAddresses()
  } catch (error) {
    console.error('保存地址失败:', error)
    ElMessage.error('保存失败')
  }
}

// 重置表单
const resetForm = () => {
  addressForm.value = {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  }
  selectedRegion.value = []
  editingAddress.value = null
}

// 地区选择变化
const handleRegionChange = (value: string[]) => {
  if (value && value.length === 3) {
    addressForm.value.province = value[0]
    addressForm.value.city = value[1]
    addressForm.value.district = value[2]
  } else {
    addressForm.value.province = ''
    addressForm.value.city = ''
    addressForm.value.district = ''
  }
}

onMounted(() => {
  loadAddresses()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.address-list {
  padding: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.add-btn-empty {
  margin-top: 24px;
  padding: 12px 32px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
}

.address-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.address-info {
  display: flex;
  gap: 12px;
}

.name {
  font-size: 16px;
  font-weight: 600;
}

.phone {
  font-size: 14px;
  color: #666;
}

.default-badge {
  background: #ff4757;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.address-detail {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.address-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 448px;
  margin: 0 auto;
  padding: 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.add-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}
</style>
