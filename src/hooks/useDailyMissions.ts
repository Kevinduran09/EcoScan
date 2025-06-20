import { useState, useEffect } from 'react';
import { DailyMissionsService } from '../services/DailyMissionsService';
import { Mission } from '../types/Mission';
import { useAuth } from '../contexts/authContext';

export const useDailyMissions = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
const loadMissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const todayMissions = await DailyMissionsService.getTodayMissions(user.uid);
      setMissions(todayMissions);
      console.log('📋 Misiones cargadas:', todayMissions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando misiones';
      setError(errorMessage);
      console.error('❌ Error cargando misiones:', err);
    } finally {
      setLoading(false);
    }
  };


  const refreshMissions = async () => {
    await loadMissions();
  };

  // Sincronizar con Firebase
  const syncWithFirebase = async () => {
    if (!user) return;

    try {
      await DailyMissionsService.syncLocalWithFirebase(user.uid);
      await loadMissions(); 
    } catch (err) {
      console.warn('⚠️ Error sincronizando con Firebase:', err);
    }
  };

  useEffect(() => {
    loadMissions();
  }, []);

  const getMissionsStats = () => {
    const total = missions.length;
    const completed = missions.filter(m => m.estado === 'completada').length;
    const pending = total - completed;
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      pending,
      progressPercentage
    };
  };

  const getMissionsByStatus = (status: string) => {
    return missions.filter(m => m.estado === status);
  };

  return {
    missions,
    loading,
    error,
    loadMissions,
    refreshMissions,
    syncWithFirebase,
    getMissionsStats,
    getMissionsByStatus,
  };
}; 