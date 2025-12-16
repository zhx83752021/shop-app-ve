import { Router } from 'express'
import { PostController } from '../controllers/post.controller'
import { authenticate, optionalAuth } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import {
  getPostsSchema,
  postIdSchema,
  createPostSchema,
  createCommentSchema,
  commentIdSchema
} from '../validators/post.validator'

const router = Router()

/**
 * @route   GET /api/posts
 * @desc    获取帖子列表
 * @access  Public
 */
router.get('/', validate(getPostsSchema, 'query'), optionalAuth, PostController.getPosts)

/**
 * @route   GET /api/posts/my
 * @desc    我的帖子列表
 * @access  Private
 */
router.get('/my', authenticate, PostController.getMyPosts)

/**
 * @route   POST /api/posts
 * @desc    发布帖子
 * @access  Private
 */
router.post('/', authenticate, validate(createPostSchema), PostController.createPost)

/**
 * @route   GET /api/posts/:id
 * @desc    获取帖子详情
 * @access  Public
 */
router.get('/:id', validate(postIdSchema, 'params'), optionalAuth, PostController.getPostById)

/**
 * @route   POST /api/posts/:id/like
 * @desc    点赞/取消点赞
 * @access  Private
 */
router.post('/:id/like', authenticate, validate(postIdSchema, 'params'), PostController.toggleLike)

/**
 * @route   GET /api/posts/:id/comments
 * @desc    获取评论列表
 * @access  Public
 */
router.get('/:id/comments', validate(postIdSchema, 'params'), PostController.getComments)

/**
 * @route   POST /api/posts/:id/comments
 * @desc    发表评论
 * @access  Private
 */
router.post('/:id/comments', authenticate, validate(postIdSchema, 'params'), validate(createCommentSchema), PostController.createComment)

/**
 * @route   DELETE /api/posts/comments/:id
 * @desc    删除评论
 * @access  Private
 */
router.delete('/comments/:id', authenticate, validate(commentIdSchema, 'params'), PostController.deleteComment)

export default router
