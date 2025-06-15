import React from 'react';
import { IonIcon } from '@ionic/react';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'| 'info';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled = false,
    onClick,
    className = ''
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-[#4CAF50] text-white hover:bg-[#43A047] focus:ring-[#4CAF50]',
        secondary: 'bg-[#2196F3] text-white hover:bg-[#1E88E5] focus:ring-[#2196F3]',
        outline: 'border-2 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/10 focus:ring-[#4CAF50]',
        ghost: 'text-[#4CAF50] hover:bg-[#4CAF50]/10 focus:ring-[#4CAF50]',
        info: 'bg-[#969996] text-white hover:bg-[#969996] focus:ring-[#969796]'
    };

    const sizeClasses = {
        sm: '!px-3 !py-1.5 !text-sm',
        md: '!px-2 !py-3 !text-base',
        lg: '!px-6 !py-3 !text-lg'
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    const buttonClasses = `
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${disabledClass}
        ${className}
    `;

    const iconClasses = size === 'sm' ? '!size-5' : size === 'md' ? '!size-6' : '!size-7';

    const renderContent = () => {
        if (!icon) return children;

        const iconElement = <IonIcon icon={icon} className={`${iconClasses} ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`} />;

        return iconPosition === 'left' ? (
            <>
                {iconElement}
                {children}
            </>
        ) : (
            <>
                {children}
                {iconElement}
            </>
        );
    };

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {renderContent()}
        </button>
    );
};

export default Button; 