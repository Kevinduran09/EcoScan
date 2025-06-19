
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db, storage } from "../core/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  level: number;
  totalPoints: number;
  xp: number;
  xpToNextLevel: number;
  totalRecycled: number;
  dailyMissionStreak: number;
  achievements: string[];
  medals: string[];
  joinedAt: any;
  isOnline: boolean;
  lastSeen: any;
  location: string;
}



export const copyGooglePhotoToStorage = async (photoURL: string, uid: string) => {
  const corsProxy = "https://corsproxy.io/?";
  const response = await fetch(`${corsProxy}${encodeURIComponent(photoURL)}`);
  const blob = await response.blob();
  const storageRef = ref(storage, `avatars/${uid}.jpg`);
  await uploadBytes(storageRef, blob);

  return await getDownloadURL(storageRef); // URL pública y estable
};

export const createOrUpdateUserProfile = async (
  user: User
): Promise<{ isNew: boolean; userData: UserProfile }> => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return {
      isNew: false,
      userData: userSnap.data() as UserProfile,
    };
  }

  // Crear datos iniciales del perfil
  const userData: UserProfile = {
    id: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    avatar: user.photoURL || "👤",
    bio: "Nuevo usuario 🌱",
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalPoints: 0,
    totalRecycled: 0,
    dailyMissionStreak: 0,
    achievements: [],
    medals: [],
    joinedAt: serverTimestamp(),
    isOnline: true,
    lastSeen: serverTimestamp(),
    location: "Desconocida",
  };

  // // Manejar foto persistente si viene de Google
  // if (user.photoURL?.includes("googleusercontent")) {
  //   const stableAvatar = await copyGooglePhotoToStorage(user.photoURL, user.uid);
  //   userData.avatar = stableAvatar;
  // }

  // Batch para inicializar perfil y subcolecciones
  const batch = writeBatch(db);

  // 1. Perfil principal
  batch.set(userRef, userData);

  // 2. Progreso por material
  const progressRef = doc(db, `users/${user.uid}/recycleProgress`, "progress");
  batch.set(progressRef, {
    glass: 0,
    plastic: 0,
    paper: 0,
    metal: 0,
    organic: 0,
    cardboard: 0,
  });


  // 4. Misiones diarias del día actual
  const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
  const missionsRef = doc(db, `users/${user.uid}/daily_missions`, today);
  batch.set(missionsRef, {
    missions: [],
    generatedAt: serverTimestamp(),
  });

  // Commit de batch
  await batch.commit();

  return {
    isNew: true,
    userData,
  };
};
