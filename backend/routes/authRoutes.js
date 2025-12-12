const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { loginValidationRules, validate } = require('../middleware/validation');

// Public routes
router.post('/login', loginValidationRules(), validate, authController.login);
router.post('/create-test-users', authController.createTestUsers);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.post('/logout', auth, authController.logout);
router.put('/change-password', auth, authController.changePassword);

module.exports = router;