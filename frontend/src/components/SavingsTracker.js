import React from 'react';
import { TrendingUp, DollarSign, Droplets, Leaf, Target } from 'lucide-react';

const SavingsTracker = () => {
  const savingsData = {
    monthly: {
      water: 1250,
      cost: 45.50,
      percentage: 18
    },
    yearly: {
      water: 15000,
      cost: 546.00,
      percentage: 22
    }
  };

  const achievements = [
    {
      title: 'Water Conservation',
      value: '15,000L',
      description: 'Saved this year',
      icon: Droplets,
      color: 'blue'
    },
    {
      title: 'Cost Savings',
      value: '$546',
      description: 'Reduced expenses',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Efficiency Gain',
      value: '22%',
      description: 'Improvement rate',
      icon: TrendingUp,
      color: 'green'
    }
  ];

  const goals = [
    {
      title: 'Monthly Water Target',
      target: 2000,
      current: 1750,
      unit: 'L',
      icon: Target,
      color: 'agricultural-blue'
    },
    {
      title: 'Cost Reduction Goal',
      target: 50,
      current: 45.50,
      unit: '$',
      icon: DollarSign,
      color: 'agricultural-green'
    }
  ];

  const getIconColor = (color) => {
    switch (color) {
      case 'blue':
        return 'text-agricultural-blue-600 bg-agricultural-blue-100';
      case 'green':
        return 'text-agricultural-green-600 bg-agricultural-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Savings Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${getIconColor(achievement.color)} mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{achievement.value}</p>
              <p className="text-sm font-medium text-gray-600">{achievement.title}</p>
              <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
            </div>
          );
        })}
      </div>

      {/* Progress Goals */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-900">Progress Goals</h5>
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          const progress = (goal.current / goal.target) * 100;
          
          return (
            <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${goal.color}-100`}>
                    <Icon className={`w-5 h-5 text-${goal.color}-600`} />
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">{goal.title}</h6>
                    <p className="text-sm text-gray-600">
                      {goal.current}{goal.unit} of {goal.target}{goal.unit}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-${goal.color}-600 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Environmental Impact */}
      <div className="p-4 bg-gradient-to-r from-agricultural-green-50 to-agricultural-blue-50 rounded-lg border border-agricultural-green-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-lg bg-agricultural-green-100">
            <Leaf className="w-5 h-5 text-agricultural-green-600" />
          </div>
          <h6 className="font-medium text-gray-900">Environmental Impact</h6>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">CO₂ Saved</p>
            <p className="font-semibold text-gray-900">2.3 kg</p>
          </div>
          <div>
            <p className="text-gray-600">Energy Saved</p>
            <p className="font-semibold text-gray-900">45 kWh</p>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h6 className="font-medium text-gray-900 mb-3">This Month vs Last Month</h6>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Water Usage</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-green-600">-{savingsData.monthly.percentage}%</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cost Savings</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-green-600">${savingsData.monthly.cost}</span>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsTracker;
