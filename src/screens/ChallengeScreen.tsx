import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToolbar
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { arrowBack } from 'ionicons/icons';
import LinearGradient from '../components/ui/LinearGradiant';
import Title from '../components/ui/Title';
import Text from '../components/ui/Text';
import '../theme/tabs.css';
import Card from '../components/ui/Card';
import { generateMissions } from '../utils/generateMissions';
import { MissionCard } from '../components/MissionCard';
import { StatusBar, Style } from '@capacitor/status-bar';
const initializeStatusBar = async () => {
    try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#FFD93D' });
        await StatusBar.show();
        await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (error) {
        console.error('Error al configurar StatusBar:', error);
    }
};

// Inicializar StatusBar

const ChallengeScreen = () => {
  initializeStatusBar();
  const history = useHistory();
  const handleBack = () => history.goBack();
  const missiones = generateMissions(5)
  console.log(missiones);
  
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly'>('daily');

  // Simulación de datos
  const activeChallenges = [1, 2, 3];
  const completedChallenges = [1];

  return (
    <IonPage>
      <IonHeader className='!shadow-none'>
        <IonToolbar>
          <LinearGradient
            colors={['#FF6B6B', '#FFD93D']}
            direction="to top"
            className='px-5 py-3 space-y-5'
          >
            <div className="flex items-center justify-between w-full">
              <IonIcon
                onClick={handleBack}
                icon={arrowBack}
                className="size-8 text-white bg-white/20 rounded-full p-2"
              />
              <Title variant="h2" className='font-semibold' color="white">
                Desafíos Diarios
              </Title>
              <div style={{ width: 32 }} /> {/* Espaciador */}
            </div>
            <IonSegment
              value={selectedTab}
              onIonChange={(e) => setSelectedTab(e.detail.value as 'daily' | 'weekly')}
              className="custom-tab-container"
            >
              <IonSegmentButton
                value="daily"
                className={`  ${selectedTab === 'daily' ? 'active-tab' : ''}`}
              >
                <IonLabel>Hoy ({activeChallenges.length})</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton
                value="weekly"
                className={`  ${selectedTab === 'weekly' ? 'active-tab' : ''}`}

              >
                <IonLabel>Completados ({completedChallenges.length})</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </LinearGradient>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {selectedTab === 'daily' ? (
          <LinearGradient colors={['#FF6B6B', '#FFD93D']} direction="to bottom" className="p-4 space-y-4 ">

            <Card
              className='space-y-2'
            >
              <Text size='base' weight='bold'>
                🌟 ¡Completa tus desafios diarios y sube de nivel!
              </Text>
              <Text size='sm'>
                Recicla consistentemente y ayuda a mejorar el medio ambiente
              </Text>
            </Card>

            {/* missions  */}
            {
              missiones.map((mission) => (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <MissionCard mission={mission as any} key={mission.id} />
              ))
            }
          </LinearGradient>
        ) : (
          <div className="p-4">
            <Text>Misiones completadas esta semana</Text>
            {/* Aquí renderiza completadas */}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChallengeScreen;
