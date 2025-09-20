import React, { useState, useEffect } from 'react';
import { Bell, X, Droplets, Cloud, CheckCircle, AlertTriangle } from 'lucide-react';

const NotificationSystem = ({ notifications, onMarkAsRead, onDismiss }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    // Show notification for unread items
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0 && !showNotification) {
      setCurrentNotification(unreadNotifications[0]);
      setShowNotification(true);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
        setCurrentNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, showNotification]);

  const handleDismiss = () => {
    setShowNotification(false);
    setCurrentNotification(null);
    if (currentNotification) {
      onDismiss(currentNotification.id);
    }
  };

  const handleMarkAsRead = () => {
    if (currentNotification) {
      onMarkAsRead(currentNotification.id);
      setShowNotification(false);
      setCurrentNotification(null);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'irrigation':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'weather':
        return <Cloud className="w-5 h-5 text-yellow-500" />;
      case 'system':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  if (!showNotification || !currentNotification) {
    return null;
  }

  return (
    <div className="fixed top-16 left-4 right-4 z-50 animate-slide-down">
      <div className={`rounded-lg shadow-lg border p-4 ${getNotificationColor(currentNotification.priority)}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getNotificationIcon(currentNotification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {currentNotification.title}
              </p>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {currentNotification.message}
            </p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                {currentNotification.time}
              </p>
              <button
                onClick={handleMarkAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Mark as Read
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;
