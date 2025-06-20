# Sistema de Misiones y Estadísticas

## Descripción General

El sistema de misiones y estadísticas conecta el proceso de reciclaje con la gamificación de la aplicación. Cuando un usuario escanea y guarda una imagen de un residuo, el sistema:

1. **Valida la imagen** usando IA para identificar el tipo de residuo
2. **Actualiza el progreso** de las misiones diarias relevantes
3. **Completa misiones** cuando se alcanza el objetivo
4. **Otorga experiencia** y actualiza estadísticas del usuario
5. **Verifica logros** y muestra notificaciones

## Componentes Principales

### 1. CameraService
- **Ubicación**: `src/services/firebase/CameraService.ts`
- **Responsabilidad**: Maneja el guardado de imágenes y actualización de misiones
- **Método clave**: `updateMissionsProgress()`

```typescript
private async updateMissionsProgress(userId: string, tipo: string): Promise<void>
```

### 2. DailyMissionsService
- **Ubicación**: `src/services/DailyMissionsService.ts`
- **Responsabilidad**: Gestiona las misiones diarias del usuario
- **Métodos principales**:
  - `getTodayMissions()`: Obtiene misiones del día
  - `updateMissionProgress()`: Actualiza progreso
  - `completeMission()`: Marca misión como completada

### 3. UserStatsService
- **Ubicación**: `src/services/UserStatsService.ts`
- **Responsabilidad**: Maneja estadísticas, experiencia y logros
- **Métodos principales**:
  - `addExperience()`: Añade XP y maneja subida de nivel
  - `onMissionCompleted()`: Procesa misión completada
  - `checkAndAwardAchievements()`: Verifica y otorga logros

## Flujo de Funcionamiento

### 1. Escaneo de Imagen
```
Usuario toma foto → IA analiza → Identifica tipo de residuo
```

### 2. Guardado y Validación
```
saveRecycleRecord() → updateMissionsProgress() → Verifica misiones relevantes
```

### 3. Actualización de Progreso
```
Para cada misión relevante:
- Si tipo coincide → Incrementa progreso
- Si alcanza objetivo → Marca como completada
```

### 4. Procesamiento de Completado
```
completeMission() → UserStatsService.onMissionCompleted() → 
- Añade XP
- Actualiza contador de reciclajes
- Actualiza racha de misiones
- Verifica logros
```

### 5. Notificaciones
```
checkAndAwardAchievements() → Muestra notificación si hay logros nuevos
```

## Tipos de Misiones

### 1. Material Recycle (`material_recycle`)
- **Objetivo**: Reciclar X cantidad de un material específico
- **Ejemplo**: "Recicla 5 objetos de plástico"
- **Activación**: Cuando se recicla el material especificado

### 2. Count Recycle (`count_recycle`)
- **Objetivo**: Reciclar X cantidad de cualquier residuo
- **Ejemplo**: "Recicla 10 objetos en total"
- **Activación**: Con cualquier reciclaje

### 3. Item Category (`item_category`)
- **Objetivo**: Reciclar X cantidad de un item específico de una categoría
- **Ejemplo**: "Recicla 3 botellas de plástico"
- **Activación**: Cuando se recicla el item específico

## Sistema de Experiencia

### Fórmula de XP por Nivel
```
XP necesario = nivel * 100 + (nivel - 1) * 50
```

### Ejemplos:
- Nivel 1 → 2: 150 XP
- Nivel 2 → 3: 250 XP
- Nivel 3 → 4: 350 XP

### XP por Misión
- Misiones básicas: 10-25 XP
- Misiones intermedias: 25-50 XP
- Misiones avanzadas: 50-100 XP

## Logros Disponibles

### Basados en Nivel
- `level_5`: Alcanzar nivel 5
- `level_10`: Alcanzar nivel 10

### Basados en Reciclaje
- `recycler_10`: Reciclar 10 objetos
- `recycler_50`: Reciclar 50 objetos

### Basados en Racha
- `streak_3`: 3 días consecutivos
- `streak_7`: 7 días consecutivos

## Notificaciones

### Tipos de Notificación
1. **Misión Completada**: Verde, icono de check
2. **Subida de Nivel**: Amarillo, icono de estrella
3. **Logro Desbloqueado**: Azul, icono de trofeo

### Componente
- **Ubicación**: `src/components/MissionNotification.tsx`
- **Hook**: `src/hooks/useMissionNotifications.ts`

## Persistencia de Datos

### Firebase Collections
- `users/{userId}/dailyMissions/{date}`: Misiones diarias
- `users/{userId}/recycle_history`: Historial de reciclajes
- `users/{userId}/recycleProgress/progress`: Progreso por material
- `users/{userId}`: Perfil y estadísticas del usuario

### Local Storage
- Misiones diarias como respaldo
- Datos de reciclaje offline
- Caché de estadísticas

## Manejo de Errores

### Estrategia de Fallback
1. **Firebase falla** → Usar datos locales
2. **Sin conexión** → Guardar localmente
3. **Sincronización** → Cuando hay conexión

### Logs
- ✅ Éxito
- ⚠️ Advertencia (fallback)
- ❌ Error
- 🎉 Misión completada
- 📈 Progreso actualizado
- 🏆 Logro **desbloqueado**

## Configuración

### Variables de Entorno
- `MISSION_COUNT`: Número de misiones diarias (default: 5)
- `XP_MULTIPLIER`: Multiplicador de experiencia
- `ACHIEVEMENT_THRESHOLDS`: Umbrales para logros

### Personalización
- Fórmulas de XP en `UserStatsService`
- Tipos de misiones en `Mission.ts`
- Logros en `checkAndAwardAchievements()` 