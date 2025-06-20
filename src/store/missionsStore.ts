import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';
import { DailyMissionsService } from '../services/DailyMissionsService';
import { Mission } from '../types/Mission';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

interface MissionsState {
  missions: Mission[];
  loading: boolean;
  error: string | null;
  loadMissions: (userId: string) => Promise<void>;
  refreshMissions: (userId: string) => Promise<void>;
  updateMissionProgress: (userId: string, missionId: string, newProgress: number) => Promise<void>;
  completeMission: (userId: string, missionId: string) => Promise<void>;
  setMissions: (missions: Mission[]) => void;
}

const preferencesStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const { value } = await Preferences.get({ key: name });
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await Preferences.set({ key: name, value });
  },
  removeItem: async (name: string): Promise<void> => {
    await Preferences.remove({ key: name });
  },
};

export const useMissionsStore = create<MissionsState>()(
  persist(
    (set, get) => ({
      missions: [],
      loading: false,
      error: null,
      setMissions: (missions: Mission[]) => set({ missions }),
      loadMissions: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const todayMissions = await DailyMissionsService.getTodayMissions(userId);
          set({ missions: todayMissions });
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Error cargando misiones';
          set({ error });
        } finally {
          set({ loading: false });
        }
      },
      refreshMissions: async (userId: string) => {
        await get().loadMissions(userId);
      },
      updateMissionProgress: async (userId: string, missionId: string, newProgress: number) => {
        set({ loading: true });
        try {
          await DailyMissionsService.updateMissionProgress(userId, missionId, newProgress);
          await get().loadMissions(userId);
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Error actualizando progreso de misión';
          set({ error });
        } finally {
          set({ loading: false });
        }
      },
      completeMission: async (userId: string, missionId: string) => {
        set({ loading: true });
        try {
          await DailyMissionsService.completeMission(userId, missionId);
          await get().loadMissions(userId);
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Error completando misión';
          set({ error });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'missions-storage',
      storage: createJSONStorage(() => preferencesStorage),
      partialize: (state) => ({ missions: state.missions }),
    }
  )
); 