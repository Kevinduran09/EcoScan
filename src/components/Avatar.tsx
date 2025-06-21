import React, { useState } from 'react'
import Lottie from 'lottie-react';
import fire2 from '../animations/fire-level-2.json'
import { AvatarService } from '../services/firebase/AvatarService';
import { useAuth } from '../contexts/authContext';

interface AvatarProps {
    size: number;
    url: string | undefined;
    editable?: boolean;
    onAvatarChange?: (newUrl: string) => void;
}

const Avatar: React.FC<AvatarProps> = ({ size, url, editable = false, onAvatarChange }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    const badgeSize = Math.round(size * 0.45);

    const handleAvatarClick = async () => {
        if (!editable || !user || isLoading) return;

        try {
            setIsLoading(true);
            const newAvatarUrl = await AvatarService.changeUserAvatar(user.uid);
            
            if (newAvatarUrl && onAvatarChange) {
                onAvatarChange(newAvatarUrl);
            }
        } catch (error) {
            console.error('Error cambiando avatar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <div
                className={`relative bg-gradient-to-tr from-green-400 to-green-700 p-1 rounded-full ${
                    editable ? 'cursor-pointer hover:scale-105 transition-transform' : ''
                }`}
                onClick={handleAvatarClick}
                style={{ width: size, height: size }}
            >
                <div className="rounded-full overflow-hidden w-full h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <img 
                            src={url || '/default-avatar.png'} 
                            alt="Foto de perfil" 
                            className="w-full h-full object-cover" 
                        />
                    )}
                </div>
            </div>
            
            {/* Efecto de fuego */}
            <div
                className="absolute"
                style={{
                    width: badgeSize * 2,
                    height: badgeSize * 2,
                    right: -badgeSize * 0.4,
                    bottom: -badgeSize * 0.4,
                }}
            >
                <Lottie 
                    animationData={fire2} 
                    loop={true} 
                    style={{ width: '100%', height: '100%' }} 
                />
            </div>
        </div>
    )
}

export default Avatar