const axios = require('axios');

class BrevoService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.sender = process.env.BREVO_SENDER;
    this.baseURL = 'https://api.brevo.com/v3';
    console.log('Brevo initialized with sender:', this.sender);
  }

  async sendOtpEmail(email, name, otp) {
    try {
      console.log('Sending email with API key:', this.apiKey ? 'Present' : 'Missing');
      console.log('Sender email:', this.sender);
      
      const response = await axios.post(
        `${this.baseURL}/smtp/email`,
        {
          sender: {
            name: 'GearGuard',
            email: this.sender
          },
          to: [{ email, name }],
          subject: 'Your GearGuard Verification Code',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Welcome to GearGuard!</h2>
              <p>Hi ${name},</p>
              <p>Your verification code is:</p>
              <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #1f2937; font-size: 32px; margin: 0; letter-spacing: 8px;">${otp}</h1>
              </div>
              <p>This code will expire in 15 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">GearGuard - Powering Smarter Maintenance</p>
            </div>
          `
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': this.apiKey
          }
        }
      );
      console.log('Email sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Brevo email error:', error.response?.data || error.message);
      throw new Error('Failed to send OTP email');
    }
  }
}

module.exports = new BrevoService();