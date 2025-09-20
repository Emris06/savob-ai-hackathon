import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Droplets, Settings } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const IrrigationCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock irrigation schedule data
  const irrigationSchedule = {
    '2024-01-15': { zones: ['A', 'B'], duration: 30, status: 'completed' },
    '2024-01-16': { zones: ['C', 'D'], duration: 45, status: 'scheduled' },
    '2024-01-17': { zones: ['A', 'B', 'C'], duration: 25, status: 'scheduled' },
    '2024-01-18': { zones: ['D'], duration: 20, status: 'scheduled' },
    '2024-01-19': { zones: ['A', 'B'], duration: 35, status: 'scheduled' },
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getScheduleForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return irrigationSchedule[dateKey] || null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'missed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const zones = [
    { id: 'A', name: 'Zone A - Front Lawn', area: '500 sq ft', type: 'Sprinkler' },
    { id: 'B', name: 'Zone B - Back Garden', area: '750 sq ft', type: 'Drip' },
    { id: 'C', name: 'Zone C - Vegetable Patch', area: '300 sq ft', type: 'Drip' },
    { id: 'D', name: 'Zone D - Flower Beds', area: '200 sq ft', type: 'Sprinkler' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Irrigation Calendar</h2>
          <p className="text-gray-600 mt-1">Manage your irrigation schedule and zones</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-primary">
            <Settings className="w-4 h-4 mr-2" />
            Configure Zones
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day) => {
                const schedule = getScheduleForDate(day);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`relative p-2 h-20 text-left rounded-lg transition-colors duration-200 ${
                      isCurrentMonth ? 'hover:bg-gray-50' : 'text-gray-400'
                    } ${
                      isToday ? 'bg-agricultural-blue-100 border-2 border-agricultural-blue-500' : ''
                    } ${
                      isSelected ? 'bg-agricultural-green-100 border-2 border-agricultural-green-500' : ''
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {format(day, 'd')}
                    </div>
                    {schedule && (
                      <div className="mt-1 space-y-1">
                        <div className={`text-xs px-1 py-0.5 rounded border ${getStatusColor(schedule.status)}`}>
                          {schedule.zones.join(', ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {schedule.duration}min
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Selected Date Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            
            {getScheduleForDate(selectedDate) ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Scheduled Irrigation</p>
                    <p className="text-sm text-gray-600">
                      Zones: {getScheduleForDate(selectedDate).zones.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">
                      {getScheduleForDate(selectedDate).duration} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Droplets className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(getScheduleForDate(selectedDate).status)}`}>
                      {getScheduleForDate(selectedDate).status}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full btn-primary">
                    Edit Schedule
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No irrigation scheduled</p>
                <button className="btn-primary">
                  Add Schedule
                </button>
              </div>
            )}
          </div>

          {/* Zones Overview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Irrigation Zones</h3>
            <div className="space-y-3">
              {zones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{zone.name}</p>
                    <p className="text-sm text-gray-600">{zone.area} • {zone.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationCalendar;
