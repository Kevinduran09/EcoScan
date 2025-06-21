import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonBadge,
  IonFab,
  IonFabButton,
  IonModal,
  IonButtons,
  IonBackButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonToast,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import {
  notificationsOutline,
  trashOutline,
  checkmarkOutline,
  closeOutline,
  refreshOutline,
} from 'ionicons/icons';
import PushNotificationService from '../services/PushNotificationService';

interface Notification {
  id: string;
  title: string;
  body: string;
  data: { [key: string]: string };
  read: boolean;
  date: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const notificationService = PushNotificationService.getInstance();

  useEffect(() => {
    // Cargar notificaciones iniciales
    loadNotifications();

    // Suscribirse a cambios en las notificaciones
    const unsubscribe = notificationService.addListener(() => {
      loadNotifications();
    });

    return unsubscribe;
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationService.getNotifications();
    const unread = notificationService.getUnreadCount();
    
    setNotifications(allNotifications);
    setUnreadCount(unread);
  };

  const handleRefresh = (event: CustomEvent) => {
    loadNotifications();
    event.detail.complete();
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setToastMessage('Notificación marcada como leída');
    setShowToast(true);
  };

  const deleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
    setToastMessage('Notificación eliminada');
    setShowToast(true);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
    setToastMessage('Todas las notificaciones marcadas como leídas');
    setShowToast(true);
  };

  const clearAllNotifications = () => {
    notificationService.clearAllNotifications();
    setToastMessage('Todas las notificaciones eliminadas');
    setShowToast(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} hora${Math.floor(diffInHours) !== 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getNotificationIcon = (data: { [key: string]: string }) => {
    if (data.type === 'daily_reminder') {
      return '🌱';
    }
    return '📱';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Notificaciones</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={markAllAsRead} disabled={unreadCount === 0}>
              <IonIcon icon={checkmarkOutline} />
            </IonButton>
            <IonButton onClick={clearAllNotifications} disabled={notifications.length === 0}>
              <IonIcon icon={trashOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {notifications.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '50vh',
            textAlign: 'center',
            padding: '20px'
          }}>
            <IonIcon 
              icon={notificationsOutline} 
              style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }} 
            />
            <h3>No hay notificaciones</h3>
            <p>Las notificaciones aparecerán aquí cuando las recibas</p>
          </div>
        ) : (
          <IonList>
            {notifications.map((notification) => (
              <IonItemSliding key={notification.id}>
                <IonItem 
                  button 
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  style={{ 
                    opacity: notification.read ? 0.7 : 1,
                    borderLeft: notification.read ? 'none' : '4px solid #4CAF50'
                  }}
                >
                  <IonLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>
                        {getNotificationIcon(notification.data)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <h2 style={{ 
                          fontWeight: notification.read ? 'normal' : 'bold',
                          margin: '0 0 4px 0'
                        }}>
                          {notification.title}
                        </h2>
                        <p style={{ 
                          margin: '0 0 4px 0',
                          color: '#666'
                        }}>
                          {notification.body}
                        </p>
                        <small style={{ color: '#999' }}>
                          {formatDate(notification.date)}
                        </small>
                      </div>
                      {!notification.read && (
                        <IonBadge color="success" style={{ marginLeft: 'auto' }}>
                          Nuevo
                        </IonBadge>
                      )}
                    </div>
                  </IonLabel>
                </IonItem>

                <IonItemOptions side="end">
                  <IonItemOption 
                    color="success" 
                    onClick={() => markAsRead(notification.id)}
                    disabled={notification.read}
                  >
                    <IonIcon icon={checkmarkOutline} />
                    Leída
                  </IonItemOption>
                  <IonItemOption 
                    color="danger" 
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <IonIcon icon={trashOutline} />
                    Eliminar
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => loadNotifications()}>
            <IonIcon icon={refreshOutline} />
          </IonFabButton>
        </IonFab>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default NotificationCenter; 