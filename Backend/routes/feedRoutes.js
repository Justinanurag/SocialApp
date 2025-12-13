import express from 'express';
import { protect } from '../middleware/auth.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @desc    Get user's personalized feed
 * @route   GET /api/feed
 * @access  Private
 * 
 * Returns posts from users that the current user follows,
 * sorted by most recent first
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get current user's following list
    const currentUser = await User.findById(req.user.id);
    const followingIds = currentUser.following || [];

    // Include current user's own posts in the feed
    followingIds.push(req.user.id);

    // Get posts from followed users
    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user', 'username firstName lastName profilePicture')
      .populate('likes.user', 'username firstName lastName profilePicture')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ user: { $in: followingIds } });

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

