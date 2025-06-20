import { doc, getDoc, setDoc, serverTimestamp, updateDoc, FieldValue } from 'firebase/firestore';
import { db } from '../core/firebaseConfig';
import { generateMissions } from '../utils/generateMissions';
import { Mission } from '../types/Mission';
import { UserStatsService } from './UserStatsService';

export interface DailyMissionsData {
  id: string; // fecha en formato YYYY-MM-DD
  missions: Mission[];
  generatedAt: string | Date | FieldValue; // serverTimestamp o ISO string
  lastUpdated: string | Date | FieldValue; // serverTimestamp o ISO string
  completedCount: number;
  totalCount: number;
}

export class DailyMissionsService {
  private static readonly LOCAL_STORAGE_KEY = 'daily_missions_data';
  private static readonly MISSION_COUNT = 5;

  /**
   * Obtiene las misiones del día actual, intentando primero desde Firebase y luego desde local
   */
  static async getTodayMissions(userId: string): Promise<Mission[]> {
    try {
      // 1. Intentar obtener desde Firebase
      
      const firebaseMissions = await this.getMissionsFromFirebase(userId);
      if (firebaseMissions.length > 0) {
        // Guardar en local como respaldo
        this.saveMissionsToLocal(userId, firebaseMissions);
        return firebaseMissions;
      }

      // 2. Si no hay misiones en Firebase, generar nuevas
      const newMissions = await this.generateAndSaveMissions(userId);
      return newMissions;

    } catch (error) {
      console.warn('⚠️ Error obteniendo misiones desde Firebase, usando local:', error);
      
      // 3. Fallback a datos locales
      const localMissions = this.getMissionsFromLocal(userId);
      if (localMissions.length > 0) {
        return localMissions;
      }

      // 4. Si no hay datos locales, generar misiones offline
      const offlineMissions = generateMissions(this.MISSION_COUNT);
      this.saveMissionsToLocal(userId, offlineMissions);
      return offlineMissions;
    }
  }

  /**
   * Genera nuevas misiones y las guarda en Firebase y local
   */
  static async generateAndSaveMissions(userId: string): Promise<Mission[]> {
    const today = this.getTodayDateString();
    const missions = generateMissions(this.MISSION_COUNT);

    try {
      // Guardar en Firebase
      await this.saveMissionsToFirebase(userId, today, missions);
      
      // Guardar en local como respaldo
      this.saveMissionsToLocal(userId, missions);
      
      console.log('✅ Misiones generadas y guardadas exitosamente');
      return missions;
    } catch (error) {
      console.error('❌ Error guardando misiones en Firebase:', error);
      
      // Si falla Firebase, guardar solo en local
      this.saveMissionsToLocal(userId, missions);
      return missions;
    }
  }

  /**
   * Actualiza el progreso de una misión específica
   */
  static async updateMissionProgress(
    userId: string, 
    missionId: string, 
    newProgress: number
  ): Promise<void> {
    try {
      // Actualizar en Firebase
      await this.updateMissionProgressInFirebase(userId, missionId, newProgress);
      
      // Actualizar en local
      this.updateMissionProgressInLocal(userId, missionId, newProgress);
      
    } catch (error) {
      console.warn('⚠️ Error actualizando progreso en Firebase, usando solo local:', error);
      this.updateMissionProgressInLocal(userId, missionId, newProgress);
    }
  }

  /**
   * Marca una misión como completada
   */
  static async completeMission(
    userId: string, 
    missionId: string,
    onMissionCompleted?: (mission: Mission) => void
  ): Promise<void> {
    try {
      // Obtener la misión para acceder a sus datos (XP, etc.)
      const missions = await this.getTodayMissions(userId);
      const mission = missions.find(m => m.id === missionId);
      
      if (!mission) {
        throw new Error('Misión no encontrada');
      }
      debugger
      // Actualizar en Firebase
      await this.completeMissionInFirebase(userId, missionId);
      
      // Actualizar en local
      this.completeMissionInLocal(userId, missionId);
      
      // Actualizar estadísticas del usuario (XP, nivel, logros, etc.)
      const result = await UserStatsService.onMissionCompleted(userId, mission);
      
      // Verificar y otorgar logros
      await UserStatsService.checkAndAwardAchievements(userId);
      
      // Notificar callback si existe
      if (onMissionCompleted) {
        onMissionCompleted(mission);
      }
      
    } catch (error) {
      console.warn('⚠️ Error completando misión en Firebase, usando solo local:', error);
      this.completeMissionInLocal(userId, missionId);
    }
  }

