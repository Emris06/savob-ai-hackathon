import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { dailyIrrigationLogs } from '../../data/ahmedFarmData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherCorrelationChart = () => {
  // Prepare data for scatter plot
  const traditionalData = dailyIrrigationLogs.map(log => ({
    x: log.weather.temperature,
    y: log.traditional.amount,
    day: log.day,
    humidity: log.weather.humidity,
    rainfall: log.weather.rainfall,
    condition: log.weather.condition
  }));

  const aiData = dailyIrrigationLogs.map(log => ({
    x: log.weather.temperature,
    y: log.aiGuided.amount,
    day: log.day,
    humidity: log.weather.humidity,
    rainfall: log.weather.rainfall,
    condition: log.weather.condition
  }));

  const data = {
    datasets: [
      {
        label: 'Traditional Irrigation',
        data: traditionalData,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(239, 68, 68)',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
      {
        label: 'AI-Guided Irrigation',
        data: aiData,
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(34, 197, 94)',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500',
          },
          color: '#374151',
        },
      },
      title: {
        display: true,
        text: "Weather vs Irrigation Correlation - Temperature Impact",
        font: {
          size: 16,
          weight: '600',
        },
        color: '#111827',
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            const point = context[0].raw;
            return `Day ${point.day} - ${point.condition}`;
          },
          label: function(context) {
            const point = context.raw;
            return [
              `Temperature: ${point.x}°C`,
              `Water Used: ${point.y.toLocaleString()}L`,
              `Humidity: ${point.humidity}%`,
              `Rainfall: ${point.rainfall}mm`
            ];
          },
          afterBody: function(context) {
            const point = context[0].raw;
            const dayLog = dailyIrrigationLogs.find(log => log.day === point.day);
            if (dayLog) {
              return [
                '',
                `Water Saved: ${dayLog.savings.waterSaved.toLocaleString()}L`,
                `Cost Saved: $${dayLog.savings.costSaved.toFixed(2)}`,
                `AI Decision: ${dayLog.aiGuided.reason}`
              ];
            }
            return [];
          }
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Temperature (°C)',
          font: {
            size: 12,
            weight: '600',
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          callback: function(value) {
            return value + '°C';
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Water Usage (Liters)',
          font: {
            size: 12,
            weight: '600',
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          callback: function(value) {
            return value.toLocaleString() + 'L';
          },
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
    },
  };

  // Calculate correlation coefficients
  const calculateCorrelation = (data) => {
    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.x, 0);
    const sumY = data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);
    const sumYY = data.reduce((sum, point) => sum + point.y * point.y, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return correlation;
  };

  const traditionalCorrelation = calculateCorrelation(traditionalData);
  const aiCorrelation = calculateCorrelation(aiData);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-80">
        <Scatter data={data} options={options} />
      </div>
      
      {/* Correlation Analysis */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">
            {traditionalCorrelation.toFixed(3)}
          </div>
          <div className="text-sm text-gray-600">Traditional Correlation</div>
          <div className="text-xs text-gray-500 mt-1">
            Temperature vs Water Usage
          </div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {aiCorrelation.toFixed(3)}
          </div>
          <div className="text-sm text-gray-600">AI-Guided Correlation</div>
          <div className="text-xs text-gray-500 mt-1">
            Temperature vs Water Usage
          </div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {((Math.abs(traditionalCorrelation) - Math.abs(aiCorrelation)) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Correlation Reduction</div>
          <div className="text-xs text-gray-500 mt-1">
            AI reduces weather dependency
          </div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Traditional irrigation shows strong correlation with temperature (rigid scheduling)</li>
          <li>• AI system adapts to weather conditions, reducing unnecessary irrigation</li>
          <li>• AI prevents over-irrigation during high temperatures and rainfall periods</li>
          <li>• More consistent water usage regardless of weather fluctuations</li>
        </ul>
      </div>
    </div>
  );
};

export default WeatherCorrelationChart;
