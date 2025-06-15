// src/contexts/authContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, authReady } from "../core/firebaseConfig";
import { createOrUpdateUserProfile, UserProfile } from "../utils/createOrUpdateUserProfile";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isNewUser: boolean;
  userData: UserProfile | null;
}

const AuthContext = createContext<AuthContextProps>({ user: null, loading: true, isNewUser: false, userData: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  useEffect(() => {
    authReady.then(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const { isNew, userData } = await createOrUpdateUserProfile(firebaseUser);
          setIsNewUser(isNew);
          setUserData(userData);
          setUser(firebaseUser);
        } else {
          setUser(null);
          setIsNewUser(false);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isNewUser, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  return useContext(AuthContext);
};
