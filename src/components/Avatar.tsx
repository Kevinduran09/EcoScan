import React from 'react'

import Lottie from 'lottie-react';
import fire2 from '../animations/fire-level-2.json'

interface AvatarProps {
    size: number;
    url:string | undefined
}

const Avatar: React.FC<AvatarProps> = ({ size,url }) => {
    
    // Calcula el tamaño del círculo del nivel (por ejemplo, 35% del avatar)
    const badgeSize = Math.round(size * 0.45);

    return (
        <div className="relative">
            <div
                className="relative bg-gradient-to-tr from-green-400 to-green-700 p-1 rounded-full shadow-lg"
            >
                <div className={`rounded-full w-${size} h-${size} flex items-center justify-center overflow-hidden`}>
                    <img src={`${url}=s128`} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </div>
            <div
                className="absolute flex items-center justify-center"
                style={{
                    width: badgeSize * 2,
                    height: badgeSize * 2,
                    right: -badgeSize * 0.4,
                    bottom: -badgeSize * 0.4,
                }}
            >
                <div className="relative" style={{ width: badgeSize * 1.25 }}>
                    <Lottie animationData={fire2} loop={true} style={{ width: '100%', height: '100%' }} />
                    
                </div>
            </div>
        </div>
    )
}

export default Avatar