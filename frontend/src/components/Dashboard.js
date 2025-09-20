import React from 'react';
import WeatherWidget from './WeatherWidget';
import WaterUsageChart from './WaterUsageChart';
import IrrigationRecommendations from './IrrigationRecommendations';
import SavingsTracker from './SavingsTracker';
import { Droplets, Thermometer, CloudRain, Sun, Calculator } from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  // Mock data for demonstration
  const metrics = [
    {
      title: 'Water Usage Today',
      value: '2,450 L',
      change: '+12%',
      changeType: 'increase',
      icon: Droplets,
      color: 'agricultural-blue'
    },
    {
      title: 'Temperature',
      value: '24°C',
      change: '+2°C',
      changeType: 'increase',
      icon: Thermometer,
      color: 'agricultural-green'
    },
    {
      title: 'Humidity',
      value: '68%',
      change: '-5%',
      changeType: 'decrease',
      icon: CloudRain,
      color: 'agricultural-blue'
    },
    {
      title: 'Sunlight Hours',
      value: '8.5h',
      change: '+1.2h',
      changeType: 'increase',
      icon: Sun,
      color: 'agricultural-green'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor your irrigation system and water usage</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <p className={`text-sm mt-1 ${
                    metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change} from yesterday
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <div className="lg:col-span-1">
          <WeatherWidget />
        </div>

        {/* Water Usage Chart */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Usage Trends</h3>
            <WaterUsageChart />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Irrigation Recommendations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Irrigation Recommendations</h3>
          <IrrigationRecommendations />
        </div>

        {/* Savings Tracker */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Tracker</h3>
          <SavingsTracker />
        </div>

        {/* Quick Access to Savings Calculator */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Calculator</h3>
          <div className="text-center p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-agricultural-green-100 rounded-full mx-auto mb-4">
              <Calculator className="w-8 h-8 text-agricultural-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Calculate Your Savings</h4>
            <p className="text-gray-600 mb-4">
              Compare traditional flood irrigation vs AI-guided irrigation to see potential savings in water and costs.
            </p>
            <button
              onClick={() => setActiveTab('savings')}
              className="w-full px-4 py-2 bg-agricultural-green-600 text-white rounded-lg hover:bg-agricultural-green-700 transition-colors"
            >
              Open Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
