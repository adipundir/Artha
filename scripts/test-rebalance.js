const axios = require('axios');
require('dotenv').config();

// Get API secret from environment variables
const API_SECRET = process.env.REBALANCE_API_SECRET || 'default-secret-change-me';
const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function testRebalance() {
  try {
    console.log('Testing rebalance API with decision function...');
    
    // Call the rebalance API
    const response = await axios.post(`${API_URL}/api/rebalance`, {
      secret: API_SECRET
    });
    
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✓ Test completed successfully');
    } else {
      console.error('✗ Test failed');
    }
  } catch (error) {
    console.error('Error testing rebalance API:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
testRebalance(); 