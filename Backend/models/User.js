import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Experience subdocument schema
 */
const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

/**
 * Education subdocument schema
 */
const educationSchema = new mongoose.Schema({
  school: {
    type: String,
    required: [true, 'Please provide a school name'],
    trim: true
  },
  degree: {
    type: String,
    required: [true, 'Please provide a degree'],
    trim: true
  },
  fieldOfStudy: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

/**
 * User schema
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  coverPicture: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  experiences: [experienceSchema],
  education: [educationSchema],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;

