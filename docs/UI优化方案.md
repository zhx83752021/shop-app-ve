# ShopNow 前端 UI 优化方案

> 基于 `frontend-design` + `ui-ux-pro-max` 双技能分析
> 生成时间：2026-04-30
> 技术栈：Vue 3 + TypeScript + Tailwind CSS + Lucide Icons

---

## 一、现状诊断

### 1.1 图文不贴合问题（核心痛点）

| 位置 | 问题描述 | 严重程度 |
|------|----------|----------|
| `ProductDetail.vue` L110-116 | 详情图用**静态** Pexels ID `[5632399, 5632380, 5632371]`，与实际商品类型无关，所有商品详情页看到的是同一批图 | 🔴 高 |
| `HomePage.vue` L326-342 | 直播封面：iPhone专场用本地生成图（`live_stream_cover.png`），但美妆、运动鞋直播用的是 Pexels 图，图文匹配度不一致 | 🟡 中 |
| `CartPage.vue` L124-128 | 推荐商品图片未做主题/内容关联，fallback 图与商品文案可能毫不相关 | 🟡 中 |
| `HomePage.vue` Banner区 | 3张本地PNG（新品、秒杀、美妆）图片内容良好，但文字叠层遮挡了图片焦点区域 | 🟡 中 |

### 1.2 跨页面设计割裂（一致性问题）

```
已统一设计系统的页面：   HomePage ✅  ProductDetail ✅  LoginPage ✅
未统一的页面：            CartPage ❌  ProfilePage ❌
```

`CartPage.vue` 和 `ProfilePage.vue` 大量使用 Tailwind 默认色板（`gray-50`、`gray-200`、`border-gray-100`），
与项目设计令牌（`surface`、`ink`、`primary`）完全割裂，导致视觉风格不一致。

### 1.3 动效与交互缺失

- 商品卡片入场无骨架屏/渐入动画
- 详情页图片区域无多图轮播（固定显示1张）
- 购物车空状态缺少插画引导
- 推荐商品区滚动无 scroll snap

### 1.4 图片性能问题

- 所有 Pexels 图片缺少 `loading="lazy"`
- 部分图片尺寸参数不合理
- 本地图片（PNG格式）文件偏大，未做 WebP 转换

---

## 二、设计系统参考

```css
/* 颜色令牌（保持现有） */
--color-primary: #FF4500;   /* 活力橙红 */
--color-accent:  #FF8C00;   /* 金橙 */
--color-ink:     #1A1A2E;   /* 深墨 */
--color-surface: #FFF8F5;   /* 暖白 */
--color-danger:  #FF2D55;   /* 鲜红 */
```

> **Anti-patterns（禁止）**：紫色渐变、gray-* 默认色、emoji 图标、线性 ease-in-out 动画

---

## 三、优化任务清单

### 🔴 P0 — 图文贴合（本次核心）

#### 任务 1：ProductDetail 详情图动态匹配
**文件：** `src/views/ProductDetail.vue`

按商品分类预设高质量 Pexels 图 ID，`detailImageIds` 改为 computed：

```typescript
const CATEGORY_IMAGE_POOLS: Record<string, number[]> = {
  '手机':    [1092644,  607812, 1038000],
  '美妆':    [3373736, 2693617, 3825517],
  '运动':    [2529148, 1598505, 2048548],
  '服装':    [1536619, 1536620, 1536621],
  '数码':    [1779487, 5082579, 3825540],
  '食品':    [1640777, 1640772, 1640773],
  'default': [5632399, 3735173, 1600698],
}

const detailImageIds = computed(() => {
  const tag = product.value.tags?.[0]
  return CATEGORY_IMAGE_POOLS[tag] || CATEGORY_IMAGE_POOLS['default']
})
```

#### 任务 2：ImageWithFallback 语义化占位
**文件：** `src/components/ImageWithFallback.vue`

图片加载失败时，生成基于商品名哈希的渐变色块，显示商品首字：

```typescript
const generateGradient = (text: string) => {
  const hash = [...(text || '')].reduce((h, c) => h * 31 + c.charCodeAt(0), 0)
  const hue1 = Math.abs(hash) % 360
  const hue2 = (hue1 + 40) % 360
  return `linear-gradient(135deg, hsl(${hue1},70%,55%), hsl(${hue2},70%,45%))`
}
```

