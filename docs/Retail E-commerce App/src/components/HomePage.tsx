import { Search, ChevronRight, Zap, TrendingUp, Video, Gift, Crown, Award, Star, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const quickActions = [
  { icon: Zap, label: '每日秒杀', gradient: 'from-[#FF5A5F] to-[#FF5A5F]' },
  { icon: TrendingUp, label: '品牌闪购', gradient: 'from-[#A78BFA] to-[#A78BFA]' },
  { icon: Video, label: '直播好物', gradient: 'from-[#3B9BFF] to-[#3B9BFF]' },
  { icon: Gift, label: '优惠券中心', gradient: 'from-[#FFD93D] to-[#FFD93D]' },
  { icon: Crown, label: '会员专属', gradient: 'from-[#B4A0E5] to-[#B4A0E5]' },
  { icon: Award, label: '排行榜', gradient: 'from-[#4ADE80] to-[#4ADE80]' },
  { icon: Star, label: '新品首发', gradient: 'from-[#FB7185] to-[#FB7185]' },
  { icon: Heart, label: '我的收藏', gradient: 'from-[#FF8A5C] to-[#FF8A5C]' },
];

const banners = [
  { id: 1, image: 'https://images.unsplash.com/photo-1761470744784-3e1ab858ab5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvcHBpbmclMjBiYW5uZXJ8ZW58MXx8fHwxNzY1MzcwMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: '春季新品' },
  { id: 2, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzY1MzU0MzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: '时尚大促' },
  { id: 3, image: 'https://images.unsplash.com/photo-1628136473110-6e95a86f4b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwcm9kdWN0fGVufDF8fHx8MTc2NTQyMzQ4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', title: '奢品专区' },
];

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1519976691384-bd9c1d4a95fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbmVha2Vyc3xlbnwxfHx8fDE3NjU0MDQwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '时尚运动鞋',
    price: '¥599',
    originalPrice: '¥899',
    sales: '已售2.3万',
    tag: '秒杀'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1590156221187-1710315f710b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzY1NDI4NTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '高端护肤套装',
    price: '¥1,299',
    originalPrice: '¥1,899',
    sales: '已售1.8万',
    tag: '热卖'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1717295248230-93ea71f48f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MXx8fHwxNzY1MzY0NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '智能数码设备',
    price: '¥2,399',
    originalPrice: '¥2,999',
    sales: '已售5.6千',
    tag: '新品'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1759459981078-35c1befc695b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjU0MzgxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '生活精品好物',
    price: '¥299',
    originalPrice: '¥399',
    sales: '已售3.2万',
    tag: '推荐'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2NTM3NjYwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '潮流街头服饰',
    price: '¥399',
    originalPrice: '¥599',
    sales: '已售1.5万',
    tag: '热卖'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1628136473110-6e95a86f4b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwcm9kdWN0fGVufDF8fHx8MTc2NTQyMzQ4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '奢华精选',
    price: '¥4,599',
    originalPrice: '¥6,999',
    sales: '已售3.8千',
    tag: '限时'
  },
];

export function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-auto bg-gray-50">
      {/* 搜索栏 */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索商品、品牌、店铺"
            className="flex-1 bg-transparent border-none outline-none text-sm"
          />
        </div>
      </div>

      {/* 运营横幅 */}
      <div className="px-4 py-3">
        <div className="relative overflow-hidden rounded-2xl h-40">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ImageWithFallback
                src={banner.image}
                alt={banner.title}
                className="w-full h-40 object-cover rounded-2xl"
              />
            </div>
          ))}
          {/* 指示器 */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentBanner
                    ? 'bg-white w-6'
                    : 'bg-white/50 w-1.5'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 金刚区 */}
      <div className="bg-white px-4 py-5 mb-2">
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center gap-2 active:opacity-70 transition-opacity"
              >
                <div className={`bg-gradient-to-br ${action.gradient} w-12 h-12 rounded-2xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 动态模块 - 直播 */}
      <div className="bg-white px-4 py-4 mb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full"></div>
            <h2 className="text-lg">直播热卖</h2>
          </div>
          <button className="flex items-center gap-1 text-sm text-gray-500">
            更多 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-32">
              <div className="relative">
                <ImageWithFallback
                  src={banners[i % banners.length].image}
                  alt={`直${i}`}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Video className="w-3 h-3" /> 直播中
                </div>
              </div>
              <p className="text-sm mt-2 line-clamp-2">限时特惠活动</p>
              <p className="text-xs text-gray-500">2.3万人观看</p>
            </div>
          ))}
        </div>
      </div>

      {/* 秒杀模块 */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-4 mb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-white" />
            <h2 className="text-lg text-white">限时秒杀</h2>
            <div className="flex items-center gap-1 bg-white/20 text-white text-xs px-2 py-1 rounded">
              <span>距结束</span>
              <span className="bg-white text-red-500 px-1 rounded">02</span>:
              <span className="bg-white text-red-500 px-1 rounded">34</span>:
              <span className="bg-white text-red-500 px-1 rounded">56</span>
            </div>
          </div>
          <button className="text-white text-sm flex items-center gap-1">
            更多 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-28 bg-white rounded-xl p-2">
              <ImageWithFallback
                src={product.image}
                alt={product.title}
                className="w-full h-28 object-cover rounded-lg mb-2"
              />
              <p className="text-xs line-clamp-2 mb-1">{product.title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-red-500">¥</span>
                <span className="text-red-500">{product.price.replace('¥', '')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 商品瀑布流 */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full"></div>
            <h2 className="text-lg">为你推荐</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <div className="relative">
                <ImageWithFallback
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {product.tag}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm mb-2 line-clamp-2 h-10">{product.title}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-primary">{product.price}</span>
                  <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                </div>
                <p className="text-xs text-gray-500">{product.sales}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}