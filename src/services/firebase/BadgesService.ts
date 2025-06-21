import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../core/firebaseConfig';
import { eventBus, EVENTS } from '../../utils/eventBus';

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  level: number;
  completed: boolean;
  progress: number;
  label: string;
  type:string;
  target:number;
  rewardXP:number;
  color: string;
}

export class BadgesService {
  static async getAllBadges(): Promise<Badge[]> {
    const badgesRef = collection(db, 'badges');
    const snapshot = await getDocs(badgesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Badge[];
  }

  static async getBadgesByUserId(userId: string): Promise<Badge[]> {

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return [];
    const userData = userSnap.data() as { medals?: string[] };
    const medals = userData.medals || [];
    if (medals.length === 0) return [];
    const badgesRef = collection(db, 'badges');
    const snapshot = await getDocs(badgesRef);
    return snapshot.docs
      .filter(doc => medals.includes(doc.id))
      .map(doc => ({ id: doc.id, ...doc.data() })) as Badge[];
  }
}

// Exportación de conveniencia
export const getAllBadges = BadgesService.getAllBadges;
export const getBadgesByUserId = BadgesService.getBadgesByUserId; 