#### 任务 3：Banner 遮罩方向与图片焦点分离
**文件：** `src/views/HomePage.vue`

为每张 Banner 配置遮罩方向，文字落在图片空白区：

```typescript
const localBanners = ref([
  { ..., maskDir: 'left'   }, // 新品首发
  { ..., maskDir: 'bottom' }, // 限时秒杀
  { ..., maskDir: 'right'  }, // 美妆专场
])
```

### 🟠 P1 — 跨页面设计一致性

#### 任务 4：CartPage 设计系统统一
**文件：** `src/views/CartPage.vue`

| 替换前 | 替换后 |
|--------|--------|
| `bg-gray-50` | `bg-surface` |
| `bg-gray-100` | `bg-surface-muted` |
| `border-gray-200` | `border-surface-muted` |
| `text-gray-500` | `text-ink-muted` |
| `text-gray-400` | `text-ink-muted` |
| `text-gray-600` | `text-ink-soft` |

头部改用 glass 效果，底部结算栏改用 shadow-bottom-bar。

#### 任务 5：ProfilePage 设计系统统一
**文件：** `src/views/ProfilePage.vue`

头部渐变改用品牌色，订单图标颜色改用品牌令牌，资产卡渐变改用品牌渐变。

### 🟡 P2 — 动效与交互增强

#### 任务 6：商品卡片入场动画
**文件：** `tailwind.config.js` + `src/views/HomePage.vue`

新增 `fade-in-up` keyframe，为推荐商品网格添加交错延迟 `animationDelay: index * 60ms`。

#### 任务 7：DetailPage 图片轮播
**文件：** `src/views/ProductDetail.vue`

主图区改为横向滑动轮播，支持触摸滑动切换。

#### 任务 8：购物车空状态插画
**文件：** `src/views/CartPage.vue`

当 `cartItems.length === 0` 时展示 unDraw 插画 + 引导按钮。

### 🟢 P3 — 图片性能优化

#### 任务 9：全局懒加载
所有 `<img>` 添加 `loading="lazy" decoding="async"`。

#### 任务 10：Pexels 图片尺寸规范

| 场景 | 参数 |
|------|------|
| 商品缩略图 | `w=400&h=400&fit=crop&auto=compress` |
| 详情主图 | `w=800&h=800&fit=crop&auto=compress` |
| Banner | `w=800&h=350&fit=crop&auto=compress` |
| 直播封面 | `w=400&h=600&fit=crop&auto=compress` |

### 🔵 P4 — 细节打磨

#### 任务 11：价格格式化规范化
**文件：** `src/views/HomePage.vue`

消除模板层 `replace` 调用，统一在数据格式化层处理。

#### 任务 12：搜索关键词高亮
**文件：** `src/views/HomePage.vue`

匹配文字用 `<mark>` 高亮显示。

#### 任务 13：按钮涟漪效果
**文件：** `src/style.css`

`.btn-ripple` 类，`:active::after` 触发 radial-gradient 涟漪。

#### 任务 14：直播封面图文一致性
**文件：** `src/views/HomePage.vue`

iPhone直播封面改用手机/数码类 Pexels 图（ID: 1092644）。

---

## 四、实施顺序

```
第1轮：任务1 + 任务3 + 任务14   ← 图文贴合，视觉冲击最大
第2轮：任务4 + 任务5              ← 设计一致性
第3轮：任务6 + 任务7 + 任务8      ← 动效交互
第4轮：任务9 + 任务10             ← 图片性能
第5轮：任务2 + 任务11~13          ← 细节完善
```

---

## 五、验收清单

- [x] 所有 `<img>` 有描述性 `alt` 文本
- [x] 所有可点击元素有 `cursor-pointer`
- [x] Hover 状态提供视觉反馈（颜色/阴影变化）
- [x] 过渡动画时长 150-300ms
- [x] 无 emoji 作为功能图标
- [x] 浅色模式文字对比度 ≥ 4.5:1
- [x] 无 `gray-*` 默认色
- [x] 图文内容语义匹配
- [x] 图片均有 `loading="lazy"` + `decoding="async"`
- [x] 直播/Banner 图片与文案语义一致
