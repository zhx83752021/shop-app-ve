import Joi from 'joi'

/**
 * 商品列表查询验证
 */
export const getProductsSchema = Joi.object({
  categoryId: Joi.string().optional(),
  keyword: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('sales', 'price', 'createdAt').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20)
})

/**
 * 商品ID验证
 */
export const productIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': '商品ID不能为空'
  })
})

/**
 * 分类ID验证
 */
export const categoryIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': '分类ID不能为空'
  })
})

/**
 * 搜索建议验证
 */
export const searchSuggestSchema = Joi.object({
  keyword: Joi.string().min(1).required().messages({
    'string.min': '关键词不能为空',
    'any.required': '关键词不能为空'
  })
})
