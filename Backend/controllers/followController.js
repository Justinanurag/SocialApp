import User from '../models/User.js';
import Follow from '../models/Follow.js';

/**
 * @desc    Follow a user
 * @route   POST /api/users/:id/follow
 * @access  Private
 */
export const followUser = async (req, res, next) => {
  try {
    const userIdToFollow = req.params.id;
    const currentUserId = req.user.id;

    // Prevent self-follow
    if (userIdToFollow === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot follow yourself'
      });
    }

    // Check if user exists
    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: userIdToFollow
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    // Create follow relationship
    await Follow.create({
      follower: currentUserId,
      following: userIdToFollow
    });

    // Update user's following and followers arrays
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userIdToFollow }
    });

    await User.findByIdAndUpdate(userIdToFollow, {
      $addToSet: { followers: currentUserId }
    });

    res.status(201).json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unfollow a user
 * @route   DELETE /api/users/:id/follow
 * @access  Private
 */
export const unfollowUser = async (req, res, next) => {
  try {
    const userIdToUnfollow = req.params.id;
    const currentUserId = req.user.id;

    // Check if follow relationship exists
    const follow = await Follow.findOne({
      follower: currentUserId,
      following: userIdToUnfollow
    });

    if (!follow) {
      return res.status(400).json({
        success: false,
        message: 'Not following this user'
      });
    }

    // Remove follow relationship
    await Follow.findOneAndDelete({
      follower: currentUserId,
      following: userIdToUnfollow
    });

    // Update user's following and followers arrays
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userIdToUnfollow }
    });

    await User.findByIdAndUpdate(userIdToUnfollow, {
      $pull: { followers: currentUserId }
    });

    res.json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's followers
 * @route   GET /api/users/:id/followers
 * @access  Public
 */
export const getFollowers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const followers = await User.find({ _id: { $in: user.followers } })
      .select('-password')
      .skip(skip)
      .limit(limit);

    const total = user.followers.length;

    res.json({
      success: true,
      data: {
        followers,
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
 * @desc    Get users that a user is following
 * @route   GET /api/users/:id/following
 * @access  Public
 */
export const getFollowing = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const following = await User.find({ _id: { $in: user.following } })
      .select('-password')
      .skip(skip)
      .limit(limit);

    const total = user.following.length;

    res.json({
      success: true,
      data: {
        following,
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