  /**
   * Sincroniza datos locales con Firebase cuando hay conexión
   */
  static async syncLocalWithFirebase(userId: string): Promise<void> {
    try {
      const localData = this.getLocalMissionsData(userId);
      const today = this.getTodayDateString();
      
      if (localData && localData.id === today) {
        // Sincronizar misiones del día actual
        await this.saveMissionsToFirebase(userId, today, localData.missions);
        console.log('✅ Datos locales sincronizados con Firebase');
      }
    } catch (error) {
      console.warn('⚠️ Error sincronizando datos locales:', error);
    }
  }

  // Métodos privados para Firebase
  private static async getMissionsFromFirebase(userId: string): Promise<Mission[]> {
    const today = this.getTodayDateString();
    const missionsRef = doc(db, `users/${userId}/dailyMissions`, today);
    const missionsSnap = await getDoc(missionsRef);

    if (missionsSnap.exists()) {
      const data = missionsSnap.data() as DailyMissionsData;
      return data.missions || [];
    }
    return [];
  }

  private static async saveMissionsToFirebase(
    userId: string, 
    date: string, 
    missions: Mission[]
  ): Promise<void> {
    const missionsRef = doc(db, `users/${userId}/dailyMissions`, date);
    const missionsData: DailyMissionsData = {
      id: date,
      missions,
      generatedAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      completedCount: 0,
      totalCount: missions.length
    };

    await setDoc(missionsRef, missionsData);
  }

  private static async updateMissionProgressInFirebase(
    userId: string, 
    missionId: string, 
    increment: number
  ): Promise<void> {
    debugger
    const today = this.getTodayDateString();
    const missionsRef = doc(db, `users/${userId}/dailyMissions`, today);
    const missionSnap = await getDoc(missionsRef);
    
     if (!missionSnap.exists()) return;

     const missions = missionSnap.data().missions
     const mission = missions.find(m => m.id === missionId)
    
     const newProgress = (mission.progresoActual || 0) + increment

     const isCompleted = newProgress >= mission.target;

    await updateDoc(missionsRef,{
        progress:newProgress,
        status: isCompleted ? 'completada' : 'en_proceso',  
        lastUpdated: serverTimestamp()
    })

  }

  private static async completeMissionInFirebase(
    userId: string, 
    missionId: string
  ): Promise<void> {
    const today = this.getTodayDateString();
    const missionsRef = doc(db, `users/${userId}/dailyMissions`, today);
    const missionSnap = await getDoc(missionsRef);
    
    if (!missionSnap.exists()) return;

    const data = missionSnap.data() as DailyMissionsData;
    const missions = data.missions;
    const missionIndex = missions.findIndex((m: Mission) => m.id === missionId);

    if (missionIndex === -1) return;

    // Solo actualiza el estado
    missions[missionIndex] = {
      ...missions[missionIndex],
      progresoActual: missions[missionIndex].target,
      estado: 'completada',
    } as Mission;

    await updateDoc(missionsRef, {
      missions,
      lastUpdated: serverTimestamp(),
    });
  }

  // Métodos privados para localStorage
  private static getMissionsFromLocal(userId: string): Mission[] {
    try {
      const data = this.getLocalMissionsData(userId);
      const today = this.getTodayDateString();
      
      if (data && data.id === today) {
        return data.missions || [];
      }
    } catch (error) {
      console.warn('❌ Error obteniendo misiones locales:', error);
    }
    
    return [];
  }

