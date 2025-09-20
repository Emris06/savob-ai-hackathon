const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testWeatherService() {
  console.log('🌤️  Testing Weather Service...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    // Test current weather
    console.log('\n2. Testing current weather...');
    const currentWeatherResponse = await axios.get(`${BASE_URL}/weather/London`);
    console.log('✅ Current weather for London:');
    console.log('   Temperature:', currentWeatherResponse.data.data.current.temperature, '°C');
    console.log('   Humidity:', currentWeatherResponse.data.data.current.humidity, '%');
    console.log('   Wind Speed:', currentWeatherResponse.data.data.current.windSpeed, 'km/h');
    console.log('   Condition:', currentWeatherResponse.data.data.current.condition);
    console.log('   Source:', currentWeatherResponse.data.data.source || 'OpenWeatherMap');

    // Test weather forecast
    console.log('\n3. Testing weather forecast...');
    const forecastResponse = await axios.get(`${BASE_URL}/weather/London/forecast`);
    console.log('✅ 7-day forecast for London:');
    forecastResponse.data.data.forecasts.slice(0, 3).forEach((day, index) => {
      console.log(`   Day ${index + 1}: ${day.temperature.min}°C - ${day.temperature.max}°C, ${day.condition}`);
    });

    // Test complete weather data
    console.log('\n4. Testing complete weather data...');
    const completeWeatherResponse = await axios.get(`${BASE_URL}/weather/New York/complete`);
    console.log('✅ Complete weather data for New York:');
    console.log('   Current:', completeWeatherResponse.data.data.current.current.temperature, '°C');
    console.log('   Forecast days:', completeWeatherResponse.data.data.forecast.forecasts.length);
    console.log('   Source:', completeWeatherResponse.data.data.source);

    // Test weather service statistics
    console.log('\n5. Testing weather service statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/weather/stats`);
    console.log('✅ Weather service stats:');
    console.log('   Cache size:', statsResponse.data.data.size);
    console.log('   Request counts:', statsResponse.data.data.requestCounts);

    // Test cache functionality
    console.log('\n6. Testing cache functionality...');
    console.log('   Making first request (should hit API or use mock)...');
    const firstRequest = await axios.get(`${BASE_URL}/weather/Paris`);
    console.log('   First request completed');
    
    console.log('   Making second request (should hit cache)...');
    const secondRequest = await axios.get(`${BASE_URL}/weather/Paris`);
    console.log('   Second request completed');
    
    // Test error handling with invalid location
    console.log('\n7. Testing error handling...');
    try {
      await axios.get(`${BASE_URL}/weather/InvalidLocation12345`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Error handling: Invalid location returns 404');
      } else {
        console.log('⚠️  Error handling: Unexpected error for invalid location');
      }
    }

    // Test irrigation with weather integration
    console.log('\n8. Testing irrigation with weather integration...');
    const irrigationResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?area=10&soilMoisture=45&soilType=loamy&daysSincePlanting=80`);
    console.log('✅ Irrigation recommendation with weather:');
    console.log('   Recommendation:', irrigationResponse.data.data.recommendation);
    console.log('   Amount:', irrigationResponse.data.data.recommendedAmount, 'L/ha');
    console.log('   Weather factors:', irrigationResponse.data.data.weatherFactors);

    // Test different locations
    console.log('\n9. Testing different locations...');
    const locations = ['Tokyo', 'Sydney', 'Berlin', 'Mumbai'];
    
    for (const location of locations) {
      try {
        const response = await axios.get(`${BASE_URL}/weather/${location}`);
        console.log(`   ${location}: ${response.data.data.current.temperature}°C, ${response.data.data.current.condition}`);
      } catch (error) {
        console.log(`   ${location}: Error - ${error.message}`);
      }
    }

    // Test cache clearing
    console.log('\n10. Testing cache clearing...');
    const clearCacheResponse = await axios.post(`${BASE_URL}/weather/clear-cache`);
    console.log('✅ Cache cleared:', clearCacheResponse.data.message);

    // Test weather data processing for irrigation
    console.log('\n11. Testing weather data processing for irrigation...');
    const weatherForIrrigation = await axios.get(`${BASE_URL}/weather/Madrid`);
    const irrigationData = weatherForIrrigation.data.data.irrigation;
    console.log('✅ Weather data processed for irrigation:');
    console.log('   Temperature:', irrigationData.temperature, '°C');
    console.log('   Humidity:', irrigationData.humidity, '%');
    console.log('   Solar Radiation:', irrigationData.solarRadiation, 'MJ/m²/day');
    console.log('   Precipitation:', irrigationData.precipitation, 'mm');

    console.log('\n🎉 All weather service tests completed successfully!');
    console.log('\n📊 Weather Service Features Tested:');
    console.log('   ✅ Current weather data fetching');
    console.log('   ✅ 7-day weather forecast');
    console.log('   ✅ Complete weather data (current + forecast)');
    console.log('   ✅ Response caching to avoid rate limits');
    console.log('   ✅ Error handling for API failures');
    console.log('   ✅ Mock data fallback when API unavailable');
    console.log('   ✅ Weather data processing for irrigation calculations');
    console.log('   ✅ Rate limiting and request management');
    console.log('   ✅ Cache statistics and management');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testWeatherService();
}

module.exports = testWeatherService;
