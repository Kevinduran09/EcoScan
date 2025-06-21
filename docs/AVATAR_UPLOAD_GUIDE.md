# Guía de Subida de Avatares

## Descripción

Esta funcionalidad permite a los usuarios cambiar su foto de perfil seleccionando una imagen de la galería o tomando una nueva foto con la cámara del dispositivo.

## Características

- ✅ Selección de imagen desde galería
- ✅ Captura de foto con cámara
- ✅ Subida automática a Firebase Storage
- ✅ Actualización del perfil en Firestore
- ✅ Interfaz de usuario intuitiva con indicadores visuales
- ✅ Manejo de permisos automático
- ✅ Estados de carga y error

## Componentes

### AvatarService

Servicio principal que maneja toda la lógica de selección y subida de avatares.

```typescript
import { AvatarService } from '../services/firebase/AvatarService';

// Cambiar avatar completo
const newAvatarUrl = await AvatarService.changeUserAvatar(userId);

// Solo seleccionar imagen
const imageDataUrl = await AvatarService.selectAvatarImage();

// Solo subir imagen
const avatarUrl = await AvatarService.uploadAvatarImage(userId, imageDataUrl);

// Solo actualizar perfil
await AvatarService.updateUserAvatar(userId, avatarUrl);
```

### Componente Avatar

Componente actualizado que soporta la funcionalidad de edición.

```tsx
// Avatar no editable (comportamiento por defecto)
<Avatar size={56} url={userData?.avatar} />

// Avatar editable
<Avatar 
  size={120} 
  url={userData?.avatar} 
  editable={true}
  onAvatarChange={(newUrl) => console.log('Avatar cambiado:', newUrl)}
/>
```

## Uso Básico

### 1. En ProfileScreen

El avatar ya está configurado como editable en la pantalla de perfil:

```tsx
<Avatar url={userData?.avatar} size={120} editable={true} />
```

### 2. En otros componentes

Para hacer editable un avatar en cualquier otro lugar:

```tsx
<Avatar 
  url={userData?.avatar} 
  size={80} 
  editable={true}
  onAvatarChange={(newUrl) => {
    // Manejar el cambio de avatar
    console.log('Nuevo avatar:', newUrl);
  }}
/>
```

## Eventos

El sistema emite eventos cuando se cambia el avatar:

```typescript
import { eventBus, EVENTS } from '../utils/eventBus';

// Escuchar cambios de avatar
eventBus.on(EVENTS.AVATAR_CHANGED, (data) => {
  console.log('Avatar cambiado:', data.newAvatarUrl);
});

// Escuchar actualizaciones de estadísticas del usuario
eventBus.on(EVENTS.USER_STATS_UPDATED, (data) => {
  console.log('Estadísticas actualizadas para usuario:', data.userId);
});
```

## Permisos

El sistema maneja automáticamente los permisos de cámara:

- Verifica permisos antes de abrir la cámara
- Solicita permisos si no están otorgados
- Maneja casos donde los permisos son denegados

## Configuración

### Capacitor Config

La configuración ya está incluida en `capacitor.config.ts`:

```typescript
plugins: {
  Camera: {
    Permissions: ['camera', 'photos'],
    android: {
      useCamera2Api: true,
      enableFlash: true,
    },
  },
}
```

### Android Permissions

Los permisos necesarios ya están en `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Estructura de Archivos

```
src/
├── services/
│   └── firebase/
│       └── AvatarService.ts          # Servicio principal
├── components/
│   └── Avatar.tsx                    # Componente actualizado
└── utils/
    └── eventBus.ts                   # Eventos del sistema
```

## Flujo de Funcionamiento

1. **Usuario hace clic en avatar editable**
2. **Sistema verifica permisos de cámara**
3. **Se abre selector de imagen (cámara/galería)**
4. **Usuario selecciona o toma foto**
5. **Imagen se sube a Firebase Storage**
6. **URL se actualiza en perfil del usuario**
7. **Se emiten eventos de actualización**
8. **Interfaz se actualiza automáticamente**

## Manejo de Errores

El sistema incluye manejo robusto de errores:

- Permisos denegados
- Errores de red
- Errores de Firebase
- Cancelación de selección
- Imágenes inválidas

## Personalización

### Cambiar calidad de imagen

```typescript
// En AvatarService.selectAvatarImage()
const image = await Camera.getPhoto({
  quality: 90, // Cambiar calidad (1-100)
  allowEditing: true,
  resultType: CameraResultType.DataUrl,
  source: CameraSource.Prompt,
  width: 400,
  height: 400
});
```

### Cambiar tamaño de imagen

```typescript
// En AvatarService.selectAvatarImage()
const image = await Camera.getPhoto({
  quality: 80,
  allowEditing: true,
  resultType: CameraResultType.DataUrl,
  source: CameraSource.Prompt,
  width: 800,  // Cambiar ancho
  height: 800  // Cambiar alto
});
```

### Cambiar ruta de almacenamiento

```typescript
// En AvatarService.uploadAvatarImage()
const storageRef = ref(storage, `custom-path/${userId}/avatar-${timestamp}.jpg`);
```

## Consideraciones

- La funcionalidad solo funciona en dispositivos nativos (Android/iOS)
- Se requiere conexión a internet para subir imágenes
- Las imágenes se comprimen automáticamente para optimizar el almacenamiento
- El sistema mantiene un historial de avatares por usuario 