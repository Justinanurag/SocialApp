import express from 'express';
import {
  searchUsers,
  searchPosts,
  generalSearch
} from '../controllers/searchController.js';

const router = express.Router();

router.get('/', generalSearch);
router.get('/users', searchUsers);
router.get('/posts', searchPosts);

export default router;

