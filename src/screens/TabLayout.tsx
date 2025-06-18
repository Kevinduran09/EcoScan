import React from 'react'
import { CustomTabBar } from '../CustomTabBar'
import { Redirect, Route } from 'react-router'
import { IonRouterOutlet, IonTabs } from '@ionic/react'
import HomeScreen from './HomeScreen'

import MapScreen from './MapScreen'
import ChallengeScreen  from './ChallengeScreen'
import HistoryScreen from './HistoryScreen'
import ProfileScreen from './ProfileScreen'
import { StatusBar, Style } from '@capacitor/status-bar'
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
                <Route exact path="/profile">
                    <ProfileScreen />
                </Route>
                <Route exact path="/">
                    <Redirect to="/home" />
                </Route>
            </IonRouterOutlet>
            <CustomTabBar />
        </IonTabs>
    )
}

export default TabLayout