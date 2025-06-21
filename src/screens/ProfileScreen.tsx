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
import Card from '../components/ui/Card';
import { CategoryStadistics } from '../components/CategoryStadistics';

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
  const { user, userData } = useAuth()

  const TOTALEXP = (userData?.xp && userData?.xpToNextLevel) ? (userData.xp / userData.xpToNextLevel * 100) : 0;

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

    if (user) {
      fetchBadges();
    }
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
          <div className="px-4 bg-[#4CAF50] shadow-lg h-18">
            <div className="flex items-center justify-between w-full ">
              <IonIcon onClick={handleBack} icon={arrowBack} className="size-8  left-0 text-white bg-white/20 rounded-full p-2" />
              <Title variant='h1' color='white' className="text-center !text-4xl">{userData?.displayName}</Title>
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
            <div className="flex flex-col items-center h-full py-5 px-4 ">
              <Avatar url={userData?.avatar} size={120} />
              <span className="effect-shimmer relative overflow-hidden bg-green-600/80 text-white text-sm px-4 py-1 rounded-full font-semibold !mt-8 mb-2 shadow"> {userData?.title} </span>
              <p className='text-zinc-200 text-lg py-3'>
                {userData?.bio}
              </p>
              <Card variant='solid' className='w-full px-4 py-5'>
                <div className='flex justify-between'>
                  <div className='flex gap-3 mb-5'>
                    <div className='bg-amber-300 rounded-full size-12 flex justify-center items-center text-white !shadow-lg'>
                      <span className='text-2xl'>{userData?.level}</span>
                    </div>
                    <div className='flex flex-col'>
                      <span className="text-black/80 font-semibold">Nivel {userData?.level}</span>
                      <span className='text-zinc-500'>{userData?.xp} XP</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 mb-4 shadow-inner">
                  <div className="effect-shimmer relative overflow-hidden bg-gradient-to-r from-amber-400 to-amber-600 h-4 rounded-full transition-all duration-500" style={{ width: `${TOTALEXP}%` }}></div>
                </div>
                <p className="text-black text-center text-md mb-4">⭐ {(userData?.xpToNextLevel || 0) - (userData?.xp || 0)} XP para alcanzar el nivel {(userData?.level || 0) + 1}</p>
              </Card>
              <ProfileStadistics />
              {user && <CategoryStadistics user={user}/>}
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