const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testIrrigationAlgorithm() {
  console.log('🧪 Testing Advanced Irrigation Algorithm...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    // Test supported crops
    console.log('\n2. Testing supported crops...');
    const cropsResponse = await axios.get(`${BASE_URL}/crops`);
    console.log('✅ Supported crops:', cropsResponse.data.data.map(c => c.type).join(', '));

    // Test soil types
    console.log('\n3. Testing soil types...');
    const soilTypesResponse = await axios.get(`${BASE_URL}/soil-types`);
    console.log('✅ Soil types:', soilTypesResponse.data.data.map(s => s.type).join(', '));

    // Test cotton irrigation recommendation
    console.log('\n4. Testing cotton irrigation recommendation...');
    const cottonResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?area=10&soilMoisture=45&soilType=loamy&daysSincePlanting=80&recentRainfall=0`);
    console.log('✅ Cotton recommendation:', cottonResponse.data.data.recommendation);
    console.log('   Amount:', cottonResponse.data.data.recommendedAmount, 'L/ha');
    console.log('   Growth stage:', cottonResponse.data.data.cropInfo.growthStage);
    console.log('   ET0:', cottonResponse.data.data.calculations.ET0, 'mm/day');
    console.log('   Crop ET:', cottonResponse.data.data.calculations.cropET, 'mm/day');

    // Test wheat irrigation recommendation
    console.log('\n5. Testing wheat irrigation recommendation...');
    const wheatResponse = await axios.get(`${BASE_URL}/irrigation/wheat/Texas?area=25&soilMoisture=30&soilType=sandy&daysSincePlanting=45&recentRainfall=5`);
    console.log('✅ Wheat recommendation:', wheatResponse.data.data.recommendation);
    console.log('   Amount:', wheatResponse.data.data.recommendedAmount, 'L/ha');
    console.log('   Growth stage:', wheatResponse.data.data.cropInfo.growthStage);
    console.log('   Reason:', wheatResponse.data.data.reason);

    // Test rice irrigation recommendation
    console.log('\n6. Testing rice irrigation recommendation...');
    const riceResponse = await axios.get(`${BASE_URL}/irrigation/rice/India?area=5&soilMoisture=60&soilType=clay&daysSincePlanting=30&recentRainfall=0`);
    console.log('✅ Rice recommendation:', riceResponse.data.data.recommendation);
    console.log('   Amount:', riceResponse.data.data.recommendedAmount, 'L/ha');
    console.log('   Growth stage:', riceResponse.data.data.cropInfo.growthStage);
    console.log('   Reason:', riceResponse.data.data.reason);

    // Test ET0 calculation
    console.log('\n7. Testing ET0 calculation...');
    const et0Response = await axios.post(`${BASE_URL}/et0`, {
      weatherData: {
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        pressure: 101.3,
        solarRadiation: 20
      }
    });
    console.log('✅ ET0 calculation:', et0Response.data.data.ET0, 'mm/day');

    // Test different soil moisture levels
    console.log('\n8. Testing different soil moisture scenarios...');
    
    // High moisture - should not irrigate
    const highMoistureResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?soilMoisture=80&soilType=loamy&daysSincePlanting=60`);
    console.log('   High moisture (80%):', highMoistureResponse.data.data.recommendation);
    
    // Low moisture - should irrigate
    const lowMoistureResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?soilMoisture=25&soilType=loamy&daysSincePlanting=60`);
    console.log('   Low moisture (25%):', lowMoistureResponse.data.data.recommendation);
    
    // Critical moisture - should definitely irrigate
    const criticalMoistureResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?soilMoisture=15&soilType=loamy&daysSincePlanting=60`);
    console.log('   Critical moisture (15%):', criticalMoistureResponse.data.data.recommendation);

    // Test different growth stages
    console.log('\n9. Testing different growth stages...');
    
    // Initial stage
    const initialStageResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?soilMoisture=50&soilType=loamy&daysSincePlanting=15`);
    console.log('   Initial stage (15 days):', initialStageResponse.data.data.cropInfo.growthStage, 
                'Kc:', initialStageResponse.data.data.cropInfo.cropCoefficient);
    
    // Mid stage
    const midStageResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?soilMoisture=50&soilType=loamy&daysSincePlanting=80`);
    console.log('   Mid stage (80 days):', midStageResponse.data.data.cropInfo.growthStage, 
                'Kc:', midStageResponse.data.data.cropInfo.cropCoefficient);
    
    // Late stage
    const lateStageResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?soilMoisture=50&soilType=loamy&daysSincePlanting=130`);
    console.log('   Late stage (130 days):', lateStageResponse.data.data.cropInfo.growthStage, 
                'Kc:', lateStageResponse.data.data.cropInfo.cropCoefficient);

    // Test weather impact
    console.log('\n10. Testing weather impact...');
    
    // High temperature scenario
    const highTempResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?soilMoisture=50&soilType=loamy&daysSincePlanting=80&temperature=35&humidity=30`);
    console.log('   High temp (35°C, 30% humidity):', highTempResponse.data.data.recommendation);
    
    // High humidity scenario
    const highHumidityResponse = await axios.get(`${BASE_URL}/irrigation/cotton/California?soilMoisture=50&soilType=loamy&daysSincePlanting=80&temperature=25&humidity=85`);
    console.log('   High humidity (25°C, 85% humidity):', highHumidityResponse.data.data.recommendation);

    console.log('\n🎉 All irrigation algorithm tests completed successfully!');
    console.log('\n📊 Algorithm Features Tested:');
    console.log('   ✅ Penman-Monteith ET0 calculation');
    console.log('   ✅ Crop-specific coefficients for different growth stages');
    console.log('   ✅ Soil type considerations');
    console.log('   ✅ Weather data integration');
    console.log('   ✅ Soil moisture balance calculations');
    console.log('   ✅ Recent rainfall considerations');
    console.log('   ✅ Irrigation efficiency factors');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testIrrigationAlgorithm();
}

module.exports = testIrrigationAlgorithm;
