import { model } from "../core/firebaseConfig";
import { ReponseInterface } from "../types/responseTypes";
import { prompt } from "../utils/constant";
import { extractJSONFromResponse } from "../utils/helpers";

export class ImageService {
  /**
   * 📤 Sube una imagen a Cloudinary usando un preset UNSIGNED
   * (funciona en frontend / navegador / Ionic)
   */
  static async upload(
    photoUri: string,
    folder: string,
    publicId: string
  ): Promise<string> {
    const cloudName = "dz8k3xnte"; // 👉 reemplaza con tu cloud_name de Cloudinary
    const uploadPreset = "unsigned_uploads"; // 👉 reemplaza con tu preset unsigned

    // Si la imagen viene como base64
    const isBase64 = photoUri.startsWith("data:image");

    const formData = new FormData();
    formData.append("file", isBase64 ? photoUri : await this._toFile(photoUri));
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);
    formData.append("public_id", publicId);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("❌ Error al subir a Cloudinary:", err);
      throw new Error("Error al subir la imagen a Cloudinary");
    }

    const data = await res.json();
    console.log("✅ Imagen subida correctamente:", data.secure_url);
    return data.secure_url;
  }

  /**
   * 🧠 Analiza una imagen con el modelo IA (opcional)
   */
  static async analyze(base64Image: string): Promise<ReponseInterface | null> {
    const base64Data = base64Image.split(",")[1];
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          ],
        },
      ],
    });

    const responseText = await result.response.text();
    const json = extractJSONFromResponse(responseText);

    if (!json) {
      throw new Error("El modelo no devolvió un JSON válido.");
    }

    return json as ReponseInterface;
  }

  /**
   * 🧩 Convierte una URL a archivo Blob (si no es base64)
   */
  private static async _toFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = `image-${Date.now()}.jpg`;
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  }
}
