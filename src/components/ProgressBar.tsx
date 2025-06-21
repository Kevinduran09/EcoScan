import React from 'react';

interface ProgressBarProps {
    value: number; // valor entre 0 y 100
    color?: string;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = '#4CAF50', className = '' }) => {
    return (
        <div className={`bg-gray-200 overflow-hidden ${className}`}>
            <div
                className="h-full transition-all duration-300 ease-in-out"
                style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
            />
        </div>
    );
};
