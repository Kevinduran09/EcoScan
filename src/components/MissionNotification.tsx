import React from 'react';
import { IonToast } from '@ionic/react';
import { checkmarkCircle, trophy, star } from 'ionicons/icons';

interface MissionNotificationProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  type: 'mission_completed' | 'level_up' | 'achievement_unlocked';
  message: string;
  xp?: number;
  level?: number;
  achievement?: string;
}

export const MissionNotification: React.FC<MissionNotificationProps> = ({
  isOpen,
  onDidDismiss,
  type,
  message,
  xp,
  level,
  achievement
}) => {
  const getIcon = () => {
    switch (type) {
      case 'mission_completed':
        return checkmarkCircle;
      case 'level_up':
        return star;
      case 'achievement_unlocked':
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