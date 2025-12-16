import { Heart, MessageCircle, ShoppingBag, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const posts = [
  {
    id: 1,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1516763449302-78450e5a507d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBibG9nZ2VyfGVufDF8fHx8MTc2NTM2ODExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    avatar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzY1MzU0MzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    username: '时尚达人小美',
    title: '春季穿搭分享 | 简约百搭风格',
    content: '这套搭配真的太爱了！简约又不失时尚感，适合日常通勤和周末逛街～',
    likes: '2.3万',
    comments: '356',
    hasProduct: true,
  },
  {
    id: 2,
    type: 'video',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzY1MzQ2NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    avatar: 'https://images.unsplash.com/photo-1590156221187-1710315f710b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzY1NDI4NTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    username: '美食探店王',
    title: '超治愈的早餐制作过程',
    content: '周末在家做了一顿丰盛的早餐，幸福感满满～用到的厨具都在下方商品栏啦',
    likes: '5.6万',
    comments: '892',
    hasProduct: true,
    duration: '02:35',
  },
  {
    id: 3,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY1MzUyNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    avatar: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2NTM3NjYwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    username: '旅行摄影师',
    title: '西藏旅行必备装备清单',
    content: '刚从西藏回来，整理了一份详细的装备清单，希望对大家有帮助～',
    likes: '1.2万',
    comments: '234',
    hasProduct: true,
  },
  {
    id: 4,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3J8ZW58MXx8fHwxNzY1MzcxMzI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    avatar: 'https://images.unsplash.com/photo-1759459981078-35c1befc695b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjU0MzgxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    username: '居家生活家',
    title: '北欧风客厅改造完成',
    content: '历时一个月的改造终于完成了！分享一些好物推荐和避坑指南～',
    likes: '3.8万',
    comments: '567',
    hasProduct: true,
  },
  {
    id: 5,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1519976691384-bd9c1d4a95fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbmVha2Vyc3xlbnwxfHx8fDE3NjU0MDQwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    avatar: 'https://images.unsplash.com/photo-1717295248230-93ea71f48f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MXx8fHwxNzY1MzY0NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    username: '球鞋收藏家',
    title: '2024最值得入手的运动鞋TOP10',
    content: '作为资深球鞋爱好者，给大家盘点今年最值得入手的几双鞋～',
    likes: '4.5万',
    comments: '723',
    hasProduct: true,
  },
];

const tabs = ['推荐', '关注', '时尚', '美食', '旅行', '数码', '家居'];

export function DiscoverPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* 顶部Tab栏 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center gap-6 px-4 py-3 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`flex-shrink-0 pb-1 ${
                index === 0
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 内容流 */}
      <div className="flex-1 overflow-auto">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-100 pb-4 mb-4">
            {/* 用户信息 */}
            <div className="flex items-center gap-3 px-4 pt-4 mb-3">
              <ImageWithFallback
                src={post.avatar}
                alt={post.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm">{post.username}</h3>
              </div>
              <button className="text-primary text-sm px-4 py-1 rounded-full border border-primary">
                关注
              </button>
            </div>

            {/* 图片/视频 */}
            <div className="relative mb-3">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
              {post.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                  </div>
                </div>
              )}
              {post.duration && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {post.duration}
                </div>
              )}
            </div>

            {/* 标题和内容 */}
            <div className="px-4 mb-3">
              <h2 className="mb-2">{post.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
            </div>

            {/* 互动栏 */}
            <div className="flex items-center gap-6 px-4 mb-3">
              <button className="flex items-center gap-2 text-gray-600">
                <Heart className="w-5 h-5" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments}</span>
              </button>
            </div>

            {/* 商品链接区 */}
            {post.hasProduct && (
              <div className="mx-4 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <ImageWithFallback
                  src={post.image}
                  alt="商品"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm mb-1 line-clamp-2">相关商品推荐</p>
                  <p className="text-primary">¥299</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-1 text-sm">
                  <ShoppingBag className="w-4 h-4" />
                  购买
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
