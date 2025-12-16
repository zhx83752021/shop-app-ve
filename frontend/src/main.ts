import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import { setupNavigationGuards, prefetchRouteComponents } from './router/navigation-guards'
import './style.css'
import App from './App.vue'

// 添加全局性能监控
import './utils/performanceMonitor'

// 初始化应用
const app = createApp(App)

// 注册全局组件
app.use(createPinia())
app.use(ElementPlus)

// 配置路由和导航守卫
app.use(router)
setupNavigationGuards(router)

// 应用启动
app.mount('#app')

// 页面完全加载后预加载路由
if (import.meta.env.PROD) { // 仅在生产环境中预加载
  window.addEventListener('load', () => {
    setTimeout(() => {
      // 使用路由配置做预加载
      prefetchRouteComponents(router.getRoutes())
    }, 2000) // 页面加载2秒后开始预加载
  })
}
