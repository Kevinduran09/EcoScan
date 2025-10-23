import { db } from "../core/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { invalidateRecyclingCache } from "./firebase/RecyclingCacheService";
import { DailyMissionsService } from "./DailyMissionsService";
import { ImageService } from "./ImageService";

export class RecyclingService {
  async processPhoto(
    userId: string,
    category: string,
    name: string,
    tipo: string,
    photoUri: string
  ) {
    const folder = `${userId}/recycle_images/${category}`;
    const publicId = `${name}-${Date.now()}`;
    const imageUrl = await ImageService.upload(photoUri, folder, publicId);

    await this.saveRecord(userId, tipo, imageUrl);
    await invalidateRecyclingCache();
    return imageUrl;
  }

  async analyzePhoto(base64Image: string) {
    return await ImageService.analyze(base64Image);
  }

  private async saveRecord(userId: string, tipo: string, imageUrl: string) {
    await addDoc(collection(db, `users/${userId}/recycle_history`), {
      tipo,
      imageUrl,
      timestamp: serverTimestamp(),
    });

    await setDoc(
      doc(db, `users/${userId}/recycleProgress/progress`),
      { [tipo]: increment(1) },
      { merge: true }
    );
    await setDoc(
      doc(db, `users/${userId}`),
      { totalRecycled: increment(1) },
      { merge: true }
    );

    await this.updateMissionsProgress(userId, tipo);
  }

  private async updateMissionsProgress(userId: string, tipo: string) {
    const missions = await DailyMissionsService.getTodayMissions(userId);
    for (const m of missions) {
      let shouldUpdate = false;
      let newProgress = m.progresoActual;

      if (
        (m.type === "material_recycle" && m.material === tipo) ||
        m.type === "count_recycle" ||
        (m.type === "item_category" && m.material === tipo)
      ) {
        shouldUpdate = true;
        newProgress = Math.min(m.progresoActual + 1, m.target);
      }

      if (shouldUpdate && newProgress >= m.target && m.estado !== "completada")
        await DailyMissionsService.completeMission(userId, m.id);
      else if (shouldUpdate && newProgress !== m.progresoActual)
        await DailyMissionsService.updateMissionProgressOnlyInFirebase(
          userId,
          m.id,
          newProgress
        );
    }
  }
}
