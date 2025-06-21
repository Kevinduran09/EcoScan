export const prompt = `Analiza cuidadosamente la imagen proporcionada y clasifica el objeto de residuo en una de las siguientes categorías específicas:

CATEGORÍAS VÁLIDAS:
- "carton": Cajas, envases de cartón, cartones de leche, etc.
- "papel": Papeles, periódicos, revistas, sobres, etc.
- "vidrio": Botellas de vidrio, frascos, vasos de vidrio, etc.
- "aluminio": Latas de aluminio, papel aluminio, etc.
- "plastico": Botellas de plástico, envases plásticos, bolsas, etc.
- "organico": Restos de comida, cáscaras, residuos biodegradables, etc.
- "electronicos": Dispositivos electrónicos, baterías, cables, etc.

INSTRUCCIONES ESPECÍFICAS:
1. Observa detalladamente el material, forma y características del objeto
2. Si el objeto no es claramente identificable como residuo reciclable, clasifica como "error"
3. Si hay múltiples objetos, identifica el principal o más visible
4. Considera el contexto y uso típico del objeto

RESPUESTA REQUERIDA EN JSON:
{
  "tipo": "categoria_identificada_o_error",
  "consejo": "Consejo específico y útil sobre cómo reciclar correctamente este tipo de residuo. Incluye pasos prácticos si es necesario.",
  "success": 200,
  "confianza": "alta|media|baja",
  "detalles": "Breve descripción de por qué se clasificó así"
}

VALIDACIONES:
- success: 200 si es válido, 400 si no aplica o hay error
- confianza: "alta" si estás muy seguro, "media" si hay dudas menores, "baja" si hay incertidumbre significativa
- Si no puedes identificar el objeto o no es un residuo reciclable, devuelve tipo: "error" y success: 400

IMPORTANTE: Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`

// Constantes de logros (Achievements)
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'level' | 'recycler' | 'streak' | 'special';
  condition: {
    type: 'level' | 'totalRecycled' | 'dailyMissionStreak';
    value: number;
  };
  rewardXP?: number;
  icon?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Logros basados en nivel
  {
    id: 'level_5',
    name: 'Aprendiz Verde',
    description: 'Alcanza el nivel 5',
    type: 'level',
    condition: { type: 'level', value: 5 },
    rewardXP: 50,
    icon: '🌱'
  },
  {
    id: 'level_10',
    name: 'Guardián del Medio Ambiente',
    description: 'Alcanza el nivel 10',
    type: 'level',
    condition: { type: 'level', value: 10 },
    rewardXP: 100,
    icon: '🌿'
  },
  {
    id: 'level_20',
    name: 'Maestro Reciclador',
    description: 'Alcanza el nivel 20',
    type: 'level',
    condition: { type: 'level', value: 20 },
    rewardXP: 200,
    icon: '🌳'
  },
  {
    id: 'level_50',
    name: 'Leyenda Verde',
    description: 'Alcanza el nivel 50',
    type: 'level',
    condition: { type: 'level', value: 50 },
    rewardXP: 500,
    icon: '🏆'
  },

  // Logros basados en reciclaje total
  {
    id: 'recycler_10',
    name: 'Reciclador Novato',
    description: 'Recicla 10 elementos',
    type: 'recycler',
    condition: { type: 'totalRecycled', value: 10 },
    rewardXP: 25,
    icon: '♻️'
  },
  {
    id: 'recycler_50',
    name: 'Reciclador Experto',
    description: 'Recicla 50 elementos',
    type: 'recycler',
    condition: { type: 'totalRecycled', value: 50 },
    rewardXP: 75,
    icon: '♻️♻️'
  },
  {
    id: 'recycler_100',
    name: 'Reciclador Maestro',
    description: 'Recicla 100 elementos',
    type: 'recycler',
    condition: { type: 'totalRecycled', value: 100 },
    rewardXP: 150,
    icon: '♻️♻️♻️'
  },
  {
    id: 'recycler_500',
    name: 'Héroe del Reciclaje',
    description: 'Recicla 500 elementos',
    type: 'recycler',
    condition: { type: 'totalRecycled', value: 500 },
    rewardXP: 300,
    icon: '🦸‍♂️'
  },

  // Logros basados en racha de misiones diarias
  {
    id: 'streak_3',
    name: 'Constancia',
    description: 'Completa misiones 3 días seguidos',
    type: 'streak',
    condition: { type: 'dailyMissionStreak', value: 3 },
    rewardXP: 30,
    icon: '🔥'
  },
  {
    id: 'streak_7',
    name: 'Semana Verde',
    description: 'Completa misiones 7 días seguidos',
    type: 'streak',
    condition: { type: 'dailyMissionStreak', value: 7 },
    rewardXP: 75,
    icon: '🔥🔥'
  },
  {
    id: 'streak_30',
    name: 'Mes Sostenible',
    description: 'Completa misiones 30 días seguidos',
    type: 'streak',
    condition: { type: 'dailyMissionStreak', value: 30 },
    rewardXP: 200,
    icon: '🔥🔥🔥'
  },
  {
    id: 'streak_100',
    name: 'Leyenda de la Constancia',
    description: 'Completa misiones 100 días seguidos',
    type: 'streak',
    condition: { type: 'dailyMissionStreak', value: 100 },
    rewardXP: 500,
    icon: '👑'
  }
];

