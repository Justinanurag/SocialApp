import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @desc    Explore posts (trending/popular posts)
 * @route   GET /api/explore
 * @access  Public
 * 
 * Returns posts sorted by engagement (likes + comments)
 */
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get posts sorted by engagement (likes count + comments count)
    const posts = await Post.aggregate([
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $size: { $ifNull: ['$likes', []] } },
              { $size: { $ifNull: ['$comments', []] } }
            ]
          }
        }
      },
      { $sort: { engagementScore: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    // Populate user, likes, and comments
    const populatedPosts = await Post.populate(posts, [
      { path: 'user', select: 'username firstName lastName profilePicture' },
      { path: 'likes.user', select: 'username firstName lastName profilePicture' },
      { path: 'comments.user', select: 'username firstName lastName profilePicture' }
    ]);

    const total = await Post.countDocuments();

    res.json({
      success: true,
      data: {
        posts: populatedPosts,
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

/**
 * @desc    Explore users (suggested users to follow)
 * @route   GET /api/explore/users
 * @access  Public
 * 
 * Returns users sorted by follower count
 */
router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.aggregate([
      {
        $addFields: {
          followerCount: { $size: { $ifNull: ['$followers', []] } }
        }
      },
      { $sort: { followerCount: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { password: 0 } }
    ]);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
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

