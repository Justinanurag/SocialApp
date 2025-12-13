import mongoose from 'mongoose';

/**
 * Comment subdocument schema
 */
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

/**
 * Like subdocument schema
 */
const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

/**
 * Post schema
 */
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  text: {
    type: String,
    required: [true, 'Post text is required'],
    trim: true,
    maxlength: [5000, 'Post text cannot exceed 5000 characters']
  },
  images: [{
    type: String // URLs to uploaded images
  }],
  likes: [likeSchema],
  comments: [commentSchema],
  shares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;

