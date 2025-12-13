import { body } from 'express-validator';

export const createPostValidator = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Post text is required')
    .isLength({ max: 5000 })
    .withMessage('Post text cannot exceed 5000 characters')
];

export const updatePostValidator = [
  body('text')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Post text cannot be empty')
    .isLength({ max: 5000 })
    .withMessage('Post text cannot exceed 5000 characters')
];

export const commentValidator = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
];

