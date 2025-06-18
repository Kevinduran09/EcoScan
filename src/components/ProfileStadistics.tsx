import React from 'react'
import Title from './ui/Title'
import { leaf, flame, trophy, star } from 'ionicons/icons'
import Card from './Card'
import { IonIcon } from '@ionic/react'
const estadisticas = [
    {
        icon: leaf,
        title: 'Objetos Reciclados',
        value: 12,
        color: '#0d8e0b'
    },
    {
        icon: flame,
        title: 'Racha Actual',
        value: 5,
        color: '#FF6B35'
    },
    {
        icon: trophy,
        title: 'Mejor Racha',
        value: 8,
        color: '#fdd700'
    },
    {
        icon: star,
        title: 'Logros',
        value: 3,
        color: '#a113ad'
    }
]
const ProfileStadistics = () => {
    return (
        <div className='w-full'>
            <Title variant='h2' color='white' className="">Estadísticas</Title>
            <div className="columns-2 w-full mt-2">
                {
                    estadisticas.map((item, index) => (
                        <Card key={index} className='py-4 px-2'>
                            <div className='flex flex-col text-wrap items-center space-y-2'>
                                <IonIcon icon={item.icon} className={`size-10`} style={{ color: item.color }}></IonIcon>
                                <span className='text-2xl font-bold'>{item.value}</span>
                                <span>{item.title}</span>
                            </div>
                        </Card>
                    ))

                }
            </div>

        </div>
    )
}

export default ProfileStadistics

/*   
<div className="grid grid-cols-2 gap-4 w-full mt-2">
    <div className="bg-white/90 rounded-xl p-4 flex flex-col items-center shadow">
        <span className="text-green-600 text-2xl mb-1">🌱</span>
        <span className="font-bold text-lg">12</span>
        <span className="text-xs text-gray-500">Objetos Reciclados</span>
    </div>
    <div className="bg-white/90 rounded-xl p-4 flex flex-col items-center shadow">
        <span className="text-orange-500 text-2xl mb-1">🔥</span>
        <span className="font-bold text-lg">5</span>
        <span className="text-xs text-gray-500">Racha Actual</span>
    </div>
    <div className="bg-white/90 rounded-xl p-4 flex flex-col items-center shadow">
        <span className="text-yellow-500 text-2xl mb-1">🏆</span>
        <span className="font-bold text-lg">8</span>
        <span className="text-xs text-gray-500">Mejor Racha</span>
    </div>
    <div className="bg-white/90 rounded-xl p-4 flex flex-col items-center shadow">
        <span className="text-purple-500 text-2xl mb-1">⭐</span>
        <span className="font-bold text-lg">3</span>
        <span className="text-xs text-gray-500">Logros</span>
    </div>
</div> */ 