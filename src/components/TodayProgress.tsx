import React from 'react'
import Card from './Card';
import { IonIcon } from '@ionic/react';
import { leafOutline } from 'ionicons/icons';
import Title from './ui/Title';
import Text from './ui/Text';

interface TodayProgressProps {
    items: number[];
}

const TodayProgress: React.FC<TodayProgressProps> = ({ items }) => {
    const TARGET_ITEMS = 3;
    const progressPercentage = Math.min((items.length / TARGET_ITEMS) * 100, 100);
    return (
        <Card className='py-4 !px-5'>
            <div className=''>
                <div className='flex items-center justify-between mb-2'>
                    <Title variant="h3" color="black">Progreso de Hoy</Title>
                    <Text size="lg" color="secondary" weight="semibold">
                        {items.length}/{TARGET_ITEMS}
                    </Text>
                </div>
                {/* Progress bar */}
                <div className='mb-5'>
                    <div className='w-full h-2 bg-white/20 rounded-full mb-2.5'>
                        <div className='h-full rounded-full bg-green-500' style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <Text size="base" color="black" className="text-center mt-2.5 text-zinc-600/90 !font-semibold">
                        {items.length >= TARGET_ITEMS ? "¡Increíble! Ya cumpliste tu meta diaria 🎉" : `${TARGET_ITEMS - items.length} más para mantener tu racha 🔥`}
                    </Text>
                </div>
                {/* Empty State */}
                {items.length === 0 && (
                    <div className='items-center flex flex-col mt-8'>
                        <IonIcon icon={leafOutline} className='text-gray-600/40 size-12'>
                        </IonIcon>
                        <Title variant="h4" color="black" className="mt-2.5">
                            ¡Comienza tu día reciclando!
                        </Title>
                        <Text size="base" color="gray" className="mt-2.5">
                            Toca el botón de escanear para comenzar
                        </Text>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default TodayProgress