import React from 'react';
import { Badge } from '../services/firebase/BadgesService';

interface BadgeCardProps {
    badge: Badge;
    unlocked: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, unlocked }) => {
    return (
        <div
            className={`bg-[#23243a] relative space-y-3 rounded-2xl p-4 flex flex-col items-center shadow-lg transition-all duration-300 ${!unlocked ? 'grayscale opacity-50' : ''
                }`}
        >
            <div
                className={`size-28 rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden ${badge.color} mb-2`}
            >
                <img src={badge.iconUrl} alt={badge.title} className="h-full w-full object-contain" />
            </div>
            <span className="text-white font-bold text-center">{badge.title}</span>
            <span className="text-xs text-zinc-300 text-center mb-2">{badge.description}</span>
            {!unlocked && (
                <div className="absolute top-0 right-0 p-2">
                    <span className="text-4xl">🔒</span>
                </div>
            )}
        </div>
    );
};

export default BadgeCard;
