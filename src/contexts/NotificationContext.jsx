import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const useNotification = () => {
  const { addNotification, ...rest } = useNotifications();
  return {
    ...rest,
    showNotification: addNotification,
    addNotification
  };
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (message, type = 'info', title = '') => {
    if (typeof message === 'object') {
      // Support old API
      const notification = message;
      return addNotification(notification.message, notification.type, notification.title);
    }

    const newNotification = {
      id: Date.now(),
      message,
      type,
      title,
      read: false,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Auto-remove notification after 5 seconds if it's not an error
    if (type !== 'error') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => prev - 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const NotificationComponent = () => {
    if (notifications.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg flex items-start space-x-3 ${
              notification.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : notification.type === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : notification.type === 'error' ? (
                <AlertCircle className="text-red-500" size={20} />
              ) : (
                <Bell className="text-blue-500" size={20} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="text-sm text-gray-500">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        showNotification: addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
      <NotificationComponent />
    </NotificationContext.Provider>
  );
}; 