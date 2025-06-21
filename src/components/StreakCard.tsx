import { IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import { flame } from 'ionicons/icons';
import Card from './Card';
import Text from './ui/Text';
import { dailyProgressService } from '../services/firebase/DailyProgressService';

interface StreakCardProps {
  userId: string;
}

const StreakCard: React.FC<StreakCardProps> = ({ userId }) => {
  const [streak, setStreak] = useState(0);
console.log('userID: ',userId);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const progress = await dailyProgressService.getDailyProgress(userId);
        console.log(progress);
        
          setStreak(progress.dailyStreak || 0);
      } catch (error) {
        console.error('Error cargando racha:', error);
      }
    };

    loadStreak();
  }, [userId]);

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-3">
              <IonIcon icon={flame} className='text-[#FF6B35] size-8 bg-[#FF6B35]/20 rounded-full p-2'></IonIcon>
        <div>
          <Text className="!text-sm !text-gray-600">Racha de misiones</Text>
          <Text className="!text-xl !font-bold !text-gray-800">{streak} días</Text>
        </div>
      </div>
    </Card>
  );
};

export default StreakCard;