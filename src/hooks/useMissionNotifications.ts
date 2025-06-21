import { useState, useCallback } from 'react';
import { UserStatsService } from '../services/UserStatsService';

interface MissionNotificationData {
  type: 'mission_completed' | 'level_up' | 'achievement_unlocked' | 'badge_unlocked';
  message: string;
  xp?: number;
  level?: number;
  achievement?: string;
  badge?: string;
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

  const checkAndShowAchievements = useCallback(async (userId: string) => {
    try {
      
      const newAchievements = await UserStatsService.checkAndAwardAchievements(userId);
      
      if (newAchievements.length > 0) {
        showAchievementUnlocked(newAchievements[0]);
      }
      const newBadges = await UserStatsService.checkAndAwardBadges(userId)
       if (newBadges.length > 0) {
        showBadgesUnlocked(newBadges[0]);
      }
    } catch (error) {
      console.error('Error verificando logros:', error);
    }
  }, [showAchievementUnlocked, showBadgesUnlocked]);

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
    checkAndShowAchievements,
    dismissNotification
  };
}; 