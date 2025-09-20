/**
 * Advanced Irrigation Recommendation Algorithm
 * Implements Penman-Monteith equation and crop-specific calculations
 */

// Crop coefficients for different growth stages
const CROP_COEFFICIENTS = {
  cotton: {
    initial: 0.4,      // 0-30 days
    development: 0.7,  // 30-60 days
    mid: 1.15,         // 60-120 days (peak water demand)
    late: 0.8,         // 120-150 days
    harvest: 0.6       // 150+ days
  },
  wheat: {
    initial: 0.3,      // 0-20 days
    development: 0.7,  // 20-50 days
    mid: 1.0,          // 50-80 days (heading/flowering)
    late: 0.65,        // 80-110 days (grain filling)
    harvest: 0.2       // 110+ days
  },
  rice: {
    initial: 1.05,     // 0-30 days (flooded conditions)
    development: 1.1,  // 30-60 days
    mid: 1.1,          // 60-100 days (tillering/panicle initiation)
    late: 1.0,         // 100-130 days (heading/flowering)
    harvest: 0.95      // 130+ days (grain filling)
  }
};

// Soil type characteristics
const SOIL_TYPES = {
  sandy: {
    fieldCapacity: 0.12,    // 12% water content at field capacity
    wiltingPoint: 0.05,     // 5% water content at wilting point
    bulkDensity: 1.6,       // g/cm³
    infiltrationRate: 25    // mm/hour
  },
  loamy: {
    fieldCapacity: 0.25,    // 25% water content at field capacity
    wiltingPoint: 0.10,     // 10% water content at wilting point
    bulkDensity: 1.4,       // g/cm³
    infiltrationRate: 15    // mm/hour
  },
  clay: {
    fieldCapacity: 0.35,    // 35% water content at field capacity
    wiltingPoint: 0.20,     // 20% water content at wilting point
    bulkDensity: 1.2,       // g/cm³
    infiltrationRate: 5     // mm/hour
  },
  clay_loam: {
    fieldCapacity: 0.30,    // 30% water content at field capacity
    wiltingPoint: 0.15,     // 15% water content at wilting point
    bulkDensity: 1.3,       // g/cm³
    infiltrationRate: 10    // mm/hour
  }
};

// Growth stage duration in days
const GROWTH_STAGE_DURATION = {
  cotton: { initial: 30, development: 30, mid: 60, late: 30, harvest: 30 },
  wheat: { initial: 20, development: 30, mid: 30, late: 30, harvest: 20 },
  rice: { initial: 30, development: 30, mid: 40, late: 30, harvest: 30 }
};

class IrrigationAlgorithm {
  constructor() {
    this.constants = {
      // Physical constants
      STEFAN_BOLTZMANN: 4.903e-9, // MJ K⁻⁴ m⁻² day⁻¹
      LATENT_HEAT_VAPORIZATION: 2.45, // MJ kg⁻¹
      PSYCHROMETRIC_CONSTANT: 0.665, // kPa K⁻¹
      GAS_CONSTANT: 0.287, // kJ kg⁻¹ K⁻¹
      
      // Crop-specific constants
      ALBEDO: 0.23, // Surface albedo
      CANOPY_RESISTANCE: 70, // s m⁻¹
      AERODYNAMIC_RESISTANCE: 208, // s m⁻¹
    };
  }

