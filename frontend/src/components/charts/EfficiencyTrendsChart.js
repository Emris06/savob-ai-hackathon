import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dailyIrrigationLogs, monthlySummary } from '../../data/ahmedFarmData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EfficiencyTrendsChart = () => {
  // Calculate weekly efficiency trends
  const weeklyData = [];
  for (let week = 0; week < 4; week++) {
    const weekStart = week * 7;
    const weekEnd = Math.min(weekStart + 7, dailyIrrigationLogs.length);
    const weekLogs = dailyIrrigationLogs.slice(weekStart, weekEnd);
    
    const traditionalWater = weekLogs.reduce((sum, log) => sum + log.traditional.amount, 0);
    const aiWater = weekLogs.reduce((sum, log) => sum + log.aiGuided.amount, 0);
    const traditionalCost = weekLogs.reduce((sum, log) => sum + log.traditional.cost, 0);
    const aiCost = weekLogs.reduce((sum, log) => sum + log.aiGuided.cost, 0);
    
    const waterEfficiency = ((traditionalWater - aiWater) / traditionalWater) * 100;
    const costEfficiency = ((traditionalCost - aiCost) / traditionalCost) * 100;
    const overallEfficiency = (waterEfficiency + costEfficiency) / 2;
    
    weeklyData.push({
      week: week + 1,
      waterEfficiency,
      costEfficiency,
      overallEfficiency,
      waterSaved: traditionalWater - aiWater,
      costSaved: traditionalCost - aiCost,
      traditionalWater,
      aiWater,
      traditionalCost,
      aiCost
    });
  }

  const data = {
    labels: weeklyData.map(w => `Week ${w.week}`),
    datasets: [
      {
        label: 'Water Efficiency (%)',
        data: weeklyData.map(w => w.waterEfficiency),
        borderColor: 'rgb(59, 130, 246)', // Blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y',
      },
      {
        label: 'Cost Efficiency (%)',
        data: weeklyData.map(w => w.costEfficiency),
        borderColor: 'rgb(34, 197, 94)', // Green-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y',
      },
      {
        label: 'Overall Efficiency (%)',
        data: weeklyData.map(w => w.overallEfficiency),
        borderColor: 'rgb(168, 85, 247)', // Purple-500
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 10,
        yAxisID: 'y',
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
        text: "Ahmed's Farm - Weekly Efficiency Trends",
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
        intersect: false,
        mode: 'index',
        callbacks: {
          title: function(context) {
            const weekIndex = context[0].dataIndex;
            const week = weeklyData[weekIndex];
            return `Week ${week.week} Performance`;
          },
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          },
          afterBody: function(context) {
            const weekIndex = context[0].dataIndex;
            const week = weeklyData[weekIndex];
            return [
              '',
              `Water Saved: ${week.waterSaved.toLocaleString()}L`,
              `Cost Saved: $${week.costSaved.toFixed(2)}`,
              `Traditional Water: ${week.traditionalWater.toLocaleString()}L`,
              `AI Water: ${week.aiWater.toLocaleString()}L`
            ];
          }
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Efficiency (%)',
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
            return value + '%';
          },
        },
        border: {
          display: false,
        },
        min: 0,
        max: 50,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff',
      },
    },
  };

  // Calculate trend statistics
  const avgWaterEfficiency = weeklyData.reduce((sum, w) => sum + w.waterEfficiency, 0) / weeklyData.length;
  const avgCostEfficiency = weeklyData.reduce((sum, w) => sum + w.costEfficiency, 0) / weeklyData.length;
  const avgOverallEfficiency = weeklyData.reduce((sum, w) => sum + w.overallEfficiency, 0) / weeklyData.length;
  
  const trendDirection = weeklyData[weeklyData.length - 1].overallEfficiency > weeklyData[0].overallEfficiency ? 'up' : 'down';
  const trendPercentage = Math.abs(((weeklyData[weeklyData.length - 1].overallEfficiency - weeklyData[0].overallEfficiency) / weeklyData[0].overallEfficiency) * 100);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
      
      {/* Efficiency Metrics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {avgWaterEfficiency.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Avg Water Efficiency</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {avgCostEfficiency.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Avg Cost Efficiency</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {avgOverallEfficiency.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Overall Efficiency</div>
        </div>
        
        <div className={`text-center p-4 rounded-lg border ${
          trendDirection === 'up' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className={`text-2xl font-bold ${
            trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trendDirection === 'up' ? '↗' : '↘'} {trendPercentage.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Trend</div>
        </div>
      </div>
      
      {/* Performance Insights */}
      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Performance Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Best Performing Week</h5>
            <p>Week {weeklyData.reduce((best, week, index) => 
              week.overallEfficiency > weeklyData[best].overallEfficiency ? index : best, 0
            ) + 1}: {Math.max(...weeklyData.map(w => w.overallEfficiency)).toFixed(1)}% efficiency</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Consistency</h5>
            <p>AI system shows {trendDirection === 'up' ? 'improving' : 'stable'} performance with minimal variance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyTrendsChart;
