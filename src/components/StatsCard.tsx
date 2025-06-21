import { IonIcon } from '@ionic/react';
import React from 'react'
import { trophy } from 'ionicons/icons';
import Card from './Card';
import Text from './ui/Text';
import { ACHIEVEMENTS } from '../utils/constant';

interface StatsCardProps {
  value: number;
  label: string;
  icon?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label, icon }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-3">
              <IonIcon icon={trophy} className='text-[#fdd700] size-8 bg-[#fdd700]/20 rounded-full p-2' ></IonIcon>
        <div>
          <Text className="!text-sm !text-gray-600">{label}</Text>
          <Text className="!text-xl !font-bold !text-gray-800">{value}/{ACHIEVEMENTS.length}</Text>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;