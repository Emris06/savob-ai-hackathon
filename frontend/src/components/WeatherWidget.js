import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';

const WeatherWidget = () => {
  // Mock weather data
  const currentWeather = {
    temperature: 24,
    condition: 'Partly Cloudy',
    humidity: 68,
    windSpeed: 12,
    precipitation: 0.2,
    icon: 'partly-cloudy'
  };

  const forecast = [
    { day: 'Today', high: 26, low: 18, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
    { day: 'Tomorrow', high: 28, low: 20, condition: 'Sunny', icon: 'sunny' },
    { day: 'Wed', high: 25, low: 17, condition: 'Rainy', icon: 'rainy' },
    { day: 'Thu', high: 23, low: 15, condition: 'Cloudy', icon: 'cloudy' },
    { day: 'Fri', high: 27, low: 19, condition: 'Sunny', icon: 'sunny' }
  ];

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'partly-cloudy':
        return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-600" />;
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Forecast</h3>
      
      {/* Current Weather */}
      <div className="bg-gradient-to-br from-agricultural-blue-50 to-agricultural-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-2xl font-bold text-gray-900">{currentWeather.temperature}°C</h4>
            <p className="text-gray-600">{currentWeather.condition}</p>
          </div>
          {getWeatherIcon(currentWeather.icon)}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-agricultural-blue-500" />
            <span className="text-gray-600">{currentWeather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{currentWeather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center space-x-2">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">{currentWeather.precipitation}mm</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="space-y-3">
        <h5 className="font-medium text-gray-900">5-Day Forecast</h5>
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(day.icon)}
              <div>
                <p className="font-medium text-gray-900">{day.day}</p>
                <p className="text-sm text-gray-500">{day.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{day.high}°</p>
              <p className="text-sm text-gray-500">{day.low}°</p>
            </div>
          </div>
        ))}
      </div>

      {/* Irrigation Alert */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Droplets className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h6 className="font-medium text-yellow-800">Irrigation Alert</h6>
            <p className="text-sm text-yellow-700 mt-1">
              Rain expected tomorrow. Consider reducing irrigation schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
