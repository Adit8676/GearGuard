const authService = require('../services/auth.service');
const User = require('../models/user.model');

class AuthController {
  async sendOtp(req, res) {
    try {
      console.log('SendOTP request body:', req.body);
      const { email } = req.body;
      console.log('Extracted email:', email);
      const result = await authService.sendOtp(email);
      res.json({ ok: true, ...result });
    } catch (error) {
      console.log('SendOTP error:', error.message);
      const statusCode = error.message.includes('already exists') ? 400 : 400;
      res.status(statusCode).json({ ok: false, message: error.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { name, email, password, otp } = req.body;
      const result = await authService.verifyOtp(name, email, password, otp);
      
      // Set httpOnly cookie
      res.cookie('gg_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({ ok: true, user: result.user });
    } catch (error) {
      res.status(400).json({ ok: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      console.log('Login request body:', req.body);
      const { email, password } = req.body;
      console.log('Login attempt for email:', email);
      const result = await authService.login(email, password);
      
      // Set httpOnly cookie
      res.cookie('gg_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({ ok: true, user: result.user });
    } catch (error) {
      console.log('Login error:', error.message);
      res.status(400).json({ ok: false, message: error.message });
    }
  }

  async me(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json({ ok: true, user });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async logout(req, res) {
    res.clearCookie('gg_token');
    res.json({ ok: true, message: 'Logged out successfully' });
  }
}

module.exports = new AuthController();