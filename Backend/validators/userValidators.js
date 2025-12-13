import { body } from 'express-validator';

export const updateUserValidator = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('profilePicture')
    .optional()
    .trim(),
  body('coverPicture')
    .optional()
    .trim()
];

export const experienceValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  body('current')
    .optional()
    .isBoolean()
    .withMessage('Current must be a boolean'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
];

export const educationValidator = [
  body('school')
    .trim()
    .notEmpty()
    .withMessage('School name is required')
    .isLength({ max: 100 })
    .withMessage('School name cannot exceed 100 characters'),
  body('degree')
    .trim()
    .notEmpty()
    .withMessage('Degree is required')
    .isLength({ max: 100 })
    .withMessage('Degree cannot exceed 100 characters'),
  body('fieldOfStudy')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Field of study cannot exceed 100 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  body('current')
    .optional()
    .isBoolean()
    .withMessage('Current must be a boolean'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
];

