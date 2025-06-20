import { doc, getDoc, updateDoc, increment, serverTimestamp, FieldValue } from 'firebase/firestore';
import { db } from '../core/firebaseConfig';
import { Mission } from '../types/Mission';

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalPoints: number;
  totalRecycled: number;
  dailyMissionStreak: number;
  achievements: string[];
  medals: string[];
  lastSeen: FieldValue;
}

export class UserStatsService {
  /**
   * Obtiene las estadísticas actuales del usuario
   */
  static async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserStats;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del usuario:', error);
      return null;
    }
  }

  /**
   * Añade experiencia al usuario y maneja el aumento de nivel
   */
  static async addExperience(userId: string, xpToAdd: number): Promise<{ newLevel: number; leveledUp: boolean; totalXp: number }> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userSnap.data() as UserStats;
      const newXp = userData.xp + xpToAdd;
      let newLevel = userData.level;
      let leveledUp = false;

      // Calcular XP necesario para el siguiente nivel
      const xpForNextLevel = this.calculateXpForLevel(newLevel + 1);

      // Verificar si subió de nivel
      if (newXp >= xpForNextLevel) {
        newLevel++;
        leveledUp = true;
        console.log(`🎉 ¡Nivel subido! Nuevo nivel: ${newLevel}`);
      }

      // Actualizar en Firebase
      await updateDoc(userRef, {
        xp: newXp,
        level: newLevel,
        xpToNextLevel: this.calculateXpForLevel(newLevel + 1),
        totalPoints: increment(xpToAdd),
        lastSeen: serverTimestamp()
      });

      return {
        newLevel,
        leveledUp,
        totalXp: newXp
      };

    } catch (error) {
      console.error('❌ Error añadiendo experiencia:', error);
      throw error;
    }
  }

  /**
   * Actualiza las estadísticas cuando se completa una misión
   */
  static async onMissionCompleted(userId: string, mission: Mission): Promise<void> {
    try {
      // Añadir experiencia de la misión
      const result = await this.addExperience(userId, mission.xp);
      
      // Actualizar contador de reciclajes si es una misión de reciclaje
      if (mission.type === 'material_recycle' || mission.type === 'count_recycle') {
        await this.incrementRecycledCount(userId);
      }

      // // Actualizar racha de misiones diarias
      // await this.updateMissionStreak(userId);

      console.log(`✅ Misión completada: +${mission.xp} XP`);
      
      if (result.leveledUp) {
        console.log(`🎉 ¡Nivel subido a ${result.newLevel}!`);
      }

    } catch (error) {
      console.error('❌ Error procesando misión completada:', error);
      throw error;
    }
  }

  /**
   * Incrementa el contador total de reciclajes
   */
  static async incrementRecycledCount(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalRecycled: increment(1),
        lastSeen: serverTimestamp()
      });
    } catch (error) {
      console.error('❌ Error incrementando contador de reciclajes:', error);
    }
  }

  /**
   * Actualiza la racha de misiones diarias
   */
  static async updateMissionStreak(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        // Por ahora, simplemente incrementamos la racha
        // En una implementación más compleja, verificaríamos la fecha del último día
        await updateDoc(userRef, {
          dailyMissionStreak: increment(1),
          lastSeen: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('❌ Error actualizando racha de misiones:', error);
    }
  }

  /**
   * Calcula la experiencia necesaria para alcanzar un nivel específico
   * Fórmula: XP = nivel * 100 + (nivel - 1) * 50
   */
  private static calculateXpForLevel(level: number): number {
    return level * 100 + (level - 1) * 50;
  }

  /**
   * Obtiene el progreso de XP para el nivel actual (0-100%)
   */
  static calculateXpProgress(currentXp: number, currentLevel: number): number {
    const xpForCurrentLevel = this.calculateXpForLevel(currentLevel);
    const xpForNextLevel = this.calculateXpForLevel(currentLevel + 1);
    const xpInCurrentLevel = currentXp - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    
    return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));
  }

  /**
   * Verifica y otorga logros basados en las estadísticas del usuario
   */
  static async checkAndAwardAchievements(userId: string): Promise<string[]> {
    try {
      const userStats = await this.getUserStats(userId);
      if (!userStats) return [];

      const newAchievements: string[] = [];
      const currentAchievements = userStats.achievements || [];

      // Logros basados en nivel
      if (userStats.level >= 5 && !currentAchievements.includes('level_5')) {
        newAchievements.push('level_5');
      }
      if (userStats.level >= 10 && !currentAchievements.includes('level_10')) {
        newAchievements.push('level_10');
      }

      // Logros basados en reciclaje total
      if (userStats.totalRecycled >= 10 && !currentAchievements.includes('recycler_10')) {
        newAchievements.push('recycler_10');
      }
      if (userStats.totalRecycled >= 50 && !currentAchievements.includes('recycler_50')) {
        newAchievements.push('recycler_50');
      }

      // Logros basados en racha
      if (userStats.dailyMissionStreak >= 3 && !currentAchievements.includes('streak_3')) {
        newAchievements.push('streak_3');
      }
      if (userStats.dailyMissionStreak >= 7 && !currentAchievements.includes('streak_7')) {
        newAchievements.push('streak_7');
      }

      // Si hay nuevos logros, actualizar en Firebase
      if (newAchievements.length > 0) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          achievements: [...currentAchievements, ...newAchievements],
          lastSeen: serverTimestamp()
        });

        console.log(`🏆 Nuevos logros desbloqueados: ${newAchievements.join(', ')}`);
      }

      return newAchievements;

    } catch (error) {
      console.error('❌ Error verificando logros:', error);
      return [];
    }
  }
} 