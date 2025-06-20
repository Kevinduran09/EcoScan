import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { generateMissions } from '../utils/generateMissions';

const HistoryScreen: React.FC = () => {
  
  const missiones = generateMissions(5)
  
  console.log(missiones);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Historial</IonTitle>
          
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
       
      </IonContent>
    </IonPage>
  );
};

export default HistoryScreen; 