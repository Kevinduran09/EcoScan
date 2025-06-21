import { eventBus, EVENTS } from '../utils/eventBus';
import celebration from '../animations/celebration.json';
import jedi from '../animations/jedi_leveluo.json';

// Tipos para la configuración del modal
interface ModalConfig {
  title?: string;
  description?: string;
  imageUrl?: string | null;
  animation?: object | null;
  sound?: string | null;
  vibrate?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export class AchievementService {
  
  /**
   * Desbloquear un badge con configuración personalizada
   */
  async unlockBadge(badgeName: string, badgeDescription: string, badgeImageUrl?: string) {
    // Lógica para desbloquear badge en la base de datos...
    console.log(`Desbloqueando badge: ${badgeName}`);
    
    // Configuración personalizada del modal
    const modalConfig: ModalConfig = {
      animation: celebration,
      sound: '/badge-unlocked.mp3',
      imageUrl: badgeImageUrl || `https://badges.com/${badgeName}.png`,
      buttonText: '¡Ver Badge!',
      vibrate: true,
      onButtonClick: () => {
        // Navegar a la página de badges
        console.log('Navegando a badges...');
        // window.location.href = '/badges';
      }
    };
    
    // Emitir evento con configuración personalizada
    eventBus.emit(EVENTS.BADGE_UNLOCKED, 
      { name: badgeName, description: badgeDescription },
      modalConfig
    );
  }

  /**
   * Subir nivel con configuración personalizada
   */
  async levelUp(newLevel: number, isSpecialLevel: boolean = false) {
    // Lógica para subir nivel en la base de datos...
    console.log(`Subiendo al nivel: ${newLevel}`);
    
    let modalConfig: ModalConfig = {};
    
    if (isSpecialLevel) {
      // Configuración especial para niveles importantes
      modalConfig = {
        title: `🎉 ¡Nivel ${newLevel} Especial Alcanzado!`,
        animation: jedi,
        sound: '/level-special.mp3',
        buttonText: '¡Continuar Aventura!',
        vibrate: true,
        onButtonClick: () => {
          console.log('Nivel especial confirmado');
        }
      };
    }
    
    // Emitir evento con configuración opcional
    eventBus.emit(EVENTS.LEVEL_UP, newLevel, modalConfig);
  }

  /**
   * Completar misión con configuración personalizada
   */
  async completeMission(missionTitle: string, xpReward: number, isSpecialMission: boolean = false) {
    // Lógica para completar misión en la base de datos...
    console.log(`Completando misión: ${missionTitle}`);
    
    let modalConfig: ModalConfig = {};
    
    if (isSpecialMission) {
      // Configuración especial para misiones importantes
      modalConfig = {
        title: '🌟 ¡Misión Especial Completada!',
        animation: celebration,
        sound: '/mission-special.mp3',
        buttonText: '¡Reclamar Recompensa!',
        vibrate: true,
        onButtonClick: () => {
          console.log('Recompensa especial reclamada');
        }
      };
    }
    
    // Emitir evento con configuración opcional
    eventBus.emit(EVENTS.MISSION_COMPLETED, 
      { title: missionTitle, xp: xpReward },
      modalConfig
    );
  }

  /**
   * Desbloquear logro especial con configuración única
   */
  async unlockSpecialAchievement(achievementName: string, achievementDescription: string) {
    console.log(`Desbloqueando logro especial: ${achievementName}`);
    
    const modalConfig: ModalConfig = {
      title: '🏆 ¡Logro Especial Desbloqueado!',
      description: `¡Has conseguido: ${achievementName}!`,
      animation: jedi,
      sound: '/achievement-special.mp3',
      imageUrl: 'https://achievements.com/special.png',
      buttonText: '¡Compartir Logro!',
      vibrate: true,
      onButtonClick: () => {
        console.log('Compartiendo logro especial...');
        // Lógica para compartir en redes sociales
      }
    };
    
    eventBus.emit(EVENTS.BADGE_UNLOCKED, 
      { name: achievementName, description: achievementDescription },
      modalConfig
    );
  }
}

// Instancia singleton del servicio
export const achievementService = new AchievementService(); 