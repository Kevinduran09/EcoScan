import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, model, storage } from "../../core/firebaseConfig";
import { prompt } from "../../utils/constant";
import { extractJSONFromResponse } from "../../utils/helpers";
import { ReponseInterface } from "../../types/responseTypes";
import { addDoc, collection, doc, increment, serverTimestamp, setDoc } from "firebase/firestore";
import { invalidateRecyclingCache } from "./RecyclingCacheService";
import { DailyMissionsService } from "../DailyMissionsService";

export class CameraService {

    async saveRecycleRecord(userId: string, imageUrl: string, tipo: string) {
        // 1. Guardar en historial
        const historyRef = collection(db, `users/${userId}/recycle_history`);
        await addDoc(historyRef, {
            tipo,
            imageUrl,
            timestamp: serverTimestamp(),
        });

        // 2. Actualizar resumen de reciclaje
        const summaryRef = doc(db, `users/${userId}/recycleProgress/progress`);
        await setDoc(summaryRef, {
            [tipo]: increment(1)
        }, { merge: true });

        // avtualizar contador total
        const userRef = doc(db,`users/${userId}`);
        await setDoc(userRef,{
          ["totalRecycled"]:increment(1)  
        },{merge:true})

        // 3. Actualizar progreso de misiones diarias
        await this.updateMissionsProgress(userId, tipo);

        // 4. Invalidar caché para que se actualice la lista de reciclajes recientes
        await invalidateRecyclingCache();
    }

    async uploadPhoto(photoUri: string, userId: string, category: string, name: string) {
        // Convertir imagen en formato base64 a blob
        const base64Response = await fetch(photoUri);
        const blob = await base64Response.blob()

        const timestamp = new Date().getTime()
        const storageRef = ref(storage, `${userId}/recycle_images/${name}-${timestamp}.jpg`)

        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef); // URL pública y estable
    }

    async analyzeImageWithIA(base64Image: string): Promise<ReponseInterface> {

        const base64Data = base64Image.split(',')[1];
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt,
                        },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: base64Data
                            }
                        }
                    ]
                }
            ]
        })

        try {
            const responseText = await result.response.text();
            const json = extractJSONFromResponse(responseText)
            console.log(json);

            return json;
        } catch (err) {
            console.error("Error al parsear JSON:", err, result.response.text());
            throw new Error("El modelo no devolvió JSON válido.");
        }

    }

    /**
     * Actualiza el progreso de las misiones diarias basado en el tipo de residuo reciclado
     */
    private async updateMissionsProgress(userId: string, tipo: string): Promise<void> {
        try {
            // Obtener misiones actuales
            const missions = await DailyMissionsService.getTodayMissions(userId);
            
            // Actualizar progreso para misiones relevantes
            for (const mission of missions) {
                let shouldUpdate = false;
                let newProgress = mission.progresoActual;

                // Verificar si la misión coincide con el tipo reciclado
                if (mission.type === 'material_recycle' && mission.material === tipo) {
                    shouldUpdate = true;
                    newProgress = Math.min(mission.progresoActual + 1, mission.target);
                } else if (mission.type === 'count_recycle') {
                    shouldUpdate = true;
                    newProgress = Math.min(mission.progresoActual + 1, mission.target);
                } else if (mission.type === 'item_category' && mission.material === tipo) {
                    shouldUpdate = true;
                    newProgress = Math.min(mission.progresoActual + 1, mission.target);
                }
                
                // Si la misión se completó, marcarla como completada
                if (shouldUpdate && newProgress >= mission.target && mission.estado !== 'completada') {
                    await DailyMissionsService.completeMission(userId, mission.id);
                    console.log(`🎉 Misión completada: ${mission.id} - ${mission.type}`);
                } else if (shouldUpdate && newProgress !== mission.progresoActual) {
                    
                    await DailyMissionsService.updateMissionProgressOnlyInFirebase(userId, mission.id, newProgress);
                    console.log(`📈 Progreso actualizado para misión: ${mission.id} (${newProgress}/${mission.target})`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Error actualizando progreso de misiones:', error);
        }
    }
}