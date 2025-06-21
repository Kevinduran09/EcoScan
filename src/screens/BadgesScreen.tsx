import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonContent,
    IonIcon,
} from '@ionic/react';
import Container from '../components/ui/Container';
import Title from '../components/ui/Title';
import { getAllBadges, Badge } from '../services/firebase/BadgesService';
import LinearGradient from '../components/ui/LinearGradiant';
import { useAuth } from '../contexts/authContext';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { StatusBar, Style } from '@capacitor/status-bar';


const initializeStatusBar = async () => {
    try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#7b5fff' });
    } catch (error) {
        console.error('Error al configurar StatusBar:', error);
    }
};


const BadgesScreen: React.FC = () => {
    initializeStatusBar();
    const history = useHistory();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userData } = useAuth()
    useEffect(() => {
        getAllBadges()
            .then((data) => {
                setBadges(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Error al cargar las insignias');
                setLoading(false);
            });
    }, []);

    const handleBack = () => {
        history.goBack();
    }

    const total = badges.length;
    const badgesToUser = userData?.medals || []
    return (
        <IonPage>
            <IonContent fullscreen >
                <LinearGradient
                    colors={['#7b5fff', '#181c2f']}
                    direction='to bottom'
                    className='pb-8'
                >


                    <div className="relative px-6 pt-3 pb-6 bg-gradient-to-b from-[#7b5fff] to-[#5f4bb6] rounded-b-3xl shadow-lg">
                        <div className="flex justify-between items-center w-full">
                            <IonIcon onClick={handleBack} icon={arrowBack} className="size-8 text-white bg-white/20 rounded-full p-2" />
                            <Title variant="h1" color="white" className="text-3xl font-bold mb-2">
                                Mis Insignias
                            </Title>
                            <div>
                                <div className="flex items-center gap-2 text-yellow-300 font-semibold">
                                    <span className="bg-yellow-400/20 rounded-full px-3 py-1 text-xs">{`Insignias: ${badgesToUser.length}/${total}`}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex mt-6">
                            <button className="flex-1 !py-4 text-center font-bold !rounded-xl bg-white/20 text-white" disabled>
                                Insignias
                            </button>
                            <button className="flex-1 !py-4 text-center font-bold !rounded-t-xl text-white/60" disabled>
                                Logros
                            </button>
                        </div>
                    </div>

                    <Container padding="sm" className="max-w-xl mx-auto mt-4">
                        {loading && <div className="text-white text-center py-8">Cargando insignias...</div>}
                        {error && <div className="text-red-400 text-center py-8">{error}</div>}
                        {!loading && !error && (
                            <div className="grid grid-cols-2 gap-4">
                                {badges.map((badge) => {
                                    const isUnlocked = badgesToUser.includes(badge.id);

                                    return (
                                        <div
                                            key={badge.id}
                                            className={`bg-[#23243a] relative space-y-3 rounded-2xl p-4 flex flex-col items-center shadow-lg transition-all duration-300 ${!isUnlocked ? 'grayscale opacity-50' : ''}`}
                                        >
                                            <div
                                                className={`size-28 rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden ${badge.color} mb-2`}
                                            >
                                                <img
                                                    src={badge.iconUrl}
                                                    alt={badge.title}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <span className="text-white font-bold text-center">{badge.title}</span>
                                            <span className="text-xs text-zinc-300 text-center mb-2">
                                                {badge.description}
                                            </span>
                                            {
                                                !isUnlocked && (
                                                    <div className='absolute top-0 right-0 p-2'>
                                                        <span className='text-4xl'>🔒</span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    );
                                })}

                            </div>
                        )}
                    </Container>
                </LinearGradient>
            </IonContent>
        </IonPage>
    );
};

export default BadgesScreen;
