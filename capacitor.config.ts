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
  }
};

export default config;
