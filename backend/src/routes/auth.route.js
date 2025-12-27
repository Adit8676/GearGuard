const express = require('express');
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;