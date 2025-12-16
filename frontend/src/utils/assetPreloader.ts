/**
 * 资源预加载和缓存管理
 *
 * 这个工具提供以下功能：
 * 1. 预加载关键资源（图片、字体等）
 * 2. 资源加载优先级管理
 * 3. 资源缓存控制
 */

// 资源类型枚举
export enum AssetType {
  IMAGE = 'image',
  FONT = 'font',
  JSON = 'json',
  SCRIPT = 'script',
  STYLE = 'style'
}

// 优先级枚举
export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// 资源接口定义
export interface Asset {
  url: string
  type: AssetType
  priority: Priority
  options?: RequestInit
  expireTime?: number // 缓存过期时间（毫秒）
}

// 预加载配置接口
export interface PreloadConfig {
  connections?: number // 并发连接数
  timeout?: number // 超时时间（毫秒）
  retryCount?: number // 重试次数
  retryDelay?: number // 重试延迟（毫秒）
}

// 默认配置
const DEFAULT_CONFIG: PreloadConfig = {
  connections: 6, // 现代浏览器通常允许每个域名6个并发连接
  timeout: 20000, // 20秒超时
  retryCount: 2,
  retryDelay: 1000
}

// 缓存管理
class CacheManager {
  private cache: Map<string, {
    data: any,
    expireAt?: number // 过期时间戳
  }> = new Map()

  /**
   * 设置缓存
   * @param key 缓存键
   * @param data 缓存数据
   * @param expireTime 过期时间（毫秒）
   */
  set(key: string, data: any, expireTime?: number): void {
    const cacheItem = {
      data,
      expireAt: expireTime ? Date.now() + expireTime : undefined
    }
    this.cache.set(key, cacheItem)

    // 如果是内存缓存，可以设置自动清理
    if (expireTime) {
      setTimeout(() => {
        this.delete(key)
      }, expireTime)
    }
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存数据或undefined（如已过期）
   */
  get(key: string): any | undefined {
    const item = this.cache.get(key)
    if (!item) return undefined

    // 检查是否过期
    if (item.expireAt && item.expireAt < Date.now()) {
      this.delete(key)
      return undefined
    }

    return item.data
  }

  /**
   * 删除缓存
   * @param key 缓存键
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }
}

// 初始化缓存管理器
const cacheManager = new CacheManager()

/**
 * 资源预加载器类
 */
class AssetPreloader {
  private config: PreloadConfig
  private loadingPromises: Map<string, Promise<any>> = new Map()
  private activeConnections = 0
  private queue: Asset[] = []

  constructor(config: PreloadConfig = DEFAULT_CONFIG) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    }
    this.init()
  }

  /**
   * 初始化
   */
  private init(): void {
    // 如果支持链接预取，添加监听器
    if ('connection' in navigator && (navigator as any).connection) {
      const conn = (navigator as any).connection

      // 网络状态变化时调整配置
      conn.addEventListener('change', () => {
        // 根据网络类型调整并发连接数
        if (conn.effectiveType === '4g') {
          this.config.connections = 6
        } else if (conn.effectiveType === '3g') {
          this.config.connections = 4
        } else {
          this.config.connections = 2
        }
      })
    }
  }

