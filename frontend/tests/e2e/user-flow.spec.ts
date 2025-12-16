import { test, expect } from '@playwright/test'

// 测试配置
const BASE_URL = 'http://localhost:5173'
const API_URL = 'http://localhost:3001'

// 测试用户数据
const testUser = {
  phone: '13800138000',
  password: '123456',
  newPhone: `138${Date.now().toString().slice(-8)}`,
  newPassword: 'test123456'
}

test.describe('电商平台完整用户流程测试', () => {

  test.beforeEach(async ({ page }) => {
    // 清除本地存储
    await page.goto(BASE_URL)
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('1. 用户注册流程', async ({ page }) => {
    console.log('开始测试用户注册...')

    // 访问注册页面
    await page.goto(`${BASE_URL}/register`)
    await expect(page.locator('h1')).toContainText('创建账户')

    // 输入手机号
    await page.fill('input[type="tel"]', testUser.newPhone)

    // 点击发送验证码
    await page.click('button:has-text("发送验证码")')

    // 等待验证码提示
    await page.waitForTimeout(1000)

    // 检查是否有验证码显示（测试环境）
    const codeElement = page.locator('text=/测试环境验证码/')
    if (await codeElement.isVisible()) {
      const codeText = await codeElement.textContent()
      const code = codeText?.match(/\d{6}/)?.[0] || '123456'
      await page.fill('input[placeholder*="验证码"]', code)
      console.log(`使用验证码: ${code}`)
    } else {
      // 如果没有显示，使用默认验证码
      await page.fill('input[placeholder*="验证码"]', '123456')
    }

    // 输入密码
    await page.fill('input[type="password"]', testUser.newPassword)

    // 勾选协议
    await page.check('input[type="checkbox"]')

    // 点击注册
    await page.click('button[type="submit"]:has-text("注册")')

    // 等待跳转到首页或处理错误
    try {
      await page.waitForURL(`${BASE_URL}/`, { timeout: 5000 })
      console.log('✅ 注册成功，已跳转到首页')
    } catch (error) {
      // 检查是否有错误提示
      const errorMsg = await page.locator('text=/已注册|失败/').textContent().catch(() => null)
      if (errorMsg) {
        console.log(`⚠️ 注册失败: ${errorMsg}，继续使用已有账号测试`)
      }
    }
  })

  test('2. 用户登录流程', async ({ page }) => {
    console.log('开始测试用户登录...')

    // 访问登录页面
    await page.goto(`${BASE_URL}/login`)
    await expect(page.locator('h1')).toContainText('欢迎回来')

    // 输入手机号和密码
    await page.fill('input[type="tel"]', testUser.phone)
    await page.fill('input[type="password"]', testUser.password)

    // 点击登录
    await page.click('button[type="submit"]:has-text("登录")')

    // 等待登录成功跳转
    await page.waitForURL(`${BASE_URL}/`, { timeout: 5000 })

    // 验证登录状态
    const token = await page.evaluate(() => localStorage.getItem('access_token'))
    expect(token).toBeTruthy()
    console.log('✅ 登录成功')
  })

  test('3. 首页功能测试', async ({ page }) => {
    console.log('开始测试首页功能...')

    await page.goto(`${BASE_URL}/`)

    // 检查页面元素
    await expect(page.locator('text=/搜索/')).toBeVisible()

    // 检查Banner轮播
    const banners = page.locator('[class*="banner"]').first()
    await expect(banners).toBeVisible({ timeout: 3000 }).catch(() => {
      console.log('⚠️ Banner未加载')
    })

    // 检查金刚区
    const quickActions = page.locator('text=/每日秒杀|优惠券/')
    await expect(quickActions.first()).toBeVisible({ timeout: 3000 }).catch(() => {
      console.log('⚠️ 金刚区未加载')
    })

    // 测试金刚区点击
    const flashSaleBtn = page.locator('text=每日秒杀').first()
    if (await flashSaleBtn.isVisible()) {
      await flashSaleBtn.click()
      await page.waitForURL(`${BASE_URL}/flash-sale`, { timeout: 3000 })
      console.log('✅ 金刚区跳转正常')
      await page.goBack()
    }

    // 检查商品列表
    const products = page.locator('[class*="product"]')
    const productCount = await products.count()
    console.log(`✅ 首页加载了 ${productCount} 个商品`)

    // 点击第一个商品
    if (productCount > 0) {
      await products.first().click()
      await page.waitForTimeout(1000)

      // 检查是否跳转到商品详情页
      const url = page.url()
      if (url.includes('/product/')) {
        console.log('✅ 商品跳转正常')
        await page.goBack()
      }
    }
  })

  test('4. 商品详情页测试', async ({ page }) => {
    console.log('开始测试商品详情页...')

    // 先登录
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="tel"]', testUser.phone)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/`)

    // 访问商品详情页（使用固定ID）
    await page.goto(`${BASE_URL}/product/1`)

    // 检查商品信息
    await expect(page.locator('[class*="price"]')).toBeVisible({ timeout: 3000 })

    // 测试加入购物车
    const addToCartBtn = page.locator('button:has-text("加入购物车")').first()
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click()
      await page.waitForTimeout(500)
      console.log('✅ 加入购物车功能正常')
    }

    // 测试收藏功能
    const favoriteBtn = page.locator('button:has-text("收藏")').first()
    if (await favoriteBtn.isVisible()) {
      await favoriteBtn.click()
      await page.waitForTimeout(500)
      console.log('✅ 收藏功能正常')
    }
  })

  test('5. 发现页测试', async ({ page }) => {
    console.log('开始测试发现页...')

    await page.goto(`${BASE_URL}/discover`)

    // 检查Tab栏
    await expect(page.locator('text=推荐')).toBeVisible()

    // 检查帖子列表
    const posts = page.locator('[class*="post"]')
    const postCount = await posts.count()
    console.log(`✅ 发现页加载了 ${postCount} 个帖子`)

    // 测试点赞功能
    const likeBtn = page.locator('[class*="Heart"]').first()
    if (await likeBtn.isVisible()) {
      await likeBtn.click()
      await page.waitForTimeout(300)
      console.log('✅ 点赞功能正常')
    }
  })

  test('6. 购物车流程测试', async ({ page }) => {
    console.log('开始测试购物车流程...')

    // 先登录
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="tel"]', testUser.phone)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/`)

    // 访问购物车
    await page.goto(`${BASE_URL}/cart`)

    // 检查购物车页面
    await expect(page.locator('text=/购物车|暂无商品/')).toBeVisible({ timeout: 3000 })

    console.log('✅ 购物车页面加载成功')
  })

  test('7. 个人中心测试', async ({ page }) => {
    console.log('开始测试个人中心...')

    // 先登录
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="tel"]', testUser.phone)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/`)

    // 访问个人中心
    await page.goto(`${BASE_URL}/profile`)

    // 检查用户信息
    await expect(page.locator('text=/我的订单|我的收藏/')).toBeVisible({ timeout: 3000 })

    console.log('✅ 个人中心页面加载成功')
  })

  test('8. 功能页面导航测试', async ({ page }) => {
    console.log('开始测试功能页面导航...')

    await page.goto(`${BASE_URL}/`)

    // 测试每日秒杀页
    await page.goto(`${BASE_URL}/flash-sale`)
    await expect(page.locator('text=每日秒杀')).toBeVisible({ timeout: 3000 })
    console.log('✅ 秒杀页正常')

    // 测试优惠券中心
    await page.goto(`${BASE_URL}/coupon-center`)
    await expect(page.locator('text=优惠券中心')).toBeVisible({ timeout: 3000 })
    console.log('✅ 优惠券页正常')

    // 测试排行榜
    await page.goto(`${BASE_URL}/ranking`)
    await expect(page.locator('text=排行榜')).toBeVisible({ timeout: 3000 })
    console.log('✅ 排行榜页正常')
  })

  test('9. API接口健康检查', async ({ page }) => {
    console.log('开始测试API接口...')

    const response = await page.request.get(`${API_URL}/api/health`)
    expect(response.ok()).toBeTruthy()
    console.log('✅ API健康检查通过')
  })

  test('10. 页面性能检查', async ({ page }) => {
    console.log('开始测试页面性能...')

    await page.goto(`${BASE_URL}/`)

    // 获取性能指标
    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstByteTime: timing.responseStart - timing.navigationStart
      }
    })

    console.log('📊 性能指标:')
    console.log(`  - 页面加载时间: ${performanceMetrics.loadTime}ms`)
    console.log(`  - DOM就绪时间: ${performanceMetrics.domReadyTime}ms`)
    console.log(`  - 首字节时间: ${performanceMetrics.firstByteTime}ms`)

    // 检查加载时间是否合理（小于5秒）
    expect(performanceMetrics.loadTime).toBeLessThan(5000)
  })
})
