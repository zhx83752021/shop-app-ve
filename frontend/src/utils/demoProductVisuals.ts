/** 演示商品用图：与文案/品类一致，统一走 Pexels（与项目其它页一致） */
const Q = '?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
const Q300 = '?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'

export function pexelsSquare(photoId: number): string {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg${Q}`
}

export function pexelsThumb(photoId: number): string {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg${Q300}`
}

/** 品牌馆闪购占位：一品牌一主图，避免「华为配随机图」 */
export const brandDemoImageByName: Record<string, string> = {
  Apple: pexelsSquare(3780681), // 耳机类
  Samsung: pexelsSquare(1092644), // 手机数码
  Nike: pexelsSquare(2529148),
  Adidas: pexelsSquare(2529148), // 与 Nike 同品类跑鞋素材（演示）
  Huawei: pexelsSquare(788946),
  Xiaomi: pexelsSquare(3825540),
  Puma: pexelsSquare(1036623),
  Sony: pexelsSquare(1779487), // 桌面影音办公
}

export function imageForShowroomBrand(brand: string): string {
  return brandDemoImageByName[brand] ?? pexelsSquare(1092644)
}

/** 与 brandDemoImageByName 一一对应 */
export const brandSaleDemoMeta = [
  { brand: 'Apple', title: '主动降噪耳机' },
  { brand: 'Samsung', title: '轻薄钢化膜套装' },
  { brand: 'Nike', title: '气垫跑鞋限量色' },
  { brand: 'Adidas', title: '经典款跑鞋' },
  { brand: 'Huawei', title: '高清轻薄办公本' },
  { brand: 'Xiaomi', title: '智能台灯床头款' },
  { brand: 'Puma', title: '休闲连帽卫衣' },
  { brand: 'Sony', title: '头戴式监听耳机' },
] as const

export const flashSaleDemoVisuals = [
  { title: '示例：无线耳机', image: pexelsThumb(3780681) },
  { title: '示例：运动水壶', image: pexelsThumb(3270989) },
  { title: '示例：便携台灯', image: pexelsThumb(1779487) },
  { title: '示例：数据线套装', image: pexelsThumb(1092644) },
]

export const newProductDemoVisuals = [
  { title: '雾面口红小样', brief: '三支热门色，随身补妆', image: pexelsSquare(3373736) },
  { title: '折叠阅读灯', brief: '三档色温，护眼不闪', image: pexelsSquare(1779487) },
  { title: '速干运动毛巾', brief: '吸汗快干，健身房常备', image: pexelsSquare(1036623) },
  { title: '玻璃密封罐两件', brief: '厨房收纳，杂粮好搭档', image: pexelsSquare(3825540) },
]

export const rankingDemoVisuals = [
  { title: '柔肤保湿面霜', image: pexelsSquare(3373736) },
  { title: '轻便跑步鞋', image: pexelsSquare(2529148) },
  { title: '不锈钢保温杯', image: pexelsSquare(6062297) },
  { title: '无线鼠标', image: pexelsSquare(1779487) },
  { title: '香薰蜡烛套装', image: pexelsSquare(4202325) },
  { title: '纯棉床品四件套', image: pexelsSquare(1549183) },
]

export const homeDemoVisuals = [
  { title: '柔弹抱枕套组', tag: '推荐', image: pexelsSquare(3825540), price: '￥39', originalPrice: '￥59', sales: '已售1200' },
  { title: '静音键盘垫', tag: '新品', image: pexelsSquare(1779487), price: '￥49', originalPrice: '￥79', sales: '已售890' },
  { title: '便携榨汁杯', tag: '热卖', image: pexelsSquare(3029401), price: '￥69', originalPrice: '￥99', sales: '已售560' },
  { title: '香薰藤条礼盒', tag: '推荐', image: pexelsSquare(3373736), price: '￥59', originalPrice: '￥89', sales: '已售2300' },
  { title: '薄款防晒袖套', tag: '时令', image: pexelsSquare(1036623), price: '￥19', originalPrice: '￥35', sales: '已售4100' },
  { title: '黄铜书立一对', tag: '格调', image: pexelsSquare(4583751), price: '￥45', originalPrice: '￥68', sales: '已售330' },
]
