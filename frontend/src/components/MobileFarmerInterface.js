import React, { useState, useEffect } from "react";
import {
  Droplets,
  Camera,
  Bell,
  Clock,
  CheckCircle,
  Wifi,
  WifiOff,
  Plus,
  Home,
  Cloud,
  Sun,
} from "lucide-react";

const MobileFarmerInterface = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "irrigation",
      title: "Irrigation Reminder",
      message: "Zone A needs watering - soil moisture at 25%",
      time: "2 hours ago",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "weather",
      title: "Weather Alert",
      message: "Rain expected in 3 hours - delay irrigation",
      time: "1 hour ago",
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      type: "system",
      title: "System Update",
      message: "Irrigation completed successfully",
      time: "30 minutes ago",
      read: true,
      priority: "low",
    },
  ]);

  const [irrigationLogs, setIrrigationLogs] = useState([
    {
      id: 1,
      zone: "Zone A",
      amount: 45,
      duration: "30 minutes",
      timestamp: "2024-01-20T08:00:00Z",
      photo: null,
    },
    {
      id: 2,
      zone: "Zone B",
      amount: 38,
      duration: "25 minutes",
      timestamp: "2024-01-19T14:30:00Z",
      photo: null,
    },
  ]);

  const [fieldPhotos, setFieldPhotos] = useState([]);

  // Form state for irrigation logging
  const [irrigationForm, setIrrigationForm] = useState({
    zone: "Zone A",
    amount: "",
    duration: "",
  });

  // Mock data
  const currentWeather = {
    temperature: 24,
    humidity: 68,
    windSpeed: 12,
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
  };

  const soilData = {
    moisture: 65,
    ph: 6.8,
    temperature: 22,
    lastUpdated: "2 hours ago",
  };

  const nextIrrigation = {
    date: "Tomorrow",
    time: "6:00 AM",
    amount: "45 minutes",
    zones: ["Zone A", "Zone B"],
    reason: "Optimal soil moisture level reached",
  };

  // Offline capability
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Mock push notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          type: "irrigation",
          title: "Irrigation Reminder",
          message: `Zone ${String.fromCharCode(
            65 + Math.floor(Math.random() * 3)
          )} needs attention`,
          time: "Just now",
          read: false,
          priority: "medium",
        };
        setNotifications((prev) => [newNotification, ...prev]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleIrrigationLog = () => {
    if (!irrigationForm.amount || !irrigationForm.duration) {
      alert("Please fill in all fields");
      return;
    }

    const newLog = {
      id: Date.now(),
      zone: irrigationForm.zone,
      amount: parseInt(irrigationForm.amount),
      duration: irrigationForm.duration,
      timestamp: new Date().toISOString(),
      photo: null,
    };

    setIrrigationLogs((prev) => [newLog, ...prev]);

    // Reset form
    setIrrigationForm({
      zone: "Zone A",
      amount: "",
      duration: "",
    });
  };

  const handlePhotoUpload = (file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPhoto = {
        id: Date.now(),
        type,
        url: e.target.result,
        timestamp: new Date().toISOString(),
        location: "Field Zone A", // Mock location
      };
      setFieldPhotos((prev) => [newPhoto, ...prev]);
    };
    reader.readAsDataURL(file);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const dismissNotification = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case "partly-cloudy":
        return <Cloud className="w-6 h-6 text-gray-500" />;
      case "cloudy":
        return <Cloud className="w-6 h-6 text-gray-600" />;
      case "rainy":
        return <Droplets className="w-6 h-6 text-blue-500" />;
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getMoistureColor = (level) => {
    if (level < 30) return "text-red-600 bg-red-100";
    if (level < 50) return "text-yellow-600 bg-yellow-100";
    if (level < 70) return "text-blue-600 bg-blue-100";
    return "text-green-600 bg-green-100";
  };

  const getMoistureStatus = (level) => {
    if (level < 30) return "Very Dry";
    if (level < 50) return "Dry";
    if (level < 70) return "Optimal";
    return "Wet";
  };

  const renderHomeTab = () => (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm text-gray-600">
            {isOnline ? "Online" : "Offline Mode"}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span
              className={`text-xs px-2 py-1 rounded-full ${getMoistureColor(
                soilData.moisture
              )}`}
            >
              {getMoistureStatus(soilData.moisture)}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {soilData.moisture}%
          </div>
          <div className="text-xs text-gray-500">Soil Moisture</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            {getWeatherIcon(currentWeather.icon)}
            <span className="text-xs text-gray-500">
              {currentWeather.condition}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {currentWeather.temperature}°C
          </div>
          <div className="text-xs text-gray-500">Temperature</div>
        </div>
      </div>

      {/* Next Irrigation Alert */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h6 className="font-medium text-gray-900">Next Irrigation</h6>
            <p className="text-sm text-gray-600">
              {nextIrrigation.date} at {nextIrrigation.time}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {nextIrrigation.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab("irrigation")}
          className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg mb-2">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            Log Irrigation
          </span>
        </button>

        <button
          onClick={() => setActiveTab("photos")}
          className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg mb-2">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            Field Photos
          </span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {irrigationLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Irrigated {log.zone}
                </p>
                <p className="text-xs text-gray-500">
                  {log.amount}L • {log.duration} •{" "}
                  {new Date(log.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIrrigationTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-4">Quick Irrigation Log</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={irrigationForm.zone}
              onChange={(e) =>
                setIrrigationForm({ ...irrigationForm, zone: e.target.value })
              }
            >
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water Amount (Liters)
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter amount"
              value={irrigationForm.amount}
              onChange={(e) =>
                setIrrigationForm({ ...irrigationForm, amount: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 30 minutes"
              value={irrigationForm.duration}
              onChange={(e) =>
                setIrrigationForm({
                  ...irrigationForm,
                  duration: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={handleIrrigationLog}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Log Irrigation
          </button>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-4">Recent Logs</h3>
        <div className="space-y-3">
          {irrigationLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {log.zone}
                  </p>
                  <p className="text-xs text-gray-500">
                    {log.amount}L • {log.duration}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPhotosTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-4">Field Conditions</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo Type
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="field-condition">Field Condition</option>
              <option value="crop-growth">Crop Growth</option>
              <option value="irrigation-system">Irrigation System</option>
              <option value="soil-condition">Soil Condition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Tap to take photo or select from gallery
              </p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handlePhotoUpload(e.target.files[0], "field-condition");
                  }
                }}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Choose Photo
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-4">Recent Photos</h3>
        <div className="grid grid-cols-2 gap-3">
          {fieldPhotos.map((photo) => (
            <div key={photo.id} className="relative">
              <img
                src={photo.url}
                alt="Field condition"
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black bg-opacity-50 text-white text-xs p-2 rounded">
                  <p className="font-medium">{photo.type}</p>
                  <p>{new Date(photo.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-4">Notifications</h3>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.read
                  ? "bg-gray-50 border-gray-200"
                  : "bg-white border-blue-200"
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {notification.type === "irrigation" && (
                    <Droplets className="w-5 h-5 text-blue-500" />
                  )}
                  {notification.type === "weather" && (
                    <Cloud className="w-5 h-5 text-yellow-500" />
                  )}
                  {notification.type === "system" && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderHomeTab();
      case "irrigation":
        return renderIrrigationTab();
      case "photos":
        return renderPhotosTab();
      case "notifications":
        return renderNotificationsTab();
      default:
        return renderHomeTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Farm Manager</h1>
            <p className="text-sm text-gray-500">Mobile Interface</p>
          </div>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs text-gray-500">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === "home" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("irrigation")}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === "irrigation" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <Droplets className="w-5 h-5" />
            <span className="text-xs">Irrigation</span>
          </button>

          <button
            onClick={() => setActiveTab("photos")}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === "photos" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs">Photos</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex flex-col items-center space-y-1 p-2 relative ${
              activeTab === "notifications" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs">Alerts</span>
            {notifications.filter((n) => !n.read).length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.filter((n) => !n.read).length}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFarmerInterface;
