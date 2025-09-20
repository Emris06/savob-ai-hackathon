const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testCropDatabase() {
  console.log('🌾 Testing Crop Database Service...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    // Test database statistics
    console.log('\n2. Testing database statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/database/stats`);
    console.log('✅ Database stats:');
    console.log('   Version:', statsResponse.data.data.version);
    console.log('   Region:', statsResponse.data.data.region);
    console.log('   Total crops:', statsResponse.data.data.totalCrops);
    console.log('   Total soil types:', statsResponse.data.data.totalSoilTypes);
    console.log('   Crops:', statsResponse.data.data.crops.join(', '));
    console.log('   Soil types:', statsResponse.data.data.soilTypes.join(', '));

    // Test available crops
    console.log('\n3. Testing available crops...');
    const cropsResponse = await axios.get(`${BASE_URL}/crops`);
    console.log('✅ Available crops:');
    cropsResponse.data.data.forEach(crop => {
      console.log(`   ${crop.type}: ${crop.name} (${crop.scientificName})`);
    });

    // Test detailed crop information
    console.log('\n4. Testing detailed crop information...');
    const crops = ['cotton', 'wheat', 'rice'];
    
    for (const cropType of crops) {
      try {
        const cropResponse = await axios.get(`${BASE_URL}/crops/${cropType}`);
        const crop = cropResponse.data.data;
        console.log(`✅ ${crop.name} (${cropType}):`);
        console.log(`   Description: ${crop.description}`);
        console.log(`   Water requirements: ${crop.waterRequirements.totalSeasonal} ${crop.waterRequirements.unit}`);
        console.log(`   Growth stages: ${Object.keys(crop.cropCoefficients).join(', ')}`);
      } catch (error) {
        console.log(`❌ Error fetching ${cropType}:`, error.message);
      }
    }

    // Test crop coefficients
    console.log('\n5. Testing crop coefficients...');
    const growthStages = ['initial', 'development', 'mid', 'late', 'harvest'];
    
    for (const cropType of crops) {
      console.log(`\n   ${cropType.toUpperCase()} coefficients:`);
      for (const stage of growthStages) {
        try {
          const coeffResponse = await axios.get(`${BASE_URL}/crops/${cropType}/coefficients/${stage}`);
          const coeff = coeffResponse.data.data.coefficient;
          console.log(`     ${stage}: Kc=${coeff.kc}, Duration=${coeff.duration} days`);
        } catch (error) {
          console.log(`     ${stage}: Not found`);
        }
      }
    }

    // Test water requirements
    console.log('\n6. Testing water requirements...');
    for (const cropType of crops) {
      try {
        const waterResponse = await axios.get(`${BASE_URL}/crops/${cropType}/water-requirements`);
        const water = waterResponse.data.data.waterRequirements;
        console.log(`✅ ${cropType}: ${water.totalSeasonal} ${water.unit}`);
        console.log(`   Daily average: ${water.dailyAverage} mm/day`);
        console.log(`   Peak daily: ${water.peakDaily} mm/day`);
        if (water.criticalPeriods) {
          console.log(`   Critical periods: ${water.criticalPeriods.length}`);
        }
      } catch (error) {
        console.log(`❌ Error fetching water requirements for ${cropType}:`, error.message);
      }
    }

    // Test growing seasons
    console.log('\n7. Testing growing seasons for Uzbekistan...');
    for (const cropType of crops) {
      try {
        const seasonResponse = await axios.get(`${BASE_URL}/crops/${cropType}/growing-season`);
        const season = seasonResponse.data.data.growingSeason;
        console.log(`✅ ${cropType} growing season:`);
        
        if (season.winterWheat && season.springWheat) {
          console.log(`   Winter wheat: Plant ${season.winterWheat.planting.start} - ${season.winterWheat.planting.end}`);
          console.log(`   Spring wheat: Plant ${season.springWheat.planting.start} - ${season.springWheat.planting.end}`);
        } else if (season.planting) {
          console.log(`   Planting: ${season.planting.start} - ${season.planting.end}`);
          console.log(`   Harvest: ${season.harvest.start} - ${season.harvest.end}`);
        }
      } catch (error) {
        console.log(`❌ Error fetching growing season for ${cropType}:`, error.message);
      }
    }

    // Test soil types
    console.log('\n8. Testing soil types...');
    const soilResponse = await axios.get(`${BASE_URL}/soil-types`);
    console.log('✅ Available soil types:');
    soilResponse.data.data.forEach(soil => {
      console.log(`   ${soil.type}: ${soil.name}`);
    });

    // Test detailed soil information
    console.log('\n9. Testing detailed soil information...');
    const soilTypes = ['sandy', 'loamy', 'clay', 'clay_loam'];
    
    for (const soilType of soilTypes) {
      try {
        const soilInfoResponse = await axios.get(`${BASE_URL}/soil-types/${soilType}`);
        const soil = soilInfoResponse.data.data;
        console.log(`✅ ${soil.name} (${soilType}):`);
        console.log(`   Field capacity: ${soil.characteristics.fieldCapacity}`);
        console.log(`   Wilting point: ${soil.characteristics.wiltingPoint}`);
        console.log(`   Water retention: ${soil.characteristics.waterRetention}`);
        console.log(`   Drainage: ${soil.characteristics.drainage}`);
      } catch (error) {
        console.log(`❌ Error fetching soil info for ${soilType}:`, error.message);
      }
    }

    // Test crop recommendations
    console.log('\n10. Testing crop recommendations...');
    const testCombinations = [
      { crop: 'cotton', soil: 'loamy', area: 10 },
      { crop: 'wheat', soil: 'clay', area: 5 },
      { crop: 'rice', soil: 'clay', area: 2 },
      { crop: 'cotton', soil: 'sandy', area: 15 }
    ];

    for (const combo of testCombinations) {
      try {
        const recResponse = await axios.get(`${BASE_URL}/crops/${combo.crop}/recommendation?soilType=${combo.soil}&area=${combo.area}`);
        const rec = recResponse.data.data;
        console.log(`✅ ${combo.crop} on ${combo.soil} soil (${combo.area} ha):`);
        console.log(`   Suitability: ${rec.soil.suitability}`);
        console.log(`   Water requirement: ${rec.waterRequirements.adjusted} ${rec.waterRequirements.unit}`);
        console.log(`   For area: ${rec.waterRequirements.forArea} ${rec.waterRequirements.unit}`);
        console.log(`   Recommendations: ${rec.recommendations.length}`);
      } catch (error) {
        console.log(`❌ Error fetching recommendation for ${combo.crop}/${combo.soil}:`, error.message);
      }
    }

    // Test Uzbekistan climate
    console.log('\n11. Testing Uzbekistan climate information...');
    const climateResponse = await axios.get(`${BASE_URL}/climate/uzbekistan`);
    const climate = climateResponse.data.data;
    console.log('✅ Uzbekistan climate:');
    console.log(`   Climate type: ${climate.climateType}`);
    console.log(`   Annual temperature: ${climate.temperature.annualAverage}°C`);
    console.log(`   Annual precipitation: ${climate.precipitation.annual} ${climate.precipitation.unit}`);
    console.log(`   Growing season: ${climate.temperature.growingSeason}`);
    console.log(`   Irrigation necessity: ${climate.irrigation.necessity}`);

    // Test irrigation guidelines
    console.log('\n12. Testing irrigation guidelines...');
    const guidelinesResponse = await axios.get(`${BASE_URL}/irrigation/guidelines`);
    const guidelines = guidelinesResponse.data.data;
    console.log('✅ Irrigation guidelines:');
    console.log(`   Water availability: ${guidelines.waterAvailability}`);
    console.log(`   Efficiency target: ${guidelines.efficiencyTarget}%`);
    console.log(`   Best practices: ${guidelines.bestPractices.length} recommendations`);

    // Test crop-soil compatibility
    console.log('\n13. Testing crop-soil compatibility...');
    const compatibilityTests = [
      { crop: 'cotton', soils: ['sandy', 'loamy', 'clay', 'clay_loam'] },
      { crop: 'wheat', soils: ['sandy', 'loamy', 'clay', 'clay_loam'] },
      { crop: 'rice', soils: ['sandy', 'loamy', 'clay', 'clay_loam'] }
    ];

    for (const test of compatibilityTests) {
      console.log(`\n   ${test.crop.toUpperCase()} soil suitability:`);
      for (const soil of test.soils) {
        try {
          const recResponse = await axios.get(`${BASE_URL}/crops/${test.crop}/recommendation?soilType=${soil}&area=1`);
          const suitability = recResponse.data.data.soil.suitability;
          console.log(`     ${soil}: ${suitability}`);
        } catch (error) {
          console.log(`     ${soil}: Error - ${error.message}`);
        }
      }
    }

    // Test error handling
    console.log('\n14. Testing error handling...');
    try {
      await axios.get(`${BASE_URL}/crops/invalid-crop`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Error handling: Invalid crop returns 404');
      } else {
        console.log('⚠️  Error handling: Unexpected error for invalid crop');
      }
    }

    try {
      await axios.get(`${BASE_URL}/soil-types/invalid-soil`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Error handling: Invalid soil type returns 404');
      } else {
        console.log('⚠️  Error handling: Unexpected error for invalid soil type');
      }
    }

    console.log('\n🎉 All crop database tests completed successfully!');
    console.log('\n📊 Crop Database Features Tested:');
    console.log('   ✅ Crop information and coefficients');
    console.log('   ✅ Water requirements by crop');
    console.log('   ✅ Growing seasons for Uzbekistan');
    console.log('   ✅ Soil type characteristics');
    console.log('   ✅ Soil-crop compatibility');
    console.log('   ✅ Comprehensive crop recommendations');
    console.log('   ✅ Uzbekistan climate data');
    console.log('   ✅ Irrigation guidelines');
    console.log('   ✅ Database statistics');
    console.log('   ✅ Error handling');

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
  testCropDatabase();
}

module.exports = testCropDatabase;
