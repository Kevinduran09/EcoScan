import { CustomTabBar } from '../CustomTabBar'
import { Redirect, Route } from 'react-router'
import { IonRouterOutlet, IonTabs } from '@ionic/react'
import HomeScreen from './HomeScreen'
import MapScreen from './MapScreen'
import ChallengeScreen  from './ChallengeScreen'
import HistoryScreen from './HistoryScreen'
import RankingScreen from './rankingScreen'
import ProfileScreen from './ProfileScreen'
import NotificationScreen from './NotificationScreen'
import { StatusBar, Style } from '@capacitor/status-bar'
import { usePushNotifications } from '../hooks/usePushNotifications'

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

const TabLayout = () => {
    usePushNotifications();

    return (
        <IonTabs className="ion-page">
            <IonRouterOutlet>
                <Route exact path="/home">
                    <HomeScreen />
                </Route>
                <Route exact path="/map">
                    <MapScreen />
                </Route>
                <Route exact path='/challenge'>
                    <ChallengeScreen/>
                </Route>
                <Route exact path="/history">
                    <HistoryScreen />
                </Route>
                <Route exact path="/ranking">
                    <RankingScreen />
                </Route>
                <Route exact path="/profile">
                    <ProfileScreen />
                </Route>
                <Route exact path="/notifications">
                    <NotificationScreen />
                </Route>
                <Route exact path="/">
                    <Redirect to="/home" />
                </Route>
            </IonRouterOutlet>
            <CustomTabBar/>
        </IonTabs>
    )
}

export default TabLayout


/*    <IonTabBar slot="bottom" style={{
                borderTop: '1px solid #ddd',
                boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
                paddingTop: '5px',
                paddingBottom: '5px'
            }}>
                <IonTabButton tab="home" href="/home">
                    <IonIcon icon={home} />
                    <IonLabel>Inicio</IonLabel>
                </IonTabButton>
                <IonTabButton tab="map" href="/map">
                    <IonIcon icon={map} />
                    <IonLabel>Mapa</IonLabel>
                </IonTabButton>
                <IonTabButton tab="challenge" href="/challenge">
                    <IonIcon icon={trophy} />
                    <IonLabel>Retos</IonLabel>
                </IonTabButton>
                <IonTabButton tab="history" href="/history">
                    <IonIcon icon={list} />
                    <IonLabel>Historial</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/profile">
                    <IonIcon icon={person} />
                    <IonLabel>Perfil</IonLabel>
                </IonTabButton>
                <IonTabButton tab="notifications" href="/notifications">
                    <IonIcon icon={notificationsOutline} />
                    <IonLabel>Notificaciones</IonLabel>
                    {unreadCount > 0 && (
                        <IonBadge color="danger">{unreadCount}</IonBadge>
                    )}
                </IonTabButton>
            </IonTabBar> */