  /**
   * 预加载单个资源
   * @param asset 资源信息
   * @returns Promise
   */
  async preload(asset: Asset): Promise<any> {
    // 检查缓存
    const cachedData = cacheManager.get(asset.url)
    if (cachedData !== undefined) {
      return cachedData
    }

    // 如果该资源已经在加载中，返回现有的Promise
    if (this.loadingPromises.has(asset.url)) {
      return this.loadingPromises.get(asset.url)
    }

    // 如果连接数已达上限，加入队列
    if (this.activeConnections >= (this.config.connections ?? DEFAULT_CONFIG.connections!)) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          ...asset,
          options: {
            ...asset.options,
            resolve,
            reject
          } as any
        })

        // 按优先级排序队列
        this.sortQueue()
      })
    }

    // 开始加载资源
    this.activeConnections++
    let promise: Promise<any>

    switch (asset.type) {
      case AssetType.IMAGE:
        promise = this.loadImage(asset.url)
        break
      case AssetType.FONT:
        promise = this.loadFont(asset.url)
        break
      case AssetType.SCRIPT:
        promise = this.loadScript(asset.url)
        break
      case AssetType.STYLE:
        promise = this.loadStyle(asset.url)
        break
      case AssetType.JSON:
        promise = this.loadJson(asset.url, asset.options)
        break
      default:
        promise = this.loadGeneric(asset.url, asset.options)
    }

    // 保存Promise
    this.loadingPromises.set(asset.url, promise)

    // 处理Promise
    return promise
      .then(data => {
        // 缓存结果
        if (data) {
          cacheManager.set(asset.url, data, asset.expireTime)
        }
        return data
      })
      .catch(error => {
        console.error(`Failed to preload asset: ${asset.url}`, error)
        throw error
      })
      .finally(() => {
        // 清理
        this.loadingPromises.delete(asset.url)
        this.activeConnections--

        // 处理队列中的下一个
        this.processNextInQueue()
      })
  }

  /**
   * 批量预加载资源
   * @param assets 资源列表
   * @returns 所有加载Promise的数组
   */
  preloadBatch(assets: Asset[]): Promise<any[]> {
    // 按优先级排序
    const sortedAssets = [...assets].sort((a, b) => {
      const priorityMap = { high: 0, medium: 1, low: 2 }
      return priorityMap[a.priority] - priorityMap[b.priority]
    })

    // 批量加载
    return Promise.all(sortedAssets.map(asset => this.preload(asset)))
  }

  /**
   * 按优先级排序队列
   */
  private sortQueue(): void {
    this.queue.sort((a, b) => {
      const priorityMap = { high: 0, medium: 1, low: 2 }
      return priorityMap[a.priority] - priorityMap[b.priority]
    })
  }

  /**
   * 处理队列中的下一个资源
   */
  private processNextInQueue(): void {
    if (this.queue.length === 0) return

    const nextAsset = this.queue.shift()
    if (nextAsset) {
      const { resolve, reject, ...options } = nextAsset.options as any

      this.preload({
        ...nextAsset,
        options
      }).then(resolve, reject)
    }
  }

  /**
   * 加载图片资源
   * @param url 图片URL
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))

      img.src = url
    })
  }

  /**
   * 加载字体资源
   * @param url 字体URL
   */
  private loadFont(url: string): Promise<void> {
    // 使用CSS Font Loading API (如果支持)
    if ('fonts' in document) {
      const fontFace = new FontFace('preloaded-font', `url(${url})`)

      return fontFace.load().then(loadedFace => {
        (document.fonts as any).add(loadedFace)
        // 返回空值，确保类型匹配
        return undefined
      })
    }

    // 后备方案：添加样式标签
    return new Promise((resolve, reject) => {
      const style = document.createElement('style')
      style.textContent = `
        @font-face {
          font-family: 'preloaded-font';
          src: url('${url}') format('woff2');
        }
      `

      style.onload = () => resolve()
      style.onerror = () => reject(new Error(`Failed to load font: ${url}`))

      document.head.appendChild(style)
    })
  }

  /**
   * 加载脚本资源
   * @param url 脚本URL
   */
  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')

      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`))

      script.src = url
      script.async = true

      document.head.appendChild(script)
    })
  }

  /**
   * 加载样式资源
   * @param url 样式表URL
   */
  private loadStyle(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')

      link.onload = () => resolve()
      link.onerror = () => reject(new Error(`Failed to load style: ${url}`))

      link.rel = 'stylesheet'
      link.href = url

      document.head.appendChild(link)
    })
  }

  /**
   * 加载JSON资源
   * @param url JSON URL
   * @param options 请求选项
   */
  private async loadJson(url: string, options?: RequestInit): Promise<any> {
    const response = await this.loadGeneric(url, options)
    return response.json()
  }

  /**
   * 通用资源加载
   * @param url 资源URL
   * @param options 请求选项
   */
  private loadGeneric(url: string, options?: RequestInit): Promise<Response> {
    const timeout = this.config.timeout ?? DEFAULT_CONFIG.timeout ?? 20000
    return fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeout)
    })
  }
}

// 创建并导出预加载器实例
export const assetPreloader = new AssetPreloader()

/**
 * 预加载页面关键资源
 * @param routeName 路由名称或路径
 */
export function preloadRouteAssets(routeName: string): Promise<any> {
  // 根据路由预加载相应的资源
  const routeAssetMap: Record<string, Asset[]> = {
    // 首页
    'home': [
      { url: '/api/banners', type: AssetType.JSON, priority: Priority.HIGH },
      { url: '/api/products/recommend', type: AssetType.JSON, priority: Priority.MEDIUM }
    ],
    // 排行榜页
    'ranking': [
      { url: '/api/rankings?type=hot', type: AssetType.JSON, priority: Priority.HIGH }
    ],
    // 商品详情页 (动态路由示例)
    'product': [
      { url: '/api/products/related', type: AssetType.JSON, priority: Priority.MEDIUM }
    ]
  }

  // 获取当前路由对应的资源
  const assets = routeAssetMap[routeName] || []

  // 优先级高的资源立即加载，其他的延迟加载
  const highPriorityAssets = assets.filter(asset => asset.priority === Priority.HIGH)
  const lowerPriorityAssets = assets.filter(asset => asset.priority !== Priority.HIGH)

  // 立即加载高优先级资源
  const highPriorityPromise = assetPreloader.preloadBatch(highPriorityAssets)

  // 延迟加载低优先级资源
  setTimeout(() => {
    assetPreloader.preloadBatch(lowerPriorityAssets).catch(err => {
      console.warn('Failed to preload some lower priority assets:', err)
    })
  }, 300)

  // 仅返回高优先级资源的Promise
  return highPriorityPromise
}

// 导出缓存管理器
export const cache = {
  get: (key: string) => cacheManager.get(key),
  set: (key: string, data: any, expireTime?: number) => cacheManager.set(key, data, expireTime),
  delete: (key: string) => cacheManager.delete(key),
  clear: () => cacheManager.clear(),
  size: () => cacheManager.size()
}
