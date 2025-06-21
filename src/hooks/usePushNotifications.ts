import { useEffect, useState } from 'react';
import PushNotificationService from '../services/PushNotificationService';

export const usePushNotifications = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const notificationService = PushNotificationService.getInstance();
        await notificationService.initialize();
        
        // Cargar datos iniciales
        const allNotifications = notificationService.getNotifications();
        const unread = notificationService.getUnreadCount();
        
        setNotifications(allNotifications);
        setUnreadCount(unread);
        setIsInitialized(true);

        // Suscribirse a cambios
        const unsubscribe = notificationService.addListener(() => {
          const updatedNotifications = notificationService.getNotifications();
          const updatedUnread = notificationService.getUnreadCount();
          
          setNotifications(updatedNotifications);
          setUnreadCount(updatedUnread);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error inicializando notificaciones push:', error);
      }
    };

    initializeNotifications();
  }, []);

  const markAsRead = (id: string) => {
    const notificationService = PushNotificationService.getInstance();
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    const notificationService = PushNotificationService.getInstance();
    notificationService.markAllAsRead();
  };

  const deleteNotification = (id: string) => {
    const notificationService = PushNotificationService.getInstance();
    notificationService.deleteNotification(id);
  };

  const clearAllNotifications = () => {
    const notificationService = PushNotificationService.getInstance();
    notificationService.clearAllNotifications();
  };

  return {
    isInitialized,
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };
}; 