declare module '@capacitor/push-notifications' {
  export interface PushNotificationSchema {
    title?: string;
    body?: string;
    id?: string;
    badge?: number;
    notification?: any;
    data?: any;
    click_action?: string;
    link?: string;
    actionId?: string;
  }

  export interface PushNotificationActionPerformed {
    actionId: string;
    inputValue?: string;
    notification: PushNotificationSchema;
  }

  export interface PushNotificationToken {
    value: string;
  }

  export interface PushNotificationDeliveredList {
    notifications: PushNotificationSchema[];
  }

  export interface PushNotificationChannel {
    id: string;
    name: string;
    description?: string;
    sound?: string;
    importance: 1 | 2 | 3 | 4 | 5;
    visibility?: 0 | 1 | -1;
    lights?: boolean;
    lightColor?: string;
    vibration?: boolean;
    vibrationPattern?: number[];
  }

  export interface PushNotificationPermissions {
    receive: 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale';
  }

  export interface PushNotificationsPlugin {
    addListener(
      eventName: 'registration',
      listenerFunc: (token: PushNotificationToken) => void,
    ): void;
    addListener(
      eventName: 'registrationError',
      listenerFunc: (error: any) => void,
    ): void;
    addListener(
      eventName: 'pushNotificationReceived',
      listenerFunc: (notification: PushNotificationSchema) => void,
    ): void;
    addListener(
      eventName: 'pushNotificationActionPerformed',
      listenerFunc: (notification: PushNotificationActionPerformed) => void,
    ): void;
    removeAllListeners(): void;
    checkPermissions(): Promise<PushNotificationPermissions>;
    requestPermissions(): Promise<PushNotificationPermissions>;
    register(): Promise<void>;
    unregister(): Promise<void>;
    getDeliveredNotifications(): Promise<PushNotificationDeliveredList>;
    removeDeliveredNotifications(delivered: PushNotificationDeliveredList): Promise<void>;
    removeAllDeliveredNotifications(): Promise<void>;
    createChannel(channel: PushNotificationChannel): Promise<void>;
    deleteChannel(id: string): Promise<void>;
    listChannels(): Promise<{ channels: PushNotificationChannel[] }>;
  }

  export const PushNotifications: PushNotificationsPlugin;
} 