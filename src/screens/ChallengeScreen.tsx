import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { arrowBack, refresh } from 'ionicons/icons';
import LinearGradient from '../components/ui/LinearGradiant';
import Title from '../components/ui/Title';
import Text from '../components/ui/Text';
import '../theme/tabs.css';
import Card from '../components/ui/Card';
import { MissionCard } from '../components/MissionCard';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useMissionsStore } from '../store/missionsStore';
import { useAuth } from '../contexts/authContext';
import { useMissionNotifications } from '../hooks/useMissionNotifications';
import { MissionNotification } from '../components/MissionNotification';

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


const ChallengeScreen = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly'>('daily');

  const { user } = useAuth();
  const {
    missions,
    loading,
    error,
    loadMissions,
    refreshMissions,
    completeMission,
  } = useMissionsStore();

  const {
    showNotification,
    notificationData,
    checkAndShowAchievements,
    dismissNotification
  } = useMissionNotifications();

  useIonViewWillEnter(() => {
    if (user?.uid) {
      initializeStatusBar();
      loadMissions(user.uid);
    }
  });

  const handleBack = () => history.goBack();

  const handleRefresh = async () => {
    if (user?.uid) {
      await refreshMissions(user.uid);
    }
  };
  console.log(missions);

  // Función para completar misión
  const handleCompleteMission = async (missionId: string) => {
    if (user?.uid) {
      await completeMission(user.uid, missionId);
      // Verificar logros, insignias y títulos después de completar la misión
      await checkAndShowAchievements(user.uid);
    }
  };

  // Obtener estadísticas y misiones completadas
  const stats = {
    total: missions.length,
    completed: missions.filter(m => m.estado === 'completada').length,
    pending: missions.filter(m => m.estado !== 'completada').length,
    progressPercentage: missions.length > 0 ? (missions.filter(m => m.estado === 'completada').length / missions.length) * 100 : 0,
  };
  const completedMissions = missions.filter(m => m.estado === 'completada');

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
              <IonIcon
                onClick={handleRefresh}
                icon={refresh}
                className="size-8 text-white bg-white/20 rounded-full p-2"
              />
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
                <IonLabel>Hoy ({stats.total})</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton
                value="weekly"
                className={`  ${selectedTab === 'weekly' ? 'active-tab' : ''}`}
              >
                <IonLabel>Completados ({stats.completed})</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </LinearGradient>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen
      >
        {selectedTab === 'daily' ? (
          <LinearGradient colors={['#FF6B6B', '#FFD93D']} direction="to bottom" className="p-4 space-y-4 ">

            <Card className='space-y-2'>
              <Text size='base' weight='bold'>
                🌟 ¡Completa tus desafios diarios y sube de nivel!
              </Text>
              <Text size='sm'>
                Recicla consistentemente y ayuda a mejorar el medio ambiente
              </Text>
              {stats.total > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>Progreso: {stats.completed}/{stats.total}</span>
                    <span>{Math.round(stats.progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                    <div
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${stats.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </Card>

            {/* Error state */}
            {error && (
              <Card className='space-y-4 bg-red-50 border-red-200'>
                <Text size='base' weight='bold' color="black">
                  Error: {error}
                </Text>
                <div className="flex gap-2">
                  <button
                    onClick={handleRefresh}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Reintentar
                  </button>
                </div>
              </Card>
            )}

            {/* Loading state */}
            {loading && (
              <Card className='space-y-4'>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </Card>
            )}

            {/* Missions */}
            {!loading && !error && missions.length > 0 && (
              missions.map((mission) => (
                <MissionCard
                  mission={mission}
                  key={mission.id}
                  onCompleteMission={handleCompleteMission}
                />
              ))
            )}

            {/* Empty state */}
            {!loading && !error && missions.length === 0 && (
              <Card className='space-y-4 text-center py-8'>
                <Text size='lg' weight='bold' color="gray">
                  No hay misiones disponibles
                </Text>
                <Text size='sm' color="gray">
                  Las misiones se generan automáticamente cada día
                </Text>
              </Card>
            )}
          </LinearGradient>
        ) : (
          <LinearGradient colors={['#FF6B6B', '#FFD93D']} direction="to bottom" className="p-4 space-y-4 h-full ">
            <Text size='2xl' weight='semibold'>Misiones completadas esta semana</Text>

            {completedMissions.length > 0 ? (
              completedMissions.map((mission) => (
                <MissionCard mission={mission} key={mission.id} />
              ))

            ) : (
              <Card className='space-y-4 text-center py-8 mt-4'>
                <Text size='lg' weight='bold' color="gray">
                  No hay misiones completadas
                </Text>
                <Text size='sm' color="gray">
                  ¡Completa algunas misiones para verlas aquí!
                </Text>
              </Card>
            )}
          </LinearGradient>

        )}

        {/* Notificación de misiones */}
        <MissionNotification
          isOpen={showNotification}
          onDidDismiss={dismissNotification}
          type={notificationData.type}
          message={notificationData.message}
          xp={notificationData.xp}
          level={notificationData.level}
          achievement={notificationData.achievement}
          badge={notificationData.badge}
          title={notificationData.title}
        />
      </IonContent>
    </IonPage>
  );
};

export default ChallengeScreen;
