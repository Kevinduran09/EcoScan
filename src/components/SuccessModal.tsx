import React, { useEffect, useState } from 'react';
import { checkmarkCircle, trophy } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  tipo: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ show, onClose, tipo }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setShowConfetti(true);
      
      // Reproducir sonido de éxito (opcional)
      // playSuccessSound();
      
      // Auto-cerrar después de 3 segundos
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setShowConfetti(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div 
        className={`w-[90%] max-w-sm rounded-2xl bg-white shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="text-center p-8 space-y-6">
          {/* Icono animado */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <IonIcon 
                icon={checkmarkCircle} 
                className="text-white text-4xl animate-bounce"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
              <IonIcon icon={trophy} className="text-white text-sm" />
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              ¡Excelente trabajo! 🌱
            </h2>
            <p className="text-gray-600">
              Has reciclado correctamente
            </p>
            <div className="inline-block bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full">
              <span className="font-semibold text-green-700 capitalize">
                {tipo}
              </span>
            </div>
          </div>

          {/* Mensaje motivacional */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              Cada pequeño acto de reciclaje cuenta para un futuro más sostenible. ¡Sigue así!
            </p>
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            ¡Continuar!
          </button>
        </div>
      </div>
    </div>
  );
}; 