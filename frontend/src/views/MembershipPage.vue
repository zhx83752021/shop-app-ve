<template>
  <div class="w-full page max-w-md mx-auto relative min-h-screen bg-[#FDF8F5]">
    <!-- 顶部视觉区 -->
    <div class="relative h-64 overflow-hidden">
      <img 
        src="https://images.pexels.com/photos/1051073/pexels-photo-1051073.jpeg?auto=compress&cs=tinysrgb&w=800" 
        class="w-full h-full object-cover"
        alt="Membership Background"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDF8F5]"></div>
      
      <!-- 顶部导航 -->
      <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <h1 class="text-white font-display font-bold text-lg">会员中心</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- 会员卡片 (悬浮感) -->
    <div class="px-5 -mt-32 relative z-20">
      <div class="member-card-glass p-6 rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/30 backdrop-blur-xl">
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-8">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg">
                <Crown class="w-6 h-6 text-white" />
              </div>
              <div>
                <span class="text-xs font-bold uppercase tracking-widest text-ink-muted/60 block">Black Card</span>
                <span class="text-lg font-display font-bold text-ink">黑金尊享会员</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-bold text-ink-muted uppercase tracking-tighter opacity-50">Score</p>
              <p class="text-xl font-display font-bold text-primary">{{ pointsDisplay }}</p>
            </div>
          </div>

          <div class="mb-8">
            <p class="text-2xl font-display font-bold text-ink tracking-tight">{{ userInfo.nickname || '尊贵的会员' }}</p>
            <p class="text-[10px] text-ink-muted font-medium mt-1 uppercase tracking-widest opacity-60">Valid Until Dec 31, 2025</p>
          </div>

          <div class="flex justify-between items-center bg-black/5 rounded-2xl p-4 border border-black/[0.03]">
            <div class="benefit-mini">
              <p class="text-sm font-bold text-ink">9.5折</p>
              <p class="text-[9px] text-ink-muted font-medium">EXCLUSIVE</p>
            </div>
            <div class="w-px h-6 bg-black/10"></div>
            <div class="benefit-mini">
              <p class="text-sm font-bold text-ink">{{ rewardYuan }}</p>
              <p class="text-[9px] text-ink-muted font-medium">REWARD ¥</p>
            </div>
            <div class="w-px h-6 bg-black/10"></div>
            <div class="benefit-mini">
              <p class="text-sm font-bold text-ink">免运费</p>
              <p class="text-[9px] text-ink-muted font-medium">FREE SHIP</p>
            </div>
          </div>
        </div>
        
        <!-- 卡片背景装饰 -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -ml-5 -mb-5"></div>
      </div>
    </div>

    <!-- 会员权益 (Editorial Grid) -->
    <div class="mt-8 px-5">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="font-display font-bold text-xl text-ink">会员特权</h2>
        <span class="text-[10px] font-bold text-primary uppercase tracking-widest">Your Benefits</span>
      </div>
      
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="privilege in privileges"
          :key="privilege.id"
          class="bg-white rounded-3xl p-4 flex flex-col items-center text-center shadow-sm border border-black/[0.02]"
        >
          <div class="w-10 h-10 rounded-2xl bg-[#F8F9FA] flex items-center justify-center mb-3">
            <component :is="privilege.icon" class="w-5 h-5 text-ink opacity-70" />
          </div>
          <p class="text-xs font-bold text-ink mb-1">{{ privilege.name }}</p>
          <p class="text-[10px] text-ink-muted leading-tight">{{ privilege.desc }}</p>
        </div>
      </div>
    </div>

    <!-- 专属商品 (Premium Cards) -->
    <div class="mt-8 px-5 mb-24">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="font-display font-bold text-xl text-ink">黑金专供</h2>
        <button class="text-xs text-ink-muted flex items-center gap-1 hover:text-primary transition-colors" @click="$router.push('/products?member=true')">
          查看全部 <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="product in memberProducts"
          :key="product.id"
          class="group cursor-pointer"
          @click="$router.push(`/product/${product.id}`)"
        >
          <div class="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-3">
            <ImageWithFallback
              :src="product.image"
              :alt="product.title"
              class-name="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute top-3 right-3 bg-ink/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-full">
              MEMBER ONLY
            </div>
          </div>
          <h3 class="text-xs font-bold text-ink line-clamp-1 mb-1">{{ product.title }}</h3>
          <div class="flex items-center gap-2">
            <span class="text-sm font-display font-bold text-primary">¥{{ product.memberPrice }}</span>
            <span class="text-[10px] text-ink-muted line-through opacity-50">¥{{ product.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 升级提示：与主栏同宽，不占满整屏 -->
    <div class="fixed bottom-0 inset-x-0 z-30 flex justify-center pointer-events-none">
      <div
        class="w-full max-w-md pointer-events-auto px-5 pt-10 pb-[max(1.25rem,env(safe-area-inset-bottom, 0px))] bg-gradient-to-t from-[#FDF8F5] via-[#FDF8F5]/92 to-transparent"
      >
        <button
          type="button"
          class="w-full h-14 bg-ink rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-ink/20 press-effect"
          @click="showUpgradeDialog = true"
        >
          <Zap class="w-5 h-5 text-[#FFD700]" />
          升级至白金会员 · 获更多权益
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Crown, Zap, Gift, Truck, Tag, Heart, Star, ChevronRight } from 'lucide-vue-next'
import ImageWithFallback from '@/components/ImageWithFallback.vue'
import { getUserProfile } from '@/api/user'
import { getProducts } from '@/api/product'

const userInfo = ref({
  nickname: '会员用户'
})

const membershipPoints = ref(8240)
const rewardYuan = ref('128.0')

const pointsDisplay = computed(() =>
  membershipPoints.value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })
)

