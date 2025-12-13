import mongoose from 'mongoose';

/**
 * Follow schema
 * Tracks follow relationships between users
 * This is optional as we can also track follows in User model
 * but having a separate model allows for better querying and analytics
 */
const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Prevent self-follow
followSchema.pre('save', function (next) {
  if (this.follower.toString() === this.following.toString()) {
    next(new Error('Cannot follow yourself'));
  } else {
    next();
  }
});

const Follow = mongoose.model('Follow', followSchema);

export default Follow;

