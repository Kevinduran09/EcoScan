import React from 'react';
import { IonIcon } from '@ionic/react';
import { checkmarkCircle, trophy, leaf } from 'ionicons/icons';
import Card from './Card';
import Button from './ui/Button';

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  tipo: string;
  onContinue?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  show,
  onClose,
  tipo,
  onContinue
}) => {
  if (!show) return null;

  const getCategoryIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      'carton': '📦',
      'papel': '📄',
      'vidrio': '🍶',
      'aluminio': '🥫',
      'plastico': '🥤',
      'organico': '🍎',
      'electronicos': '📱'
    };
    return icons[tipo] || '♻️';
  };

  const getMotivationalMessage = (tipo: string) => {
    const messages: Record<string, string> = {
      'carton': '¡Excelente! El cartón se puede reciclar hasta 7 veces.',
      'papel': '¡Perfecto! El papel reciclado ahorra mucha agua y energía.',
      'vidrio': '¡Genial! El vidrio es 100% reciclable infinitamente.',
      'aluminio': '¡Fantástico! El aluminio se puede reciclar sin perder calidad.',
      'plastico': '¡Bien hecho! Cada botella reciclada ahorra energía.',
      'organico': '¡Excelente! Los residuos orgánicos se convierten en compost.',
      'electronicos': '¡Perfecto! Los electrónicos contienen materiales valiosos.'
    };
    return messages[tipo] || '¡Gracias por reciclar! Cada acción cuenta.';
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-3">
      <Card className="w-[90%] max-w-md rounded-xl bg-white shadow-lg px-6 py-8 relative">
        <div className="space-y-6 text-center">
          {/* Icono de éxito */}
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-4">
              <IonIcon icon={checkmarkCircle} className="size-16 text-green-600" />
            </div>
          </div>

          {/* Título */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Guardado exitosamente! 🎉
            </h2>
            <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
              <span>{getCategoryIcon(tipo)}</span>
              <span className="capitalize font-medium">{tipo}</span>
            </div>
          </div>

          {/* Mensaje motivacional */}
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800">
              {getMotivationalMessage(tipo)}
            </p>
          </div>

          {/* Estadísticas rápidas */}
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <IonIcon icon={leaf} className="size-4 text-green-600" />
              <span>Planeta más limpio</span>
            </div>
            <div className="flex items-center gap-1">
              <IonIcon icon={trophy} className="size-4 text-yellow-600" />
              <span>+10 XP</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              fullWidth
              onClick={handleContinue}
              className="!rounded-lg !py-3"
            >
              Continuar escaneando
            </Button>
            <Button
              variant="info"
              fullWidth
              onClick={onClose}
              className="!rounded-lg !py-3"
            >
              Ver historial
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}; 