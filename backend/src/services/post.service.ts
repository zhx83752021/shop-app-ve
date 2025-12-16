import prisma from '../config/database'
import { Prisma } from '@prisma/client'

/**
 * 帖子服务
 */
export class PostService {
  /**
   * 获取帖子列表
   */
  static async getPosts(query: any, userId?: string) {
    const { page = 1, pageSize = 20, type } = query

    const where: Prisma.PostWhereInput = {
      status: 'APPROVED'
    }

    if (type) {
      where.type = type
    }

    const total = await prisma.post.count({ where })

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            memberLevel: true
          }
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                mainImage: true,
                price: true,
                originalPrice: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    // 如果提供了userId，查询点赞和关注状态
    let likesMap: Map<string, boolean> = new Map()
    let followsMap: Map<string, boolean> = new Map()

    if (userId) {
      // 批量查询点赞状态
      const likes = await prisma.postLike.findMany({
        where: {
          userId,
          postId: { in: posts.map(p => p.id) }
        },
        select: { postId: true }
      })
      likesMap = new Map(likes.map(l => [l.postId, true]))

      // 批量查询关注状态
      const authorIds = [...new Set(posts.map(p => p.userId))]
      const follows = await prisma.follow.findMany({
        where: {
          followerId: userId,
          followingId: { in: authorIds }
        },
        select: { followingId: true }
      })
      followsMap = new Map(follows.map(f => [f.followingId, true]))
    }

    return {
      items: posts.map((post) => ({
        ...post,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        isLiked: likesMap.get(post.id) || false,
        isFollowing: followsMap.get(post.userId) || false,
        products: post.products.map((pp) => ({
          ...pp.product,
          price: pp.product.price.toString(),
          originalPrice: pp.product.originalPrice.toString()
        })),
        _count: undefined
      })),
      total,
      page,
      pageSize
    }
  }

  /**
   * 获取帖子详情
   */
  static async getPostById(postId: string, userId?: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            memberLevel: true
          }
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                mainImage: true,
                price: true,
                originalPrice: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    if (!post) {
      throw new Error('帖子不存在')
    }

    if (post.status !== 'APPROVED') {
      throw new Error('帖子未通过审核')
    }

    // 检查是否点赞
    let isLiked = false
    if (userId) {
      const like = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId,
            userId
          }
        }
      })
      isLiked = !!like
    }

    return {
      ...post,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      isLiked,
      products: post.products.map((pp) => ({
        ...pp.product,
        price: pp.product.price.toString(),
        originalPrice: pp.product.originalPrice.toString()
      })),
      _count: undefined
    }
  }

  /**
   * 发布帖子
   */
  static async createPost(userId: string, data: any) {
    const { productIds, ...postData } = data

    const post = await prisma.post.create({
      data: {
        ...postData,
        userId,
        status: 'PENDING'
      }
    })

    // 关联商品
    if (productIds && productIds.length > 0) {
      await prisma.postProduct.createMany({
        data: productIds.map((productId: string) => ({
          postId: post.id,
          productId
        }))
      })
    }

    return post
  }

  /**
   * 点赞/取消点赞
   */
  static async toggleLike(userId: string, postId: string) {
    // 检查帖子是否存在
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      throw new Error('帖子不存在')
    }

    // 检查是否已点赞
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    })

    if (existingLike) {
      // 取消点赞
      await prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId
          }
        }
      })
      return { isLiked: false, message: '取消点赞' }
    } else {
      // 点赞
      await prisma.postLike.create({
        data: {
          userId,
          postId
        }
      })
      return { isLiked: true, message: '点赞成功' }
    }
  }

  /**
   * 获取评论列表
   */
  static async getComments(postId: string, page: number = 1, pageSize: number = 20) {
    const total = await prisma.comment.count({
      where: { postId, parentId: null }
    })

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                avatar: true
              }
            },
            replyToUser: {
              select: {
                id: true,
                nickname: true
              }
            }
          },
          orderBy: { createdAt: 'asc' },
          take: 3
        },
        _count: {
          select: {
            replies: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return {
      items: comments.map((comment) => ({
        ...comment,
        replyCount: comment._count.replies,
        _count: undefined
      })),
      total,
      page,
      pageSize
    }
  }

  /**
   * 发表评论
   */
  static async createComment(userId: string, postId: string, data: any) {
    const { content, parentId } = data

    // 检查帖子是否存在
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      throw new Error('帖子不存在')
    }

    // 如果是回复，检查父评论是否存在
    let replyToUserId = null
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      })

      if (!parentComment) {
        throw new Error('父评论不存在')
      }

      replyToUserId = parentComment.userId
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
        parentId,
        replyToUserId
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        }
      }
    })

    return comment
  }

  /**
   * 删除评论
   */
  static async deleteComment(userId: string, commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if (!comment) {
      throw new Error('评论不存在')
    }

    if (comment.userId !== userId) {
      throw new Error('无权删除此评论')
    }

    await prisma.comment.delete({
      where: { id: commentId }
    })

    return { message: '删除成功' }
  }

  /**
   * 我的帖子列表
   */
  static async getMyPosts(userId: string, page: number = 1, pageSize: number = 20) {
    const total = await prisma.post.count({
      where: { userId }
    })

    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return {
      items: posts.map((post) => ({
        ...post,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        _count: undefined
      })),
      total,
      page,
      pageSize
    }
  }
}
