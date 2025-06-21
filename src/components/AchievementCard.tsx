import React from 'react';
import Card from './ui/Card';

interface Achievement {
    id: string;
    name: string;
    description: string;
    type: 'level' | 'recycler' | 'streak' | 'special';
    condition: {
        type: 'level' | 'totalRecycled' | 'dailyMissionStreak';
        value: number;
    };
    rewardXP?: number;
    icon?: string;
}

interface AchievementCardProps {
    achievement: Achievement;
    unlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, unlocked }) => {
    return (
        <div className={`bg-[#23243a] p-4 rounded-xl shadow-lg relative ${!unlocked ? 'grayscale opacity-50' : ''}`}>
            <div className="flex flex-col items-center gap-4">
                {/* Icono grande */}
                <div className='flex flex-col gap-3 items-center'>
                    <div className="bg-[#3b3d52] p-4 rounded-full text-3xl flex items-center justify-center">
                        {achievement.icon || '🏆'}
                    </div>
                </div>
                
                {/* Contenido del logro */}
                <div className="flex flex-col text-center flex-1">
                    <span className="text-white text-lg font-semibold">{achievement.name}</span>
                    <span className="text-sm text-gray-300 mb-1">{achievement.description}</span>
                    <div className="t">
                        <span className="text-yellow-100 text-sm font-semibold">
                            Gana +{achievement.rewardXP || 0} XP
                        </span>
                    </div>
                </div>
                
                {!unlocked && (
                    <div className="absolute top-0 right-0 p-2">
                        <span className="text-4xl">🔒</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementCard; 