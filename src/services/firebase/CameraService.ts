import { ref } from "firebase/storage";
import { model, storage } from "../../core/firebaseConfig";
import { base64ToFile } from "../../utils/converterImage";
import { prompt } from "../../utils/constant";
import { extractJSONFromResponse } from "../../utils/helpers";
import { ReponseInterface } from "../../types/responseTypes";

export class CameraService {


    async uploadPhoto(photoUri: string, userId: string, category?: string) {
        try {
            // Convertir imagen en formato base64 a blob
            const base64Response = await fetch(photoUri);
            const blob = base64Response.blob()

            const timestamp = new Date().getTime()
            const storageRef = ref(storage,)
        } catch (error) {
            console.error("Error en uploadPhoto:", error);
            throw error;
        }
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
}