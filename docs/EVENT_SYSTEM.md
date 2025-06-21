# Sistema de Eventos Unificado

## 🎯 Descripción

El sistema de eventos unificado permite mostrar modales personalizados desde cualquier parte de la aplicación (componentes o servicios) usando el `eventBus` y configuración personalizada.

## 🚀 Características

- **Un solo modal** para todos los tipos de eventos
- **Configuración personalizable** desde servicios y componentes
- **Compatibilidad hacia atrás** con componentes existentes
- **Animaciones, sonidos y vibración** configurables
- **Eventos automáticos** con valores por defecto

## 📋 Tipos de Eventos Disponibles

```typescript
export const EVENTS = {
  LEVEL_UP: 'level_up',
  BADGE_UNLOCKED: 'badge_unlocked', 
  MISSION_COMPLETED: 'mission_completed'
} as const;
```

## 🎨 Configuración del Modal

```typescript
interface ModalProps {
  title?: string;           // Título del modal
  description?: string;     // Descripción
  imageUrl?: string | null; // URL de imagen
  animation?: object | null; // Objeto de animación Lottie
  sound?: string | null;    // Ruta del archivo de sonido
  vibrate?: boolean;        // Activar vibración
  buttonText?: string;      // Texto del botón
  onButtonClick?: () => void; // Función al hacer clic
  children?: React.ReactNode; // Contenido personalizado
}
```

## 🔧 Uso desde Componentes

### Hook useEventManager
```typescript
import { useEventManager } from '../components/EventManager';

const MiComponente = () => {
  const { openModal, emitLevelUp, emitBadgeUnlocked, emitMissionCompleted } = useEventManager();

  // Modal directo
  const mostrarModal = () => {
    openModal({
      title: '¡Felicidades!',
      description: 'Has completado una tarea',
      animation: celebration,
      sound: '/success.mp3',
      vibrate: true,
      buttonText: '¡Continuar!'
    });
  };

  // Evento con configuración personalizada
  const subirNivel = () => {
    emitLevelUp(5, {
      animation: jedi,
      sound: '/level-special.mp3',
      buttonText: '¡Aceptar!'
    });
  };

  return (
    <button onClick={subirNivel}>Subir Nivel</button>
  );
};
```

### Hook useEventEmitter (legacy)
```typescript
import { useEventEmitter } from '../components/EventManager';

const MiComponente = () => {
  const { emitLevelUp } = useEventEmitter();
  
  // Sin configuración (usa valores por defecto)
  emitLevelUp(5);
  
  // Con configuración personalizada
  emitLevelUp(5, {
    title: '¡Nivel Especial!',
    animation: celebration
  });
};
```

## 🏢 Uso desde Servicios

### Importar eventBus
```typescript
import { eventBus, EVENTS } from '../utils/eventBus';

class MiServicio {
  async completarTarea() {
    // Lógica del servicio...
    
    // Emitir evento con configuración personalizada
    eventBus.emit(EVENTS.MISSION_COMPLETED, 
      { title: "Tarea completada", xp: 50 },
      {
        animation: celebration,
        sound: '/task-completed.mp3',
        buttonText: '¡Continuar!'
      }
    );
  }
}
```

### Usar AchievementService
```typescript
import { achievementService } from '../services/AchievementService';

// Desbloquear badge con imagen personalizada
await achievementService.unlockBadge(
  "Reciclador Experto",
  "Has reciclado 100 objetos",
  "https://badges.com/experto.png"
);

// Subir nivel especial
await achievementService.levelUp(10, true);

// Completar misión especial
await achievementService.completeMission(
  "Misión Diaria",
  100,
  true
);
```

## 🎭 Animaciones Disponibles

```typescript
import jedi from '../animations/jedi_leveluo.json';
import celebration from '../animations/celebration.json';
import level1 from '../animations/level-1.json';
import level3 from '../animations/level-3.json';
```

## 🔊 Sonidos Disponibles

```typescript
// Archivos en /public/
'/level-up.mp3'
'/badge-unlocked.mp3'
'/mission-completed.mp3'
'/achievement-special.mp3'
```

## 📱 Ejemplos de Uso

### 1. Badge con Imagen Personalizada
```typescript
eventBus.emit(EVENTS.BADGE_UNLOCKED, 
  { name: "Reciclador", description: "Primer reciclaje" },
  {
    imageUrl: "https://badges.com/reciclador.png",
    animation: celebration,
    sound: '/badge-unlocked.mp3',
    buttonText: '¡Ver Badge!'
  }
);
```

### 2. Nivel Especial
```typescript
eventBus.emit(EVENTS.LEVEL_UP, 
  10,
  {
    title: "¡Nivel 10 Especial!",
    animation: jedi,
    sound: '/level-special.mp3',
    buttonText: '¡Continuar Aventura!'
  }
);
```

### 3. Misión con Acción Personalizada
```typescript
eventBus.emit(EVENTS.MISSION_COMPLETED, 
  { title: "Misión Diaria", xp: 100 },
  {
    animation: celebration,
    sound: '/mission-completed.mp3',
    buttonText: '¡Reclamar Recompensa!',
    onButtonClick: () => {
      // Navegar a la página de recompensas
      window.location.href = '/rewards';
    }
  }
);
```

## 🔄 Flujo de Eventos

1. **Servicio/Componente** emite evento con `eventBus.emit()`
2. **EventManager** escucha el evento y recibe configuración
3. **EventManager** combina configuración por defecto + personalizada
4. **CustomModal** se muestra con la configuración final
5. **Usuario** interactúa con el modal
6. **Modal** se cierra y ejecuta `onButtonClick` si está definido

## ⚡ Ventajas

- **Flexibilidad total** - Personalización completa desde cualquier parte
- **Consistencia** - Misma experiencia de usuario en toda la app
- **Mantenibilidad** - Un solo lugar para cambios en modales
- **Escalabilidad** - Fácil agregar nuevos tipos de eventos
- **Performance** - Un solo modal en memoria

## 🐛 Solución de Problemas

### Error: "Type 'badge_unlocked' is not assignable"
- Verificar que el evento esté definido en `EVENTS`
- Asegurar que el tipo del evento coincida

### Modal no se muestra
- Verificar que el componente esté envuelto en `EventManager`
- Comprobar que el evento se esté emitiendo correctamente
- Revisar la consola para errores de JavaScript

### Animación no funciona
- Verificar que el archivo JSON de animación esté importado
- Comprobar que el objeto de animación sea válido
- Asegurar que Lottie esté instalado correctamente 