const express = require('express');
const cors = require('cors');
const axios = require('axios');
const IrrigationAlgorithm = require('./irrigationAlgorithm');
const WeatherService = require('./weatherService');
const CropDatabaseService = require('./cropDatabaseService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize services
const irrigationAlgorithm = new IrrigationAlgorithm();
const weatherService = new WeatherService();
const cropDatabase = new CropDatabaseService();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demonstration (in production, use a database)
const irrigationLogs = [];
const farmData = new Map();

// Initialize some sample farm data
farmData.set('farm1', {
  id: 'farm1',
  name: 'Green Valley Farm',
  location: 'California, USA',
  cropType: 'tomatoes',
  area: 10, // hectares
  currentEfficiency: 75,
  traditionalEfficiency: 60,
  waterCostPerLiter: 0.003,
  monthlyWaterUsage: 2500 // liters
});

farmData.set('farm2', {
  id: 'farm2',
  name: 'Sunrise Agriculture',
  location: 'Texas, USA',
  cropType: 'corn',
  area: 25,
  currentEfficiency: 85,
  traditionalEfficiency: 65,
  waterCostPerLiter: 0.0025,
  monthlyWaterUsage: 5000
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Weather endpoints
app.get('/api/weather/:location', async (req, res, next) => {
  try {
    const { location } = req.params;
    const weatherData = await weatherService.getCurrentWeather(location);
    
    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    next(error);
  }
});

// Weather forecast endpoint
app.get('/api/weather/:location/forecast', async (req, res, next) => {
  try {
    const { location } = req.params;
    const forecastData = await weatherService.getForecast(location);
    
    res.json({
      success: true,
      data: forecastData
    });
  } catch (error) {
    next(error);
  }
});

// Complete weather data (current + forecast)
app.get('/api/weather/:location/complete', async (req, res, next) => {
  try {
    const { location } = req.params;
    const weatherData = await weatherService.getWeatherData(location);
    
    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    next(error);
  }
});

// Weather service statistics
app.get('/api/weather/stats', (req, res) => {
  const stats = weatherService.getCacheStats();
  res.json({
    success: true,
    data: stats
  });
});

// Clear weather cache
app.post('/api/weather/clear-cache', (req, res) => {
  weatherService.clearCache();
  res.json({
    success: true,
    message: 'Weather cache cleared'
  });
});

// Advanced irrigation recommendations endpoint
app.get('/api/irrigation/:cropType/:location', async (req, res, next) => {
  try {
    const { cropType, location } = req.params;
    const { 
      area = 1, 
      soilMoisture = 50, 
      soilType = 'loamy',
      daysSincePlanting = 60,
      recentRainfall = 0,
      irrigationEfficiency = 0.85
    } = req.query;

    // Get weather data for the location using weather service
    let weatherData = null;
    
    try {
      const weatherResponse = await weatherService.getCurrentWeather(location);
      weatherData = weatherResponse.irrigation;
    } catch (weatherError) {
      console.warn('Could not fetch weather data:', weatherError.message);
      // Use default weather data if weather service fails
      weatherData = {
        temperature: 25,
        humidity: 60,
        windSpeed: 10,
        pressure: 101.3,
        solarRadiation: 18.5,
        precipitation: 0,
        condition: 'Clear'
      };
    }

    // Use the advanced irrigation algorithm
    const algorithmParams = {
      cropType,
      soilType,
      weatherData,
      soilMoisture: parseFloat(soilMoisture),
      daysSincePlanting: parseInt(daysSincePlanting),
      area: parseFloat(area),
      recentRainfall: parseFloat(recentRainfall),
      irrigationEfficiency: parseFloat(irrigationEfficiency)
    };

    const recommendation = irrigationAlgorithm.calculateIrrigationRequirement(algorithmParams);

    // Get crop information
    const cropInfo = irrigationAlgorithm.getCropInfo(cropType);

    const response = {
      success: true,
      data: {
        cropType,
        location,
        area: parseFloat(area),
        soilType,
        recommendation: recommendation.recommendation,
        recommendedAmount: recommendation.irrigationAmount,
        irrigationAmountMM: recommendation.irrigationAmountMM,
        optimalTime: recommendation.optimalTime,
        reason: recommendation.reason,
        calculations: recommendation.calculations,
        weatherFactors: recommendation.weatherFactors,
        cropInfo: {
          name: cropInfo.name,
          growthStage: recommendation.calculations.growthStage,
          cropCoefficient: recommendation.calculations.cropCoefficient,
          description: cropInfo.description
        },
        soilMoisture: parseFloat(soilMoisture),
        daysSincePlanting: parseInt(daysSincePlanting),
        recentRainfall: parseFloat(recentRainfall),
        timestamp: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Log irrigation activities endpoint
app.post('/api/irrigation/log', (req, res, next) => {
  try {
    const {
      farmId,
      cropType,
      area,
      amount,
      duration,
      zones,
      weatherConditions,
      notes
    } = req.body;

    // Validate required fields
    if (!farmId || !cropType || !area || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: farmId, cropType, area, amount'
      });
    }

    const logEntry = {
      id: Date.now().toString(),
      farmId,
      cropType,
      area: parseFloat(area),
      amount: parseFloat(amount),
      duration: duration ? parseFloat(duration) : null,
      zones: zones || [],
      weatherConditions: weatherConditions || {},
      notes: notes || '',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    irrigationLogs.push(logEntry);

    // Update farm data with latest irrigation
    if (farmData.has(farmId)) {
      const farm = farmData.get(farmId);
      farm.lastIrrigation = logEntry.timestamp;
      farm.totalWaterUsed = (farm.totalWaterUsed || 0) + logEntry.amount;
      farmData.set(farmId, farm);
    }

    res.status(201).json({
      success: true,
      message: 'Irrigation activity logged successfully',
      data: logEntry
    });
  } catch (error) {
    next(error);
  }
});

// Get irrigation logs for a farm
app.get('/api/irrigation/logs/:farmId', (req, res, next) => {
  try {
    const { farmId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const farmLogs = irrigationLogs
      .filter(log => log.farmId === farmId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      data: {
        logs: farmLogs,
        total: irrigationLogs.filter(log => log.farmId === farmId).length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Savings calculation endpoint
app.get('/api/savings/:farmId', (req, res, next) => {
  try {
    const { farmId } = req.params;
    const { period = 'monthly' } = req.query;

    const farm = farmData.get(farmId);
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Get irrigation logs for the farm
    const farmLogs = irrigationLogs.filter(log => log.farmId === farmId);
    
    // Calculate period-based data
    const now = new Date();
    let startDate;
    let periodMultiplier = 1;

    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        periodMultiplier = 1;
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        periodMultiplier = 1;
        break;
      case 'yearly':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        periodMultiplier = 12;
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const recentLogs = farmLogs.filter(log => 
      new Date(log.timestamp) >= startDate
    );

    // Calculate actual water usage
    const actualWaterUsed = recentLogs.reduce((sum, log) => sum + log.amount, 0);
    const actualCost = actualWaterUsed * farm.waterCostPerLiter;

    // Calculate traditional irrigation usage (less efficient)
    const traditionalEfficiency = farm.traditionalEfficiency / 100;
    const currentEfficiency = farm.currentEfficiency / 100;
    
    const traditionalWaterUsed = actualWaterUsed / currentEfficiency * traditionalEfficiency;
    const traditionalCost = traditionalWaterUsed * farm.waterCostPerLiter;

    // Calculate savings
    const waterSaved = traditionalWaterUsed - actualWaterUsed;
    const costSaved = traditionalCost - actualCost;
    const efficiencyGain = farm.currentEfficiency - farm.traditionalEfficiency;

    // Calculate environmental impact
    const co2Saved = waterSaved * 0.0004; // kg CO2 per liter saved
    const energySaved = waterSaved * 0.001; // kWh per liter saved

    const response = {
      success: true,
      data: {
        farmId,
        farmName: farm.name,
        period,
        currentSystem: {
          waterUsed: Math.round(actualWaterUsed),
          cost: Math.round(actualCost * 100) / 100,
          efficiency: farm.currentEfficiency
        },
        traditionalSystem: {
          waterUsed: Math.round(traditionalWaterUsed),
          cost: Math.round(traditionalCost * 100) / 100,
          efficiency: farm.traditionalEfficiency
        },
        savings: {
          waterSaved: Math.round(waterSaved),
          costSaved: Math.round(costSaved * 100) / 100,
          efficiencyGain: Math.round(efficiencyGain),
          percentageSaved: Math.round((waterSaved / traditionalWaterUsed) * 100)
        },
        environmentalImpact: {
          co2Saved: Math.round(co2Saved * 100) / 100,
          energySaved: Math.round(energySaved * 100) / 100,
          householdsEquivalent: Math.round(waterSaved / 150) // Average household water usage
        },
        projections: {
          monthly: {
            waterSaved: Math.round(waterSaved * periodMultiplier),
            costSaved: Math.round(costSaved * periodMultiplier * 100) / 100
          },
          yearly: {
            waterSaved: Math.round(waterSaved * 12),
            costSaved: Math.round(costSaved * 12 * 100) / 100
          }
        },
        timestamp: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get crop information endpoint
app.get('/api/crops/:cropType', (req, res) => {
  try {
    const { cropType } = req.params;
    const cropInfo = irrigationAlgorithm.getCropInfo(cropType);
    
    res.json({
      success: true,
      data: cropInfo
    });
  } catch (error) {
    next(error);
  }
});

// Get all supported crops from database
app.get('/api/crops', (req, res) => {
  try {
    const crops = cropDatabase.getAvailableCrops();
    res.json({
      success: true,
      data: crops
    });
  } catch (error) {
    next(error);
  }
});

// Get detailed crop information
app.get('/api/crops/:cropType', (req, res, next) => {
  try {
    const { cropType } = req.params;
    const cropInfo = cropDatabase.getCropInfo(cropType);
    
    if (!cropInfo) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.json({
      success: true,
      data: cropInfo
    });
  } catch (error) {
    next(error);
  }
});

// Get crop coefficients for specific growth stage
app.get('/api/crops/:cropType/coefficients/:growthStage', (req, res, next) => {
  try {
    const { cropType, growthStage } = req.params;
    const coefficient = cropDatabase.getCropCoefficient(cropType, growthStage);
    
    if (!coefficient) {
      return res.status(404).json({
        success: false,
        message: 'Crop coefficient not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        cropType,
        growthStage,
        coefficient
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get water requirements for a crop
app.get('/api/crops/:cropType/water-requirements', (req, res, next) => {
  try {
    const { cropType } = req.params;
    const waterRequirements = cropDatabase.getWaterRequirements(cropType);
    
    if (!waterRequirements) {
      return res.status(404).json({
        success: false,
        message: 'Water requirements not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        cropType,
        waterRequirements
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get growing season information for Uzbekistan
app.get('/api/crops/:cropType/growing-season', (req, res, next) => {
  try {
    const { cropType } = req.params;
    const growingSeason = cropDatabase.getGrowingSeason(cropType);
    
    if (!growingSeason) {
      return res.status(404).json({
        success: false,
        message: 'Growing season information not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        cropType,
        growingSeason
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get comprehensive crop recommendation
app.get('/api/crops/:cropType/recommendation', (req, res, next) => {
  try {
    const { cropType } = req.params;
    const { soilType = 'loamy', area = 1 } = req.query;
    
    const recommendation = cropDatabase.getCropRecommendation(cropType, soilType, parseFloat(area));
    
    if (recommendation.error) {
      return res.status(404).json({
        success: false,
        message: recommendation.error
      });
    }
    
    res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    next(error);
  }
});

// Get soil types information from database
app.get('/api/soil-types', (req, res, next) => {
  try {
    const soilTypes = cropDatabase.getAvailableSoilTypes();
    res.json({
      success: true,
      data: soilTypes
    });
  } catch (error) {
    next(error);
  }
});

// Get detailed soil type information
app.get('/api/soil-types/:soilType', (req, res, next) => {
  try {
    const { soilType } = req.params;
    const soilInfo = cropDatabase.getSoilTypeInfo(soilType);
    
    if (!soilInfo) {
      return res.status(404).json({
        success: false,
        message: 'Soil type not found'
      });
    }
    
    res.json({
      success: true,
      data: soilInfo
    });
  } catch (error) {
    next(error);
  }
});

// Get Uzbekistan climate information
app.get('/api/climate/uzbekistan', (req, res, next) => {
  try {
    const climate = cropDatabase.getUzbekistanClimate();
    
    if (!climate) {
      return res.status(404).json({
        success: false,
        message: 'Climate information not found'
      });
    }
    
    res.json({
      success: true,
      data: climate
    });
  } catch (error) {
    next(error);
  }
});

// Get irrigation guidelines for Uzbekistan
app.get('/api/irrigation/guidelines', (req, res, next) => {
  try {
    const guidelines = cropDatabase.getIrrigationGuidelines();
    
    if (!guidelines) {
      return res.status(404).json({
        success: false,
        message: 'Irrigation guidelines not found'
      });
    }
    
    res.json({
      success: true,
      data: guidelines
    });
  } catch (error) {
    next(error);
  }
});

// Get crop database statistics
app.get('/api/database/stats', (req, res, next) => {
  try {
    const stats = cropDatabase.getDatabaseStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Calculate ET0 only
app.post('/api/et0', (req, res, next) => {
  try {
    const { weatherData } = req.body;
    
    if (!weatherData) {
      return res.status(400).json({
        success: false,
        message: 'Weather data is required'
      });
    }
    
    const ET0 = irrigationAlgorithm.calculateET0(weatherData);
    
    res.json({
      success: true,
      data: {
        ET0: Math.round(ET0 * 100) / 100,
        unit: 'mm/day',
        weatherData
      }
    });
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Irrigation API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all farms
app.get('/api/farms', (req, res) => {
  const farms = Array.from(farmData.values());
  res.json({
    success: true,
    data: farms
  });
});

// Create a new farm
app.post('/api/farms', (req, res, next) => {
  try {
    const {
      name,
      location,
      cropType,
      area,
      currentEfficiency = 75,
      traditionalEfficiency = 60,
      waterCostPerLiter = 0.003
    } = req.body;

    if (!name || !location || !cropType || !area) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, location, cropType, area'
      });
    }

    const farmId = `farm${Date.now()}`;
    const farm = {
      id: farmId,
      name,
      location,
      cropType,
      area: parseFloat(area),
      currentEfficiency: parseFloat(currentEfficiency),
      traditionalEfficiency: parseFloat(traditionalEfficiency),
      waterCostPerLiter: parseFloat(waterCostPerLiter),
      monthlyWaterUsage: 0,
      createdAt: new Date().toISOString()
    };

    farmData.set(farmId, farm);

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data: farm
    });
  } catch (error) {
    next(error);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Irrigation API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌤️  Weather API: http://localhost:${PORT}/api/weather/:location`);
  console.log(`💧 Irrigation API: http://localhost:${PORT}/api/irrigation/:cropType/:location`);
  console.log(`📝 Log API: http://localhost:${PORT}/api/irrigation/log`);
  console.log(`💰 Savings API: http://localhost:${PORT}/api/savings/:farmId`);
});

module.exports = app;
