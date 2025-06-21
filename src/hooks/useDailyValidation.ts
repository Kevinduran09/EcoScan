import { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { dailyProgressService } from '../services/firebase/DailyProgressService';

export const useDailyValidation = () => {
  const { user } = useAuth();

  useEffect(() => {
    const validateDailyProgress = async () => {
      if (!user?.uid) return;

      try {
        // Validar y reiniciar progreso diario si es necesario
        await dailyProgressService.validateAndResetDailyProgress(user.uid);
        console.log('Validación diaria completada');
      } catch (error) {
        console.error('Error en validación diaria:', error);
      }
    };

    // Ejecutar validación cuando el usuario esté disponible
    if (user?.uid) {
      validateDailyProgress();
    }
  }, [user?.uid]);

  return null;
}; 