import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.proyecto1.una',
  appName: 'proyecto1-una',
  webDir: 'dist',
  bundledWebRuntime: false,
    server: {
    cleartext: true,
    androidScheme: 'http',

  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: [
        "google.com"
      ]
    },
    Camera: {
      Permissions: ['camera', 'photos'],
      android: {
        useCamera2Api: true, // Utilizar la API de cámara 2 en Android
        enableFlash: true, // Habilitar el flash en Android
      },
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
      android: {
        icon: "ic_notification",
        iconColor: "#4CAF50",
        sound: "default",
        vibrate: true,
        channelId: "recycling-reminders",
        channelName: "Recordatorios de Reciclaje",
        channelDescription: "Notificaciones para recordar reciclar",
        channelImportance: 4,
        visibility: 1,
        lights: true,
        lightColor: "#4CAF50",
        vibrationPattern: [0, 250, 250, 250],
      },
      ios: {
        badge: true,
        sound: "default",
        alert: true,
        critical: false,
        category: "RECYCLING_REMINDER",
      },
    },
  }
};

export default config;
