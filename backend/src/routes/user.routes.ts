import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import {
  updateProfileSchema,
  changePasswordSchema,
  addAddressSchema,
  updateAddressSchema,
  addressIdSchema,
  favoriteSchema
} from '../validators/user.validator'

const router = Router()

// 所有用户操作都需要认证
router.use(authenticate)

/**
 * @route   GET /api/user/profile
 * @desc    获取用户信息
 * @access  Private
 */
router.get('/profile', UserController.getProfile)

/**
 * @route   PUT /api/user/profile
 * @desc    更新用户信息
 * @access  Private
 */
router.put('/profile', validate(updateProfileSchema), UserController.updateProfile)

/**
 * @route   PUT /api/user/password
 * @desc    修改密码
 * @access  Private
 */
router.put('/password', validate(changePasswordSchema), UserController.changePassword)

/**
 * @route   GET /api/user/addresses
 * @desc    获取地址列表
 * @access  Private
 */
router.get('/addresses', UserController.getAddresses)

/**
 * @route   POST /api/user/addresses
 * @desc    添加地址
 * @access  Private
 */
router.post('/addresses', validate(addAddressSchema), UserController.addAddress)

/**
 * @route   PUT /api/user/addresses/:id
 * @desc    更新地址
 * @access  Private
 */
router.put('/addresses/:id', validate(addressIdSchema, 'params'), validate(updateAddressSchema), UserController.updateAddress)

/**
 * @route   DELETE /api/user/addresses/:id
 * @desc    删除地址
 * @access  Private
 */
router.delete('/addresses/:id', validate(addressIdSchema, 'params'), UserController.deleteAddress)

/**
 * @route   GET /api/user/favorites
 * @desc    获取收藏列表
 * @access  Private
 */
router.get('/favorites', UserController.getFavorites)

/**
 * @route   POST /api/user/favorites
 * @desc    添加收藏
 * @access  Private
 */
router.post('/favorites', validate(favoriteSchema), UserController.addFavorite)

/**
 * @route   DELETE /api/user/favorites/:productId
 * @desc    取消收藏
 * @access  Private
 */
router.delete('/favorites/:productId', UserController.removeFavorite)

/**
 * @route   GET /api/user/browse-history
 * @desc    获取浏览历史
 * @access  Private
 */
router.get('/browse-history', UserController.getBrowseHistory)

/**
 * @route   DELETE /api/user/browse-history
 * @desc    清空浏览历史
 * @access  Private
 */
router.delete('/browse-history', UserController.clearBrowseHistory)

/**
 * @route   POST /api/user/follow
 * @desc    关注用户
 * @access  Private
 */
router.post('/follow', UserController.followUser)

/**
 * @route   DELETE /api/user/follow/:userId
 * @desc    取消关注用户
 * @access  Private
 */
router.delete('/follow/:userId', UserController.unfollowUser)

/**
 * @route   GET /api/user/followings
 * @desc    获取关注列表
 * @access  Private
 */
router.get('/followings', UserController.getFollowings)

/**
 * @route   GET /api/user/followers
 * @desc    获取粉丝列表
 * @access  Private
 */
router.get('/followers', UserController.getFollowers)

export default router
