export interface LocalRecyclingData {
  id: string;
  imageUrl: string;
  tipo: string;
  consejo: string;
  confianza?: string;
  detalles?: string;
  timestamp: string;
  userId: string;
}

export class LocalStorageService {
  private static readonly STORAGE_KEY = 'local_recycling_data';
  private static readonly MAX_ITEMS = 50;

  static saveRecyclingData(data: Omit<LocalRecyclingData, 'id'>): void {
    try {
      const existingData = this.getRecyclingData();
      const newData: LocalRecyclingData = {
        ...data,
        id: Date.now().toString()
      };

      existingData.push(newData);

      // Mantener solo los últimos MAX_ITEMS registros
      if (existingData.length > this.MAX_ITEMS) {
        existingData.splice(0, existingData.length - this.MAX_ITEMS);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));
      console.log('✅ Datos guardados localmente');
    } catch (error) {
      console.error('❌ Error al guardar localmente:', error);
    }
  }

  static getRecyclingData(): LocalRecyclingData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error al obtener datos locales:', error);
      return [];
    }
  }

  static clearRecyclingData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Datos locales eliminados');
    } catch (error) {
      console.error('❌ Error al eliminar datos locales:', error);
    }
  }

  static getRecyclingDataByUser(userId: string): LocalRecyclingData[] {
    const allData = this.getRecyclingData();
    return allData.filter(item => item.userId === userId);
  }

  static getRecyclingDataByType(tipo: string): LocalRecyclingData[] {
    const allData = this.getRecyclingData();
    return allData.filter(item => item.tipo === tipo);
  }

  static getRecyclingStats(): {
    total: number;
    byType: Record<string, number>;
    byConfidence: Record<string, number>;
  } {
    const data = this.getRecyclingData();
    const stats = {
      total: data.length,
      byType: {} as Record<string, number>,
      byConfidence: {} as Record<string, number>
    };

    data.forEach(item => {
      // Contar por tipo
      stats.byType[item.tipo] = (stats.byType[item.tipo] || 0) + 1;
      
      // Contar por confianza
      const confianza = item.confianza || 'desconocida';
      stats.byConfidence[confianza] = (stats.byConfidence[confianza] || 0) + 1;
    });

    return stats;
  }
} 