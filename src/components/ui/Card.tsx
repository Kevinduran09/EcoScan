import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'outlined' | 'elevated' | 'solid';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    className = '',
    onClick
}) => {
    const variantClasses = {
        default: 'bg-white/20 backdrop-blur-sm',
        outlined: 'border border-white/20 bg-transparent',
        elevated: 'bg-white/20 shadow-lg',
        solid: 'bg-white shadow-lg'
    };

    const paddingClasses = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-7'
    };

    const baseClasses = `
        rounded-xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${className}
    `;

    return (
        <div
            className={baseClasses}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {children}
        </div>
    );
};

export default Card; 