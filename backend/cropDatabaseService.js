/**
 * Crop Database Service
 * Manages crop data, coefficients, and Uzbekistan-specific agricultural information
 */

const fs = require('fs');
const path = require('path');

class CropDatabaseService {
  constructor() {
    this.database = null;
    this.loadDatabase();
  }

  /**
   * Load crop database from JSON file
   */
  loadDatabase() {
    try {
      const databasePath = path.join(__dirname, 'cropDatabase.json');
      const databaseContent = fs.readFileSync(databasePath, 'utf8');
      this.database = JSON.parse(databaseContent);
      console.log('✅ Crop database loaded successfully');
    } catch (error) {
      console.error('❌ Error loading crop database:', error.message);
      this.database = this.getDefaultDatabase();
    }
  }

  /**
   * Get default database structure if file loading fails
   * @returns {Object} Default database structure
   */
  getDefaultDatabase() {
    return {
      version: "1.0.0",
      crops: {
        cotton: {
          name: "Cotton",
          cropCoefficients: {
            initial: { kc: 0.4, duration: 30 },
            development: { kc: 0.7, duration: 40 },
            mid: { kc: 1.15, duration: 60 },
            late: { kc: 0.8, duration: 40 },
            harvest: { kc: 0.6, duration: 30 }
          },
          waterRequirements: {
            totalSeasonal: 6000,
            unit: "mm/ha"
          }
        },
        wheat: {
          name: "Wheat",
          cropCoefficients: {
            initial: { kc: 0.3, duration: 20 },
            development: { kc: 0.7, duration: 40 },
            mid: { kc: 1.0, duration: 30 },
            late: { kc: 0.65, duration: 30 },
            harvest: { kc: 0.2, duration: 10 }
          },
          waterRequirements: {
            totalSeasonal: 4000,
            unit: "mm/ha"
          }
        },
        rice: {
          name: "Rice",
          cropCoefficients: {
            initial: { kc: 1.05, duration: 30 },
            development: { kc: 1.1, duration: 40 },
            mid: { kc: 1.1, duration: 40 },
            late: { kc: 1.0, duration: 30 },
            harvest: { kc: 0.95, duration: 20 }
          },
          waterRequirements: {
            totalSeasonal: 12000,
            unit: "mm/ha"
          }
        }
      }
    };
  }

  /**
   * Get all available crops
   * @returns {Array} List of available crops
   */
  getAvailableCrops() {
    if (!this.database || !this.database.crops) {
      return [];
    }

    return Object.keys(this.database.crops).map(cropType => ({
      type: cropType,
      name: this.database.crops[cropType].name,
      scientificName: this.database.crops[cropType].scientificName,
      description: this.database.crops[cropType].description
    }));
  }

  /**
   * Get crop information by type
   * @param {string} cropType - Type of crop
   * @returns {Object|null} Crop information
   */
  getCropInfo(cropType) {
    if (!this.database || !this.database.crops || !this.database.crops[cropType]) {
      return null;
    }

    return this.database.crops[cropType];
  }

  /**
   * Get crop coefficients for a specific growth stage
   * @param {string} cropType - Type of crop
   * @param {string} growthStage - Growth stage
   * @returns {Object|null} Crop coefficient information
   */
  getCropCoefficient(cropType, growthStage) {
    const crop = this.getCropInfo(cropType);
    if (!crop || !crop.cropCoefficients || !crop.cropCoefficients[growthStage]) {
      return null;
    }

    return crop.cropCoefficients[growthStage];
  }

  /**
   * Get water requirements for a crop
   * @param {string} cropType - Type of crop
   * @returns {Object|null} Water requirements
   */
  getWaterRequirements(cropType) {
    const crop = this.getCropInfo(cropType);
    if (!crop || !crop.waterRequirements) {
      return null;
    }

    return crop.waterRequirements;
  }

  /**
   * Get growing season information for Uzbekistan
   * @param {string} cropType - Type of crop
   * @returns {Object|null} Growing season information
   */
  getGrowingSeason(cropType) {
    const crop = this.getCropInfo(cropType);
    if (!crop || !crop.growingSeason || !crop.growingSeason.uzbekistan) {
      return null;
    }

    return crop.growingSeason.uzbekistan;
  }

