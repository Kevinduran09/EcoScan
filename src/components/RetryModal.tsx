import React, { useState } from 'react';
import { refresh, close, warning } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

interface RetryModalProps {
  show: boolean;
  onClose: () => void;
  onRetry: () => Promise<void>;
  error: string;
  maxRetries?: number;
}

export const RetryModal: React.FC<RetryModalProps> = ({ 
  show, 
  onClose, 
  onRetry, 
  error, 
  maxRetries = 3 
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  if (!show) return null;

  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      onClose();
      return;
    }

    setIsRetrying(true);
    try {
      await onRetry();
      // Si el retry es exitoso, cerrar el modal
      onClose();
    } catch {
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleClose = () => {
    setRetryCount(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="w-[90%] max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="text-center p-6 space-y-4">
          {/* Icono de advertencia */}
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <IonIcon 
              icon={warning} 
              className="text-red-500 text-3xl"
            />
          </div>

          {/* Título */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">
              Error de conexión
            </h2>
            <p className="text-gray-600 text-sm">
              {error}
            </p>
          </div>

          {/* Contador de reintentos */}
          {retryCount > 0 && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-700">
                Intento {retryCount} de {maxRetries}
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <IonIcon icon={close} className="inline mr-2" />
              Cancelar
            </button>
            
            <button
              onClick={handleRetry}
              disabled={isRetrying || retryCount >= maxRetries}
              className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-colors ${
                retryCount >= maxRetries
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <IonIcon 
                icon={refresh} 
                className={`inline mr-2 ${isRetrying ? 'animate-spin' : ''}`} 
              />
              {isRetrying ? 'Reintentando...' : 'Reintentar'}
            </button>
          </div>

          {/* Mensaje de máximo de reintentos */}
          {retryCount >= maxRetries && (
            <p className="text-sm text-red-600">
              Se alcanzó el máximo de reintentos. Inténtalo más tarde.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 