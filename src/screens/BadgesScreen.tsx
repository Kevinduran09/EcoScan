import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonContent,
    IonIcon,
} from '@ionic/react';
import Container from '../components/ui/Container';
import Title from '../components/ui/Title';
import LinearGradient from '../components/ui/LinearGradiant';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { getAllBadges, Badge } from '../services/firebase/BadgesService';
import { useAuth } from '../contexts/authContext';
import BadgeCard from '../components/BadgeCard';
import AchievementCard from '../components/AchievementCard';
import { ACHIEVEMENTS } from '../utils/constant';

const initializeStatusBar = async () => {
    try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#7b5fff' });
    } catch (error) {
        console.error('Error al configurar StatusBar:', error);
    }
};

const BadgesScreen: React.FC = () => {
    const history = useHistory();
    const { userData } = useAuth();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'badges' | 'achievements'>('badges');

    useEffect(() => {
        initializeStatusBar();
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

    const handleBack = () => history.goBack();

    const badgesToUser = userData?.medals || [];
    const achievementToUser = userData?.achievements || []
    const total = badges.length;



   
    return (
        <IonPage>
            <IonContent fullscreen>
                <LinearGradient
                    colors={['#7b5fff', '#181c2f']}
                    direction="to bottom"
                    className="pb-8"
                >
                    <div className="relative px-6 pt-3 pb-6 bg-gradient-to-b from-[#7b5fff] to-[#5f4bb6] rounded-b-3xl shadow-lg">
                        <div className="flex justify-between items-center w-full">
                            <IonIcon onClick={handleBack} icon={arrowBack} className="size-8 text-white bg-white/20 rounded-full p-2" />
                            <Title variant="h1" color="white" className="text-3xl font-bold mb-2">
                                Mi Perfil
                            </Title>
                            <span className="bg-yellow-400/20 rounded-full px-3 py-1 text-xs text-yellow-300 font-semibold">
                                {`Insignias: ${badgesToUser.length}/${total}`}
                            </span>
                        </div>

                        <TabsSelector
                            activeTab={activeTab}
                            onSelectTab={setActiveTab}
                            tabs={[
                                { key: 'badges', label: 'Insignias' },
                                { key: 'achievements', label: 'Logros' },
                            ]}
                        />
                    </div>

                    <Container padding="sm" className="max-w-xl mx-auto mt-4">
                        {loading && <div className="text-white text-center py-8">Cargando insignias...</div>}
                        {error && <div className="text-red-400 text-center py-8">{error}</div>}

                        {!loading && !error && activeTab === 'badges' && (
                            <div className="grid grid-cols-2 gap-4">
                                {badges.map((badge) => (
                                    <BadgeCard
                                        key={badge.id}
                                        badge={badge}
                                        unlocked={badgesToUser.includes(badge.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {!loading && !error && activeTab === 'achievements' && (
                            <div className="grid grid-cols-2 gap-4">
                                {ACHIEVEMENTS.map((item, index) => (
                                    <AchievementCard
                                        key={index}
                                        achievement={item}
                                        unlocked={achievementToUser.includes(item.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </Container>
                </LinearGradient>
            </IonContent>
        </IonPage>
    );
};

export default BadgesScreen;



interface TabsSelectorProps {
    activeTab: 'badges' | 'achievements';
    onSelectTab: (tab: 'badges' | 'achievements') => void;
    tabs: { key: 'badges' | 'achievements'; label: string }[];
}

const TabsSelector: React.FC<TabsSelectorProps> = ({ activeTab, onSelectTab, tabs }) => {
    return (
        <div className="flex mt-6">
            {tabs.map(({ key, label }) => (
                <button
                    key={key}
                    className={`flex-1 !py-4 text-center font-bold ${activeTab === key ? 'bg-white/20 text-white !rounded-xl' : 'text-white/60'}`}
                    onClick={() => onSelectTab(key)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