  /**
   * Get soil adjustments for a crop and soil type
   * @param {string} cropType - Type of crop
   * @param {string} soilType - Type of soil
   * @returns {Object|null} Soil adjustment factors
   */
  getSoilAdjustment(cropType, soilType) {
    const crop = this.getCropInfo(cropType);
    if (!crop || !crop.soilAdjustments || !crop.soilAdjustments[soilType]) {
      return null;
    }

    return crop.soilAdjustments[soilType];
  }

  /**
   * Get irrigation schedule for a crop
   * @param {string} cropType - Type of crop
   * @returns {Object|null} Irrigation schedule
   */
  getIrrigationSchedule(cropType) {
    const crop = this.getCropInfo(cropType);
    if (!crop || !crop.irrigationSchedule) {
      return null;
    }

    return crop.irrigationSchedule;
  }

  /**
   * Get yield factors for a crop
   * @param {string} cropType - Type of crop
   * @returns {Object|null} Yield factors
   */
  getYieldFactors(cropType) {
    const crop = this.getCropInfo(cropType);
    if (!crop || !crop.yieldFactors) {
      return null;
    }

    return crop.yieldFactors;
  }

  /**
   * Get soil type information
   * @param {string} soilType - Type of soil
   * @returns {Object|null} Soil type information
   */
  getSoilTypeInfo(soilType) {
    if (!this.database || !this.database.soilTypes || !this.database.soilTypes[soilType]) {
      return null;
    }

    return this.database.soilTypes[soilType];
  }

  /**
   * Get all soil types
   * @returns {Array} List of soil types
   */
  getAvailableSoilTypes() {
    if (!this.database || !this.database.soilTypes) {
      return [];
    }

    return Object.keys(this.database.soilTypes).map(soilType => ({
      type: soilType,
      name: this.database.soilTypes[soilType].name,
      description: this.database.soilTypes[soilType].description
    }));
  }

  /**
   * Get Uzbekistan climate information
   * @returns {Object|null} Climate information
   */
  getUzbekistanClimate() {
    if (!this.database || !this.database.uzbekistanClimate) {
      return null;
    }

    return this.database.uzbekistanClimate;
  }

  /**
   * Get irrigation guidelines for Uzbekistan
   * @returns {Object|null} Irrigation guidelines
   */
  getIrrigationGuidelines() {
    if (!this.database || !this.database.irrigationGuidelines || !this.database.irrigationGuidelines.uzbekistan) {
      return null;
    }

    return this.database.irrigationGuidelines.uzbekistan;
  }

  /**
   * Calculate adjusted water requirement based on soil type
   * @param {string} cropType - Type of crop
   * @param {string} soilType - Type of soil
   * @param {number} baseRequirement - Base water requirement
   * @returns {number} Adjusted water requirement
   */
  calculateAdjustedWaterRequirement(cropType, soilType, baseRequirement) {
    const soilAdjustment = this.getSoilAdjustment(cropType, soilType);
    if (!soilAdjustment) {
      return baseRequirement;
    }

    return baseRequirement * soilAdjustment.waterRetention;
  }

  /**
   * Get optimal planting dates for a crop in Uzbekistan
   * @param {string} cropType - Type of crop
   * @returns {Object|null} Planting date information
   */
  getOptimalPlantingDates(cropType) {
    const growingSeason = this.getGrowingSeason(cropType);
    if (!growingSeason) {
      return null;
    }

    // Handle crops with multiple planting seasons (like wheat)
    if (growingSeason.winterWheat && growingSeason.springWheat) {
      return {
        winter: growingSeason.winterWheat.planting,
        spring: growingSeason.springWheat.planting
      };
    }

    return growingSeason.planting;
  }

  /**
   * Get critical irrigation periods for a crop
   * @param {string} cropType - Type of crop
   * @returns {Array|null} Critical periods
   */
  getCriticalIrrigationPeriods(cropType) {
    const waterRequirements = this.getWaterRequirements(cropType);
    if (!waterRequirements || !waterRequirements.criticalPeriods) {
      return null;
    }

    return waterRequirements.criticalPeriods;
  }

  /**
   * Check if a crop is suitable for a soil type
   * @param {string} cropType - Type of crop
   * @param {string} soilType - Type of soil
   * @returns {string} Suitability rating
   */
  getCropSoilSuitability(cropType, soilType) {
    const soilInfo = this.getSoilTypeInfo(soilType);
    if (!soilInfo || !soilInfo.suitability) {
      return 'Unknown';
    }

    return soilInfo.suitability[cropType] || 'Unknown';
  }

