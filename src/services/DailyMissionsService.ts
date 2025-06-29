import { doc, getDoc, setDoc, serverTimestamp, updateDoc, FieldValue } from 'firebase/firestore';
import { db } from '../core/firebaseConfig';
import { generateMissions } from '../utils/generateMissions';
import { Mission } from '../types/Mission';
import { UserStatsService } from './UserStatsService';

interface DailyMissionsData {
  id: string;
  missions: Mission[];
  generatedAt: string | Date | FieldValue;
  lastUpdated: string | Date | FieldValue;
}

export class DailyMissionsService {
  private static readonly LOCAL_STORAGE_KEY = 'daily_missions_cache';
  private static  CURRENT_TARGET =5
  static async getTodayMissions(userId: string): Promise<Mission[]> {
    try {
      
      const today = this.getTodayString();
      const docRef = doc(db, `users/${userId}/dailyMissions/${today}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as DailyMissionsData;
        this.saveToLocal(userId, data);
        return data.missions;
      }

      const newMissions = generateMissions(this.CURRENT_TARGET);
      const missionsData: DailyMissionsData = {
        id: today,
        missions: newMissions,
        generatedAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };

      await this.saveToFirebase(userId, missionsData);
      return newMissions;
    } catch (error) {
      console.warn('Error obteniendo misiones desde Firebase, intentando local:', error);
      
      const localData = this.getFromLocal(userId);
      if (localData) {
        return localData.missions;
      }

      console.log('Generando misiones offline');
      return generateMissions(this.CURRENT_TARGET);
    }
  }

  static async saveToFirebase(userId: string, data: DailyMissionsData): Promise<void> {
    try {
      const docRef = doc(db, `users/${userId}/dailyMissions/${data.id}`);
      await setDoc(docRef, data);
      this.saveToLocal(userId, data);
    } catch (error) {
      console.error('Error guardando en Firebase:', error);
      this.saveToLocal(userId, data);
    }
  }

  static async updateMissionProgress(userId: string, missionId: string, newProgress: number): Promise<void> {
    try {
      const today = this.getTodayString();
      const docRef = doc(db, `users/${userId}/dailyMissions/${today}`);
      
      await updateDoc(docRef, {
        [`missions.${missionId}.progresoActual`]: newProgress,
        lastUpdated: serverTimestamp()
      });

      this.updateLocalProgress(userId, missionId, newProgress);
    } catch (error) {
      console.error('Error actualizando progreso en Firebase:', error);
      this.updateLocalProgress(userId, missionId, newProgress);
    }
  }

  static async completeMission(userId: string, missionId: string): Promise<void> {
    try {
      const today = this.getTodayString();
      const docRef = doc(db, `users/${userId}/dailyMissions/${today}`);
      
      await updateDoc(docRef, {
        [`missions.${missionId}.estado`]: 'completada',
        lastUpdated: serverTimestamp()
      });

      const missions = await this.getTodayMissions(userId);
      const mission = missions.find(m => m.id === missionId);
      if (mission) {
        await UserStatsService.onMissionCompleted(userId, mission);
      }
      
      this.updateLocalMissionStatus(userId, missionId, 'completada');
    } catch (error) {
      console.error('Error completando misión en Firebase:', error);
      this.updateLocalMissionStatus(userId, missionId, 'completada');
    }
  }

  static async updateMissionProgressOnlyInFirebase(userId: string, missionId: string, newProgress: number): Promise<void> {
    try {
      const today = this.getTodayString();
      const docRef = doc(db, `users/${userId}/dailyMissions/${today}`);
      
      await updateDoc(docRef, {
        [`missions.${missionId}.progresoActual`]: newProgress,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error actualizando solo progreso en Firebase:', error);
    }
  }

  static async syncTodayMissions(userId: string): Promise<void> {
    try {
      const today = this.getTodayString();
      const docRef = doc(db, `users/${userId}/dailyMissions/${today}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as DailyMissionsData;
        this.saveToLocal(userId, data);
      }
    } catch (error) {
      console.warn('Error sincronizando misiones:', error);
    }
  }

  private static saveToLocal(userId: string, data: DailyMissionsData): void {
    try {
      const allData = this.getAllLocalMissionsData();
      allData[userId] = data;
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.warn('Error guardando en localStorage:', error);
    }
  }

  private static getFromLocal(userId: string): DailyMissionsData | null {
    try {
      const allData = this.getAllLocalMissionsData();
      return allData[userId] || null;
    } catch (error) {
      console.warn('Error obteniendo desde localStorage:', error);
      return null;
    }
  }

  private static getAllLocalMissionsData(): Record<string, DailyMissionsData> {
    try {
      const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn('Error obteniendo datos locales:', error);
      return {};
    }
  }

  private static updateLocalProgress(userId: string, missionId: string, newProgress: number): void {
    try {
      const allData = this.getAllLocalMissionsData();
      if (allData[userId] && allData[userId].missions) {
        const mission = allData[userId].missions.find(m => m.id === missionId);
        if (mission) {
          mission.progresoActual = newProgress;
          allData[userId].lastUpdated = new Date().toISOString();
          localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(allData));
        }
      }
    } catch (error) {
      console.warn('Error actualizando progreso local:', error);
    }
  }

  private static updateLocalMissionStatus(userId: string, missionId: string, status: string): void {
    try {
      const allData = this.getAllLocalMissionsData();
      if (allData[userId] && allData[userId].missions) {
        const mission = allData[userId].missions.find(m => m.id === missionId);
        if (mission) {
          mission.estado = status;
          allData[userId].lastUpdated = new Date().toISOString();
          localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(allData));
        }
      }
    } catch (error) {
      console.warn('Error actualizando estado local:', error);
    }
  }

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

  private static getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }
} 