  private static saveMissionsToLocal(userId: string, missions: Mission[]): void {
    try {
      const today = this.getTodayDateString();
      const missionsData: DailyMissionsData = {
        id: today,
        missions,
        generatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        completedCount: 0,
        totalCount: missions.length
      };

      const allData = this.getAllLocalMissionsData();
      allData[userId] = missionsData;
      
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('❌ Error guardando misiones locales:', error);
    }
  }

  private static updateMissionProgressInLocal(
    userId: string, 
    missionId: string, 
    newProgress: number
  ): void {
    try {
      const data = this.getLocalMissionsData(userId);
      if (data) {
        const missionIndex = data.missions.findIndex(m => m.id === missionId);
        if (missionIndex !== -1) {
          data.missions[missionIndex].progresoActual = newProgress;
          data.lastUpdated = new Date().toISOString();
          this.saveLocalMissionsData(userId, data);
        }
      }
    } catch (error) {
      console.error('❌ Error actualizando progreso local:', error);
    }
  }

  private static completeMissionInLocal(userId: string, missionId: string): void {
    try {
      const data = this.getLocalMissionsData(userId);
      if (data) {
        const missionIndex = data.missions.findIndex(m => m.id === missionId);
        if (missionIndex !== -1) {
          data.missions[missionIndex].estado = 'completada';
          data.missions[missionIndex].progresoActual = data.missions[missionIndex].target;
          data.completedCount += 1;
          data.lastUpdated = new Date().toISOString();
          this.saveLocalMissionsData(userId, data);
        }
      }
    } catch (error) {
      console.error('❌ Error completando misión local:', error);
    }
  }

  // Métodos auxiliares
  private static getTodayDateString(): string {
    return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }

  private static getLocalMissionsData(userId: string): DailyMissionsData | null {
    try {
      const allData = this.getAllLocalMissionsData();
      return allData[userId] || null;
    } catch (error) {
      console.warn('❌ Error obteniendo datos locales:', error);
      return null;
    }
  }

  private static getAllLocalMissionsData(): Record<string, DailyMissionsData> {
    try {
      const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn('❌ Error obteniendo todos los datos locales:', error);
      return {};
    }
  }

  private static saveLocalMissionsData(userId: string, data: DailyMissionsData): void {
    try {
      const allData = this.getAllLocalMissionsData();
      allData[userId] = data;
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('❌ Error guardando datos locales:', error);
    }
  }

  private static findMissionIndex(userId: string, missionId: string): number {
    const data = this.getLocalMissionsData(userId);
    if (data) {
      return data.missions.findIndex(m => m.id === missionId);
    }
    return -1;
  }

  /**
   * Limpia datos locales antiguos (más de 7 días)
   */
  static cleanOldLocalData(): void {
    try {
      const allData = this.getAllLocalMissionsData();
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      Object.keys(allData).forEach(userId => {
        const userData = allData[userId];
        const missionDate = new Date(userData.id);
        
        if (missionDate < sevenDaysAgo) {
          delete allData[userId];
        }
      });

      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(allData));
      console.log('🧹 Datos locales antiguos limpiados');
    } catch (error) {
      console.warn('❌ Error limpiando datos locales:', error);
    }
  }

  
   static async updateMissionProgressOnlyInFirebase(
    userId: string,
    missionId: string,
    newProgress: number
  ): Promise<void> {
    
    const today = this.getTodayDateString();
    const missionsRef = doc(db, `users/${userId}/dailyMissions`, today);
    const missionSnap = await getDoc(missionsRef);

    if (!missionSnap.exists()) return;

    const data = missionSnap.data() as DailyMissionsData;
    const missions = data.missions;
    const missionIndex = missions.findIndex((m: Mission) => m.id === missionId);

    if (missionIndex === -1) return;

    // Solo actualiza el progreso
    missions[missionIndex] = {
      ...missions[missionIndex],
      progresoActual: newProgress,
    } as Mission;
    
    await updateDoc(missionsRef, {
      missions,
      lastUpdated: serverTimestamp(),
    });
  }
} 