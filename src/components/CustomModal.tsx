import React, { useEffect } from 'react';
import { IonModal, IonButton } from '@ionic/react';
import confetti from 'canvas-confetti';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Howl } from 'howler';
import Lottie from 'lottie-react';

interface CustomModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  imageUrl?: string | null;
  animation?: object | null;
  sound?: string | null; // ruta del sonido
  vibrate?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}

const defaultAnimation = null; // Puedes importar una animación por defecto si quieres
const defaultSound = '/level-up.mp3';
const defaultTitle = '¡Felicidades!';
const defaultDescription = '¡Sigue reciclando para llegar al siguiente nivel!';
const defaultButtonText = 'Continuar';

const CustomModal: React.FC<CustomModalProps> = ({
  show,
  onClose,
  title = defaultTitle,
  description = defaultDescription,
  imageUrl = null,
  animation = defaultAnimation,
  sound = defaultSound,
  vibrate = true,
  buttonText = defaultButtonText,
  onButtonClick,
  children,
}) => {
  useEffect(() => {
    if (show) {
      lanzarConfetti();
      if (vibrate) vibrar();
      if (sound) reproducirSonido(sound);
    }
    // eslint-disable-next-line
  }, [show]);

  const lanzarConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
    });
  };
  const vibrar = async () => {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  };
  const reproducirSonido = async (src: string) => {
    const sound = new Howl({ src: [src] });
    sound.play();
  };

  const handleButton = () => {
    if (onButtonClick) onButtonClick();
    else onClose();
  };

  return (
    <IonModal isOpen={show} onDidDismiss={onClose} className='!bg-green-800'>
      <div className='!bg-green-700 h-full flex flex-col text-white justify-center items-center' style={{ textAlign: 'center', padding: '2rem' }}>
        {children ? (
          children
        ) : (
          <>
            {imageUrl && (
              <div className="flex flex-col items-center mb-8">
                <img src={imageUrl} alt="imagen" className="size-72 flex items-center justify-center " />
              </div>
            )}
            {title && <h2>{title}</h2>}
            {animation && <Lottie animationData={animation} loop={true} />}
            {description && <p>{description}</p>}
          </>
        )}
        <IonButton onClick={handleButton}>{buttonText}</IonButton>
      </div>
    </IonModal>
  );
};

export default CustomModal; 