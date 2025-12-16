import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: '/products',
          name: 'Products',
          component: () => import('@/views/Products.vue')
        },
        {
          path: '/orders',
          name: 'Orders',
          component: () => import('@/views/Orders.vue')
        },
        {
          path: '/users',
          name: 'Users',
          component: () => import('@/views/Users.vue')
        },
        {
          path: '/refunds',
          name: 'Refunds',
          component: () => import('@/views/Refunds.vue')
        },
        {
          path: '/posts',
          name: 'Posts',
          component: () => import('@/views/Posts.vue')
        },
        {
          path: '/coupons',
          name: 'Coupons',
          component: () => import('@/views/Coupons.vue')
        },
        {
          path: '/banners',
          name: 'Banners',
          component: () => import('@/views/Banners.vue')
        },
        {
          path: '/categories',
          name: 'Categories',
          component: () => import('@/views/Categories.vue')
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
