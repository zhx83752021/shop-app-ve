import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue'),
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/Layout.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/HomePage.vue'),
      },
      {
        path: '/discover',
        name: 'Discover',
        component: () => import('@/views/DiscoverPage.vue'),
      },
      {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/views/CartPage.vue'),
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfilePage.vue'),
      },
    ],
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue'),
  },
  {
    path: '/flash-sale',
    name: 'FlashSale',
    component: () => import('@/views/FlashSale.vue'),
  },
  {
    path: '/brand-sale',
    name: 'BrandSale',
    component: () => import('@/views/BrandSale.vue'),
  },
  {
    path: '/new-products',
    name: 'NewProducts',
    component: () => import('@/views/NewProducts.vue'),
  },
  {
    path: '/coupon-center',
    name: 'CouponCenter',
    component: () => import('@/views/CouponCenter.vue'),
  },
  {
    path: '/ranking',
    name: 'RankingList',
    component: () => import('@/views/RankingList.vue'),
  },
  {
    path: '/live-stream',
    name: 'LiveStream',
    component: () => import('@/views/LiveStreamPage.vue'),
  },
  {
    path: '/membership',
    name: 'Membership',
    component: () => import('@/views/MembershipPage.vue'),
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/FavoritesPage.vue'),
  },
  {
    path: '/addresses',
    name: 'Addresses',
    component: () => import('@/views/AddressesPage.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsPage.vue'),
  },
  {
    path: '/verification',
    name: 'Verification',
    component: () => import('@/views/VerificationPage.vue'),
  },
  {
    path: '/contact-service',
    name: 'ContactService',
    component: () => import('@/views/ContactServicePage.vue'),
  },
  {
    path: '/customer-chat',
    name: 'CustomerChat',
    component: () => import('@/views/CustomerServicePage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
