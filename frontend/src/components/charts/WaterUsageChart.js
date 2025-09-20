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
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dailyIrrigationLogs, monthlySummary } from '../../data/ahmedFarmData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WaterUsageChart = () => {
  // Use real data from Ahmed's farm
  const data = {
    labels: dailyIrrigationLogs.map(log => `Day ${log.day}`),
    datasets: [
      {
        label: 'Traditional Irrigation',
        data: dailyIrrigationLogs.map(log => log.traditional.amount),
        borderColor: 'rgb(239, 68, 68)', // Red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'AI-Guided Irrigation',
        data: dailyIrrigationLogs.map(log => log.aiGuided.amount),
        borderColor: 'rgb(34, 197, 94)', // Green-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Rainfall',
        data: dailyIrrigationLogs.map(log => log.weather.rainfall * 100), // Scale rainfall for visibility
        borderColor: 'rgb(59, 130, 246)', // Blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderDash: [5, 5],
        yAxisID: 'y1',
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
        text: "Ahmed's Farm - Water Usage Over 30 Days (Liters)",
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
            const dayIndex = context[0].dataIndex;
            const log = dailyIrrigationLogs[dayIndex];
            return `Day ${log.day} - ${log.date} (${log.weather.condition})`;
          },
          label: function(context) {
            if (context.dataset.label === 'Rainfall') {
              return `Rainfall: ${(context.parsed.y / 100).toFixed(1)}mm`;
            }
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}L`;
          },
          afterBody: function(context) {
            const dayIndex = context[0].dataIndex;
            const log = dailyIrrigationLogs[dayIndex];
            return [
              `Temp: ${log.weather.temperature}°C`,
              `Humidity: ${log.weather.humidity}%`,
              `Water Saved: ${log.savings.waterSaved.toLocaleString()}L`,
              `Cost Saved: $${log.savings.costSaved.toFixed(2)}`
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
            size: 10,
          },
          maxTicksLimit: 15,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
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
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{monthlySummary.totalWaterSaved.toLocaleString()}L</div>
          <div className="text-xs text-gray-600">Monthly Water Saved</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{monthlySummary.averageEfficiencyGain.toFixed(0)}%</div>
          <div className="text-xs text-gray-600">Avg Efficiency Gain</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">${monthlySummary.totalCostSaved.toFixed(0)}</div>
          <div className="text-xs text-gray-600">Monthly Cost Saved</div>
        </div>
      </div>
    </div>
  );
};

export default WaterUsageChart;
