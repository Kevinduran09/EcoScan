import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './Tab1.css';
import { useState } from 'react';
import { useEventManager } from '../components/EventManager';

const Tab1: React.FC = () => {
  const [nivel, setNivel] = useState(0);
  const { emitLevelUp } = useEventManager();

  const handleShowModal = () => {
    setNivel(nivel + 1);
    emitLevelUp(nivel + 1);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={handleShowModal}>Mostrar modal</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
