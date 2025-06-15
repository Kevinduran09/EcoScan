import { IonContent, IonPage, IonButton, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import '../theme/camera.css'
import { StatusBar, Style } from '@capacitor/status-bar';
import { arrowBack, camera, cameraReverse, flash, flashOff, square } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import NivelSubidoModal from '../components/NivelSubidoModal';
import Title from '../components/ui/Title';
import { CameraService } from '../services/firebase/CameraService';
import { ReponseInterface } from '../types/responseTypes';
import { PreviewView } from '../components/PreviewView';
const initializeStatusBar = async () => {
  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.show();
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (error) {
    console.error('Error al configurar StatusBar:', error);
  }
};
interface PreviewData {
  show: boolean;
  title: string;
  content: string;
  imageUrl: string | null;
}
// Inicializar StatusBar
initializeStatusBar();
const CameraScreen: React.FC = () => {
  const history = useHistory()
  const [previewData, setPreviewData] = useState<PreviewData>({
    show: false,
    title: '',
    content: '',
    imageUrl: null,
  });
  const [isCamaraActive, setIsCamaraActive] = useState(false)
  const [isFlashOn, setIsFlashOn] = useState(false)
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const isNative = Capacitor.isNativePlatform()
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const handleBack = () => {
    history.goBack()
  }
  const startCamera = async () => {
    try {
      const cameraPreviewOptions: CameraPreviewOptions = isNative ? {
        position: 'rear',
        width: window.innerWidth,
        height: window.innerHeight,
        toBack: true,
        enableZoom: true,
        className: 'camera-preview',
      } : {
        parent: 'camera-preview',
        className: 'camera-preview',
      }

      await CameraPreview.start(cameraPreviewOptions);
      setIsCamaraActive(true)
    } catch (error) {
      console.error('Error al iniciar la cámara:', error);
    }
  }
  const stopCamera = async () => {
    try {
      await CameraPreview.stop();
      setIsCamaraActive(false)
    } catch (error) {
      console.error('Error al detener la cámara:', error);
    }
  }
  const takePicture = async () => {
    console.log('Tomando foto...');

    try {
      const options: CameraPreviewPictureOptions = {
        quality: 85,
        width: 800,
        height: 600,
      }
      const result = await CameraPreview.capture(options);
      console.log('Foto tomada:', result);
      if (result.value) {
        // Asegurarnos de que la imagen tenga el prefijo data:image/jpeg;base64,
        const base64Image = result.value.startsWith('data:')
          ? result.value
          : `data:image/jpeg;base64,${result.value}`;
        // setImage(base64Image);


        const camaraService = new CameraService()
        const response: ReponseInterface = await camaraService.analyzeImageWithIA(base64Image)
        setPreviewData({
          show: true,
          title: response.tipo,
          content: response.consejo || 'Sin resultados',
          imageUrl: base64Image,
        });

        
      }
    } catch (error) {
      console.error('Error al tomar la foto: ', error)
    }
  }
  const saveInFirebaseDb = ()=>{
    // aplicar logica para guardar la imagen en firebase db
  }
  const toggleFlash = async () => {
    if (!isNative) {
      console.log('La funcionalidad de flash no está disponible en la web');
      return;

    }
    try {
      if (isFlashOn) {
        await CameraPreview.setFlashMode({ flashMode: "off" })
      } else {
        await CameraPreview.setFlashMode({ flashMode: 'on' })
      }
      setIsFlashOn(!isFlashOn)
    } catch (error) {
      console.error('Error al cambiar el modo de flash:', error);

    }
  }
  const toggleCamera = async () => {
    try {
      await CameraPreview.stop();
      const newPosition = isFrontCamera ? 'rear' : 'front';
      const cameraPreviewOptions: CameraPreviewOptions = isNative ? {
        position: newPosition,
        width: window.innerWidth,
        height: window.innerHeight,
        toBack: true,
        enableZoom: true,
        className: 'camera-preview',
      } : {
        parent: 'camera-preview',
        className: 'camera-preview',
      }
      await CameraPreview.start(cameraPreviewOptions);
      setIsFrontCamera(!isFrontCamera);
      console.log('Cámara cambiada a:', newPosition);
    } catch (error) {
      console.error('Error al cambiar la cámara:', error);

    }
  }
  return (
    <IonPage>
      <IonContent fullscreen className='my-custom-camera-preview-content'>
        <div id='camera-preview' className='w-full h-full'></div>

        {/* preview result */}
        {previewData.show && previewData.imageUrl && (
          <PreviewView
            show={previewData.show}
            title={previewData.title}
            content={previewData.content}
            imageUrl={previewData.imageUrl}
            setShow={(val: boolean) => setPreviewData(prev => ({ ...prev, show: val }))}
          />
        )}
        {/* top bar */}
        <div className='absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-3 '>
          <IonButton
            fill="clear"
            onClick={handleBack}
          >
            <IonIcon
              icon={arrowBack}
              className='size-8 text-white bg-gray-200/20 rounded-full p-2'
            />
          </IonButton>
          <Title variant='h2' color='white' className="text-center">Escanear Residuo</Title>

          <IonButton
            fill="clear"
            onClick={toggleFlash}
            disabled={!isNative}

          >
            <IonIcon
              icon={isFlashOn ? flash : flashOff}
              className={`size-8 bg-gray-200/20 rounded-full p-2 ${isNative ? 'text-white' : 'text-gray-500'}`}
            />
          </IonButton>
        </div>


        {/* bottom bar */}
        <div className='absolute bottom-0 left-0 right-0 flex items-center justify-between px-12 py-4 bg-black opacity-80'>
          <IonButton
            fill="clear"
          >
            <IonIcon
              icon={square}
              className='size-8 text-white'
            />
          </IonButton>

          <div className='absolute left-1/2 -translate-x-1/2 bg-white size-24 rounded-full flex items-center justify-center p-1 bottom-6 z-10'>
            <IonButton
              fill="clear"
              onClick={takePicture}
              className="w-full h-full rounded-full bg-green-500 text-white"
            >
              <IonIcon icon={camera} className=" text-2xl" />
            </IonButton>
          </div>
          <IonButton
            fill="clear"
            onClick={toggleCamera}
            disabled={!isNative}
          >
            <IonIcon
              icon={cameraReverse}
              className={`text-2xl ${isNative ? 'text-white' : 'text-gray-500'}`}
            />
          </IonButton>

        </div>        {/* focus square mejorado */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative size-64">
            {/* Esquinas */}
            <div className="absolute w-8 h-8 border-t-4 border-l-4 border-green-600 rounded-tl-lg top-0 left-0"></div>
            <div className="absolute w-8 h-8 border-t-4 border-r-4 border-green-600 rounded-tr-lg top-0 right-0"></div>
            <div className="absolute w-8 h-8 border-b-4 border-l-4 border-green-600 rounded-bl-lg bottom-0 left-0"></div>
            <div className="absolute w-8 h-8 border-b-4 border-r-4 border-green-600 rounded-br-lg bottom-0 right-0"></div>
          </div>
          <div className="absolute w-full  bg-black/80 rounded-md -bottom-4 left-1/2 -translate-x-1/2 top-[277px]">
            <p className="text-white text-center text-sm ">Centra el objeto y toca el boton para escanearlo</p>
          </div>

        </div>


        <NivelSubidoModal
          url={image}
          show={!!image}
          nivel={1}
          onClose={() => setImage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CameraScreen;