// Función helper para obtener logro por ID
export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
};

// Función helper para obtener logros por tipo
export const getAchievementsByType = (type: Achievement['type']): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.type === type);
};

// Función helper para verificar si un usuario cumple las condiciones de un logro
export const checkAchievementCondition = (
  achievement: Achievement,
  userStats: { level: number; totalRecycled: number; dailyMissionStreak: number }
): boolean => {
  const { condition } = achievement;
  
  switch (condition.type) {
    case 'level':
      return userStats.level >= condition.value;
    case 'totalRecycled':
      return userStats.totalRecycled >= condition.value;
    case 'dailyMissionStreak':
      return userStats.dailyMissionStreak >= condition.value;
    default:
      return false;
  }
};

// Función helper para obtener logros próximos (no desbloqueados pero cercanos)
export const getUpcomingAchievements = (
  userStats: { level: number; totalRecycled: number; dailyMissionStreak: number },
  currentAchievements: string[]
): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => {
    // No incluir logros ya desbloqueados
    if (currentAchievements.includes(achievement.id)) {
      return false;
    }

    // Obtener el valor actual del usuario para el tipo de condición
    let currentValue: number;
    switch (achievement.condition.type) {
      case 'level':
        currentValue = userStats.level;
        break;
      case 'totalRecycled':
        currentValue = userStats.totalRecycled;
        break;
      case 'dailyMissionStreak':
        currentValue = userStats.dailyMissionStreak;
        break;
      default:
        return false;
    }

    // Incluir logros que estén a máximo un 50% de distancia del objetivo
    const targetValue = achievement.condition.value;
    const progress = currentValue / targetValue;
    return progress >= 0.5 && progress < 1;
  });
};

// Función helper para calcular el progreso de un logro específico
export const getAchievementProgress = (
  achievement: Achievement,
  userStats: { level: number; totalRecycled: number; dailyMissionStreak: number }
): { current: number; target: number; percentage: number } => {
  let currentValue: number;
  
  switch (achievement.condition.type) {
    case 'level':
      currentValue = userStats.level;
      break;
    case 'totalRecycled':
      currentValue = userStats.totalRecycled;
      break;
    case 'dailyMissionStreak':
      currentValue = userStats.dailyMissionStreak;
      break;
    default:
      currentValue = 0;
  }

  const targetValue = achievement.condition.value;
  const percentage = Math.min(100, Math.max(0, (currentValue / targetValue) * 100));

  return {
    current: currentValue,
    target: targetValue,
    percentage
  };
};

// Función helper para obtener logros por categoría con progreso
export const getAchievementsWithProgress = (
  userStats: { level: number; totalRecycled: number; dailyMissionStreak: number },
  currentAchievements: string[]
): Array<Achievement & { progress: { current: number; target: number; percentage: number }; unlocked: boolean }> => {
  return ACHIEVEMENTS.map(achievement => {
    const progress = getAchievementProgress(achievement, userStats);
    const unlocked = currentAchievements.includes(achievement.id);
    
    return {
      ...achievement,
      progress,
      unlocked
    };
  });
};

