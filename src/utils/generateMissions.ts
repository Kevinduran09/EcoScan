
// tipos de misiones
const MISSIONS_TYPES = ['material_recycle', 'item_category', 'shared_mission'] as const;

type MissionType = typeof MISSIONS_TYPES[number];

// materiales reciclables 
const materials = ["vidrio", "plástico", "papel", "orgánico", "aluminio", "cartón"]

// items por categoria
const itemCategories = {
    "vidrio": ["botella", "espejo"],
    "plástico": ["envase", "bolsa"],
    "papel": ["hoja", "cuaderno"],
    "orgánico": ["restos de comida", "cáscara"],
    "aluminio": ["lata", "envoltorio"],
    "cartón": ["caja", "tubo"]
};

type MaterialKey = keyof typeof itemCategories;

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array: ReadonlyArray<string>) {
    return array[Math.floor(Math.random() * array.length)]
}


function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function getTodayISO() {
    return new Date().toISOString();
}

function getTomorrowISO() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
}

// Generar mision randomizada
function generateMission(type: MissionType) {
    const base = {
        id: generateId(),
        type,
        estado: "pendiente",
        progresoActual: 0,
        fechaAsignacion: getTodayISO(),
        fechaExpiracion: getTomorrowISO()
    };

    if (type === 'material_recycle') {
        const material = randomChoice(materials)
        const target = randomInt(1, 5)
        const xp = target * randomInt(5, 20) // xp proporcional al target de la mision

        return {
            ...base,
            material,
            target,
            xp
        }
    }
    if (type === 'item_category') {
        const material = randomChoice(Object.keys(itemCategories)) as MaterialKey;
        const items = itemCategories[material];
        const item = randomChoice(items)
        const target = randomInt(1, 4)
        const xp = target * randomInt(5, 20) // xp proporcional al target de la mision
        return {
            ...base,
            material,
            item,
            target,
            xp
        }
    }

    if (type === 'shared_mission') {
        const target = randomInt(1, 3)
        const xp = target * randomInt(2, 6)
        return {
            ...base,
            target,
            xp
        }
    }

    return null
}

export function generateMissions(n = 5) {

    const missions = []

    while (missions.length < n) {
        const mision_type = randomChoice(MISSIONS_TYPES) as MissionType
        const mission = generateMission(mision_type)
        if (mission) missions.push(mission)
    }

    return missions
}


