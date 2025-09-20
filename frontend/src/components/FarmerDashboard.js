import React, { useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Cloud, 
  Sun, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  BarChart3,
  Leaf,
  Zap
} from 'lucide-react';

const FarmerDashboard = () => {
  const [soilMoisture] = useState(65);
  
  // Mock data for demonstration
  const currentWeather = {
    temperature: 24,
    humidity: 68,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy'
  };

  const soilData = {
    moisture: soilMoisture,
    ph: 6.8,
    temperature: 22,
    lastUpdated: '2 hours ago'
  };

  const nextIrrigation = {
    date: 'Tomorrow',
    time: '6:00 AM',
    amount: '45 minutes',
    zones: ['Zone A', 'Zone B'],
    reason: 'Optimal soil moisture level reached'
  };

  const weeklySavings = {
    waterSaved: 1250,
    costSaved: 45.50,
    efficiency: 87,
    vsTraditional: 22
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'partly-cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-600" />;
      case 'rainy':
        return <Droplets className="w-8 h-8 text-blue-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getMoistureColor = (level) => {
    if (level < 30) return 'text-red-600 bg-red-100';
    if (level < 50) return 'text-yellow-600 bg-yellow-100';
    if (level < 70) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getMoistureStatus = (level) => {
    if (level < 30) return 'Very Dry';
    if (level < 50) return 'Dry';
    if (level < 70) return 'Optimal';
    return 'Wet';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor your farm's irrigation and environmental conditions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Weather</h3>
            {getWeatherIcon(currentWeather.icon)}
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {currentWeather.temperature}°C
              </div>
              <p className="text-gray-600">{currentWeather.condition}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="font-semibold text-gray-900">{currentWeather.humidity}%</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg mx-auto mb-2">
                  <Wind className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">Wind</p>
                <p className="font-semibold text-gray-900">{currentWeather.windSpeed} km/h</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg mx-auto mb-2">
                  <Thermometer className="w-4 h-4 text-yellow-600" />
                </div>
                <p className="text-sm text-gray-600">Feels Like</p>
                <p className="font-semibold text-gray-900">{currentWeather.temperature + 2}°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Soil Moisture Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Soil Moisture</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMoistureColor(soilMoisture)}`}>
              {getMoistureStatus(soilMoisture)}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {soilMoisture}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    soilMoisture < 30 ? 'bg-red-500' :
                    soilMoisture < 50 ? 'bg-yellow-500' :
                    soilMoisture < 70 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${soilMoisture}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">pH Level</p>
                <p className="font-semibold text-gray-900">{soilData.ph}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Soil Temp</p>
                <p className="font-semibold text-gray-900">{soilData.temperature}°C</p>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500">
              Last updated: {soilData.lastUpdated}
            </div>
          </div>
        </div>

        {/* Next Irrigation Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Next Irrigation</h3>
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Scheduled</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {nextIrrigation.date}
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>{nextIrrigation.time}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="font-semibold text-gray-900">{nextIrrigation.amount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Zones</span>
                <span className="font-semibold text-gray-900">{nextIrrigation.zones.join(', ')}</span>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Reason:</strong> {nextIrrigation.reason}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Savings Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Water Savings</h3>
          <div className="flex items-center space-x-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">+{weeklySavings.vsTraditional}% vs Traditional</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{weeklySavings.waterSaved}L</p>
            <p className="text-sm text-gray-600">Water Saved</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">${weeklySavings.costSaved}</p>
            <p className="text-sm text-gray-600">Cost Saved</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{weeklySavings.efficiency}%</p>
            <p className="text-sm text-gray-600">Efficiency</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
              <Leaf className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{weeklySavings.vsTraditional}%</p>
            <p className="text-sm text-gray-600">Better than Traditional</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-agricultural-green-50 to-agricultural-green-100 border border-agricultural-green-200 rounded-lg hover:from-agricultural-green-100 hover:to-agricultural-green-200 transition-all duration-200 group">
            <div className="flex items-center justify-center w-12 h-12 bg-agricultural-green-600 rounded-lg mb-3 group-hover:bg-agricultural-green-700 transition-colors duration-200">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Log Irrigation</h4>
            <p className="text-sm text-gray-600 text-center">Record completed irrigation session</p>
          </button>
          
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-agricultural-blue-50 to-agricultural-blue-100 border border-agricultural-blue-200 rounded-lg hover:from-agricultural-blue-100 hover:to-agricultural-blue-200 transition-all duration-200 group">
            <div className="flex items-center justify-center w-12 h-12 bg-agricultural-blue-600 rounded-lg mb-3 group-hover:bg-agricultural-blue-700 transition-colors duration-200">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">View Calendar</h4>
            <p className="text-sm text-gray-600 text-center">Check irrigation schedule</p>
          </button>
          
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-3 group-hover:bg-purple-700 transition-colors duration-200">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">View Analytics</h4>
            <p className="text-sm text-gray-600 text-center">Check detailed reports</p>
          </button>
          
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200 group">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-600 rounded-lg mb-3 group-hover:bg-yellow-700 transition-colors duration-200">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">System Alerts</h4>
            <p className="text-sm text-gray-600 text-center">View system notifications</p>
          </button>
        </div>
      </div>

      {/* System Status Alert */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h6 className="font-medium text-gray-900">System Status: All Operational</h6>
            <p className="text-sm text-gray-600 mt-1">
              All irrigation zones are functioning normally. Next maintenance check scheduled for next week.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button className="text-sm font-medium text-green-600 hover:text-green-700">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
