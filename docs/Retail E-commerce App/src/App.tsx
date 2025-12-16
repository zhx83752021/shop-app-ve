import { useState } from 'react';
import { Home, Compass, ShoppingCart, User } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { DiscoverPage } from './components/DiscoverPage';
import { CartPage } from './components/CartPage';
import { ProfilePage } from './components/ProfilePage';

type TabType = 'home' | 'discover' | 'cart' | 'profile';

const tabs = [
  { id: 'home' as TabType, label: '首页', icon: Home },
  { id: 'discover' as TabType, label: '发现', icon: Compass },
  { id: 'cart' as TabType, label: '购物车', icon: ShoppingCart },
  { id: 'profile' as TabType, label: '我的', icon: User },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'discover':
        return <DiscoverPage />;
      case 'cart':
        return <CartPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* 底部导航栏 */}
      <nav className="sticky bottom-0 bg-white border-t border-gray-200 px-2 py-2 pb-safe z-50">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive ? 'bg-orange-50' : ''
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-primary' : 'text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs ${
                    isActive ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
