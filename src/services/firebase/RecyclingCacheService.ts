import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../core/firebaseConfig';

export interface RecyclingItem {
  id: string;
  tipo: string;
  imageUrl: string;
  timestamp: Timestamp;
  consejo?: string;
}

export interface RecyclingStats {
  total: number;
  byType: Record<string, number>;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

class RecyclingCacheService {
  private cache: RecyclingItem[] = [];
  private statsCache: RecyclingStats | null = null;
  private lastSync: number = 0;
  private lastStatsSync: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private readonly STATS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

  // Obtener reciclajes recientes con caché inteligente
  async getRecentRecycling(userId: string, itemsLimit: number = 10): Promise<RecyclingItem[]> {
    try {
      // 1. Intentar cargar desde caché local
      const cached = await this.loadFromCache();
      
      // 2. Si el caché es válido, devolver inmediatamente
      if (this.isCacheValid() && cached.length > 0) {
        console.log('📱 Usando caché local para reciclajes recientes');
        return cached.slice(0, itemsLimit);
      }

      // 3. Si no hay caché o expiró, cargar desde Firebase
      console.log('🌐 Cargando reciclajes recientes desde Firebase...');
      const freshData = await this.loadFromFirebase(userId, itemsLimit);
      await this.saveToCache(freshData);
      return freshData;
      
    } catch (error) {
      console.warn('⚠️ Error cargando reciclajes, usando caché como fallback:', error);
      // 4. Si Firebase falla, usar caché obsoleto como fallback
      const cached = await this.loadFromCache();
      return cached.slice(0, itemsLimit);
    }
  }

  // Obtener estadísticas con caché
  async getRecyclingStats(userId: string): Promise<RecyclingStats> {
    try {
      // Verificar caché de estadísticas
      const cachedStats = await this.loadStatsFromCache();
      
      if (this.isStatsCacheValid() && cachedStats) {
        console.log('📊 Usando estadísticas en caché');
        return cachedStats;
      }

      console.log('📊 Calculando estadísticas desde Firebase...');
      const freshStats = await this.calculateStatsFromFirebase(userId);
      await this.saveStatsToCache(freshStats);
      return freshStats;
      
    } catch (error) {
      console.warn('⚠️ Error calculando estadísticas, usando caché:', error);
      const cachedStats = await this.loadStatsFromCache();
      return cachedStats || this.getDefaultStats();
    }
  }

  // Cargar desde caché local
  private async loadFromCache(): Promise<RecyclingItem[]> {
    try {
      const data = localStorage.getItem('recent_recycling_cache');
      const timestamp = localStorage.getItem('recent_recycling_timestamp');
      
      if (data && timestamp) {
        this.cache = JSON.parse(data);
        this.lastSync = parseInt(timestamp);
        return this.cache;
      }
    } catch (error) {
      console.warn('❌ Error cargando caché:', error);
    }
    return [];
  }

  // Cargar estadísticas desde caché
  private async loadStatsFromCache(): Promise<RecyclingStats | null> {
    try {
      const data = localStorage.getItem('recycling_stats_cache');
      const timestamp = localStorage.getItem('recycling_stats_timestamp');
      
      if (data && timestamp) {
        this.statsCache = JSON.parse(data);
        this.lastStatsSync = parseInt(timestamp);
        return this.statsCache;
      }
    } catch (error) {
      console.warn('❌ Error cargando caché de estadísticas:', error);
    }
    return null;
  }

