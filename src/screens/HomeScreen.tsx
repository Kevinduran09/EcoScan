import { IonContent, IonPage } from '@ionic/react';
import '../theme/variables.css';
import LevelProgress from '../components/LevelProgress';
import Card from '../components/Card';
import data from '../data.json'
import StreakCard from '../components/StreakCard';
import StatsCard from '../components/StatsCard';
import TodayProgress from '../components/TodayProgress';
import QuickActions from '../components/QuickActions';
import Title from '../components/ui/Title';
import Text from '../components/ui/Text';
import Container from '../components/ui/Container';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { useAuth } from '../contexts/authContext';
import Button from '../components/ui/Button';
import { Recents } from '../components/Recents';
import { useEventManager } from '../components/EventManager';
import { achievementService } from '../services/AchievementService';
import { useDailyValidation } from '../hooks/useDailyValidation';
import { dailyProgressService } from '../services/firebase/DailyProgressService';

const initializeStatusBar = async () => {
    try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#4CAF50' });
        await StatusBar.show();
        await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (error) {
        console.error('Error al configurar StatusBar:', error);
    }
};

// Inicializar StatusBar
initializeStatusBar();

const HomeScreen: React.FC = () => {
    const { achievements } = data.data;
    const { userData, user } = useAuth();
    const { openModal, emitLevelUp, emitBadgeUnlocked, emitMissionCompleted } = useEventManager();
    
    // Validar progreso diario al entrar
    useDailyValidation();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return '¡Buenos días';
        if (hour < 18) return '¡Buenas tardes';
        return '¡Buenas noches';
    };
    
    const getMotivationalMessage = () => {
        return '¡Comienza tu día reciclando algo! 🌱';
    };

    return (
        <IonPage >
            <IonContent fullscreen>
                <div className="gradient-primary flex-1">
                    <Container padding="sm" className="pt-6 space-y-5">
                        {/* Header */}
                        <div className='flex justify-between items-center mb-5'>
                            <div className='space-y-1'>
                                <Title variant="h2" color="white">
                                    {getGreeting()},  {userData?.displayName?.split(' ')[0]}!
                                </Title>
                                <Text size="base" color="white">
                                    Reciclador Nivel {userData?.level}
                                </Text>
                            </div>
                            <div className='bg-white rounded-full size-15 flex items-center justify-center'>
                                <Link to="/profile">
                                    <Avatar size={56} url={userData?.avatar} />
                                </Link>
                            </div>
                        </div>

                        {/* Progress level */}
                        <div>
                            <LevelProgress stats={{
                                nivel: userData?.level ?? 1,
                                nextLevel: userData?.xpToNextLevel ?? 0,
                                xp: userData?.xp ?? 0
                            }} />
                        </div>

                        {/* Motivational Message */}
                        <div>
                            <Card className='!py-6'>
                                <Text size="base" className="text-center text-zinc-600/90 !font-bold">
                                    {getMotivationalMessage()}
                                </Text>
                            </Card>
                        </div>

                        {/* Daily Goals */}
                        <div className='flex flex-row justify-stretch gap-5'>
                            <StreakCard streak={userData?.dailyMissionStreak || 0} />
                            <StatsCard title='Logros' value={`${userData?.achievements.length}/${achievements.length}`} />
                        </div>

                        {/* Progress today */}
                        <TodayProgress />
                        <QuickActions />

                        <Recents />
                        
                        {/* Botones de prueba para eventos desde componentes */}
                        <Button
                            fullWidth
                            onClick={() => emitLevelUp(5)}
                        >
                            Subir nivel (Componente)
                        </Button>
                        
                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={() => emitBadgeUnlocked({
                                name: "Reciclador Novato",
                                description: "Has reciclado tu primer objeto"
                            })}
                        >
                            Probar Badge (Componente)
                        </Button>
                        
                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={() => emitMissionCompleted({
                                title: "Reciclar 5 botellas",
                                xp: 50
                            })}
                        >
                            Probar Mission (Componente)
                        </Button>

                        {/* Botones de prueba para eventos desde servicios */}
                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={() => achievementService.levelUp(10, true)}
                        >
                            Nivel Especial (Servicio)
                        </Button>

                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={() => achievementService.unlockBadge(
                                "Reciclador Experto", 
                                "Has reciclado 100 objetos diferentes",
                                "https://badges.com/experto.png"
                            )}
                        >
                            Badge con Imagen (Servicio)
                        </Button>

                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={() => achievementService.completeMission(
                                "Misión Diaria Completa",
                                100,
                                true
                            )}
                        >
                            Misión Especial (Servicio)
                        </Button>

                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={() => achievementService.unlockSpecialAchievement(
                                "Reciclador Legendario",
                                "Has reciclado 1000 objetos en total"
                            )}
                        >
                            Logro Especial (Servicio)
                        </Button>
                        
                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={() => openModal({
                                title: '¡Nivel subido!',
                                description: '¡Has alcanzado un nuevo nivel!',
                                imageUrl:'https://firebasestorage.googleapis.com/v0/b/proyecto-1-una.firebasestorage.app/o/badges%2F1750399011892.png?alt=media&token=8c25c15a-dd0d-45b1-8050-af0508e412e5',
                                sound: '/level-up.mp3',
                                vibrate: true,
                                buttonText: '¡Genial!',
                            })}
                        >
                            Probar Modal Directo
                        </Button>

                        {/* Botón de prueba para simular reciclaje */}
                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={async () => {
                                if (user?.uid) {
                                    try {
                                        await dailyProgressService.addRecycling(user.uid);
                                        console.log('Reciclaje simulado agregado');
                                    } catch (error) {
                                        console.error('Error al simular reciclaje:', error);
                                    }
                                }
                            }}
                        >
                            Simular Reciclaje (Progreso Diario)
                        </Button>
                    </Container>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default HomeScreen;
