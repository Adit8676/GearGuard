const axios = require('axios');
require('dotenv').config();

const testBrevo = async () => {
  try {
    const response = await axios.get('https://api.brevo.com/v3/account', {
      headers: {
        'Accept': 'application/json',
        'Api-Key': process.env.BREVO_API_KEY
      }
    });
    console.log('✅ Brevo API Key is valid');
    console.log('Account:', response.data.email);
  } catch (error) {
    console.log('❌ Brevo API Key error:', error.response?.data || error.message);
  }
};

testBrevo();