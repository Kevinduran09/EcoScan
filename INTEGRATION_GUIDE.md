# Guía de Integración - Notificaciones Push

Esta guía explica cómo integrar el sistema de notificaciones push en el proyecto de reciclaje móvil.

## 📋 Resumen del Sistema

El sistema de notificaciones push consta de dos partes principales:

1. **Servidor Backend** (`proyecto-movles-backend/`) - Maneja el envío de notificaciones
2. **Cliente Móvil** (`proyecto-movles/`) - Recibe y muestra las notificaciones

## 🚀 Configuración del Servidor Backend

### 1. Instalación

```bash
cd proyecto-movles-backend

# En Windows
install.bat

# En Linux/Mac
chmod +x install.sh
./install.sh
```

### 2. Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** > **Cuentas de servicio**
4. Haz clic en **Generar nueva clave privada**
5. Guarda el archivo como `serviceAccountKey.json` en la raíz del servidor

### 3. Iniciar el Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3001`

## 📱 Integración en la App Móvil

### 1. Servicio de Notificaciones

El servicio `PushNotificationService.ts` ya está creado y maneja:

- Solicitud de permisos
- Registro del dispositivo
- Almacenamiento local de notificaciones
- Comunicación con el servidor

### 2. Hook Personalizado

El hook `usePushNotifications.ts` proporciona:

- Estado de inicialización
- Contador de notificaciones no leídas
- Lista de notificaciones
- Métodos para gestionar notificaciones

### 3. Componente de Notificaciones

El componente `NotificationCenter.tsx` incluye:

- Lista de notificaciones con swipe actions
- Marcado como leído/no leído
- Eliminación de notificaciones
- Pull-to-refresh
- Indicadores visuales

## 🔧 Integración en la App Principal

### 1. Inicializar Notificaciones

En tu componente principal (ej: `App.tsx` o `TabLayout.tsx`):

```typescript
import { usePushNotifications } from './hooks/usePushNotifications';

const App: React.FC = () => {
  const { isInitialized, unreadCount } = usePushNotifications();

  // El hook se encarga de la inicialización automática
  return (
    // ... tu código existente
  );
};
```

### 2. Agregar Ruta de Notificaciones

En tu sistema de rutas:

```typescript
import NotificationCenter from './components/NotificationCenter';

// En tus rutas
<Route path="/notifications" component={NotificationCenter} />
```

### 3. Agregar Indicador de Notificaciones

En tu barra de navegación o tab bar:

```typescript
import { notificationsOutline } from 'ionicons/icons';
import { usePushNotifications } from './hooks/usePushNotifications';

const TabBar: React.FC = () => {
  const { unreadCount } = usePushNotifications();

  return (
    <IonTabBar>
      {/* ... otros tabs */}
      <IonTabButton tab="notifications" href="/notifications">
        <IonIcon icon={notificationsOutline} />
        <IonLabel>Notificaciones</IonLabel>
        {unreadCount > 0 && (
          <IonBadge color="danger">{unreadCount}</IonBadge>
        )}
      </IonTabButton>
    </IonTabBar>
  );
};
```

## 📨 Endpoints del Servidor

### Configuración
- `POST /api/configure-firebase` - Configurar credenciales
- `GET /api/firebase-status` - Estado de Firebase

### Tokens
- `POST /api/save-device-token` - Guardar token de dispositivo
- `GET /api/token-stats` - Estadísticas de tokens

### Notificaciones
- `POST /api/send-notification` - Enviar notificación individual
- `POST /api/send-notification-to-all` - Enviar a todos los usuarios
- `POST /api/send-daily-reminder` - Enviar recordatorio diario

## 🔄 Recordatorios Diarios

El servidor está configurado para enviar recordatorios automáticos:

- **Hora**: 9:00 AM (configurable)
- **Zona horaria**: America/Mexico_City (configurable)
- **Mensaje**: "¡Es hora de reciclar! 🌱"

### Personalizar Recordatorios

Edita el archivo `server.js` en la función cron:

```javascript
cron.schedule('0 9 * * *', async () => {
  // Personaliza el título y mensaje aquí
  const title = "¡Es hora de reciclar! 🌱";
  const body = "No olvides reciclar hoy. Cada pequeño gesto cuenta para cuidar nuestro planeta.";
  // ...
}, {
  timezone: "America/Mexico_City" // Cambia la zona horaria
});
```

## 🧪 Pruebas

### 1. Probar el Servidor

```bash
# Verificar estado
curl http://localhost:3001/api/firebase-status

# Enviar notificación de prueba
curl -X POST http://localhost:3001/api/send-daily-reminder
```

### 2. Probar en la App

1. Inicia la app móvil
2. Verifica que se soliciten permisos de notificaciones
3. Revisa la consola para ver el token generado
4. Verifica que el token se guarde en el servidor
5. Envía una notificación de prueba desde el servidor

## 🔧 Solución de Problemas

### Firebase no se inicializa
- Verifica que `serviceAccountKey.json` existe y es válido
- Revisa los logs del servidor
- Asegúrate de que las credenciales sean correctas

### Notificaciones no llegan
- Verifica que los permisos estén concedidos
- Revisa que el token se guarde correctamente
- Verifica la configuración de Firebase en la app

### Recordatorios diarios no funcionan
- Verifica que el servidor esté corriendo
- Revisa la zona horaria configurada
- Verifica los logs del servidor

## 📚 Archivos Importantes

### Servidor Backend
- `server.js` - Servidor principal
- `package.json` - Dependencias
- `README.md` - Documentación completa

### App Móvil
- `src/services/PushNotificationService.ts` - Servicio principal
- `src/hooks/usePushNotifications.ts` - Hook personalizado
- `src/components/NotificationCenter.tsx` - Componente de UI
- `src/types/push-notifications.d.ts` - Tipos TypeScript

## 🎯 Próximos Pasos

1. **Configurar Firebase** en el servidor
2. **Integrar el hook** en la app principal
3. **Agregar la ruta** de notificaciones
4. **Probar el sistema** completo
5. **Personalizar** mensajes y horarios según necesidades

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs del servidor y la app
2. Verifica la configuración de Firebase
3. Asegúrate de que todas las dependencias estén instaladas
4. Consulta la documentación de Firebase y Capacitor 