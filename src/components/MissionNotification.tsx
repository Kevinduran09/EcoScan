import React from 'react';
import { IonToast } from '@ionic/react';
import { checkmarkCircle, trophy, star, medal } from 'ionicons/icons';

interface MissionNotificationProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  type: 'mission_completed' | 'level_up' | 'achievement_unlocked' | 'badge_unlocked' | 'title_unlocked';
  message: string;
  xp?: number;
  level?: number;
  achievement?: string;
  badge?: string;
  title?: string;
}

export const MissionNotification: React.FC<MissionNotificationProps> = ({
  isOpen,
  onDidDismiss,
  type,
  message,
  xp,
  level,
  achievement,
  badge,
  title
}) => {
  const getIcon = () => {
    switch (type) {
      case 'mission_completed':
        return checkmarkCircle;
      case 'level_up':
        return star;
      case 'achievement_unlocked':
        return trophy;
      case 'badge_unlocked':
        return medal;
      case 'title_unlocked':
        return trophy;
      default:
        return checkmarkCircle;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'mission_completed':
        return 'success';
      case 'level_up':
        return 'warning';
      case 'achievement_unlocked':
        return 'primary';
      case 'badge_unlocked':
        return 'secondary';
      case 'title_unlocked':
        return 'tertiary';
      default:
        return 'success';
    }
  };

  const getMessage = () => {
    let baseMessage = message;
    
    if (xp) {
      baseMessage += ` +${xp} XP`;
    }
    
    if (level) {
      baseMessage += ` ¡Nivel ${level}!`;
    }
    
    if (achievement) {
      baseMessage += ` 🏆 ${achievement}`;
    }

    if (badge) {
      baseMessage += ` 🏅 ${badge}`;
    }

    if (title) {
      baseMessage += ` 👑 ${title}`;
    }
    
    return baseMessage;
  };

  return (
    <IonToast
      isOpen={isOpen}
      onDidDismiss={onDidDismiss}
      message={getMessage()}
      duration={4000}
      position="top"
      color={getColor()}
      icon={getIcon()}
      buttons={[
        {
          text: '¡Genial!',
          role: 'cancel'
        }
      ]}
    />
  );
}; 