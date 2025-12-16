import Joi from 'joi'

/**
 * 帖子列表查询验证
 */
export const getPostsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(50).default(20),
  type: Joi.string().valid('IMAGE', 'VIDEO').optional()
})

/**
 * 帖子ID验证
 */
export const postIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': '帖子ID不能为空'
  })
})

/**
 * 发布帖子验证
 */
export const createPostSchema = Joi.object({
  type: Joi.string().valid('IMAGE', 'VIDEO').required().messages({
    'any.only': '类型必须是 IMAGE 或 VIDEO',
    'any.required': '类型不能为空'
  }),
  title: Joi.string().min(2).max(100).required().messages({
    'string.min': '标题至少2个字符',
    'string.max': '标题最多100个字符',
    'any.required': '标题不能为空'
  }),
  content: Joi.string().max(2000).optional(),
  images: Joi.array().items(Joi.string().uri()).when('type', {
    is: 'IMAGE',
    then: Joi.array().min(1).required(),
    otherwise: Joi.optional()
  }).messages({
    'array.min': '至少上传1张图片'
  }),
  video: Joi.string().uri().when('type', {
    is: 'VIDEO',
    then: Joi.string().required(),
    otherwise: Joi.optional()
  }).messages({
    'any.required': '视频URL不能为空'
  }),
  videoCover: Joi.string().uri().optional(),
  productIds: Joi.array().items(Joi.string()).optional()
})

/**
 * 评论验证
 */
export const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required().messages({
    'string.min': '评论不能为空',
    'string.max': '评论最多500个字符',
    'any.required': '评论内容不能为空'
  }),
  parentId: Joi.string().optional()
})

/**
 * 评论ID验证
 */
export const commentIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': '评论ID不能为空'
  })
})
