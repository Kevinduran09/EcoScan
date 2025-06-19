// Servicio para manejar efectos de sonido
class SoundEffects {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;

  constructor() {
    // Inicializar AudioContext solo cuando sea necesario
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new AudioContext();
    }
  }

  // Habilitar/deshabilitar sonidos
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Sonido de éxito (frecuencia ascendente)
  playSuccessSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C
      oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E
      oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error reproduciendo sonido de éxito:', error);
    }
  }

  // Sonido de error (frecuencia descendente)
  playErrorSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A
      oscillator.frequency.setValueAtTime(415.30, this.audioContext.currentTime + 0.1); // Ab
      oscillator.frequency.setValueAtTime(392, this.audioContext.currentTime + 0.2); // G

      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error reproduciendo sonido de error:', error);
    }
  }

  // Sonido de confirmación (beep corto)
  playConfirmSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Error reproduciendo sonido de confirmación:', error);
    }
  }

  // Sonido de captura de foto
  playCameraSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Error reproduciendo sonido de cámara:', error);
    }
  }

  // Vibrar dispositivo (si está disponible)
  vibrate(pattern: number | number[] = 100) {
    if (!this.isEnabled || !navigator.vibrate) return;

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Error al vibrar:', error);
    }
  }

  // Combinar sonido y vibración para éxito
  playSuccessWithVibration() {
    this.playSuccessSound();
    this.vibrate([100, 50, 100]);
  }

  // Combinar sonido y vibración para error
  playErrorWithVibration() {
    this.playErrorSound();
    this.vibrate([200, 100, 200]);
  }
}

// Instancia singleton
export const soundEffects = new SoundEffects();

// Funciones de conveniencia
export const playSuccessSound = () => soundEffects.playSuccessSound();
export const playErrorSound = () => soundEffects.playErrorSound();
export const playConfirmSound = () => soundEffects.playConfirmSound();
export const playCameraSound = () => soundEffects.playCameraSound();
export const playSuccessWithVibration = () => soundEffects.playSuccessWithVibration();
export const playErrorWithVibration = () => soundEffects.playErrorWithVibration(); 