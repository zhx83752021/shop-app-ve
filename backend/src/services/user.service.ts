import prisma from '../config/database'
import { hashPassword, verifyPassword } from '../utils/password'

/**
 * 用户服务
 */
export class UserService {
  /**
   * 获取用户信息
   */
  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        gender: true,
        memberLevel: true,
        points: true,
        growthValue: true,
        balance: true,
        createdAt: true
      }
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    return {
      ...user,
      phone: user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      balance: user.balance.toString()
    }
  }

  /**
   * 更新用户信息
   */
  static async updateProfile(userId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        nickname: true,
        avatar: true,
        gender: true
      }
    })

    return user
  }

  /**
   * 修改密码
   */
  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // 获取用户
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    // 验证旧密码
    const isValid = await verifyPassword(oldPassword, user.password)
    if (!isValid) {
      throw new Error('旧密码错误')
    }

    // 更新密码
    const hashedPassword = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return { message: '密码修改成功' }
  }

  /**
   * 获取地址列表
   */
  static async getAddresses(userId: string) {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    })

    return addresses
  }

  /**
   * 添加地址
   */
  static async addAddress(userId: string, data: any) {
    // 如果设置为默认地址，先取消其他默认地址
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        userId,
        ...data
      }
    })

    return address
  }

  /**
   * 更新地址
   */
  static async updateAddress(userId: string, addressId: string, data: any) {
    // 验证地址是否属于当前用户
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId }
    })

    if (!address) {
      throw new Error('地址不存在')
    }

    // 如果设置为默认地址，先取消其他默认地址
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false }
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data
    })

    return updatedAddress
  }

  /**
   * 删除地址
   */
  static async deleteAddress(userId: string, addressId: string) {
    // 验证地址是否属于当前用户
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId }
    })

    if (!address) {
      throw new Error('地址不存在')
    }

    await prisma.address.delete({
      where: { id: addressId }
    })

    return { message: '删除成功' }
  }

  /**
   * 获取收藏列表
   */
  static async getFavorites(userId: string, page: number = 1, pageSize: number = 20) {
    const total = await prisma.favorite.count({ where: { userId } })

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            mainImage: true,
            price: true,
            originalPrice: true,
            sales: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return {
      items: favorites.map((f) => ({
        id: f.id,
        product: {
          ...f.product,
          price: f.product.price.toString(),
          originalPrice: f.product.originalPrice.toString()
        },
        createdAt: f.createdAt
      })),
      total,
      page,
      pageSize
    }
  }

  /**
   * 添加收藏
   */
  static async addFavorite(userId: string, productId: string) {
    // 检查商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      throw new Error('商品不存在')
    }

    // 检查是否已收藏
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    if (existing) {
      throw new Error('已收藏该商品')
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        productId
      }
    })

    return favorite
  }

  /**
   * 取消收藏
   */
  static async removeFavorite(userId: string, productId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    if (!favorite) {
      throw new Error('未收藏该商品')
    }

    await prisma.favorite.delete({
      where: { id: favorite.id }
    })

    return { message: '取消收藏成功' }
  }

  /**
   * 获取浏览历史
   */
  static async getBrowseHistory(userId: string, page: number = 1, pageSize: number = 20) {
    const total = await prisma.browseHistory.count({ where: { userId } })

    const history = await prisma.browseHistory.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            mainImage: true,
            price: true,
            originalPrice: true,
            sales: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return {
      items: history.map((h) => ({
        id: h.id,
        product: {
          ...h.product,
          price: h.product.price.toString(),
          originalPrice: h.product.originalPrice.toString()
        },
        createdAt: h.createdAt
      })),
      total,
      page,
      pageSize
    }
  }

  /**
   * 清空浏览历史
   */
  static async clearBrowseHistory(userId: string) {
    await prisma.browseHistory.deleteMany({
      where: { userId }
    })

    return { message: '浏览历史已清空' }
  }

  /**
   * 关注用户
   */
  static async followUser(userId: string, followingId: string) {
    try {
      console.log('关注操作 - userId:', userId, 'followingId:', followingId)

      // 检查是否尝试关注自己
      if (userId === followingId) {
        throw new Error('不能关注自己')
      }

      // 检查被关注用户是否存在
      const targetUser = await prisma.user.findUnique({
        where: { id: followingId }
      })

      if (!targetUser) {
        throw new Error('用户不存在')
      }

      // 检查是否已经关注
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId
          }
        }
      })

      if (existingFollow) {
        throw new Error('已经关注过该用户')
      }

      // 创建关注关系
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId
        }
      })

      return { message: '关注成功' }
    } catch (error) {
      console.error('关注失败 - 详细错误:', error)
      throw error
    }
  }

  /**
   * 取消关注用户
   */
  static async unfollowUser(userId: string, followingId: string) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId
        }
      }
    })

    if (!follow) {
      throw new Error('未关注该用户')
    }

    await prisma.follow.delete({
      where: { id: follow.id }
    })

    return { message: '取消关注成功' }
  }

  /**
   * 获取关注列表
   */
  static async getFollowings(userId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize

    const [followings, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              nickname: true,
              avatar: true
            }
          }
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.follow.count({ where: { followerId: userId } })
    ])

    return {
      items: followings.map(f => f.following),
      total,
      page,
      pageSize
    }
  }

  /**
   * 获取粉丝列表
   */
  static async getFollowers(userId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              nickname: true,
              avatar: true
            }
          }
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.follow.count({ where: { followingId: userId } })
    ])

    return {
      items: followers.map(f => f.follower),
      total,
      page,
      pageSize
    }
  }
}
