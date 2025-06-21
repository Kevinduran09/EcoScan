import React, { useEffect, useState } from 'react'
import Card from './Card';
import { IonIcon } from '@ionic/react';
import { leafOutline } from 'ionicons/icons';
import Title from './ui/Title';
import Text from './ui/Text';
import { useAuth } from '../contexts/authContext';
import { dailyProgressService } from '../services/firebase/DailyProgressService';

interface dailyStatsInterface{
    currentProgress: number;
    targetDaily: number;
    dailyStreak: number;
    totalRecycled: number;
    isCompleted: boolean;
    progressPercentage: number;
}
const TodayProgress: React.FC = () => {
    const { user } = useAuth();
    const [dailyStats, setDailyStats] = useState<dailyStatsInterface | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDailyStats = async () => {
            if (!user?.uid) return;
            
            try {
                setLoading(true);
                const stats = await dailyProgressService.getDailyStats(user.uid);
                setDailyStats(stats);
            } catch (error) {
                console.error('Error loading daily stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDailyStats();
    }, [user?.uid]);

    const currentItems = dailyStats ? dailyStats.currentProgress : 0
    const targetItems = dailyStats ? dailyStats.targetDaily : 3;
    const progressPercentage = dailyStats ? dailyStats.progressPercentage : Math.min((currentItems / targetItems) * 100, 100);
    const isCompleted = dailyStats ? dailyStats.isCompleted : (currentItems >= targetItems);

    if (loading) {
        return (
            <Card className='py-4 !px-5'>
                <div className='flex items-center justify-center py-8'>
                    <Text size="base" color="gray">Cargando progreso...</Text>
                </div>
            </Card>
        );
    }

    return (
        <Card className='py-4 !px-5'>
            <div className=''>
                <div className='flex items-center justify-between mb-2'>
                    <Title variant="h3" color="black">Progreso de Hoy</Title>
                    <Text size="lg" color="secondary" weight="semibold">
                        {currentItems}/{targetItems}
                    </Text>
                </div>
                
                {/* Progress bar */}
                <div className='mb-5'>
                    <div className='w-full h-2 bg-white/20 rounded-full mb-2.5'>
                        <div 
                            className='h-full rounded-full bg-green-500 transition-all duration-300' 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <Text size="base" color="black" className="text-center mt-2.5 text-zinc-600/90 !font-semibold">
                        {isCompleted 
                            ? "¡Increíble! Ya cumpliste tu meta diaria 🎉" 
                            : `${targetItems - currentItems} más para mantener tu racha 🔥`
                        }
                    </Text>
                </div>

                {/* Estadísticas adicionales si están disponibles */}
                {dailyStats && (
                    <div className='flex justify-between items-center text-sm text-gray-600 mb-4'>
                        <div>
                            <Text size="sm" color="gray">Racha actual: {dailyStats.dailyStreak} días</Text>
                        </div>
                        <div>
                            <Text size="sm" color="gray">Total: {dailyStats.totalRecycled} objetos</Text>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {currentItems === 0 && (
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

                {/* Estado completado */}
                {isCompleted && (
                    <div className='items-center flex flex-col mt-4'>
                        <div className='text-4xl mb-2'>🎉</div>
                        <Title variant="h4" color="black" className="mt-2.5 text-center">
                            ¡Meta Diaria Completada!
                        </Title>
                        <Text size="base" color="gray" className="mt-2.5 text-center">
                            +30 XP ganados • Racha: {dailyStats?.dailyStreak || 0} días
                        </Text>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default TodayProgress