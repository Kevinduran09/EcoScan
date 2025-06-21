import React from 'react';
import Title from './ui/Title';
import { Badge } from '../services/firebase/BadgesService';
import { IonIcon } from '@ionic/react';
import { arrowForward, checkmark, chevronForward } from 'ionicons/icons';
import Card from './Card';

interface BadgeListProps {
    badges: Badge[];
    loading: boolean;
    error: string | null;
    onViewAll: () => void;
}

const BadgeList: React.FC<BadgeListProps> = ({ badges, loading, error, onViewAll }) => {
    return (
        <div className="w-full mt-4">
            <div className='flex justify-between items-center'>
                <Title variant="h2" color="white" className="!font-semibold">Insignias</Title>
                <div>
                    <button className=" text-white flex justify-center items-center !px-3 !py-2  bg-white/10 !rounded-3xl  !text-sm" onClick={onViewAll}>Ver todas
                        <IonIcon className='ml-1' icon={chevronForward} />
                    </button>
                </div>
            </div>
            <div>
                <Title variant="h6" color="white" className="">Desbloqueados</Title>
                {
                    badges.slice(0, 4).map((badge) => (
                        <Card className="effect-shimmer relative overflow-hidden bg-gradient-to-r from-fuchsia-700 to-purple-700">
                            <div className='z-5 flex px-3 py-2 justify-between items-center'>
                                <div className='flex justify-center items-center gap-4'>
                                    <div className={`w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden mb-1`} style={{ borderColor: badge.color }}>
                                        <img src={badge.iconUrl} alt={badge.title} className="w-12 h-12 object-contain" />

                                    </div>
                                    <div className='flex flex-col text-white space-y-2'>
                                        <span className='!text-base !font-semibold'>
                                            {badge.title}
                                        </span>

                                        <span className='!text-sm'>
                                            {badge.description}
                                        </span>

                                    </div>
                                </div>

                                <div className='bg-white/50 p-1 rounded-full'>
                                    <div className='bg-white rounded-full size-10 flex justify-center items-center '>
                                        <IonIcon className='size-7 text-gray-800' icon={checkmark} />
                                    </div>
                                </div>

                            </div>
                        </Card>
                    ))
                }
            </div>
        </div>
    );
};

export default BadgeList;


/*     {loading ? (
                <p className="text-white">Cargando insignias...</p>
            ) : error ? (
                <p className="text-red-400">{error}</p>
            ) : badges.length === 0 ? (
                <p className="text-white/70">Aún no tienes insignias.</p>
            ) : (
                <div className="flex flex-row gap-4 overflow-x-auto pb-2" style={{
                    scrollbarWidth: 'none'
                }}>
                    {badges.slice(0, 4).map((badge) => (
                        <div key={badge.id} className="flex flex-col items-center min-w-[90px]">
                            <div className={`w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden mb-1 border-2`} style={{ borderColor: badge.color }}>
                                <img src={badge.iconUrl} alt={badge.title} className="w-12 h-12 object-contain" />
                            </div>
                            <span className="text-xs text-white text-center font-semibold">{badge.title}</span>
                        </div>
                    ))}
                    {badges.length > 4 && (
                        <button className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center ml-2 border-2 border-zinc-500" onClick={onViewAll}>
                            <span className="text-white text-xl font-bold">+{badges.length - 4}</span>
                        </button>
                    )}
                </div>
            )} */