  // Cargar desde Firebase
  private async loadFromFirebase(userId: string, itemsLimit: number): Promise<RecyclingItem[]> {
    const historyRef = collection(db, `users/${userId}/recycle_history`);
    const q = query(
      historyRef,
      orderBy('timestamp', 'desc'),
      limit(itemsLimit)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as RecyclingItem[];
  }

  // Calcular estadísticas desde Firebase
  private async calculateStatsFromFirebase(userId: string): Promise<RecyclingStats> {
    const historyRef = collection(db, `users/${userId}/recycle_history`);
    
    // Obtener todos los reciclajes del usuario
    const snapshot = await getDocs(historyRef);
    const items = snapshot.docs.map(doc => doc.data()) as RecyclingItem[];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const byType: Record<string, number> = {};
    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;
    
    items.forEach(item => {
      const itemDate = item.timestamp.toDate();
      
      // Contar por tipo
      byType[item.tipo] = (byType[item.tipo] || 0) + 1;
      
      // Contar por período
      if (itemDate >= today) todayCount++;
      if (itemDate >= weekAgo) weekCount++;
      if (itemDate >= monthAgo) monthCount++;
    });
    
    return {
      total: items.length,
      byType,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount
    };
  }

  // Guardar en caché local
  private async saveToCache(data: RecyclingItem[]): Promise<void> {
    try {
      localStorage.setItem('recent_recycling_cache', JSON.stringify(data));
      localStorage.setItem('recent_recycling_timestamp', Date.now().toString());
      this.cache = data;
      this.lastSync = Date.now();
      console.log('💾 Caché de reciclajes actualizado');
    } catch (error) {
      console.warn('❌ Error guardando caché:', error);
    }
  }

  // Guardar estadísticas en caché
  private async saveStatsToCache(stats: RecyclingStats): Promise<void> {
    try {
      localStorage.setItem('recycling_stats_cache', JSON.stringify(stats));
      localStorage.setItem('recycling_stats_timestamp', Date.now().toString());
      this.statsCache = stats;
      this.lastStatsSync = Date.now();
      console.log('💾 Caché de estadísticas actualizado');
    } catch (error) {
      console.warn('❌ Error guardando caché de estadísticas:', error);
    }
  }

  // Verificar si el caché es válido
  private isCacheValid(): boolean {
    return Date.now() - this.lastSync < this.CACHE_DURATION;
  }

  // Verificar si el caché de estadísticas es válido
  private isStatsCacheValid(): boolean {
    return Date.now() - this.lastStatsSync < this.STATS_CACHE_DURATION;
  }

  // Invalidar caché (llamar cuando se agrega nuevo reciclaje)
  async invalidateCache(): Promise<void> {
    console.log('🔄 Invalidando caché de reciclajes...');
    this.lastSync = 0;
    this.lastStatsSync = 0;
    try {
      localStorage.removeItem('recent_recycling_cache');
      localStorage.removeItem('recent_recycling_timestamp');
      localStorage.removeItem('recycling_stats_cache');
      localStorage.removeItem('recycling_stats_timestamp');
    } catch (error) {
      console.warn('❌ Error invalidando caché:', error);
    }
  }

  // Limpiar caché completamente
  async clearCache(): Promise<void> {
    console.log('🗑️ Limpiando caché completamente...');
    this.cache = [];
    this.statsCache = null;
    this.lastSync = 0;
    this.lastStatsSync = 0;
    
    try {
      localStorage.removeItem('recent_recycling_cache');
      localStorage.removeItem('recent_recycling_timestamp');
      localStorage.removeItem('recycling_stats_cache');
      localStorage.removeItem('recycling_stats_timestamp');
    } catch (error) {
      console.warn('❌ Error limpiando caché:', error);
    }
  }

  // Obtener estadísticas por defecto
  private getDefaultStats(): RecyclingStats {
    return {
      total: 0,
      byType: {},
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    };
  }

  // Obtener información del caché (para debugging)
  getCacheInfo(): { 
    hasCache: boolean; 
    lastSync: number; 
    cacheSize: number;
    isValid: boolean;
  } {
    return {
      hasCache: this.cache.length > 0,
      lastSync: this.lastSync,
      cacheSize: this.cache.length,
      isValid: this.isCacheValid()
    };
  }
}

// Instancia singleton
export const recyclingCacheService = new RecyclingCacheService();

// Funciones de conveniencia
export const getRecentRecycling = (userId: string, limit?: number) => 
  recyclingCacheService.getRecentRecycling(userId, limit);

export const getRecyclingStats = (userId: string) => 
  recyclingCacheService.getRecyclingStats(userId);

export const invalidateRecyclingCache = () => 
  recyclingCacheService.invalidateCache();

export const clearRecyclingCache = () => 
  recyclingCacheService.clearCache(); 