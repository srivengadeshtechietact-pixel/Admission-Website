const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { login, changePassword, forgotPassword, resetPassword, register } = require('../controllers/authController');
const { validateInput } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post(
    '/login',
    [
        check('username', 'Please include a valid username').not().isEmpty(),
        check('password', 'Password is required').exists()
    ],
    validateInput,
    login
);

router.post(
    '/forgot-password',
    [
        check('email', 'Please include a valid email').isEmail()
    ],
    validateInput,
    forgotPassword
);

router.put(
    '/reset-password/:resettoken',
    [
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
    ],
    validateInput,
    resetPassword
);

router.put(
    '/change-password',
    protect,
    [
        check('currentPassword', 'Current password is required').exists(),
        check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
    ],
    validateInput,
    changePassword
);

router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    validateInput,
    register
);

module.exports = router;
