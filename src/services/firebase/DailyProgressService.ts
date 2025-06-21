import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../core/firebaseConfig';
import { eventBus, EVENTS } from '../../utils/eventBus';
import celebration from '../../animations/celebration.json';

export interface DailyProgress {
  currentProgress: number;
  lastRecycleDate: string; // ISO string
  dailyStreak: number;
  totalRecycled: number;
  targetDaily: number;
}

export class DailyProgressService {
  private readonly TARGET_DAILY = 3;
  private readonly XP_REWARD = 30;

  /**
   * Obtener el progreso diario del usuario
   */
  async getDailyProgress(userId: string): Promise<DailyProgress> {
    try {
      const progressDocRef = doc(db, 'users', userId, 'dailyProgress', 'progress');
      const docSnap = await getDoc(progressDocRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as DailyProgress;
      } else {
        // Crear progreso inicial si no existe
        const initialProgress: DailyProgress = {
          currentProgress: 0,
          lastRecycleDate: new Date().toISOString(),
          dailyStreak: 0,
          totalRecycled: 0,
          targetDaily: this.TARGET_DAILY
        };
        
        await setDoc(progressDocRef, initialProgress);
        return initialProgress;
      }
    } catch (error) {
      console.error("Error fetching daily progress: ", error);
      throw error;
    }
  }

  /**
   * Validar si es un nuevo día y reiniciar progreso si es necesario
   */
  async validateAndResetDailyProgress(userId: string): Promise<DailyProgress> {
    try {
      const progress = await this.getDailyProgress(userId);
      const today = new Date().toDateString();
      const lastRecycleDay = new Date(progress.lastRecycleDate).toDateString();

      // Si es un nuevo día, reiniciar progreso
      if (today !== lastRecycleDay) {
        const updatedProgress: DailyProgress = {
          ...progress,
          currentProgress: 0,
          lastRecycleDate: new Date().toISOString()
        };

        await this.updateDailyProgress(userId, updatedProgress);
        return updatedProgress;
      }

      return progress;
    } catch (error) {
      console.error("Error validating daily progress: ", error);
      throw error;
    }
  }

  /**
   * Agregar un reciclaje al progreso diario
   */
  async addRecycling(userId: string): Promise<DailyProgress> {
    try {
      const progress = await this.validateAndResetDailyProgress(userId);
      
      const currentProgress = progress.currentProgress + 1;
      const newTotalRecycled = progress.totalRecycled + 1;
      
      const updatedProgress: DailyProgress = {
        ...progress,
        currentProgress: currentProgress,
        totalRecycled: newTotalRecycled,
        lastRecycleDate: new Date().toISOString()
      };

      await this.updateDailyProgress(userId, updatedProgress);

      if (currentProgress === this.TARGET_DAILY) {
        await this.handleDailyGoalCompleted(userId, updatedProgress);
      }

      return updatedProgress;
    } catch (error) {
      console.error("Error adding recycling: ", error);
      throw error;
    }
  }

  // Manejar cuando se completa la meta diaria
  private async handleDailyGoalCompleted(userId: string, progress: DailyProgress): Promise<void> {
    try {
  
      const newStreak = progress.dailyStreak + 1;
      

      const updatedProgress: DailyProgress = {
        ...progress,
        dailyStreak: newStreak
      };

      await this.updateDailyProgress(userId, updatedProgress);

      await this.grantExperience(userId, this.XP_REWARD);

    
      this.showDailyGoalCompletedModal(newStreak);

    } catch (error) {
      console.error("Error handling daily goal completion: ", error);
      throw error;
    }
  }

  /**
   * Otorgar experiencia al usuario
   */
  private async grantExperience(userId: string, xpAmount: number): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      
      // Actualizar XP del usuario
      await updateDoc(userDocRef, {
        xp: increment(xpAmount)
      });


    } catch (error) {
      console.error("Error granting experience: ", error);
      throw error;
    }
  }

  /**
   * Mostrar modal de celebración por completar meta diaria
   */
  private showDailyGoalCompletedModal(streak: number): void {
    eventBus.emit(EVENTS.MISSION_COMPLETED, 
      { 
        title: "¡Meta Diaria Completada!", 
        xp: this.XP_REWARD 
      },
      {
        title: "🎉 ¡Meta Diaria Completada!",
        description: `¡Has reciclado 3 objetos hoy!\n\n+${this.XP_REWARD} XP ganados\nRacha actual: ${streak} días`,
        animation: celebration,
        sound: '/level-up.mp3',
        buttonText: '¡Continuar!',
        vibrate: true
      }
    );
  }

  /**
   * Actualizar progreso diario en Firebase
   */
  private async updateDailyProgress(userId: string, progress: DailyProgress): Promise<void> {
    try {
      const progressDocRef = doc(db, 'users', userId, 'dailyProgress', 'progress');
      await setDoc(progressDocRef, progress);
    } catch (error) {
      console.error("Error updating daily progress: ", error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del progreso diario
   */
  async getDailyStats(userId: string): Promise<{
    currentProgress: number;
    targetDaily: number;
    dailyStreak: number;
    totalRecycled: number;
    isCompleted: boolean;
    progressPercentage: number;
  }> {
    try {
      const progress = await this.validateAndResetDailyProgress(userId);
      
      return {
        currentProgress: progress.currentProgress,
        targetDaily: progress.targetDaily,
        dailyStreak: progress.dailyStreak,
        totalRecycled: progress.totalRecycled,
        isCompleted: progress.currentProgress >= progress.targetDaily,
        progressPercentage: Math.min((progress.currentProgress / progress.targetDaily) * 100, 100)
      };
    } catch (error) {
      console.error("Error getting daily stats: ", error);
      throw error;
    }
  }
}

export const dailyProgressService = new DailyProgressService(); 