import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { irrigationComparison, monthlySummary, seasonalProjections } from '../../data/ahmedFarmData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SavingsComparisonChart = () => {
  const data = {
    labels: [
      'Water Usage (L)',
      'Water Cost ($)',
      'Irrigation Events',
      'Avg Duration (min)',
      'Efficiency (%)',
      'Monthly Savings ($)',
      'Seasonal Savings ($)',
      'Annual Savings ($)'
    ],
    datasets: [
      {
        label: 'Traditional Irrigation',
        data: [
          irrigationComparison.traditional.totalWaterUsed,
          irrigationComparison.traditional.totalWaterCost,
          irrigationComparison.traditional.irrigationEvents,
          irrigationComparison.traditional.averageSessionDuration,
          irrigationComparison.traditional.efficiency,
          0, // No savings for traditional
          0, // No savings for traditional
          0  // No savings for traditional
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'AI-Guided Irrigation',
        data: [
          irrigationComparison.aiGuided.totalWaterUsed,
          irrigationComparison.aiGuided.totalWaterCost,
          irrigationComparison.aiGuided.irrigationEvents,
          irrigationComparison.aiGuided.averageSessionDuration,
          irrigationComparison.aiGuided.efficiency,
          monthlySummary.totalCostSaved,
          seasonalProjections.costSaved,
          seasonalProjections.annualCostSaved
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
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
        text: "Ahmed's Farm - AI vs Traditional Irrigation Comparison",
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
          label: function(context) {
            const label = context.dataset.label;
            const value = context.parsed.y;
            const dataLabel = context.label;
            
            if (dataLabel.includes('Water Usage')) {
              return `${label}: ${value.toLocaleString()}L`;
            } else if (dataLabel.includes('Cost') || dataLabel.includes('Savings')) {
              return `${label}: $${value.toFixed(2)}`;
            } else if (dataLabel.includes('Events')) {
              return `${label}: ${value} events`;
            } else if (dataLabel.includes('Duration')) {
              return `${label}: ${value} minutes`;
            } else if (dataLabel.includes('Efficiency')) {
              return `${label}: ${value}%`;
            }
            return `${label}: ${value}`;
          },
          afterBody: function(context) {
            const dataIndex = context[0].dataIndex;
            const traditionalValue = context[0].parsed.y;
            const aiValue = context[1].parsed.y;
            
            if (dataIndex < 5) { // Only show savings for comparison metrics
              const savings = traditionalValue - aiValue;
              const percentage = ((savings / traditionalValue) * 100).toFixed(1);
              
              if (context[0].label.includes('Water Usage')) {
                return [`Water Saved: ${savings.toLocaleString()}L (${percentage}%)`];
              } else if (context[0].label.includes('Cost')) {
                return [`Cost Saved: $${savings.toFixed(2)} (${percentage}%)`];
              } else if (context[0].label.includes('Events')) {
                return [`Events Reduced: ${savings} (${percentage}%)`];
              } else if (context[0].label.includes('Duration')) {
                return [`Time Saved: ${savings} minutes (${percentage}%)`];
              } else if (context[0].label.includes('Efficiency')) {
                return [`Efficiency Gain: +${savings}%`];
              }
            }
            return [];
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
          maxRotation: 45,
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
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'k';
            }
            return value;
          },
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
      
      {/* Key Metrics Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">
            {((irrigationComparison.traditional.totalWaterUsed - irrigationComparison.aiGuided.totalWaterUsed) / irrigationComparison.traditional.totalWaterUsed * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">Water Reduction</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            ${(irrigationComparison.traditional.totalWaterCost - irrigationComparison.aiGuided.totalWaterCost).toFixed(0)}
          </div>
          <div className="text-sm text-gray-600">Monthly Cost Saved</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {irrigationComparison.traditional.irrigationEvents - irrigationComparison.aiGuided.irrigationEvents}
          </div>
          <div className="text-sm text-gray-600">Fewer Events</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            +{irrigationComparison.aiGuided.efficiency - irrigationComparison.traditional.efficiency}%
          </div>
          <div className="text-sm text-gray-600">Efficiency Gain</div>
        </div>
      </div>
      
      {/* ROI Highlight */}
      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Return on Investment</h4>
            <p className="text-sm text-gray-600">Payback period: 8 months</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600">156%</div>
            <div className="text-sm text-gray-600">Annual ROI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsComparisonChart;
