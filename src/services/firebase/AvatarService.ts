import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../../core/firebaseConfig';
import { Capacitor } from '@capacitor/core';

export class AvatarService {
  /**
   * Selecciona una imagen de la galería o toma una foto
   */
  static async selectAvatarImage(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Permite elegir entre cámara y galería
        width: 400,
        height: 400
      });

      if (image.dataUrl) {
        return image.dataUrl;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error seleccionando imagen de avatar:', error);
      throw error;
    }
  }

  /**
   * Sube la imagen de avatar a Firebase Storage
   */
  static async uploadAvatarImage(userId: string, imageDataUrl: string): Promise<string> {
    try {
      // Convertir data URL a blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      // Crear referencia en Storage
      const timestamp = new Date().getTime();
      const storageRef = ref(storage, `avatars/${userId}/avatar-${timestamp}.jpg`);

      // Subir imagen
      await uploadBytes(storageRef, blob);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log('✅ Avatar subido exitosamente:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ Error subiendo avatar:', error);
      throw error;
    }
  }

  /**
   * Actualiza el avatar del usuario en Firestore
   */
  static async updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        avatar: avatarUrl,
        lastSeen: new Date()
      });
      
      console.log('✅ Avatar actualizado en perfil del usuario');
    } catch (error) {
      console.error('❌ Error actualizando avatar en perfil:', error);
      throw error;
    }
  }

  /**
   * Proceso completo: seleccionar, subir y actualizar avatar
   */
  static async changeUserAvatar(userId: string): Promise<string | null> {
    try {
      // 1. Seleccionar imagen
      const imageDataUrl = await this.selectAvatarImage();
      if (!imageDataUrl) {
        console.log('❌ No se seleccionó ninguna imagen');
        return null;
      }

      // 2. Subir a Firebase Storage
      const avatarUrl = await this.uploadAvatarImage(userId, imageDataUrl);

      // 3. Actualizar perfil del usuario
      await this.updateUserAvatar(userId, avatarUrl);

      return avatarUrl;
    } catch (error) {
      console.error('❌ Error en el proceso de cambio de avatar:', error);
      throw error;
    }
  }

  /**
   * Verifica si la plataforma soporta la funcionalidad de cámara
   */
  static isCameraSupported(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Verifica permisos de cámara
   */
  static async checkPermissions(): Promise<boolean> {
    try {
      const permission = await Camera.checkPermissions();
      return permission.camera === 'granted';
    } catch (error) {
      console.error('❌ Error verificando permisos:', error);
      return false;
    }
  }

  /**
   * Solicita permisos de cámara
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const permission = await Camera.requestPermissions();
      return permission.camera === 'granted';
    } catch (error) {
      console.error('❌ Error solicitando permisos:', error);
      return false;
    }
  }
} 