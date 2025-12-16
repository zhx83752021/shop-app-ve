import {
  Package,
  Truck,
  CheckCircle,
  MessageCircle,
  CreditCard,
  Tag,
  Heart,
  MapPin,
  Settings,
  HeadphonesIcon,
  ChevronRight,
  ShoppingBag,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const orderStatusItems = [
  { icon: ShoppingBag, label: '待付款', count: 2, color: 'text-orange-500' },
  { icon: Package, label: '待发货', count: 1, color: 'text-blue-500' },
  { icon: Truck, label: '待收货', count: 3, color: 'text-green-500' },
  { icon: CheckCircle, label: '待评价', count: 5, color: 'text-purple-500' },
  { icon: RotateCcw, label: '退换/售后', count: 0, color: 'text-gray-500' },
];

const assetItems = [
  { icon: Tag, label: '优惠券', value: '8张', gradient: 'from-[#FFD93D] to-[#FFD93D]' },
  { icon: CreditCard, label: '余额', value: '¥1,280', gradient: 'from-[#B4A0E5] to-[#B4A0E5]' },
  { icon: Heart, label: '收藏', value: '36', gradient: 'from-[#FB7185] to-[#FB7185]' },
  { icon: Clock, label: '足迹', value: '128', gradient: 'from-[#3B9BFF] to-[#3B9BFF]' },
];

const menuSections = [
  {
    title: '常用功能',
    items: [
      { icon: MapPin, label: '收货地址', color: 'text-blue-500' },
      { icon: Settings, label: '账号设置', color: 'text-gray-600' },
      { icon: HeadphonesIcon, label: '联系客服', color: 'text-green-500', highlight: true },
    ],
  },
];

export function ProfilePage() {
  return (
    <div className="flex flex-col h-full overflow-auto bg-gray-50">
      {/* 用户信息卡片 */}
      <div className="bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 px-4 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjU0MDI0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="用户头像"
            className="w-16 h-16 rounded-full object-cover border-4 border-white/30"
          />
          <div className="flex-1 text-white">
            <h2 className="text-xl mb-1">用户昵称</h2>
            <p className="text-sm text-white/80">会员等级: 黄金会员</p>
          </div>
          <ChevronRight className="w-6 h-6 text-white" />
        </div>

        {/* 会员卡片 */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm mb-1 text-white/80">会员积分</p>
              <p className="text-2xl">3,680</p>
            </div>
            <div className="text-right">
              <p className="text-sm mb-1 text-white/80">成长值</p>
              <p className="text-2xl">8,520</p>
            </div>
            <button className="bg-white text-primary px-4 py-2 rounded-full text-sm">
              签到领积分
            </button>
          </div>
        </div>
      </div>

      {/* 订单追踪卡片 */}
      <div className="bg-white mx-4 -mt-4 rounded-2xl p-4 shadow-lg border border-gray-100 mb-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">我的订单</h3>
          <button className="text-sm text-gray-500 flex items-center gap-1">
            全部订单 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {orderStatusItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center gap-2 py-2 active:opacity-70 transition-opacity relative"
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${item.color}`} />
                  {item.count > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {item.count}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-700">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 资产卡片 */}
      <div className="bg-white mx-4 rounded-2xl p-4 mb-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">我的资产</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {assetItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className={`bg-gradient-to-br ${item.gradient} w-10 h-10 rounded-full flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-700">{item.label}</span>
                <span className="text-xs text-gray-900">{item.value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 功能菜单 */}
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-white mx-4 rounded-2xl mb-3 overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm text-gray-500">{section.title}</h3>
          </div>
          <div>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <button
                  key={itemIndex}
                  className={`w-full flex items-center gap-3 px-4 py-4 ${
                    itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                  } active:bg-gray-50 transition-colors`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.highlight && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      在线
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* 客服入口强调 */}
      <div className="mx-4 mb-6">
        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg active:opacity-90 transition-opacity">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <HeadphonesIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg mb-1">7x24小时在线客服</h3>
              <p className="text-sm text-white/80">有问题随时咨询我们</p>
            </div>
          </div>
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}