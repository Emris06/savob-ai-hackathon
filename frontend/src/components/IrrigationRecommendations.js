import React from 'react';
import { CheckCircle, AlertTriangle, Clock, Droplets, Sun, CloudRain } from 'lucide-react';

const IrrigationRecommendations = () => {
  const recommendations = [
    {
      id: 1,
      type: 'optimal',
      title: 'Zone A - Optimal Timing',
      description: 'Best time to irrigate is between 6:00-8:00 AM',
      icon: CheckCircle,
      color: 'green',
      priority: 'high'
    },
    {
      id: 2,
      type: 'weather',
      title: 'Rain Expected Tomorrow',
      description: 'Reduce irrigation by 30% due to forecasted rain',
      icon: CloudRain,
      color: 'blue',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'efficiency',
      title: 'Zone C - Low Efficiency',
      description: 'Check sprinkler heads for clogs or misalignment',
      icon: AlertTriangle,
      color: 'yellow',
      priority: 'high'
    },
    {
      id: 4,
      type: 'schedule',
      title: 'Update Schedule',
      description: 'Consider extending irrigation time by 10 minutes',
      icon: Clock,
      color: 'blue',
      priority: 'low'
    }
  ];

  const getIconColor = (color) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-100';
      case 'blue':
        return 'text-blue-600 bg-blue-100';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => {
        const Icon = rec.icon;
        return (
          <div key={rec.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className={`flex-shrink-0 p-2 rounded-lg ${getIconColor(rec.color)}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
            </div>
          </div>
        );
      })}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-agricultural-green-600 text-white rounded-lg hover:bg-agricultural-green-700 transition-colors duration-200">
            <Droplets className="w-4 h-4" />
            <span className="text-sm font-medium">Start Irrigation</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-agricultural-blue-600 text-white rounded-lg hover:bg-agricultural-blue-700 transition-colors duration-200">
            <Sun className="w-4 h-4" />
            <span className="text-sm font-medium">Adjust Schedule</span>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 p-4 bg-gradient-to-r from-agricultural-green-50 to-agricultural-blue-50 rounded-lg border border-agricultural-green-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h6 className="font-medium text-gray-900">System Status</h6>
            <p className="text-sm text-gray-600">All zones operational • Last check: 2 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationRecommendations;
