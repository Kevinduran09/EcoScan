import React, { CSSProperties, ReactNode } from 'react';
import '.././../theme/camera.css';

interface LinearGradientProps {
    colors: string[];
    style?: CSSProperties;
    children: ReactNode;
    className?: string
    direction?: 'to right' | 'to bottom' | 'to left' | 'to top';
}

const LinearGradient: React.FC<LinearGradientProps> = ({
    colors,
    style = {},
    children,
    className,
    direction = 'to right'
}) => {
    const gradientStyle: CSSProperties = {
        ...style,
        background: `linear-gradient(${direction}, ${colors.join(', ')})`
    };

    return (
        <div className={`linear-gradient ${className}`} style={gradientStyle}>
            {children}
        </div>
    );
};

export default LinearGradient;