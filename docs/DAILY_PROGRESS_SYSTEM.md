# Sistema de Progreso Diario de Reciclaje

## 🎯 Descripción

Sistema completo para manejar el progreso diario de reciclaje del usuario con validación automática de fechas, actualización en Firebase y recompensas automáticas.

## 🚀 Características Implementadas

- ✅ **Validación automática de fecha** - Reinicia progreso cada día
- ✅ **Actualización en Firebase** - Sincronización en tiempo real
- ✅ **Recompensas automáticas** - 30 XP al completar meta diaria
- ✅ **Actualización de racha** - Incrementa streak diario
- ✅ **Modal de celebración** - Notificación automática al completar
- ✅ **Validación al entrar** - Verifica fecha al abrir la app
- ✅ **UI en tiempo real** - Muestra progreso actualizado

## 📊 Estructura de Datos en Firebase

### Colección: `users/{userId}/dailyProgress/progress`
```typescript
interface DailyProgress {
  currentDay: number;        // Objetos reciclados hoy
  lastRecycleDate: string;   // Fecha del último reciclaje (ISO)
  dailyStreak: number;       // Racha actual de días
  totalRecycled: number;     // Total de objetos reciclados
  targetDaily: number;       // Meta diaria (3 por defecto)
}
```

## 🔧 Servicios Implementados

### DailyProgressService
```typescript
class DailyProgressService {
  // Obtener progreso diario
  async getDailyProgress(userId: string): Promise<DailyProgress>
  
  // Validar y reiniciar si es nuevo día
  async validateAndResetDailyProgress(userId: string): Promise<DailyProgress>
  
  // Agregar reciclaje y verificar meta
  async addRecycling(userId: string): Promise<DailyProgress>
  
  // Obtener estadísticas
  async getDailyStats(userId: string): Promise<DailyStats>
}
```

## 🔄 Flujo Completo

### 1. Al Entrar a la App
```typescript
// Hook useDailyValidation
useEffect(() => {
  // Validar si es nuevo día
  await dailyProgressService.validateAndResetDailyProgress(user.uid);
}, [user?.uid]);
```

### 2. Al Reciclar (CameraScreen)
```typescript
// En saveImageToFirebase
await dailyProgressService.addRecycling(user.uid);
```

### 3. Validación Automática
- Compara fecha actual con `lastRecycleDate`
- Si es diferente día, reinicia `currentDay = 0`
- Actualiza `lastRecycleDate` con fecha actual

### 4. Al Completar Meta (3 objetos)
- Incrementa `dailyStreak + 1`
- Otorga 30 XP al usuario
- Muestra modal de celebración
- Actualiza Firebase

## 🎨 Componentes Actualizados

### TodayProgress.tsx
- **Datos en tiempo real** desde Firebase
- **Estadísticas adicionales** (racha, total)
- **Estados visuales** (vacío, progreso, completado)
- **Animaciones** de transición

### CameraScreen.tsx
- **Integración automática** con DailyProgressService
- **Actualización inmediata** al reciclar
- **Eliminación** de código legacy

### HomeScreen.tsx
- **Validación diaria** al entrar
- **Botón de prueba** para simular reciclaje
- **Compatibilidad** con sistema existente

## 📱 Interfaz de Usuario

### Estados del Progreso
1. **Vacío** - "¡Comienza tu día reciclando!"
2. **En Progreso** - "X más para mantener tu racha 🔥"
3. **Completado** - "¡Meta Diaria Completada! 🎉"

### Información Mostrada
- Progreso actual: `2/3`
- Barra de progreso animada
- Racha actual: `5 días`
- Total reciclado: `150 objetos`
- XP ganado: `+30 XP`

## 🎁 Recompensas Automáticas

### Al Completar Meta Diaria
- **+30 XP** otorgado automáticamente
- **Racha incrementada** en 1 día
- **Modal de celebración** con animación
- **Sonido y vibración** de confirmación

### Configuración del Modal
```typescript
{
  title: "🎉 ¡Meta Diaria Completada!",
  description: "¡Has reciclado 3 objetos hoy!\n\n+30 XP ganados\nRacha actual: X días",
  animation: celebration,
  sound: '/level-up.mp3',
  buttonText: '¡Continuar!',
  vibrate: true
}
```

## 🔧 Configuración

### Constantes del Sistema
```typescript
private readonly TARGET_DAILY = 3;    // Meta diaria
private readonly XP_REWARD = 30;      // XP por completar
```

### Personalización
- Cambiar `TARGET_DAILY` para meta diferente
- Modificar `XP_REWARD` para recompensa diferente
- Ajustar animaciones y sonidos en modal

## 🧪 Pruebas

### Botón de Simulación
```typescript
// En HomeScreen
<Button onClick={async () => {
  await dailyProgressService.addRecycling(user.uid);
}}>
  Simular Reciclaje (Progreso Diario)
</Button>
```

### Verificación en Consola
- Logs de validación diaria
- Confirmación de reciclaje agregado
- Estadísticas de progreso
- Errores de Firebase

## 🔄 Sincronización

### Firebase Firestore
- **Colección**: `users/{userId}/dailyProgress/progress`
- **Documento único**: Contiene todo el progreso
- **Actualizaciones atómicas**: Incrementos y resets
- **Transacciones**: Para operaciones complejas

### Tiempo Real
- **Validación automática** al entrar
- **Actualización inmediata** al reciclar
- **Sincronización** entre dispositivos
- **Persistencia** de datos

## 🐛 Solución de Problemas

### Error: "No such document"
- El documento se crea automáticamente en primer uso
- Verificar permisos de Firebase
- Comprobar conexión a internet

### Progreso no se actualiza
- Verificar que `user.uid` esté disponible
- Comprobar logs de consola
- Validar estructura de datos en Firebase

### Modal no aparece
- Verificar que EventManager esté configurado
- Comprobar que el evento se emita correctamente
- Revisar configuración de animaciones

## 🚀 Próximas Mejoras

- **Notificaciones push** al completar meta
- **Estadísticas semanales/mensuales**
- **Logros por rachas** (7 días, 30 días, etc.)
- **Competencia entre usuarios**
- **Historial detallado** de reciclaje

¡El sistema está completamente implementado y funcionando! 🎉 