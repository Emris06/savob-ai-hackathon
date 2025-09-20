import React, { useState, useEffect } from "react";
import {
  Calculator,
  DollarSign,
  Droplets,
  TrendingUp,
  Target,
  Leaf,
  Download,
  Calendar,
  BarChart3,
  Clock,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SavingsCalculator = () => {
  const [inputs, setInputs] = useState({
    farmSize: 10, // hectares
    cropType: "cotton",
    waterCostPerLiter: 0.03, // USD per liter
    currentEfficiency: 60, // Traditional flood irrigation efficiency
    soilType: "loamy",
    subscriptionCost: 50, // Monthly subscription cost
  });

  const [results, setResults] = useState({
    traditionalWaterUsage: 0,
    aiWaterUsage: 0,
    waterSaved: 0,
    monthlySavings: 0,
    seasonalSavings: 0,
    annualSavings: 0,
    paybackPeriod: 0,
    efficiencyGain: 0,
    monthlyBreakdown: [],
    seasonalBreakdown: [],
  });

  // Crop-specific water requirements (liters per hectare per month)
  const cropWaterRequirements = {
    cotton: {
      monthly: 50000, // liters per hectare per month
      seasonal: 300000, // liters per hectare per season
      efficiency: {
        traditional: 0.6,
        ai: 0.9,
      },
    },
    wheat: {
      monthly: 35000,
      seasonal: 210000,
      efficiency: {
        traditional: 0.65,
        ai: 0.88,
      },
    },
    rice: {
      monthly: 80000,
      seasonal: 480000,
      efficiency: {
        traditional: 0.55,
        ai: 0.85,
      },
    },
  };

  // Soil type adjustments
  const soilAdjustments = {
    sandy: {
      waterMultiplier: 1.3,
      efficiency: -0.05,
    },
    loamy: {
      waterMultiplier: 1.0,
      efficiency: 0,
    },
    clay: {
      waterMultiplier: 0.8,
      efficiency: 0.05,
    },
    clay_loam: {
      waterMultiplier: 0.9,
      efficiency: 0.02,
    },
  };

  const calculateSavings = () => {
    const {
      farmSize,
      cropType,
      waterCostPerLiter,
      currentEfficiency,
      soilType,
      subscriptionCost,
    } = inputs;
    const crop = cropWaterRequirements[cropType];
    const soil = soilAdjustments[soilType];

    if (!crop || !soil) return;

    // Calculate water usage for traditional irrigation
    const traditionalWaterUsage =
      crop.monthly * farmSize * soil.waterMultiplier;
    const traditionalCost = traditionalWaterUsage * waterCostPerLiter;

    // Calculate water usage for AI-guided irrigation
    const aiEfficiency = crop.efficiency.ai + soil.efficiency;
    const aiWaterUsage =
      traditionalWaterUsage * (crop.efficiency.traditional / aiEfficiency);
    const aiCost = aiWaterUsage * waterCostPerLiter;

    // Calculate savings
    const waterSaved = traditionalWaterUsage - aiWaterUsage;
    const monthlySavings = traditionalCost - aiCost;
    const seasonalSavings = monthlySavings * 6; // 6-month growing season
    const annualSavings = monthlySavings * 12;

    // Calculate payback period (considering subscription cost)
    const netMonthlySavings = monthlySavings - subscriptionCost;
    const paybackPeriod =
      netMonthlySavings > 0
        ? Math.ceil(subscriptionCost / netMonthlySavings)
        : 999;

    // Calculate efficiency gain
    const efficiencyGain =
      ((aiEfficiency - crop.efficiency.traditional) /
        crop.efficiency.traditional) *
      100;

    // Monthly breakdown for the growing season
    const monthlyBreakdown = [];
    const seasonalBreakdown = [];

    for (let month = 1; month <= 12; month++) {
      const isGrowingSeason = month >= 3 && month <= 8; // March to August
      const monthlyWater = isGrowingSeason
        ? crop.monthly * farmSize * soil.waterMultiplier
        : 0;
      const monthlyAICost = isGrowingSeason
        ? aiWaterUsage * waterCostPerLiter
        : 0;
      const monthlyTraditionalCost = isGrowingSeason ? traditionalCost : 0;
      const monthlyNetSavings =
        monthlyTraditionalCost - monthlyAICost - subscriptionCost;

      monthlyBreakdown.push({
        month: new Date(2024, month - 1).toLocaleString("default", {
          month: "long",
        }),
        traditionalWater: Math.round(monthlyWater),
        aiWater: Math.round(
          monthlyWater * (crop.efficiency.traditional / aiEfficiency)
        ),
        traditionalCost: Math.round(monthlyTraditionalCost * 100) / 100,
        aiCost: Math.round(monthlyAICost * 100) / 100,
        savings: Math.round(monthlyNetSavings * 100) / 100,
        isGrowingSeason,
      });
    }

    // Seasonal breakdown
    const seasons = [
      { name: "Spring", months: [3, 4, 5], color: "green" },
      { name: "Summer", months: [6, 7, 8], color: "yellow" },
      { name: "Fall", months: [9, 10, 11], color: "orange" },
      { name: "Winter", months: [12, 1, 2], color: "blue" },
    ];

    seasons.forEach((season) => {
      const seasonData = monthlyBreakdown.filter((m) =>
        season.months.includes(monthlyBreakdown.indexOf(m) + 1)
      );
      const totalTraditionalWater = seasonData.reduce(
        (sum, m) => sum + m.traditionalWater,
        0
      );
      const totalAIWater = seasonData.reduce((sum, m) => sum + m.aiWater, 0);
      const totalSavings = seasonData.reduce((sum, m) => sum + m.savings, 0);

      seasonalBreakdown.push({
        name: season.name,
        color: season.color,
        traditionalWater: totalTraditionalWater,
        aiWater: totalAIWater,
        waterSaved: totalTraditionalWater - totalAIWater,
        savings: totalSavings,
      });
    });
    
    setResults({
      traditionalWaterUsage: Math.round(traditionalWaterUsage),
      aiWaterUsage: Math.round(aiWaterUsage),
      waterSaved: Math.round(waterSaved),
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      seasonalSavings: Math.round(seasonalSavings * 100) / 100,
      annualSavings: Math.round(annualSavings * 100) / 100,
      paybackPeriod,
      efficiencyGain: Math.round(efficiencyGain),
      monthlyBreakdown,
      seasonalBreakdown,
    });
  };

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]:
        field === "cropType" || field === "soilType"
          ? value
          : parseFloat(value) || 0,
    }));
  };

  useEffect(() => {
    calculateSavings();
  }, [inputs]);

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Irrigation Savings Analysis Report", 20, 20);

    // Farm Information
    doc.setFontSize(14);
    doc.text("Farm Information", 20, 40);
    doc.setFontSize(10);
    doc.text(`Farm Size: ${inputs.farmSize} hectares`, 20, 50);
    doc.text(
      `Crop Type: ${
        inputs.cropType.charAt(0).toUpperCase() + inputs.cropType.slice(1)
      }`,
      20,
      55
    );
    doc.text(
      `Soil Type: ${
        inputs.soilType.charAt(0).toUpperCase() + inputs.soilType.slice(1)
      }`,
      20,
      60
    );
    doc.text(`Water Cost: $${inputs.waterCostPerLiter}/liter`, 20, 65);
    doc.text(`Subscription Cost: $${inputs.subscriptionCost}/month`, 20, 70);

    // Summary Results
    doc.setFontSize(14);
    doc.text("Savings Summary", 20, 85);
    doc.setFontSize(10);
    doc.text(
      `Monthly Water Savings: ${results.waterSaved.toLocaleString()} liters`,
      20,
      95
    );
    doc.text(`Monthly Cost Savings: $${results.monthlySavings}`, 20, 100);
    doc.text(`Annual Cost Savings: $${results.annualSavings}`, 20, 105);
    doc.text(`Efficiency Improvement: ${results.efficiencyGain}%`, 20, 110);
    doc.text(`Payback Period: ${results.paybackPeriod} months`, 20, 115);

    // Monthly Breakdown Table
    doc.setFontSize(14);
    doc.text("Monthly Breakdown", 20, 130);

    const tableData = results.monthlyBreakdown.map((month) => [
      month.month,
      month.isGrowingSeason ? month.traditionalWater.toLocaleString() : "0",
      month.isGrowingSeason ? month.aiWater.toLocaleString() : "0",
      month.isGrowingSeason ? `$${month.traditionalCost}` : "$0",
      month.isGrowingSeason ? `$${month.aiCost}` : "$0",
      `$${month.savings}`,
    ]);

    autoTable(doc, {
      head: [
        [
          "Month",
          "Traditional Water (L)",
          "AI Water (L)",
          "Traditional Cost",
          "AI Cost",
          "Net Savings",
        ],
      ],
      body: tableData,
      startY: 140,
      styles: { fontSize: 8 },
    });

    // Seasonal Summary
    doc.setFontSize(14);
    doc.text("Seasonal Summary", 20, doc.lastAutoTable.finalY + 20);

    const seasonalData = results.seasonalBreakdown.map((season) => [
      season.name,
      season.traditionalWater.toLocaleString(),
      season.aiWater.toLocaleString(),
      season.waterSaved.toLocaleString(),
      `$${season.savings.toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [
        [
          "Season",
          "Traditional Water (L)",
          "AI Water (L)",
          "Water Saved (L)",
          "Savings",
        ],
      ],
      body: seasonalData,
      startY: doc.lastAutoTable.finalY + 30,
      styles: { fontSize: 8 },
    });

    // Footer
    doc.setFontSize(8);
    doc.text(
      `Report generated on ${new Date().toLocaleDateString()}`,
      20,
      doc.lastAutoTable.finalY + 20
    );

    doc.save("irrigation-savings-report.pdf");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Irrigation Savings Calculator
          </h2>
          <p className="text-gray-600 mt-1">
            Compare traditional flood irrigation vs AI-guided irrigation
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-agricultural-green-600 text-white rounded-lg hover:bg-agricultural-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calculator className="w-4 h-4" />
            <span>Real-time calculations</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Farm Parameters
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Size (hectares)
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  value={inputs.farmSize}
                  onChange={(e) =>
                    handleInputChange("farmSize", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agricultural-green-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Type
              </label>
              <div className="relative">
                <Leaf className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={inputs.cropType}
                  onChange={(e) =>
                    handleInputChange("cropType", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agricultural-green-500 focus:border-transparent"
                >
                  <option value="cotton">Cotton</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Cost per Liter ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.001"
                  value={inputs.waterCostPerLiter}
                  onChange={(e) =>
                    handleInputChange("waterCostPerLiter", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agricultural-green-500 focus:border-transparent"
                  placeholder="0.03"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil Type
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={inputs.soilType}
                  onChange={(e) =>
                    handleInputChange("soilType", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agricultural-green-500 focus:border-transparent"
                >
                  <option value="sandy">Sandy</option>
                  <option value="loamy">Loamy</option>
                  <option value="clay">Clay</option>
                  <option value="clay_loam">Clay Loam</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Service Subscription Cost ($/month)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="1"
                  value={inputs.subscriptionCost}
                  onChange={(e) =>
                    handleInputChange("subscriptionCost", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agricultural-green-500 focus:border-transparent"
                  placeholder="50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Savings Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Savings Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-agricultural-blue-50 rounded-lg">
                <Droplets className="w-8 h-8 text-agricultural-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-agricultural-blue-600">
                  {results.waterSaved.toLocaleString()}L
                </p>
                <p className="text-sm text-gray-600">Water Saved/Month</p>
              </div>
              <div className="text-center p-4 bg-agricultural-green-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-agricultural-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-agricultural-green-600">
                  ${results.monthlySavings}
                </p>
                <p className="text-sm text-gray-600">Cost Saved/Month</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Efficiency Improvement
                </span>
                <span className="text-lg font-bold text-agricultural-green-600">
                  +{results.efficiencyGain}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Annual Savings
                </span>
                <span className="text-lg font-bold text-agricultural-green-600">
                  ${results.annualSavings}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Payback Period
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {results.paybackPeriod === 999
                    ? "Never"
                    : `${results.paybackPeriod} months`}
                </span>
              </div>
            </div>
          </div>

          {/* System Comparison */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              System Comparison
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                <h4 className="font-medium text-gray-900 mb-3">
                  Traditional Flood Irrigation
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Water Usage</p>
                    <p className="font-semibold text-gray-900">
                      {results.traditionalWaterUsage.toLocaleString()}L
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Monthly Cost</p>
                    <p className="font-semibold text-gray-900">
                      $
                      {(
                        results.traditionalWaterUsage * inputs.waterCostPerLiter
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Efficiency</p>
                    <p className="font-semibold text-gray-900">
                      {cropWaterRequirements[inputs.cropType]?.efficiency
                        .traditional * 100}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                <h4 className="font-medium text-gray-900 mb-3">
                  AI-Guided Irrigation
                </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Water Usage</p>
                    <p className="font-semibold text-gray-900">
                      {results.aiWaterUsage.toLocaleString()}L
                    </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Monthly Cost</p>
                    <p className="font-semibold text-gray-900">
                      $
                      {(
                        results.aiWaterUsage * inputs.waterCostPerLiter +
                        inputs.subscriptionCost
                      ).toFixed(2)}
                    </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Efficiency</p>
                    <p className="font-semibold text-gray-900">
                      {Math.round(
                        (cropWaterRequirements[inputs.cropType]?.efficiency.ai +
                          soilAdjustments[inputs.soilType]?.efficiency) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Monthly Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Month
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Traditional Water (L)
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  AI Water (L)
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Water Saved (L)
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Net Savings ($)
                </th>
              </tr>
            </thead>
            <tbody>
              {results.monthlyBreakdown.map((month, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 ${
                    month.isGrowingSeason ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {month.month}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {month.traditionalWater.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {month.aiWater.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {(month.traditionalWater - month.aiWater).toLocaleString()}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-medium ${
                      month.savings >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${month.savings}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seasonal Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Seasonal Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {results.seasonalBreakdown.map((season, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                season.color === "green"
                  ? "border-green-200 bg-green-50"
                  : season.color === "yellow"
                  ? "border-yellow-200 bg-yellow-50"
                  : season.color === "orange"
                  ? "border-orange-200 bg-orange-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <h4 className="font-semibold text-gray-900 mb-3">
                {season.name}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Saved:</span>
                  <span className="font-medium">
                    {season.waterSaved.toLocaleString()}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Savings:</span>
                  <span
                    className={`font-medium ${
                      season.savings >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${season.savings.toFixed(2)}
                  </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Environmental Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-green-600">
              {((results.waterSaved * 12) / 1000).toFixed(1)}kL
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Annual Water Conservation
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-blue-600">
              {(results.waterSaved * 12 * 0.0004).toFixed(1)}kg
            </p>
            <p className="text-sm text-gray-600 mt-2">CO₂ Emissions Reduced</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <Droplets className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <p className="text-3xl font-bold text-purple-600">
              {Math.round((results.waterSaved * 12) / 150)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Households Water Equivalent
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
