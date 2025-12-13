import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  createPostValidator,
  updatePostValidator,
  commentValidator
} from '../validators/postValidators.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, upload.array('images', 5), createPostValidator, createPost);
router.put('/:id', protect, upload.array('images', 5), updatePostValidator, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comments', protect, commentValidator, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;

