const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing Irrigation API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    // Test farms endpoint
    console.log('\n2. Testing farms endpoint...');
    const farmsResponse = await axios.get(`${BASE_URL}/farms`);
    console.log('✅ Farms:', farmsResponse.data.data.length, 'farms found');

    // Test weather endpoint (without API key - should show error handling)
    console.log('\n3. Testing weather endpoint...');
    try {
      const weatherResponse = await axios.get(`${BASE_URL}/weather/London`);
      console.log('✅ Weather data received');
    } catch (error) {
      console.log('⚠️  Weather API requires OpenWeatherMap key:', error.response?.data?.message || error.message);
    }

    // Test irrigation recommendations
    console.log('\n4. Testing irrigation recommendations...');
    const irrigationResponse = await axios.get(`${BASE_URL}/irrigation/tomatoes/California?area=10&soilMoisture=45`);
    console.log('✅ Irrigation recommendation:', irrigationResponse.data.data.recommendation);
    console.log('   Amount:', irrigationResponse.data.data.recommendedAmount, 'liters');

    // Test irrigation logging
    console.log('\n5. Testing irrigation logging...');
    const logData = {
      farmId: 'farm1',
      cropType: 'tomatoes',
      area: 10,
      amount: 150,
      duration: 45,
      zones: ['Zone A', 'Zone B'],
      notes: 'Test irrigation session'
    };
    const logResponse = await axios.post(`${BASE_URL}/irrigation/log`, logData);
    console.log('✅ Irrigation logged:', logResponse.data.message);

    // Test savings calculation
    console.log('\n6. Testing savings calculation...');
    const savingsResponse = await axios.get(`${BASE_URL}/savings/farm1?period=monthly`);
    console.log('✅ Savings calculated:');
    console.log('   Water saved:', savingsResponse.data.data.savings.waterSaved, 'liters');
    console.log('   Cost saved: $', savingsResponse.data.data.savings.costSaved);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
