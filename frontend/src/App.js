import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FarmerDashboard from './components/FarmerDashboard';
import MobileFarmerInterface from './components/MobileFarmerInterface';
import AhmedFarmDashboard from './components/AhmedFarmDashboard';
import IrrigationCalendar from './components/IrrigationCalendar';
import IrrigationCalendarView from './components/IrrigationCalendarView';
import SavingsCalculator from './components/SavingsCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'farmer':
        return <FarmerDashboard />;
      case 'mobile-farmer':
        return <MobileFarmerInterface />;
      case 'ahmed-farm':
        return <AhmedFarmDashboard />;
      case 'calendar':
        return <IrrigationCalendar />;
      case 'calendar-view':
        return <IrrigationCalendarView />;
      case 'savings':
        return <SavingsCalculator />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;
