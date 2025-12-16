import { Router } from 'express'
import { CouponController } from '../controllers/coupon.controller'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import { getCouponsSchema, couponIdSchema } from '../validators/coupon.validator'

const router = Router()

/**
 * @route   GET /api/coupons
 * @desc    获取优惠券列表
 * @access  Public
 */
router.get('/', validate(getCouponsSchema, 'query'), CouponController.getCoupons)

/**
 * @route   POST /api/coupons/:id/claim
 * @desc    领取优惠券
 * @access  Private
 */
router.post('/:id/claim', authenticate, validate(couponIdSchema, 'params'), CouponController.claimCoupon)

/**
 * @route   GET /api/coupons/my
 * @desc    我的优惠券列表
 * @access  Private
 */
router.get('/my', authenticate, CouponController.getMyCoupons)

/**
 * @route   GET /api/coupons/available
 * @desc    获取可用优惠券
 * @access  Private
 */
router.get('/available', authenticate, CouponController.getAvailableCoupons)

/**
 * @route   GET /api/banners
 * @desc    获取Banner列表
 * @access  Public
 */
router.get('/banners', CouponController.getBanners)

export default router
