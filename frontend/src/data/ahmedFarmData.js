// Realistic demo data for Ahmed's cotton farm in Tashkent, Uzbekistan
// 50 hectares cotton farm with compelling AI irrigation results

export const farmProfile = {
  farmerName: "Ahmed Karimov",
  farmName: "Karimov Cotton Farm",
  location: "Tashkent Region, Uzbekistan",
  farmSize: 50, // hectares
  cropType: "cotton",
  soilType: "loamy",
  established: 2015,
  aiSystemInstalled: "March 2024",
  contactInfo: {
    phone: "+998 90 123 4567",
    email: "ahmed.karimov@farm.uz"
  }
};

// 30 days of realistic weather data for Tashkent region (April 2024)
export const weatherData = [
  { date: "2024-04-01", temperature: 18, humidity: 65, windSpeed: 8, rainfall: 0, condition: "sunny", solarRadiation: 22.5 },
  { date: "2024-04-02", temperature: 20, humidity: 58, windSpeed: 12, rainfall: 0, condition: "sunny", solarRadiation: 24.8 },
  { date: "2024-04-03", temperature: 22, humidity: 52, windSpeed: 15, rainfall: 0, condition: "partly-cloudy", solarRadiation: 21.2 },
  { date: "2024-04-04", temperature: 19, humidity: 72, windSpeed: 6, rainfall: 5.2, condition: "rainy", solarRadiation: 8.5 },
  { date: "2024-04-05", temperature: 16, humidity: 78, windSpeed: 4, rainfall: 8.1, condition: "rainy", solarRadiation: 6.2 },
  { date: "2024-04-06", temperature: 17, humidity: 68, windSpeed: 9, rainfall: 2.3, condition: "cloudy", solarRadiation: 12.8 },
  { date: "2024-04-07", temperature: 21, humidity: 55, windSpeed: 11, rainfall: 0, condition: "sunny", solarRadiation: 23.1 },
  { date: "2024-04-08", temperature: 24, humidity: 48, windSpeed: 14, rainfall: 0, condition: "sunny", solarRadiation: 26.4 },
  { date: "2024-04-09", temperature: 26, humidity: 42, windSpeed: 16, rainfall: 0, condition: "sunny", solarRadiation: 28.7 },
  { date: "2024-04-10", temperature: 28, humidity: 38, windSpeed: 18, rainfall: 0, condition: "sunny", solarRadiation: 30.2 },
  { date: "2024-04-11", temperature: 25, humidity: 45, windSpeed: 13, rainfall: 0, condition: "partly-cloudy", solarRadiation: 25.6 },
  { date: "2024-04-12", temperature: 23, humidity: 58, windSpeed: 10, rainfall: 1.8, condition: "cloudy", solarRadiation: 18.9 },
  { date: "2024-04-13", temperature: 20, humidity: 65, windSpeed: 8, rainfall: 3.5, condition: "rainy", solarRadiation: 14.2 },
  { date: "2024-04-14", temperature: 18, humidity: 70, windSpeed: 6, rainfall: 4.2, condition: "rainy", solarRadiation: 11.8 },
  { date: "2024-04-15", temperature: 19, humidity: 62, windSpeed: 9, rainfall: 0.8, condition: "cloudy", solarRadiation: 16.5 },
  { date: "2024-04-16", temperature: 22, humidity: 54, windSpeed: 12, rainfall: 0, condition: "sunny", solarRadiation: 24.3 },
  { date: "2024-04-17", temperature: 25, humidity: 47, windSpeed: 15, rainfall: 0, condition: "sunny", solarRadiation: 27.1 },
  { date: "2024-04-18", temperature: 27, humidity: 41, windSpeed: 17, rainfall: 0, condition: "sunny", solarRadiation: 29.5 },
  { date: "2024-04-19", temperature: 29, humidity: 36, windSpeed: 19, rainfall: 0, condition: "sunny", solarRadiation: 31.8 },
  { date: "2024-04-20", temperature: 31, humidity: 32, windSpeed: 21, rainfall: 0, condition: "sunny", solarRadiation: 33.2 },
  { date: "2024-04-21", temperature: 28, humidity: 39, windSpeed: 16, rainfall: 0, condition: "partly-cloudy", solarRadiation: 28.9 },
  { date: "2024-04-22", temperature: 26, humidity: 46, windSpeed: 13, rainfall: 0, condition: "partly-cloudy", solarRadiation: 25.7 },
  { date: "2024-04-23", temperature: 24, humidity: 53, windSpeed: 11, rainfall: 0, condition: "cloudy", solarRadiation: 22.4 },
  { date: "2024-04-24", temperature: 21, humidity: 61, windSpeed: 9, rainfall: 2.1, condition: "rainy", solarRadiation: 17.8 },
  { date: "2024-04-25", temperature: 19, humidity: 67, windSpeed: 7, rainfall: 3.8, condition: "rainy", solarRadiation: 13.6 },
  { date: "2024-04-26", temperature: 20, humidity: 59, windSpeed: 10, rainfall: 1.2, condition: "cloudy", solarRadiation: 19.2 },
  { date: "2024-04-27", temperature: 23, humidity: 51, windSpeed: 12, rainfall: 0, condition: "sunny", solarRadiation: 26.8 },
  { date: "2024-04-28", temperature: 26, humidity: 44, windSpeed: 14, rainfall: 0, condition: "sunny", solarRadiation: 29.3 },
  { date: "2024-04-29", temperature: 28, humidity: 40, windSpeed: 16, rainfall: 0, condition: "sunny", solarRadiation: 31.1 },
  { date: "2024-04-30", temperature: 30, humidity: 35, windSpeed: 18, rainfall: 0, condition: "sunny", solarRadiation: 32.7 }
];

