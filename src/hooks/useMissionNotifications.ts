import { useState, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../core/firebaseConfig';
import { UserStatsService } from '../services/UserStatsService';
import { checkAndAwardTitleForLevel, getHighestTitleForLevel } from '../services/firebase/TitleService';

interface MissionNotificationData {
  type: 'mission_completed' | 'level_up' | 'achievement_unlocked' | 'badge_unlocked' | 'title_unlocked';
  message: string;
  xp?: number;
  level?: number;
  achievement?: string;
  badge?: string;
  title?: string;
}

export const useMissionNotifications = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState<MissionNotificationData>({
    type: 'mission_completed',
    message: ''
  });

  const showMissionCompleted = useCallback((xp: number) => {
    setNotificationData({
      type: 'mission_completed',
      message: '¡Misión completada!',
      xp
    });
    setShowNotification(true);
  }, []);

  const showLevelUp = useCallback((level: number) => {
    setNotificationData({
      type: 'level_up',
      message: '¡Subiste de nivel!',
      level
    });
    setShowNotification(true);
  }, []);

  const showAchievementUnlocked = useCallback((achievement: string) => {
    setNotificationData({
      type: 'achievement_unlocked',
      message: '¡Nuevo logro desbloqueado!',
      achievement
    });
    setShowNotification(true);
  }, []);

  const showBadgesUnlocked = useCallback((badge: string) => {
    setNotificationData({
      type: 'badge_unlocked',
      message: '¡Nueva insignia desbloqueada!',
      badge
    });
    setShowNotification(true);
  }, []);

  const showTitleUnlocked = useCallback((title: string) => {
    setNotificationData({
      type: 'title_unlocked',
      message: '¡Nuevo título desbloqueado!',
      title
    });
    setShowNotification(true);
  }, []);

  const checkAndShowAchievements = useCallback(async (userId: string) => {
    try {
      // Verificar logros
      const newAchievements = await UserStatsService.checkAndAwardAchievements(userId);
      if (newAchievements.length > 0) {
        showAchievementUnlocked(newAchievements[0]);
      }

      // Verificar insignias
      const newBadges = await UserStatsService.checkAndAwardBadges(userId);
      if (newBadges.length > 0) {
        showBadgesUnlocked(newBadges[0]);
      }
      debugger
      // Verificar títulos
      const userStats = await UserStatsService.getUserStats(userId);
      if (userStats) {
        const newTitle = await getHighestTitleForLevel(userStats.level);
        if (newTitle) {
          // Verificar si el usuario ya tiene este título
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const { title: currentTitle } = userSnap.data();
            if (currentTitle !== newTitle.title) {
              // Otorgar el nuevo título
              await checkAndAwardTitleForLevel(userId, userStats.level);
              showTitleUnlocked(newTitle.title);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error verificando logros:', error);
    }
  }, [showAchievementUnlocked, showBadgesUnlocked, showTitleUnlocked]);

  const dismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  return {
    showNotification,
    notificationData,
    showMissionCompleted,
    showLevelUp,
    showAchievementUnlocked,
    showBadgesUnlocked,
    showTitleUnlocked,
    checkAndShowAchievements,
    dismissNotification
  };
}; 