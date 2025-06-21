import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../core/firebaseConfig';

export interface RecyclingProgress {
  cardboard: number;
  electronicos: number;
  glass: number;
  metal: number;
  organic: number;
  papel: number;
  paper: number;
  plastic: number;
  plastico: number;
}

export const getRecyclingProgress = async (userId: string): Promise<RecyclingProgress | null> => {
  try {
    const progressDocRef = doc(db, 'users', userId, 'recycleProgress', 'progress');
    const docSnap = await getDoc(progressDocRef);
    console.log(docSnap.data());
    
    if (docSnap.exists()) {
      return docSnap.data() as RecyclingProgress;
    } else {
      console.log("No such recycling progress document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching recycling progress: ", error);
    throw error;
  }
}; 