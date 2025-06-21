import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { auth, authReady } from '../core/firebaseConfig';

class PushNotificationService {
  private static instance: PushNotificationService;
  private initialized = false;
  private notifications: any[] = [];
  private listeners: (() => void)[] = [];

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize() {
    if (this.initialized) {
      console.log('Ya inicializado');
      return;
    }

    try {
      console.log('Solicitando permisos...');
      const result = await PushNotifications.requestPermissions();

      if (result.receive !== 'granted') {
        console.warn('Permisos denegados');
        return;
      }

      console.log('Permisos otorgados');
      await PushNotifications.register();

      this.setupListeners();
      this.initialized = true;
    } catch (error) {
      console.error('Error al inicializar notificaciones push:', error);
    }
  }

  private setupListeners() {
    PushNotifications.addListener('registration', async (token) => {
      console.log('Token recibido:', token.value);
      await this.saveTokenToServer(token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error en el registro:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notificación recibida:', notification);

      const newNotification = {
        id: Date.now().toString(),
        title: notification.title || 'Notificación',
        body: notification.body || '',
        data: notification.data || {},
        read: false,
        date: new Date().toISOString(),
      };

      this.notifications.unshift(newNotification);
      this.notifyListeners();
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Acción en notificación:', notification);
    });
  }

  private async saveTokenToServer(token: string) {
    try {
      await authReady;
      const user = auth.currentUser;

      if (!user) {
        console.warn('Usuario no autenticado. Token no guardado.');
        return;
      }

      const platform = Capacitor.getPlatform();
      const payload = {
        token,
        userId: user.uid,
        deviceInfo: {
          platform,
          appVersion: '1.0.0',
        },
      };

      console.log('Enviando token al backend:', payload);

      const response = await fetch('http://10.0.2.2:3001/api/save-device-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Token guardado correctamente');
      } else {
        const errText = await response.text();
        console.error('Error al guardar token. Respuesta:', errText);
      }
    } catch (error) {
      console.error('Error en saveTokenToServer:', error);
    }
  }

  public getNotifications() {
    return this.notifications;
  }

  public getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  public markAsRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.notifyListeners();
    }
  }

  public markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  public deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  public clearAllNotifications() {
    this.notifications = [];
    this.notifyListeners();
  }

  public addListener(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }
}

export default PushNotificationService;