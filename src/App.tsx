import { Route } from 'react-router-dom';
import {
  IonApp,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import CameraScreen from './screens/CameraScreen';
import BadgesScreen from './screens/BadgesScreen';
import { EventManager } from './components/EventManager';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */

/* Theme variables */
import './theme/variables.css';

import TabLayout from './screens/TabLayout';
import LoginScreen from './screens/LoginScreen';
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './components/rutasRedireccion/rutasPrivadas';
setupIonicReact();
// Configurar 

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <EventManager>
        <IonReactRouter>
          {/* Ruta publica */}
          <Route path="/login" exact render={() => <LoginScreen />} />

          {/* Rutas protegidas */}
          <PrivateRoute path="/" component={TabLayout} />
          <PrivateRoute path="/camera" exact component={CameraScreen} />
          <Route path="/badges" component={BadgesScreen} />
        </IonReactRouter>
      </EventManager>
    </AuthProvider>
  </IonApp>
);

export default App;
