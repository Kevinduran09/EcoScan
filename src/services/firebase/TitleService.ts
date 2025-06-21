import { db } from '../../core/firebaseConfig';
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    updateDoc,
    doc,
    getDoc,
} from 'firebase/firestore';

export interface SpecialTitle {
    level: number;
    title: string;
    description: string;
}

const getTitlesCollection = () => collection(db, 'titles');
const getUserRef = (userId: string) => doc(db, 'users', userId);

export const getHighestTitleForLevel = async (
    userLevel: number
): Promise<SpecialTitle | null> => {
    try {
        const q = query(
            getTitlesCollection(),
            where('level', '<=', userLevel),
            orderBy('level', 'desc'),
            limit(1)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        const { level, title, description } = snapshot.docs[0].data();
        return { level, title, description };
    } catch (error) {
        console.error('Error al obtener título:', error);
        throw error;
    }
};


export const checkAndAwardTitleForLevel = async (
    userId: string,
    newLevel: number
): Promise<void> => {
    try {
        const newTitle = await getHighestTitleForLevel(newLevel);
        if (!newTitle) return;

        const userRef = getUserRef(userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const { title: currentTitle } = userSnap.data();
        if (currentTitle === newTitle.title) return;

        await updateDoc(userRef, {
            title: newTitle.title,
            bio: newTitle.description,
        });

        console.log(`🏆 Título otorgado a ${userId}: "${newTitle.title}"`);
    } catch (error) {
        console.error(`Error al otorgar título a ${userId}:`, error);
    }
};
