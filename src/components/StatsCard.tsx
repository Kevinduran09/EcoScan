import { IonIcon } from '@ionic/react';
import React from 'react'
import { trophy } from 'ionicons/icons';
import Card from './Card';
// import Title from './ui/Title';
import Text from './ui/Text';

interface StatsCardProps {
    title: string;
    value: string;
}

const StatsCard = ({ title, value }: StatsCardProps) => {
    return (
        <Card className='py-4 px-3'>
            <div className="flex justify-center items-center h-full space-x-2.5">
                <IonIcon icon={trophy} className='text-[#fdd700] size-8 bg-[#fdd700]/20 rounded-full p-2' ></IonIcon>
                <div className=''>
                    <Text color='black' className='!font-bold !text-2xl'>{value}</Text>
                    <Text size="sm" color="gray">{title}</Text>
                </div>
            </div>
        </Card>
    )
}

export default StatsCard