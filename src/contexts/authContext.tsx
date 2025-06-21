import React, { createContext, useContext, useEffect, useState, useRef } from "react";

import { User, onAuthStateChanged } from "firebase/auth";
import { auth, authReady } from "../core/firebaseConfig";
import { createOrUpdateUserProfile, UserProfile } from "../utils/createOrUpdateUserProfile";
import { DailyMissionsService } from "../services/DailyMissionsService";
import { eventBus, EVENTS } from "../utils/eventBus";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isNewUser: boolean;
  userData: UserProfile | null;
  setRegistrationData: (data: { displayName?: string }) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({ 
  user: null, 
  loading: true, 
  isNewUser: false, 
  userData: null,
  setRegistrationData: () => {},
  refreshUserData: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [registrationData, setRegistrationData] = useState<{ displayName?: string }>({});
  


  const registrationDataRef = useRef<{ displayName?: string }>({});
  const initializeDailyMissions = async (userId: string) => {
    try {
      console.log("🚀 Inicializando misiones diarias...");
      await DailyMissionsService.getTodayMissions(userId);
      console.log("✅ Misiones diarias inicializadas correctamente");
    } catch (error) {
      console.error("❌ Error inicializando misiones diarias:", error);
    }
  };

  const cleanOldData = () => {
    try {
      DailyMissionsService.cleanOldLocalData();
    } catch (error) {
      console.warn("⚠️ Error limpiando datos antiguos:", error);
    }
  };

  // Función para manejar el cambio de estado de autenticación
  const handleAuthStateChange = async (firebaseUser: User | null) => {
    if (firebaseUser) {
      // Usar los datos de registro actuales desde la ref
      const currentRegistrationData = registrationDataRef.current;
      const { isNew, userData } = await createOrUpdateUserProfile(firebaseUser, currentRegistrationData);
      
      setIsNewUser(isNew);
      setUserData(userData);
      setUser(firebaseUser);
      
      // Limpiar los datos de registro después de usarlos
      registrationDataRef.current = {};
      setRegistrationData({});
      
      await initializeDailyMissions(firebaseUser.uid);
    } else {
      setUser(null);
      setIsNewUser(false);
      setUserData(null);
    }
    setLoading(false);
  };

  // useEffect para el listener de autenticación (sin dependencias problemáticas)
  useEffect(() => {
    authReady.then(() => {

      const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

      return () => unsubscribe();
    });

    cleanOldData();
  }, []); // Sin dependencias

  // useEffect separado para actualizar la ref cuando cambien los datos de registro
  useEffect(() => {
    registrationDataRef.current = registrationData;
  }, [registrationData]);

  const refreshUserData = async () => {
    if (user) {
      try {
        const { userData: updatedUserData } = await createOrUpdateUserProfile(user, {});
        setUserData(updatedUserData);
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  // Listener para eventos de actualización de estadísticas
  useEffect(() => {
    const handleUserStatsUpdate = () => {
      
      refreshUserData();
    };

    const handleLevelUp = () => {
      refreshUserData();
    };

    const handleMissionCompleted = () => {
      refreshUserData();
    };

    // Suscribirse a eventos
    eventBus.on(EVENTS.USER_STATS_UPDATED, handleUserStatsUpdate);
    eventBus.on(EVENTS.LEVEL_UP, handleLevelUp);
    eventBus.on(EVENTS.MISSION_COMPLETED, handleMissionCompleted);

    return () => {
      eventBus.off(EVENTS.USER_STATS_UPDATED, handleUserStatsUpdate);
      eventBus.off(EVENTS.LEVEL_UP, handleLevelUp);
      eventBus.off(EVENTS.MISSION_COMPLETED, handleMissionCompleted);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, isNewUser, userData, setRegistrationData, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  return useContext(AuthContext);
};