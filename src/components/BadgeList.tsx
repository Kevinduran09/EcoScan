import React from 'react';
import Title from './ui/Title';
import { Badge } from '../services/firebase/BadgesService';

interface BadgeListProps {
    badges: Badge[];
    loading: boolean;
    error: string | null;
    onViewAll: () => void;
}

const BadgeList: React.FC<BadgeListProps> = ({ badges, loading, error, onViewAll }) => {
    return (
        <div className="w-full mt-4">
            <div className='flex justify-between'>
                <Title variant="h2" color="white" className="mb-2">Insignias</Title>
                <button className="mt-2 text-zinc-500 text-base" onClick={onViewAll}>Ver todas las insignias</button>
            </div>
            {loading ? (
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
            )}
        </div>
    );
};

export default BadgeList; 