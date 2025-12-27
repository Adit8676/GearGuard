const User = require('../models/user.model');
const Otp = require('../models/otp.model');
const brevoService = require('../lib/brevo');
const { generateToken } = require('../lib/jwt');

class AuthService {
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(email) {
    // Validation
    if (!email) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Rate limiting - check recent OTP attempts
    const recentOtps = await Otp.find({
      email,
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
    });

    if (recentOtps.length >= 5) {
      throw new Error('Too many OTP requests. Please try again later.');
    }

    // Delete any existing OTP for this email
    await Otp.deleteMany({ email });

    // Generate and store OTP (plain text like Willow)
    const otp = this.generateOtp();
    await Otp.create({
      email,
      otp, // Store plain text like Willow
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    });

    // Send OTP via Brevo
    await brevoService.sendOtpEmail(email, 'User', otp);

    return {
      message: 'OTP sent successfully',
      resendAvailableAt: Date.now() + 60 * 1000 // 1 minute
    };
  }

  async verifyOtp(name, email, password, otp) {
    if (!name || !email || !password || !otp) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Find OTP record (plain text comparison like Willow)
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    // Clean up OTP
    await Otp.deleteOne({ email, otp });

    // Generate JWT
    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async login(email, password) {
    console.log('AuthService login called with:', { email, password: password ? '[HIDDEN]' : 'undefined' });
    
    if (!email || !password) {
      console.log('Missing email or password');
      throw new Error('Email and password are required');
    }

    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      throw new Error('Invalid credentials');
    }

    console.log('User found:', { id: user._id, email: user.email, role: user.role, status: user.status });
    
    if (user.status === 'disabled') {
      console.log('User account is disabled');
      throw new Error('Account is disabled. Please contact administrator.');
    }

    console.log('Comparing password...');
    const isValidPassword = await user.comparePassword(password);
    console.log('Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      throw new Error('Invalid credentials');
    }

    console.log('Generating token...');
    const token = generateToken(user._id);
    console.log('Token generated successfully');

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    };
  }
}

module.exports = new AuthService();