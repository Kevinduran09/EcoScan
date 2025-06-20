import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { arrowBack, logOutOutline } from 'ionicons/icons';
import Container from '../components/ui/Container';
import Title from '../components/ui/Title';
import { StatusBar, Style } from '@capacitor/status-bar';
import ProfileStadistics from '../components/ProfileStadistics';
import { useHistory } from 'react-router';
import Avatar from '../components/Avatar';
import { signOut } from 'firebase/auth';
import { auth } from '../core/firebaseConfig';
import { useAuth } from '../contexts/authContext';
import { getBadgesByUserId, Badge } from '../services/firebase/BadgesService';
import BadgeList from '../components/BadgeList';

const initializeStatusBar = async () => {
  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#4CAF50' });
  } catch (error) {
    console.error('Error al configurar StatusBar:', error);
  }
};

const ProfileScreen: React.FC = () => {
  initializeStatusBar();
  const history = useHistory();
  const {user,userData} = useAuth()
  
  const TOTALEXP = userData?.xp ? userData?.xp / userData?.xpToNextLevel * 100 : 0
  console.log(userData);
  
  // Estado para insignias
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [errorBadges, setErrorBadges] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user) return;
      setLoadingBadges(true);
      try {
        const userBadges = await getBadgesByUserId(user.uid);
        setBadges(userBadges);
        setErrorBadges(null);
      } catch {
        setErrorBadges('Error al cargar las insignias');
      } finally {
        setLoadingBadges(false);
      }
    };
    fetchBadges();
  }, [user]);

  const handleBack = () => {
    history.goBack();
  }

    const handleLogout = async () => {
    try {
      
      await signOut(auth)
      history.replace("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } 
  }
  return (
    <IonPage className=''>
      <IonHeader className='!shadow-none'>
        <IonToolbar>
          <div className="py-2 px-3 bg-[#4CAF50] shadow-lg h-18">
            <div className="flex items-center justify-between w-full ">
              <IonIcon onClick={handleBack} icon={arrowBack} className="size-8  left-0 text-white bg-white/20 rounded-full p-2" />
              <Title variant='h2' color='white' className="text-center">Mi perfil</Title>
              <div className=' bg-red-500 flex justify-center items-center rounded-full p-2'>
                <IonIcon onClick={handleLogout} icon={logOutOutline} className="size-8    text-white" />

              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="gradient-primary  flex-1">
          <Container padding="sm" className="space-y-5" >

            {/* Header */}

            <div className="flex flex-col items-center h-full py-5 px-4 ">
              {/* Imagen de perfil con borde degradado */}
              <Avatar url={userData?.avatar}  size={120} />

              {/* Nombre y título */}
              <h2 className='!text-3xl text-white font-bold'>{user?.displayName}</h2>

              <span className="effect-shimmer relative overflow-hidden bg-green-600/80 text-white text-sm px-4 py-1 rounded-full font-semibold mt-1 mb-2 shadow"> {userData?.bio} </span>
              <p className="text-white/80 mb-2">Nivel {userData?.level}</p>



              {/* Barra de progreso */}
              <div className='w-full px-2'>
                <p className="text-white text-xl mb-3">Progreso del nivel</p>
                <div className="w-full bg-white/30 rounded-full h-4 mb-4 shadow-inner">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500" style={{ width: `${TOTALEXP}%` }}></div>
                </div>
                <p className="text-white text-md mb-4">{userData?.xp} XP / {userData?.xpToNextLevel} XP para el siguiente nivel</p>
              </div>

              <ProfileStadistics />

              {/* Badges estilo Duolingo */}
              <BadgeList
                badges={badges}
                loading={loadingBadges}
                error={errorBadges}
                onViewAll={() => history.push('/badges')}
              />
            </div>
          </Container>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileScreen;