import prisma from '../config/database'

/**
 * 购物车服务
 */
export class CartService {
  /**
   * 获取购物车
   */
  static async getCart(userId: string) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            mainImage: true,
            price: true,
            originalPrice: true,
            stock: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // 计算总价和已选择商品数量
    const selectedItems = cartItems.filter((item) => item.selected && item.product.status === 'ACTIVE')
    const totalAmount = selectedItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )

    return {
      items: cartItems.map((item) => ({
        id: item.id,
        product: {
          ...item.product,
          price: item.product.price.toString(),
          originalPrice: item.product.originalPrice.toString()
        },
        quantity: item.quantity,
        selected: item.selected
      })),
      totalAmount: totalAmount.toFixed(2),
      selectedCount: selectedItems.length
    }
  }

  /**
   * 添加到购物车
   */
  static async addToCart(userId: string, productId: string, quantity: number) {
    // 检查商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product || product.status !== 'ACTIVE') {
      throw new Error('商品不存在或已下架')
    }

    if (product.stock < quantity) {
      throw new Error('库存不足')
    }

    // 检查购物车中是否已存在该商品
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    if (existingCartItem) {
      // 如果已存在，增加数量
      const newQuantity = existingCartItem.quantity + quantity

      if (product.stock < newQuantity) {
        throw new Error('库存不足')
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity }
      })

      return updatedItem
    } else {
      // 如果不存在，创建新记录
      const cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity
        }
      })

      return cartItem
    }
  }

  /**
   * 更新购物车商品数量
   */
  static async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    // 查找购物车项
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId
      },
      include: {
        product: true
      }
    })

    if (!cartItem) {
      throw new Error('购物车项不存在')
    }

    // 检查库存
    if (cartItem.product.stock < quantity) {
      throw new Error('库存不足')
    }

    // 更新数量
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    })

    return updatedItem
  }

  /**
   * 删除购物车商品
   */
  static async deleteCartItem(userId: string, cartItemId: string) {
    // 验证购物车项是否属于当前用户
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId
      }
    })

    if (!cartItem) {
      throw new Error('购物车项不存在')
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    return { message: '删除成功' }
  }

  /**
   * 全选/取消全选
   */
  static async selectAll(userId: string, selected: boolean) {
    await prisma.cartItem.updateMany({
      where: { userId },
      data: { selected }
    })

    return { message: '操作成功' }
  }

  /**
   * 清空购物车
   */
  static async clearCart(userId: string) {
    await prisma.cartItem.deleteMany({
      where: { userId }
    })

    return { message: '购物车已清空' }
  }
}