  /**
   * Get comprehensive crop recommendation for Uzbekistan
   * @param {string} cropType - Type of crop
   * @param {string} soilType - Type of soil
   * @param {number} area - Area in hectares
   * @returns {Object} Comprehensive recommendation
   */
  getCropRecommendation(cropType, soilType, area = 1) {
    const crop = this.getCropInfo(cropType);
    const soil = this.getSoilTypeInfo(soilType);
    const growingSeason = this.getGrowingSeason(cropType);
    const waterRequirements = this.getWaterRequirements(cropType);
    const soilAdjustment = this.getSoilAdjustment(cropType, soilType);

    if (!crop) {
      return { error: 'Crop not found' };
    }

    const baseWaterRequirement = waterRequirements ? waterRequirements.totalSeasonal : 0;
    const adjustedWaterRequirement = this.calculateAdjustedWaterRequirement(
      cropType, 
      soilType, 
      baseWaterRequirement
    );

    return {
      crop: {
        name: crop.name,
        scientificName: crop.scientificName,
        description: crop.description
      },
      soil: {
        type: soilType,
        name: soil ? soil.name : 'Unknown',
        suitability: this.getCropSoilSuitability(cropType, soilType)
      },
      growingSeason: growingSeason,
      waterRequirements: {
        base: baseWaterRequirement,
        adjusted: adjustedWaterRequirement,
        forArea: adjustedWaterRequirement * area,
        unit: waterRequirements ? waterRequirements.unit : 'mm/ha'
      },
      soilAdjustment: soilAdjustment,
      criticalPeriods: this.getCriticalIrrigationPeriods(cropType),
      irrigationSchedule: this.getIrrigationSchedule(cropType),
      yieldFactors: this.getYieldFactors(cropType),
      recommendations: this.generateRecommendations(cropType, soilType, soilAdjustment)
    };
  }

  /**
   * Generate specific recommendations based on crop and soil
   * @param {string} cropType - Type of crop
   * @param {string} soilType - Type of soil
   * @param {Object} soilAdjustment - Soil adjustment factors
   * @returns {Array} Recommendations
   */
  generateRecommendations(cropType, soilType, soilAdjustment) {
    const recommendations = [];

    if (soilAdjustment) {
      if (soilAdjustment.waterRetention < 0.8) {
        recommendations.push({
          type: 'irrigation',
          priority: 'high',
          message: `Increase irrigation frequency by ${Math.round((1/soilAdjustment.waterRetention - 1) * 100)}% due to low water retention`
        });
      }

      if (soilAdjustment.drainage === 'Poor') {
        recommendations.push({
          type: 'drainage',
          priority: 'high',
          message: 'Implement drainage system to prevent waterlogging'
        });
      }

      if (soilAdjustment.irrigationFrequency > 1.2) {
        recommendations.push({
          type: 'efficiency',
          priority: 'medium',
          message: 'Consider drip irrigation for better water efficiency'
        });
      }
    }

    // Crop-specific recommendations
    if (cropType === 'rice' && soilType !== 'clay') {
      recommendations.push({
        type: 'soil',
        priority: 'high',
        message: 'Rice requires clay soil or soil with clay layer for proper water retention'
      });
    }

    if (cropType === 'cotton' && soilType === 'sandy') {
      recommendations.push({
        type: 'fertilization',
        priority: 'medium',
        message: 'Use split fertilizer applications due to sandy soil leaching'
      });
    }

    return recommendations;
  }

  /**
   * Get database statistics
   * @returns {Object} Database statistics
   */
  getDatabaseStats() {
    if (!this.database) {
      return { error: 'Database not loaded' };
    }

    return {
      version: this.database.version,
      lastUpdated: this.database.lastUpdated,
      region: this.database.region,
      totalCrops: Object.keys(this.database.crops || {}).length,
      totalSoilTypes: Object.keys(this.database.soilTypes || {}).length,
      crops: Object.keys(this.database.crops || {}),
      soilTypes: Object.keys(this.database.soilTypes || {})
    };
  }

  /**
   * Reload database from file
   */
  reloadDatabase() {
    this.loadDatabase();
  }
}

module.exports = CropDatabaseService;
