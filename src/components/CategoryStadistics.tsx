import React, { useEffect, useState } from 'react'
import Title from './ui/Title'
import Card from './ui/Card'
import { ProgressBar } from './ProgressBar';
import { getRecyclingProgress, RecyclingProgress } from '../services/firebase/RecyclingProgressService';
import { User } from 'firebase/auth';

export const CategoryStadistics = ({ user }: { user: User }) => {


    // Estado para progreso de reciclaje
    const [recyclingProgress, setRecyclingProgress] = useState<RecyclingProgress | null>(null);

    useEffect(() => {

        const fetchRecyclingProgress = async () => {
            if (!user) return;
            try {
                const progress = await getRecyclingProgress(user.uid);
                console.log(progress);

                setRecyclingProgress(progress);
            } catch (error) {
                console.error('Error al cargar progreso de reciclaje:', error);
            }
        };
        fetchRecyclingProgress();
    }, [user]);
    console.log(recyclingProgress);
    
    const mockStats = [
        { label: 'Metal', count: recyclingProgress?.metal ?? 0, color: '#A4A4A4', icon: '🥫' },
        { label: 'Plástico', count: recyclingProgress?.plastico ?? 0, color: '#2A9DF4', icon: '♻️' },
        { label: 'Vidrio', count: recyclingProgress?.glass ?? 0, color: '#3CB043', icon: '🍶' },
        { label: 'Cartón', count: recyclingProgress?.cardboard ?? 0, color: '#FFA500', icon: '📦' },
        { label: 'Orgánico', count: recyclingProgress?.organic ?? 0, color: '#76C043', icon: '🥬' },
        { label: 'Papel', count: recyclingProgress?.papel ?? 0, color: '#8B4513', icon: '📄' },
        { label: 'Electronicos', count: recyclingProgress?.electronicos ?? 0, color: '#A710B1', icon: '📱' },
    ];
    return (
        <div className='w-full'>
            <Title variant='h2' color='white' className="">Categorias Recicladas</Title>
            <Card variant='solid' className="rounded-2xl bg-white  shadow p-4 space-y-3">
                {mockStats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="text-xl rounded-full size-8 !p-5 flex justify-center items-center" style={{ backgroundColor: stat.color }}>
                                <span>{stat.icon}</span>
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{stat.label}</p>
                                <p className="text-xs text-gray-500">{stat.count} objetos</p>
                            </div>
                        </div>
                        <ProgressBar value={stat.count * 10} color={stat.color} className="w-32 h-2 rounded-full" />
                    </div>
                ))}
            </Card>
        </div>
    )
}
