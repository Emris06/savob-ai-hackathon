import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns';

const IrrigationCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Mock data for 7-day forecast and irrigation recommendations
  const weekData = [
    {
      date: addDays(startOfWeek(currentWeek), 0),
      weather: {
        condition: 'Sunny',
        icon: 'sunny',
        temperature: 28,
        humidity: 45,
        windSpeed: 8,
        precipitation: 0
      },
      irrigation: {
        recommendation: 'irrigate',
        amount: 45,
        reason: 'Low soil moisture, optimal weather conditions',
        zones: ['Zone A', 'Zone B'],
        time: '06:00-07:00'
      }
    },
    {
      date: addDays(startOfWeek(currentWeek), 1),
      weather: {
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy',
        temperature: 26,
        humidity: 55,
        windSpeed: 12,
        precipitation: 0
      },
      irrigation: {
        recommendation: 'irrigate',
        amount: 35,
        reason: 'Moderate soil moisture, good conditions',
        zones: ['Zone C'],
        time: '06:30-07:00'
      }
    },
    {
      date: addDays(startOfWeek(currentWeek), 2),
      weather: {
        condition: 'Rainy',
        icon: 'rainy',
        temperature: 22,
        humidity: 80,
        windSpeed: 15,
        precipitation: 12
      },
      irrigation: {
        recommendation: 'dont-irrigate',
        amount: 0,
        reason: 'Heavy rain expected, soil will be saturated',
        zones: [],
        time: 'N/A'
      }
    },
    {
      date: addDays(startOfWeek(currentWeek), 3),
      weather: {
        condition: 'Cloudy',
        icon: 'cloudy',
        temperature: 24,
        humidity: 70,
        windSpeed: 10,
        precipitation: 2
      },
      irrigation: {
        recommendation: 'maybe',
        amount: 20,
        reason: 'Light rain, check soil moisture before irrigating',
        zones: ['Zone D'],
        time: '07:00-07:30'
      }
    },
    {
      date: addDays(startOfWeek(currentWeek), 4),
      weather: {
        condition: 'Sunny',
        icon: 'sunny',
        temperature: 30,
        humidity: 40,
        windSpeed: 6,
        precipitation: 0
      },
      irrigation: {
        recommendation: 'irrigate',
        amount: 50,
        reason: 'High temperature, low humidity, optimal irrigation time',
        zones: ['Zone A', 'Zone B', 'Zone C'],
        time: '05:30-06:30'
      }
    },
    {
      date: addDays(startOfWeek(currentWeek), 5),
      weather: {
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy',
        temperature: 27,
        humidity: 50,
        windSpeed: 9,
        precipitation: 0
      },
      irrigation: {
        recommendation: 'irrigate',
        amount: 40,
        reason: 'Good conditions for irrigation',
        zones: ['Zone B', 'Zone D'],
        time: '06:00-06:45'
      }
    },
    {
      date: addDays(startOfWeek(currentWeek), 6),
      weather: {
        condition: 'Sunny',
        icon: 'sunny',
        temperature: 29,
        humidity: 42,
        windSpeed: 7,
        precipitation: 0
      },
      irrigation: {
        recommendation: 'irrigate',
        amount: 38,
        reason: 'Warm day, moderate soil moisture',
        zones: ['Zone A', 'Zone C'],
        time: '06:15-07:00'
      }
    }
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

  const getIrrigationColor = (recommendation) => {
    switch (recommendation) {
      case 'irrigate':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'maybe':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'dont-irrigate':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getIrrigationIcon = (recommendation) => {
    switch (recommendation) {
      case 'irrigate':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'maybe':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'dont-irrigate':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRecommendationText = (recommendation) => {
    switch (recommendation) {
      case 'irrigate':
        return 'Irrigate';
      case 'maybe':
        return 'Maybe';
      case 'dont-irrigate':
        return "Don't Irrigate";
      default:
        return 'Check';
    }
  };

  const navigateWeek = (direction) => {
    setCurrentWeek(addDays(currentWeek, direction * 7));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const selectedDayData = weekData.find(day => isSameDay(day.date, selectedDate));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Irrigation Calendar</h2>
          <p className="text-gray-600 mt-1">7-day irrigation recommendations with weather forecast</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Today
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        {weekData.map((day, index) => (
          <div
            key={index}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSameDay(day.date, selectedDate) ? 'ring-2 ring-agricultural-green-500 bg-agricultural-green-50' : ''
            } ${isToday(day.date) ? 'border-2 border-blue-300' : ''}`}
            onClick={() => setSelectedDate(day.date)}
          >
            {/* Date Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {format(day.date, 'EEE')}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {format(day.date, 'd')}
                </p>
              </div>
              {isToday(day.date) && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>

            {/* Weather */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                {getWeatherIcon(day.weather.icon)}
                <span className="text-sm font-medium text-gray-900">
                  {day.weather.temperature}°C
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{day.weather.condition}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span className="text-gray-600">{day.weather.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">{day.weather.windSpeed}km/h</span>
                  </div>
                </div>
                {day.weather.precipitation > 0 && (
                  <div className="flex items-center space-x-1 text-xs">
                    <CloudRain className="w-3 h-3 text-blue-500" />
                    <span className="text-gray-600">{day.weather.precipitation}mm</span>
                  </div>
                )}
              </div>
            </div>

            {/* Irrigation Recommendation */}
            <div className={`p-2 rounded-lg border ${getIrrigationColor(day.irrigation.recommendation)}`}>
              <div className="flex items-center justify-between mb-1">
                {getIrrigationIcon(day.irrigation.recommendation)}
                <span className="text-xs font-medium">
                  {getRecommendationText(day.irrigation.recommendation)}
                </span>
              </div>
              {day.irrigation.amount > 0 && (
                <p className="text-xs text-center font-medium">
                  {day.irrigation.amount}L/ha
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View for Selected Day */}
      {selectedDayData && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {format(selectedDayData.date, 'EEEE, MMMM d, yyyy')}
            </h3>
            <div className="flex items-center space-x-2">
              {getIrrigationIcon(selectedDayData.irrigation.recommendation)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getIrrigationColor(selectedDayData.irrigation.recommendation)}`}>
                {getRecommendationText(selectedDayData.irrigation.recommendation)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weather Details */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Weather Conditions</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon(selectedDayData.weather.icon)}
                    <span className="font-medium text-gray-900">{selectedDayData.weather.condition}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{selectedDayData.weather.temperature}°C</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Humidity</p>
                      <p className="font-semibold text-gray-900">{selectedDayData.weather.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Wind className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Wind Speed</p>
                      <p className="font-semibold text-gray-900">{selectedDayData.weather.windSpeed} km/h</p>
                    </div>
                  </div>
                </div>

                {selectedDayData.weather.precipitation > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CloudRain className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Precipitation</p>
                      <p className="font-semibold text-gray-900">{selectedDayData.weather.precipitation} mm</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Irrigation Details */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Irrigation Recommendation</h4>
              <div className="space-y-4">
                {selectedDayData.irrigation.amount > 0 ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Droplets className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900">Recommended Amount</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{selectedDayData.irrigation.amount}L/ha</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Best Time</p>
                        <p className="font-semibold text-gray-900">{selectedDayData.irrigation.time}</p>
                      </div>
                    </div>

                    {selectedDayData.irrigation.zones.length > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Recommended Zones</p>
                          <p className="font-semibold text-gray-900">{selectedDayData.irrigation.zones.join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <XCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">No Irrigation Recommended</p>
                        <p className="text-sm text-red-700 mt-1">{selectedDayData.irrigation.reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Reason</p>
                      <p className="text-sm text-blue-700 mt-1">{selectedDayData.irrigation.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="card">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Legend</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Irrigate - Optimal conditions</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-700">Maybe - Check conditions</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-700">Don't Irrigate - Avoid watering</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationCalendarView;
