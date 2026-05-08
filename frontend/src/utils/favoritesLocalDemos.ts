/** 未登录或接口无数据时的收藏演示；id 不可走真实商品接口 */
export const FAVORITES_LOCAL_DEMO_IDS_PREFIX = 'local-demo-fav-'

export interface FavoritesLocalDemoRow {
  id: string
  title: string
  description: string
  image: string
  price: number
  tags: string[]
}

export const FAVORITES_LOCAL_DEMO_LIST: FavoritesLocalDemoRow[] = [
  {
    id: `${FAVORITES_LOCAL_DEMO_IDS_PREFIX}1`,
    title: 'Apple iPhone 15 Pro Max',
    description: '钛金属设计，A17 Pro芯片',
    image:
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    price: 9999,
    tags: ['手机'],
  },
  {
    id: `${FAVORITES_LOCAL_DEMO_IDS_PREFIX}2`,
    title: 'Nike Air Jordan 1',
    description: '经典配色，限量发售',
    image:
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    price: 1399,
    tags: ['运动'],
  },
  {
    id: `${FAVORITES_LOCAL_DEMO_IDS_PREFIX}3`,
    title: 'Sony WH-1000XM5 降噪耳机',
    description: '业界领先降噪技术',
    image:
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    price: 2499,
    tags: ['数码'],
  },
  {
    id: `${FAVORITES_LOCAL_DEMO_IDS_PREFIX}4`,
    title: 'Dyson V15吸尘器',
    description: '激光探测微尘',
    image:
      'https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    price: 4990,
    tags: ['数码'],
  },
]

/** 详情页用的完整字段（与 ProductDetail 模板一致） */
export function buildLocalDemoProductDetail(row: FavoritesLocalDemoRow) {
  const original = Math.round(row.price * 1.12)
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: String(row.price),
    originalPrice: String(original),
    mainImage: row.image,
    image: row.image,
    sales: 128,
    tags: row.tags,
  }
}

export const LOCAL_DEMO_PRODUCT_DETAIL_BY_ID: Record<string, ReturnType<typeof buildLocalDemoProductDetail>> =
  Object.fromEntries(FAVORITES_LOCAL_DEMO_LIST.map((r) => [r.id, buildLocalDemoProductDetail(r)]))
