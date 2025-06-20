# Aplicación Móvil de Clasificación de Imágenes con IA

## Descripción del Proyecto
Aplicación móvil desarrollada con Ionic/Vue que permite a los usuarios capturar imágenes, clasificarlas mediante IA y mantener un perfil gamificado. La aplicación utiliza Firebase como backend para autenticación, almacenamiento y notificaciones.

## Requisitos del Sistema
- Node.js y npm
- Ionic CLI
- Android Studio (para builds nativos)
- Firebase CLI
- Vue.js DevTools (recomendado)

## Configuración del Proyecto

### Instalación
```bash
# Instalar dependencias
npm install

# Servir la aplicación en desarrollo
ionic serve

# Compilar para Android
ionic capacitor build android
```

### Estructura del Proyecto
- `/src` - Código fuente principal
- `/android` - Proyecto nativo de Android
- `/public` - Archivos estáticos
- `/resources` - Recursos de la aplicación (iconos, splash screens)

## Estado del Desarrollo

### Prioridad Alta ⭐
1. ✅ Captura de Imágenes con Cámara (COMPLETADO)
2. 🔄 Autenticación Firebase
   - Email/Password
   - Google Sign-in
   - Facebook Sign-in
3. 🔄 Gestión de Usuario
   - Creación de cuenta
   - Modificación de información
   - Eliminación de cuenta
4. 🔄 Firebase Storage
   - Almacenamiento de imágenes
   - Asociación de imágenes con usuarios
5. 🔄 Clasificación de Imágenes
   - Integración con IA
   - Almacenamiento de metadata en Firebase
6. 🔄 Notificaciones Push
   - Configuración de Firebase Cloud Messaging

### Prioridad Baja 📝
- Sistema de Gamificación
  - Estadísticas de usuario
    * Nivel
    * XP actual
    * XP requerida para siguiente nivel
  - Sistema de logros y medallas
  - Títulos de usuario
  - Sistema de puntuación

## Distribución de Módulos

### 1. Módulo de Autenticación
- Implementación de Firebase Auth
- Integración de proveedores (Email, Google, Facebook)
- Manejo de estados de autenticación

### 2. Módulo de Gestión de Usuario
- CRUD de perfiles de usuario
- Gestión de información personal
- Manejo de preferencias

### 3. Módulo de Storage y Manejo de Imágenes
- Subida de imágenes a Firebase Storage
- Asociación de imágenes con usuarios
- Gestión de metadata

### 4. Módulo de Notificaciones
- Configuración de FCM
- Manejo de tokens
- Gestión de permisos

### 5. Módulo de Gamificación
- Sistema de niveles y experiencia
- Gestión de logros y medallas
- Sistema de títulos

## Convenciones de Desarrollo

### Commits
Formato: `tipo(alcance): descripción`

Tipos:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formateo
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Tareas de mantenimiento

### Branching Strategy
- `main`: Rama principal de producción
- `develop`: Rama de desarrollo
- `feature/*`: Nuevas características
- `fix/*`: Correcciones
- `release/*`: Preparación de releases

### Estándares de Código
- Usar ESLint y Prettier configurados
- Seguir la guía de estilo de Vue.js
- Mantener componentes pequeños y reutilizables
- Documentar funciones y componentes principales

## Contribución
1. Crear branch desde `develop`
2. Implementar cambios siguiendo estándares
3. Crear Pull Request hacia `develop`
4. Esperar revisión de código

## TODO

- [ ] Agregar push notification con server que notifique todos los días a todos los usuarios que hay que reciclar
- [ ] Estadísticas Comunitarias: Visualización (anonimizada) del impacto colectivo (ej: total reciclado por la comunidad)
- [ ] Gamificación (Logros/Insignias): Sistema de badges desbloqueables por hitos de reciclaje

