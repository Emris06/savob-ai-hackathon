import React, { useState } from 'react';
import { 
  Droplets, 
  DollarSign, 
  TrendingUp, 
  Leaf, 
  Thermometer, 
  Cloud, 
  Wind, 
  Sun,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Target,
  Zap
} from 'lucide-react';
import WaterUsageChart from './charts/WaterUsageChart';
import SavingsComparisonChart from './charts/SavingsComparisonChart';
import WeatherCorrelationChart from './charts/WeatherCorrelationChart';
import EfficiencyTrendsChart from './charts/EfficiencyTrendsChart';
import { 
  farmProfile, 
  kpis, 
  seasonalProjections, 
  successStories, 
  businessCase 
} from '../data/ahmedFarmData';

const AhmedFarmDashboard = () => {
  const [activeChart, setActiveChart] = useState('water-usage');

  const renderChart = () => {
    switch (activeChart) {
      case 'water-usage':
        return <WaterUsageChart />;
      case 'savings-comparison':
        return <SavingsComparisonChart />;
      case 'weather-correlation':
        return <WeatherCorrelationChart />;
      case 'efficiency-trends':
        return <EfficiencyTrendsChart />;
      default:
        return <WaterUsageChart />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Farm Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{farmProfile.farmName}</h1>
            <div className="flex items-center space-x-4 text-green-100">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{farmProfile.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Est. {farmProfile.established}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>{farmProfile.farmSize} hectares</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-2xl font-bold">{farmProfile.farmerName}</div>
            <div className="text-green-100 text-sm">Cotton Farmer</div>
            <div className="flex items-center space-x-2 mt-2 text-sm">
              <Phone className="w-3 h-3" />
              <span>{farmProfile.contactInfo.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-3 h-3" />
              <span>{farmProfile.contactInfo.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Water Efficiency</p>
              <p className="text-3xl font-bold text-gray-900">
                {kpis.waterEfficiency.aiGuided}%
              </p>
              <p className="text-sm text-green-600">
                +{kpis.waterEfficiency.improvement}% vs Traditional
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Droplets className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Savings</p>
              <p className="text-3xl font-bold text-gray-900">
                ${kpis.costSavings.monthly.toFixed(0)}
              </p>
              <p className="text-sm text-green-600">
                {kpis.costSavings.percentage}% reduction
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Water Saved</p>
              <p className="text-3xl font-bold text-gray-900">
                {kpis.environmentalImpact.waterConservation.toLocaleString()}L
              </p>
              <p className="text-sm text-blue-600">
                {kpis.environmentalImpact.householdsEquivalent} households
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Leaf className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROI</p>
              <p className="text-3xl font-bold text-gray-900">
                {businessCase.threeYearROI > 0 ? '+' : ''}${businessCase.threeYearROI.toFixed(0)}
              </p>
              <p className="text-sm text-purple-600">
                {businessCase.paybackPeriod} month payback
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveChart('water-usage')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeChart === 'water-usage'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Water Usage
          </button>
          <button
            onClick={() => setActiveChart('savings-comparison')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeChart === 'savings-comparison'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Savings Comparison
          </button>
          <button
            onClick={() => setActiveChart('weather-correlation')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeChart === 'weather-correlation'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weather Correlation
          </button>
          <button
            onClick={() => setActiveChart('efficiency-trends')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeChart === 'efficiency-trends'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Efficiency Trends
          </button>
        </div>
      </div>

      {/* Active Chart */}
      {renderChart()}

      {/* Success Stories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Success Stories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">{story.date}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{story.story}</p>
              <p className="text-xs text-green-600 font-medium">{story.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Business Case Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-500" />
          Business Case Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">${businessCase.initialInvestment}</div>
            <div className="text-sm text-gray-600">Initial Investment</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">${seasonalProjections.costSaved.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Seasonal Savings</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{businessCase.paybackPeriod}</div>
            <div className="text-sm text-gray-600">Months to Payback</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">156%</div>
            <div className="text-sm text-gray-600">Annual ROI</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Additional Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessCase.additionalBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Leaf className="w-5 h-5 mr-2 text-green-500" />
          Environmental Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-green-600">
              {(seasonalProjections.environmentalImpact.co2Reduced).toFixed(1)}kg
            </p>
            <p className="text-sm text-gray-600 mt-2">CO₂ Emissions Reduced</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-blue-600">
              {seasonalProjections.environmentalImpact.householdsEquivalent}
            </p>
            <p className="text-sm text-gray-600 mt-2">Households Water Equivalent</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-purple-600">
              {seasonalProjections.environmentalImpact.treesEquivalent}
            </p>
            <p className="text-sm text-gray-600 mt-2">Trees Equivalent Saved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AhmedFarmDashboard;