const showUpgradeDialog = ref(false)

const privileges = [
  { id: 1, name: '专属折扣', desc: '全场9.5折', icon: Tag },
  { id: 2, name: '包邮特权', desc: '免运费', icon: Truck },
  { id: 3, name: '生日礼包', desc: '专属好礼', icon: Gift },
  { id: 4, name: '优先购买', desc: '新品首发', icon: Star },
  { id: 5, name: '积分翻倍', desc: '购物双倍积分', icon: Heart },
  { id: 6, name: '专属客服', desc: '1对1服务', icon: Crown }
]

const FALLBACK_MEMBER_PRODUCTS = [
  {
    id: '1',
    title: 'Apple AirPods Pro 2代',
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    price: 1999,
    memberPrice: 1899
  },
  {
    id: '2',
    title: 'Nike Air Max 270',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    price: 1299,
    memberPrice: 1199
  },
  {
    id: '3',
    title: 'Dyson吹风机',
    image: 'https://images.pexels.com/photos/3993306/pexels-photo-3993306.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    price: 2990,
    memberPrice: 2690
  },
  {
    id: '4',
    title: 'SK-II神仙水',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    price: 1590,
    memberPrice: 1390
  }
]

const memberProducts = ref([...FALLBACK_MEMBER_PRODUCTS])

async function loadProfile() {
  try {
    const p = await getUserProfile()
    userInfo.value.nickname = p.nickname?.trim() || userInfo.value.nickname
    if (typeof p.points === 'number' && !Number.isNaN(p.points)) {
      membershipPoints.value = p.points
    }
    const bal = Number(p.balance)
    if (Number.isFinite(bal)) {
      rewardYuan.value = bal.toFixed(1)
    }
  } catch {
    /* 未登录或网络异常时保留占位 */
  }
}

async function loadMemberShelf() {
  try {
    const res = await getProducts({ page: 1, pageSize: 4 })
    const items = Array.isArray((res as any)?.items) ? (res as any).items : []
    if (!items.length) return
    memberProducts.value = items.map((item: any) => {
      const price = Math.round(Number(item.price))
      return {
        id: item.id,
        title: item.title,
        image: item.mainImage,
        price,
        memberPrice: Math.max(1, Math.round(price * 0.95))
      }
    })
  } catch {
    memberProducts.value = [...FALLBACK_MEMBER_PRODUCTS]
  }
}

onMounted(() => {
  loadProfile()
  loadMemberShelf()
})
</script>

<style scoped>
.page {
  font-family: 'Inter', sans-serif;
}

.member-card-glass {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.benefit-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.press-effect:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* 隐藏滚动条 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
