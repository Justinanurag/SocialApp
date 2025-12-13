import User from '../models/User.js';
import Post from '../models/Post.js';

/**
 * @desc    Search users
 * @route   GET /api/search/users
 * @access  Public
 */
export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search in username, firstName, lastName, email
    const searchRegex = new RegExp(q, 'i');
    const query = {
      $or: [
        { username: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ]
    };

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

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
};

/**
 * @desc    Search posts
 * @route   GET /api/search/posts
 * @access  Public
 */
export const searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search in post text
    const searchRegex = new RegExp(q, 'i');
    const query = { text: searchRegex };

    const posts = await Post.find(query)
      .populate('user', 'username firstName lastName profilePicture')
      .populate('likes.user', 'username firstName lastName profilePicture')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

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
};

/**
 * @desc    General search (users and posts)
 * @route   GET /api/search
 * @access  Public
 */
export const generalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(q, 'i');

    // Search users
    const userQuery = {
      $or: [
        { username: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ]
    };

    // Search posts
    const postQuery = { text: searchRegex };

    const [users, posts, userCount, postCount] = await Promise.all([
      User.find(userQuery).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Post.find(postQuery)
        .populate('user', 'username firstName lastName profilePicture')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(userQuery),
      Post.countDocuments(postQuery)
    ]);

    res.json({
      success: true,
      data: {
        users: {
          results: users,
          total: userCount,
          page,
          limit,
          pages: Math.ceil(userCount / limit)
        },
        posts: {
          results: posts,
          total: postCount,
          page,
          limit,
          pages: Math.ceil(postCount / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

