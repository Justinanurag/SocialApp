import User from '../models/User.js';
import Post from '../models/Post.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Get all users (with pagination)
 * @route   GET /api/users
 * @access  Public
 */
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

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
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username firstName lastName profilePicture')
      .populate('following', 'username firstName lastName profilePicture');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Private (own profile only)
 */
export const updateUser = async (req, res, next) => {
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

    // Check if user is updating their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const {
      firstName,
      lastName,
      bio,
      location,
      website,
      profilePicture,
      coverPicture
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        bio,
        location,
        website,
        profilePicture,
        coverPicture
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add experience to user profile
 * @route   POST /api/users/:id/experiences
 * @access  Private (own profile only)
 */
export const addExperience = async (req, res, next) => {
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

    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.experiences.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Experience added successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update experience
 * @route   PUT /api/users/:id/experiences/:expId
 * @access  Private (own profile only)
 */
export const updateExperience = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const experience = user.experiences.id(req.params.expId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    Object.assign(experience, req.body);
    await user.save();

    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete experience
 * @route   DELETE /api/users/:id/experiences/:expId
 * @access  Private (own profile only)
 */
export const deleteExperience = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.experiences.id(req.params.expId).remove();
    await user.save();

    res.json({
      success: true,
      message: 'Experience deleted successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add education to user profile
 * @route   POST /api/users/:id/education
 * @access  Private (own profile only)
 */
export const addEducation = async (req, res, next) => {
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

    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.education.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Education added successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update education
 * @route   PUT /api/users/:id/education/:eduId
 * @access  Private (own profile only)
 */
export const updateEducation = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const education = user.education.id(req.params.eduId);
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    Object.assign(education, req.body);
    await user.save();

    res.json({
      success: true,
      message: 'Education updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete education
 * @route   DELETE /api/users/:id/education/:eduId
 * @access  Private (own profile only)
 */
export const deleteEducation = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.education.id(req.params.eduId).remove();
    await user.save();

    res.json({
      success: true,
      message: 'Education deleted successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's posts
 * @route   GET /api/users/:id/posts
 * @access  Public
 */
export const getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: req.params.id })
      .populate('user', 'username firstName lastName profilePicture')
      .populate('likes.user', 'username firstName lastName profilePicture')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ user: req.params.id });

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