// Irrigation comparison data - AI vs Traditional
export const irrigationComparison = {
  traditional: {
    totalWaterUsed: 125000, // liters for 30 days
    averageDailyUsage: 4167, // liters per day
    irrigationEvents: 18, // number of irrigation sessions
    averageSessionDuration: 45, // minutes
    waterCost: 0.025, // USD per liter
    totalWaterCost: 3125, // USD for 30 days
    efficiency: 62, // percentage
    zones: ["Zone A", "Zone B", "Zone C", "Zone D"],
    schedule: "Fixed schedule - every 2 days"
  },
  aiGuided: {
    totalWaterUsed: 87500, // liters for 30 days (30% reduction)
    averageDailyUsage: 2917, // liters per day
    irrigationEvents: 12, // number of irrigation sessions (33% fewer)
    averageSessionDuration: 35, // minutes (22% shorter)
    waterCost: 0.025, // USD per liter
    totalWaterCost: 2187.50, // USD for 30 days
    efficiency: 89, // percentage (27% improvement)
    zones: ["Zone A", "Zone B", "Zone C", "Zone D"],
    schedule: "AI-optimized based on soil moisture and weather"
  }
};

// Daily irrigation logs with AI recommendations
export const dailyIrrigationLogs = weatherData.map((weather, index) => {
  const day = index + 1;
  const date = weather.date;
  
  // AI decision logic based on weather and soil conditions
  const shouldIrrigate = weather.rainfall < 2 && weather.humidity < 70 && weather.temperature > 20;
  const aiRecommendation = shouldIrrigate ? "irrigate" : "skip";
  
  // Calculate water amounts based on weather conditions
  const baseWaterNeed = 3000; // base liters per day
  const weatherMultiplier = weather.temperature > 25 ? 1.3 : weather.temperature < 15 ? 0.7 : 1.0;
  const humidityMultiplier = weather.humidity < 50 ? 1.2 : weather.humidity > 80 ? 0.8 : 1.0;
  const rainfallAdjustment = Math.max(0, 1 - (weather.rainfall / 10));
  
  const traditionalAmount = Math.round(baseWaterNeed * weatherMultiplier * humidityMultiplier);
  const aiAmount = shouldIrrigate ? Math.round(traditionalAmount * 0.7 * rainfallAdjustment) : 0;
  
  return {
    day,
    date,
    weather: {
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainfall: weather.rainfall,
      condition: weather.condition
    },
    traditional: {
      irrigated: true, // Traditional always irrigates on schedule
      amount: traditionalAmount,
      duration: 45,
      cost: traditionalAmount * 0.025,
      reason: "Scheduled irrigation"
    },
    aiGuided: {
      irrigated: shouldIrrigate,
      amount: aiAmount,
      duration: shouldIrrigate ? 35 : 0,
      cost: aiAmount * 0.025,
      reason: shouldIrrigate ? 
        `AI recommendation: Optimal conditions (temp: ${weather.temperature}°C, humidity: ${weather.humidity}%)` :
        `AI recommendation: Skip irrigation (rainfall: ${weather.rainfall}mm, high humidity: ${weather.humidity}%)`
    },
    savings: {
      waterSaved: traditionalAmount - aiAmount,
      costSaved: (traditionalAmount - aiAmount) * 0.025,
      efficiencyGain: shouldIrrigate ? 30 : 100 // 100% efficiency when skipping unnecessary irrigation
    }
  };
});

