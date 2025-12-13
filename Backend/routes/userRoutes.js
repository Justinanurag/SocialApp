import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  getUserPosts
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import {
  updateUserValidator,
  experienceValidator,
  educationValidator
} from '../validators/userValidators.js';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/followController.js';

const router = express.Router();

// Public routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/:id/posts', getUserPosts);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

// Protected routes
router.put('/:id', protect, updateUserValidator, updateUser);
router.post('/:id/experiences', protect, experienceValidator, addExperience);
router.put('/:id/experiences/:expId', protect, updateExperience);
router.delete('/:id/experiences/:expId', protect, deleteExperience);
router.post('/:id/education', protect, educationValidator, addEducation);
router.put('/:id/education/:eduId', protect, updateEducation);
router.delete('/:id/education/:eduId', protect, deleteEducation);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

export default router;

