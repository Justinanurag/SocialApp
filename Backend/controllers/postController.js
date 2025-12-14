import Post from '../models/Post.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { uploadMultipleToCloudinary } from '../utils/cloudinary.js';

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text } = req.body;
    
    // Upload images to Cloudinary if files are present
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        const files = req.files.map(file => ({
          buffer: file.buffer,
          mimetype: file.mimetype
        }));
        imageUrls = await uploadMultipleToCloudinary(files, 'social-posts');
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // If Cloudinary is not configured, allow post creation without images
        if (uploadError.message && uploadError.message.includes('Cloudinary is not configured')) {
          console.warn('Cloudinary not configured, creating post without images');
          imageUrls = [];
        } else {
          return res.status(500).json({
            success: false,
            message: uploadError.message || 'Failed to upload images. Please check Cloudinary configuration.',
            error: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
          });
        }
      }
    }

    const post = await Post.create({
      user: req.user.id,
      text,
      images: imageUrls
    });

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post: populatedPost }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all posts (with pagination)
 * @route   GET /api/posts
 * @access  Public
 */
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('user', 'username firstName lastName profilePicture')
      .populate('likes.user', 'username firstName lastName profilePicture')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

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
 * @desc    Get post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username firstName lastName profilePicture')
      .populate('likes.user', 'username firstName lastName profilePicture')
      .populate('comments.user', 'username firstName lastName profilePicture');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private (own post only)
 */
export const updatePost = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { text } = req.body;
    
    // Upload new images to Cloudinary if files are present
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        const files = req.files.map(file => ({
          buffer: file.buffer,
          mimetype: file.mimetype
        }));
        imageUrls = await uploadMultipleToCloudinary(files, 'social-posts');
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // If Cloudinary is not configured, allow post update without images
        if (uploadError.message && uploadError.message.includes('Cloudinary is not configured')) {
          console.warn('Cloudinary not configured, updating post without new images');
          imageUrls = [];
        } else {
          return res.status(500).json({
            success: false,
            message: uploadError.message || 'Failed to upload images. Please check Cloudinary configuration.',
            error: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
          });
        }
      }
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        text,
        ...(imageUrls.length > 0 && { images: imageUrls })
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('user', 'username firstName lastName profilePicture')
      .populate('likes.user', 'username firstName lastName profilePicture')
      .populate('comments.user', 'username firstName lastName profilePicture');

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private (own post only)
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like/Unlike post
 * @route   POST /api/posts/:id/like
 * @access  Private
 */
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if already liked
    const alreadyLiked = post.likes.some(
      like => like.user.toString() === req.user.id
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        like => like.user.toString() !== req.user.id
      );
      await post.save();

      const updatedPost = await Post.findById(post._id)
        .populate('user', 'username firstName lastName profilePicture')
        .populate('likes.user', 'username firstName lastName profilePicture')
        .populate('comments.user', 'username firstName lastName profilePicture');

      return res.json({
        success: true,
        message: 'Post unliked',
        data: { post: updatedPost }
      });
    } else {
      // Like
      post.likes.push({ user: req.user.id });
      await post.save();

      const updatedPost = await Post.findById(post._id)
        .populate('user', 'username firstName lastName profilePicture')
        .populate('likes.user', 'username firstName lastName profilePicture')
        .populate('comments.user', 'username firstName lastName profilePicture');

      return res.json({
        success: true,
        message: 'Post liked',
        data: { post: updatedPost }
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add comment to post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
export const addComment = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      user: req.user.id,
      text: req.body.text
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username firstName lastName profilePicture')
      .populate('likes.user', 'username firstName lastName profilePicture')
      .populate('comments.user', 'username firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { post: updatedPost }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete comment
 * @route   DELETE /api/posts/:id/comments/:commentId
 * @access  Private (own comment or post owner)
 */
export const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment or the post
    if (
      comment.user.toString() !== req.user.id &&
      post.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    post.comments.id(req.params.commentId).remove();
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username firstName lastName profilePicture')
      .populate('likes.user', 'username firstName lastName profilePicture')
      .populate('comments.user', 'username firstName lastName profilePicture');

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: { post: updatedPost }
    });
  } catch (error) {
    next(error);
  }
};