// Monthly summary data
export const monthlySummary = {
  totalWaterSaved: dailyIrrigationLogs.reduce((sum, day) => sum + day.savings.waterSaved, 0),
  totalCostSaved: dailyIrrigationLogs.reduce((sum, day) => sum + day.savings.costSaved, 0),
  averageEfficiencyGain: dailyIrrigationLogs.reduce((sum, day) => sum + day.savings.efficiencyGain, 0) / 30,
  irrigationEventsReduced: irrigationComparison.traditional.irrigationEvents - irrigationComparison.aiGuided.irrigationEvents,
  waterUsageReduction: ((irrigationComparison.traditional.totalWaterUsed - irrigationComparison.aiGuided.totalWaterUsed) / irrigationComparison.traditional.totalWaterUsed) * 100
};

// Seasonal projections (6-month growing season)
export const seasonalProjections = {
  waterSaved: monthlySummary.totalWaterSaved * 6, // 6 months
  costSaved: monthlySummary.totalCostSaved * 6,
  annualWaterSaved: monthlySummary.totalWaterSaved * 12,
  annualCostSaved: monthlySummary.totalCostSaved * 12,
  paybackPeriod: 8, // months
  roi: 156, // percentage return on investment
  environmentalImpact: {
    co2Reduced: (monthlySummary.totalWaterSaved * 6 * 0.0004), // kg CO2
    householdsEquivalent: Math.round((monthlySummary.totalWaterSaved * 6) / 150), // households water equivalent
    treesEquivalent: Math.round((monthlySummary.totalWaterSaved * 6) / 1000) // trees saved
  }
};

// Key performance indicators for judges
export const kpis = {
  waterEfficiency: {
    traditional: 62,
    aiGuided: 89,
    improvement: 27
  },
  costSavings: {
    monthly: monthlySummary.totalCostSaved,
    seasonal: seasonalProjections.costSaved,
    annual: seasonalProjections.annualCostSaved,
    percentage: 30
  },
  environmentalImpact: {
    waterConservation: monthlySummary.totalWaterSaved,
    co2Reduction: seasonalProjections.environmentalImpact.co2Reduced,
    householdsEquivalent: seasonalProjections.environmentalImpact.householdsEquivalent
  },
  operationalEfficiency: {
    irrigationEventsReduced: monthlySummary.irrigationEventsReduced,
    timeSaved: monthlySummary.irrigationEventsReduced * 45, // minutes
    laborCostSaved: monthlySummary.irrigationEventsReduced * 15 // USD per event
  }
};

// Success stories and testimonials
export const successStories = [
  {
    date: "2024-04-15",
    story: "AI system prevented unnecessary irrigation during 2-day rain period, saving 8,000L of water",
    impact: "Saved $200 in water costs and prevented soil waterlogging"
  },
  {
    date: "2024-04-22",
    story: "AI detected optimal irrigation window during heat wave, maximizing water efficiency",
    impact: "Used 30% less water while maintaining crop health during extreme weather"
  },
  {
    date: "2024-04-28",
    story: "System automatically adjusted irrigation schedule based on soil moisture sensors",
    impact: "Achieved 95% irrigation efficiency, highest recorded this season"
  }
];

// ROI and business case
export const businessCase = {
  initialInvestment: 2500, // USD for AI system
  monthlySavings: monthlySummary.totalCostSaved,
  seasonalSavings: seasonalProjections.costSaved,
  annualSavings: seasonalProjections.annualCostSaved,
  paybackPeriod: 8, // months
  threeYearROI: seasonalProjections.annualCostSaved * 3 - 2500,
  breakEvenPoint: "August 2024",
  additionalBenefits: [
    "Reduced labor costs",
    "Improved crop yield quality",
    "Environmental compliance",
    "Water resource sustainability",
    "Climate resilience"
  ]
};

export default {
  farmProfile,
  weatherData,
  irrigationComparison,
  dailyIrrigationLogs,
  monthlySummary,
  seasonalProjections,
  kpis,
  successStories,
  businessCase
};
