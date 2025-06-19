export type MissionType = 'material_recycle' | 'item_category' | 'shared_mission' |"count_recycle"

type BaseMission = {
  id: string;
  type: MissionType;
  estado: string;
  progresoActual: number;
  fechaAsignacion: string;
  fechaExpiracion: string;
}

type MaterialRecycleMission = BaseMission & {
  type: 'material_recycle';
  material: string;
  target: number;
  xp: number;
}

type ItemCategoryMission = BaseMission & {
  type: 'item_category';
  material: string;
  item: string;
  target: number;
  xp: number;
}

type CountMission = BaseMission & {
  type: 'count_recycle';
  target: number;
  xp: number;
}

export type Mission = MaterialRecycleMission | ItemCategoryMission | CountMission;
