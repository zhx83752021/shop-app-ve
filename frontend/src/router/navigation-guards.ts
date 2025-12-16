/**
 * 全局路由导航守卫
 * - 预加载资源
 * - 自动滚动到顶部
 * - 页面切换动画
 */
import { Router, RouteRecordNormalized } from 'vue-router'
import { preloadRouteAssets } from '../utils/assetPreloader'

/**
 * 注册路由导航守卫
 * @param router Vue Router实例
 */
export function setupNavigationGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach((to, _from, next) => {
    // 页面切换时显示加载状态
    document.body.classList.add('page-loading')

    // 预加载目标路由资源
    const routeName = to.name?.toString() || 'default'

    // 预加载首页相关资源
    preloadRouteAssets(routeName).catch(error => {
      console.warn(`Failed to preload assets for route ${routeName}:`, error)
    })

    next()
  })

  // 全局后置钩子
  router.afterEach((to, from) => {
    // 移除加载状态
    document.body.classList.remove('page-loading')

    // 页面切换后自动滚动到顶部
    if (to.path !== from.path) {
      window.scrollTo({
        top: 0,
        behavior: 'auto' // 使用auto而不是smooth，避免动画延迟
      })
    }

    // 如果是返回操作，尝试恢复滚动位置
    if (to.meta.keepAlive &&
        to.meta.savedPosition &&
        typeof to.meta.savedPosition === 'number') {
      // 异步执行，确保DOM已更新
      setTimeout(() => {
        window.scrollTo({
          top: to.meta.savedPosition as number,
          behavior: 'auto'
        })
      }, 50)
    }
  })

  // 保存页面滚动位置，用于“返回”时恢复
  router.beforeEach((_to, from, next) => {
    if (from.meta.keepAlive) {
      from.meta.savedPosition = window.scrollY
    }
    next()
  })

  // 路由错误处理
  router.onError((error) => {
    console.error('Router error:', error)

    // 移除加载状态
    document.body.classList.remove('page-loading')
  })
}

/**
 * 智能预加载路由组件
 * @param routes 路由配置
 */
export function prefetchRouteComponents(routes: RouteRecordNormalized[]): void {
  // 确保路由已解析
  if (!routes?.length) return

  // 使用Intersection Observer API监控视口
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 获取链接的href
          const link = entry.target as HTMLAnchorElement
          const href = link.getAttribute('href')

          if (href) {
            // 查找匹配的路由
            const matchedRoute = routes.find(route =>
              route.path === href ||
              href.startsWith(route.path + '/'))

            if (matchedRoute?.name) {
              // 预加载路由资源
              preloadRouteAssets(matchedRoute.name.toString())

              // 移除观察，避免重复加载
              observer.unobserve(entry.target)
            }
          }
        }
      })
    }, {
      rootMargin: '200px', // 提前200px触发加载
      threshold: 0.1
    })

    // 监听所有导航链接
    setTimeout(() => {
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        observer.observe(link)
      })
    }, 1000) // 延迟1秒，确保DOM已加载完成
  }
}
