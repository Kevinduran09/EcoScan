
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db,storage } from "../core/firebaseConfig";
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  level: number;
  totalPoints: number;
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

export const createOrUpdateUserProfile = async (user: User): Promise<{ isNew: boolean; userData: UserProfile }> => {
 
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return {
      isNew: false,
      userData: userSnap.data() as UserProfile,
    };
  }

  // Crear nuevo perfil
  const userData: UserProfile = {
    id: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    avatar: user.photoURL || "👤",
    bio: "Nuevo usuario 🌱",
    level: 1,
    totalPoints: 0,
    joinedAt: serverTimestamp(),
    isOnline: true,
    lastSeen: serverTimestamp(),
    location: "Desconocida",
  };

  if (user.photoURL?.includes("googleusercontent")) {
    const stableAvatar = await copyGooglePhotoToStorage(user.photoURL, user.uid);
    userData.avatar = stableAvatar;
  }

  await setDoc(userRef, userData);

  return {
    isNew: true,
    userData,
  };
};
