// 商品类型
export interface Product {
  id: string
  image: string
  title: string
  price: string
  originalPrice: string
  sales: string
  tag: string
  isFavorite?: boolean
}

// 轮播图类型
export interface Banner {
  id: number
  image: string
  title: string
}

// 购物车商品类型
export interface CartItem {
  id: number
  image: string
  title: string
  specs: string
  price: number
  originalPrice: number
  quantity: number
  selected: boolean
}

// 帖子类型
export interface Post {
  id: number
  type: 'image' | 'video'
  image: string
  avatar: string
  username: string
  title: string
  content: string
  likes: string
  comments: string
  hasProduct: boolean
  duration?: string
}

// 快捷入口类型
export interface QuickAction {
  label: string
  gradient: string
  iconName: string
}

// 订单状态类型
export interface OrderStatus {
  label: string
  count: number
  color: string
  iconName: string
}

// 资产项类型
export interface AssetItem {
  label: string
  value: string
  gradient: string
  iconName: string
}

// 菜单项类型
export interface MenuItem {
  label: string
  color: string
  iconName: string
  highlight?: boolean
}
