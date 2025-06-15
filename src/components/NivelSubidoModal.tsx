import React, { useEffect } from 'react';
import { IonModal, IonButton } from '@ionic/react';
import confetti from 'canvas-confetti'; // para confetis
import { Haptics, ImpactStyle } from '@capacitor/haptics'; // para funcionaldiades como vibrar
import { Howl } from 'howler';  // para reproducir sonidos
import Lottie from 'lottie-react'; //para svg animados
import celebration from '../animations/celebration.json' 
interface Props {
    show: boolean;
    nivel: number;
    onClose: () => void;
    url?: string | null;
}

const NivelSubidoModal: React.FC<Props> = ({ show, nivel, onClose, url = null }) => {

    useEffect(() => {
        if (show) {
            lanzarConfetti();
            vibrar();
            reproducirSonido();
        }
    }, [show])

    const lanzarConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 90,
            origin: {
                y: 0.6
            }
        })
    }
    const vibrar = async () => {
        await Haptics.impact({ style: ImpactStyle.Heavy })
    }
    const reproducirSonido = async () => {
        const sound = new Howl({
            src: ['/level-up.mp3']
        })
        sound.play()
    }
    return (
        <IonModal isOpen={show} onDidDismiss={onClose}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                {
                    url ?
                        (
                            <div className='flex flex-col items-center mb-24'>
                                <img src={url} alt="avatar" className="size-72 bg-white flex items-center justify-center overflow-hidden rounded-full" />
                            </div>
                        ) : (
                            <>
                                <h2>🎉 Nivel {nivel} alcanzado!</h2>
                                <Lottie animationData={celebration} loop={true} />
                                <p>¡Sigue reciclando para llegar al siguiente nivel!</p>

                            </>
                        )

                }
                <IonButton onClick={onClose}>Continuar</IonButton>
            </div>
        </IonModal >
    )
}

export default NivelSubidoModal;
