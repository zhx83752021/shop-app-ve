import { Minus, Plus, Trash2, Tag, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartItem {
  id: number;
  image: string;
  title: string;
  specs: string;
  price: number;
  originalPrice: number;
  quantity: number;
  selected: boolean;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1519976691384-bd9c1d4a95fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbmVha2Vyc3xlbnwxfHx8fDE3NjU0MDQwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '时尚运动鞋',
    specs: '颜色: 白色 | 尺码: 42',
    price: 599,
    originalPrice: 899,
    quantity: 1,
    selected: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1590156221187-1710315f710b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzY1NDI4NTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '高端护肤套装',
    specs: '规格: 标准装',
    price: 1299,
    originalPrice: 1899,
    quantity: 1,
    selected: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1717295248230-93ea71f48f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MXx8fHwxNzY1MzY0NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '智能数码设备',
    specs: '颜色: 黑色 | 版本: 标准版',
    price: 2399,
    originalPrice: 2999,
    quantity: 1,
    selected: false,
  },
];

const recommendProducts = [
  {
    id: 101,
    image: 'https://images.unsplash.com/photo-1759459981078-35c1befc695b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjU0MzgxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '生活精品好物',
    price: '¥299',
    tag: '相似推荐',
  },
  {
    id: 102,
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2NTM3NjYwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '潮流街头服饰',
    price: '¥399',
    tag: '搭配推荐',
  },
];

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [allSelected, setAllSelected] = useState(false);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const toggleSelect = (id: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAll = () => {
    const newValue = !allSelected;
    setAllSelected(newValue);
    setCartItems(items =>
      items.map(item => ({ ...item, selected: newValue }))
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSavings = selectedItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-200">
        <h1 className="text-xl">购物车 ({cartItems.length})</h1>
      </div>

      {/* 优惠券提示 */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 mx-4 mt-3 p-3 rounded-xl flex items-center gap-3">
        <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
          <Tag className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm">
            <span className="text-primary">3张优惠券</span> 可用
          </p>
          <p className="text-xs text-gray-500">最高可省 ¥200</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* 购物车列表 */}
      <div className="flex-1 overflow-auto pb-32">
        <div className="mt-3">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white mb-2 px-4 py-3">
              <div className="flex gap-3">
                {/* 选择框 */}
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="flex-shrink-0 mt-1"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      item.selected
                        ? 'bg-primary border-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {item.selected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {/* 商品图片 */}
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />

                {/* 商品信息 */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm mb-1 line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{item.specs}</p>
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-primary">¥{item.price}</span>
                        <span className="text-xs text-gray-400 line-through">
                          ¥{item.originalPrice}
                        </span>
                      </div>
                    </div>
                    {/* 数量控制 */}
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex-shrink-0 self-start mt-1"
                >
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 猜你喜欢 */}
        <div className="mt-4 bg-white px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-primary rounded-full"></div>
            <h2 className="text-lg">猜你喜欢</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {product.tag}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm mb-2 line-clamp-2">{product.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary">{product.price}</span>
                    <button className="text-primary text-xs px-3 py-1 rounded-full border border-primary">
                      加购
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部结算栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-safe">
        {/* 优惠信息 */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-gray-600">已优惠</span>
          <span className="text-primary">-¥{totalSavings}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 全选 */}
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                allSelected
                  ? 'bg-primary border-primary'
                  : 'border-gray-300'
              }`}
            >
              {allSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm">全选</span>
          </button>

          {/* 合计 */}
          <div className="flex-1 flex items-baseline justify-end gap-1">
            <span className="text-sm text-gray-600">合计:</span>
            <span className="text-primary text-xs">¥</span>
            <span className="text-primary text-xl">{totalPrice}</span>
          </div>

          {/* 结算按钮 */}
          <button
            disabled={selectedItems.length === 0}
            className={`px-8 py-3 rounded-full text-white ${
              selectedItems.length > 0
                ? 'bg-primary active:bg-primary-dark'
                : 'bg-gray-300'
            }`}
          >
            结算 ({selectedItems.length})
          </button>
        </div>
      </div>
    </div>
  );
}