  /**
   * Calculate reference evapotranspiration using Penman-Monteith equation
   * @param {Object} weather - Weather data
   * @returns {number} ET0 in mm/day
   */
  calculateET0(weather) {
    const {
      temperature,
      humidity,
      windSpeed,
      solarRadiation,
      pressure = 101.3 // Default atmospheric pressure in kPa
    } = weather;

    // Convert temperature to Kelvin
    const T = temperature + 273.15;
    const T_mean = T;

    // Calculate saturation vapor pressure (es)
    const es = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));

    // Calculate actual vapor pressure (ea)
    const ea = (humidity / 100) * es;

    // Calculate vapor pressure deficit
    const vaporPressureDeficit = es - ea;

    // Calculate slope of saturation vapor pressure curve (Δ)
    const delta = (4098 * es) / Math.pow(temperature + 237.3, 2);

    // Calculate psychrometric constant (γ)
    const gamma = this.constants.PSYCHROMETRIC_CONSTANT * pressure / 100;

    // Calculate net radiation (Rn) - simplified
    const Rn = this.calculateNetRadiation(solarRadiation, temperature, humidity);

    // Calculate soil heat flux (G) - simplified
    const G = 0.1 * Rn;

    // Calculate wind function
    const windFunction = 0.34 * (1 + 0.54 * windSpeed);

    // Penman-Monteith equation
    const numerator = delta * (Rn - G) + this.constants.LATENT_HEAT_VAPORIZATION * 
                     windFunction * vaporPressureDeficit;
    const denominator = delta + gamma * (1 + this.constants.CANOPY_RESISTANCE / 
                       this.constants.AERODYNAMIC_RESISTANCE);

    const ET0 = numerator / denominator;

    return Math.max(0, ET0); // Ensure non-negative value
  }

  /**
   * Calculate net radiation (simplified)
   * @param {number} solarRadiation - Solar radiation in MJ/m²/day
   * @param {number} temperature - Temperature in °C
   * @param {number} humidity - Relative humidity in %
   * @returns {number} Net radiation in MJ/m²/day
   */
  calculateNetRadiation(solarRadiation, temperature, humidity) {
    // If solar radiation is not provided, estimate it
    let Rs = solarRadiation;
    if (!Rs) {
      // Estimate solar radiation based on temperature and humidity
      Rs = 0.16 * Math.sqrt(temperature + 17.8) * (1 - humidity / 100) * 10;
    }

    // Calculate net shortwave radiation
    const Rns = (1 - this.constants.ALBEDO) * Rs;

    // Calculate net longwave radiation (simplified)
    const Rnl = this.constants.STEFAN_BOLTZMANN * Math.pow(temperature + 273.15, 4) * 
                (0.34 - 0.14 * Math.sqrt(humidity / 100)) * 
                (1.35 * Rs / 20 - 0.35);

    return Rns - Rnl;
  }

  /**
   * Determine crop growth stage based on days since planting
   * @param {string} cropType - Type of crop
   * @param {number} daysSincePlanting - Days since planting
   * @returns {string} Growth stage
   */
  getGrowthStage(cropType, daysSincePlanting) {
    const stages = GROWTH_STAGE_DURATION[cropType.toLowerCase()];
    if (!stages) return 'mid'; // Default to mid stage

    let cumulativeDays = 0;
    for (const [stage, duration] of Object.entries(stages)) {
      cumulativeDays += duration;
      if (daysSincePlanting <= cumulativeDays) {
        return stage;
      }
    }
    return 'harvest'; // Beyond all defined stages
  }

  /**
   * Get crop coefficient for specific growth stage
   * @param {string} cropType - Type of crop
   * @param {string} growthStage - Growth stage
   * @returns {number} Crop coefficient
   */
  getCropCoefficient(cropType, growthStage) {
    const crop = CROP_COEFFICIENTS[cropType.toLowerCase()];
    if (!crop) return 1.0; // Default coefficient

    return crop[growthStage] || crop.mid; // Default to mid stage if stage not found
  }

  /**
   * Calculate crop evapotranspiration
   * @param {number} ET0 - Reference evapotranspiration
   * @param {string} cropType - Type of crop
   * @param {number} daysSincePlanting - Days since planting
   * @returns {number} Crop evapotranspiration in mm/day
   */
  calculateCropET(ET0, cropType, daysSincePlanting) {
    const growthStage = this.getGrowthStage(cropType, daysSincePlanting);
    const Kc = this.getCropCoefficient(cropType, growthStage);
    return ET0 * Kc;
  }

  /**
   * Calculate soil water balance
   * @param {Object} soilData - Soil data
   * @param {Object} weatherData - Weather data
   * @param {number} cropET - Crop evapotranspiration
   * @param {number} rainfall - Recent rainfall in mm
   * @returns {Object} Soil water balance
   */
  calculateSoilWaterBalance(soilData, weatherData, cropET, rainfall) {
    const soilType = SOIL_TYPES[soilData.type.toLowerCase()] || SOIL_TYPES.loamy;
    const currentMoisture = soilData.moisture / 100; // Convert percentage to decimal
    
    // Calculate available water capacity
    const availableWaterCapacity = soilType.fieldCapacity - soilType.wiltingPoint;
    
    // Calculate current available water
    const currentAvailableWater = Math.max(0, currentMoisture - soilType.wiltingPoint);
    const currentAvailableWaterPercent = (currentAvailableWater / availableWaterCapacity) * 100;
    
    // Calculate water deficit
    const waterDeficit = Math.max(0, cropET - rainfall);
    
    // Calculate soil water after rainfall and ET
    const soilWaterAfterRainfall = Math.min(soilType.fieldCapacity, currentMoisture + (rainfall / 100));
    const soilWaterAfterET = Math.max(soilType.wiltingPoint, soilWaterAfterRainfall - (cropET / 100));
    
    return {
      currentMoisture: currentMoisture * 100,
      availableWaterCapacity: availableWaterCapacity * 100,
      currentAvailableWater: currentAvailableWater * 100,
      currentAvailableWaterPercent,
      waterDeficit,
      soilWaterAfterRainfall: soilWaterAfterRainfall * 100,
      soilWaterAfterET: soilWaterAfterET * 100,
      wiltingPoint: soilType.wiltingPoint * 100,
      fieldCapacity: soilType.fieldCapacity * 100
    };
  }

  /**
   * Calculate irrigation requirement
   * @param {Object} params - Input parameters
   * @returns {Object} Irrigation recommendation
   */
  calculateIrrigationRequirement(params) {
    const {
      cropType,
      soilType,
      weatherData,
      soilMoisture,
      daysSincePlanting = 60,
      area = 1, // hectares
      recentRainfall = 0, // mm
      irrigationEfficiency = 0.85
    } = params;

    // Calculate reference evapotranspiration
    const ET0 = this.calculateET0(weatherData);
    
    // Calculate crop evapotranspiration
    const cropET = this.calculateCropET(ET0, cropType, daysSincePlanting);
    
    // Calculate soil water balance
    const soilData = { type: soilType, moisture: soilMoisture };
    const waterBalance = this.calculateSoilWaterBalance(soilData, weatherData, cropET, recentRainfall);
    
    // Determine irrigation need
    const criticalMoistureLevel = 30; // 30% of available water capacity
    const optimalMoistureLevel = 70; // 70% of available water capacity
    
    let recommendation = 'dont-irrigate';
    let irrigationAmount = 0;
    let reason = '';
    
    // Check if irrigation is needed
    if (waterBalance.currentAvailableWaterPercent < criticalMoistureLevel) {
      recommendation = 'irrigate';
      // Calculate amount needed to reach optimal level
      const targetMoisture = waterBalance.fieldCapacity * (optimalMoistureLevel / 100);
      const currentMoisture = waterBalance.currentMoisture;
      const moistureDeficit = Math.max(0, targetMoisture - currentMoisture);
      irrigationAmount = (moistureDeficit * 10) / irrigationEfficiency; // Convert to mm and apply efficiency
      reason = `Critical soil moisture level (${waterBalance.currentAvailableWaterPercent.toFixed(1)}%). `;
    } else if (waterBalance.currentAvailableWaterPercent < optimalMoistureLevel && 
               waterBalance.waterDeficit > 2) {
      recommendation = 'irrigate';
      // Calculate amount based on water deficit
      irrigationAmount = Math.min(waterBalance.waterDeficit, 15) / irrigationEfficiency; // Max 15mm per day
      reason = `Suboptimal soil moisture (${waterBalance.currentAvailableWaterPercent.toFixed(1)}%) with water deficit. `;
    } else if (waterBalance.currentAvailableWaterPercent < optimalMoistureLevel) {
      recommendation = 'maybe';
      irrigationAmount = Math.min(waterBalance.waterDeficit, 8) / irrigationEfficiency; // Reduced amount
      reason = `Moderate soil moisture (${waterBalance.currentAvailableWaterPercent.toFixed(1)}%). `;
    } else {
      reason = `Adequate soil moisture (${waterBalance.currentAvailableWaterPercent.toFixed(1)}%). `;
    }
    
    // Consider recent rainfall
    if (recentRainfall > 5) {
      if (recommendation === 'irrigate') {
        recommendation = 'maybe';
        irrigationAmount *= 0.5; // Reduce irrigation by 50%
        reason += `Recent rainfall (${recentRainfall}mm) detected. `;
      } else if (recommendation === 'maybe') {
        recommendation = 'dont-irrigate';
        irrigationAmount = 0;
        reason += `Recent rainfall (${recentRainfall}mm) makes irrigation unnecessary. `;
      }
    }
    
    // Consider weather conditions
    if (weatherData.windSpeed > 15) {
      if (recommendation === 'irrigate') {
        recommendation = 'maybe';
        irrigationAmount *= 0.7; // Reduce irrigation in high winds
        reason += `High wind conditions (${weatherData.windSpeed} km/h). `;
      }
    }
    
    if (weatherData.humidity > 80) {
      if (recommendation === 'irrigate') {
        recommendation = 'maybe';
        irrigationAmount *= 0.8; // Reduce irrigation in high humidity
        reason += `High humidity (${weatherData.humidity}%) reduces water demand. `;
      }
    }
    
    // Convert to liters per hectare
    const irrigationAmountLitersPerHectare = Math.round(irrigationAmount * 10 * area);
    
    // Determine optimal irrigation time
    let optimalTime = '06:00-08:00';
    if (weatherData.temperature > 30) {
      optimalTime = '05:00-07:00';
    } else if (weatherData.temperature < 15) {
      optimalTime = '08:00-10:00';
    }
    
    // Get growth stage info
    const growthStage = this.getGrowthStage(cropType, daysSincePlanting);
    const cropCoefficient = this.getCropCoefficient(cropType, growthStage);
    
    return {
      recommendation,
      irrigationAmount: irrigationAmountLitersPerHectare,
      irrigationAmountMM: irrigationAmount,
      optimalTime,
      reason: reason.trim(),
      calculations: {
        ET0: Math.round(ET0 * 100) / 100,
        cropET: Math.round(cropET * 100) / 100,
        growthStage,
        cropCoefficient: Math.round(cropCoefficient * 100) / 100,
        waterBalance,
        recentRainfall,
        irrigationEfficiency
      },
      weatherFactors: {
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        solarRadiation: weatherData.solarRadiation || 'estimated'
      }
    };
  }

  /**
   * Get detailed crop information
   * @param {string} cropType - Type of crop
   * @returns {Object} Crop information
   */
  getCropInfo(cropType) {
    const crop = CROP_COEFFICIENTS[cropType.toLowerCase()];
    const stages = GROWTH_STAGE_DURATION[cropType.toLowerCase()];
    
    if (!crop || !stages) {
      return {
        name: cropType,
        coefficients: { mid: 1.0 },
        stages: { mid: 60 },
        description: 'Crop not found in database'
      };
    }
    
    return {
      name: cropType,
      coefficients: crop,
      stages: stages,
      description: this.getCropDescription(cropType)
    };
  }

  /**
   * Get crop description
   * @param {string} cropType - Type of crop
   * @returns {string} Crop description
   */
  getCropDescription(cropType) {
    const descriptions = {
      cotton: 'Cotton requires careful water management, especially during flowering and boll development stages.',
      wheat: 'Wheat has critical water needs during heading and flowering stages.',
      rice: 'Rice typically requires flooded conditions, especially during early growth stages.'
    };
    
    return descriptions[cropType.toLowerCase()] || 'Standard irrigation practices apply.';
  }
}

module.exports = IrrigationAlgorithm;
