import React, { useEffect, useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { eventBus, EVENTS } from '../utils/eventBus';
import CustomModal from './CustomModal';
import jedi from '../animations/jedi_leveluo.json';
import celebration from '../animations/celebration.json'
// Tipos para los modales
interface ModalProps {
    title?: string;
    description?: string;
    imageUrl?: string | null;
    animation?: object | null;
    sound?: string | null;
    vibrate?: boolean;
    buttonText?: string;
    onButtonClick?: () => void;
    children?: React.ReactNode;
}

interface EventManagerContextType {
    openModal: (props: ModalProps) => void;
    closeModal: () => void;
    emitLevelUp: (level?: number, modalConfig?: ModalProps) => void;
    emitBadgeUnlocked: (badge: { name: string; description: string }, modalConfig?: ModalProps) => void;
    emitMissionCompleted: (mission: { title: string; xp: number }, modalConfig?: ModalProps) => void;
}

const EventManagerContext = createContext<EventManagerContextType | undefined>(undefined);

interface EventManagerProps {
    children: ReactNode;
}

export const EventManager: React.FC<EventManagerProps> = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalProps, setModalProps] = useState<ModalProps>({});

    const openModal = useCallback((props: ModalProps = {}) => {
        setModalProps(props);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
    }, []);

    // Manejador unificado para eventos de nivel
    const handleLevelUp = useCallback((...args: unknown[]) => {
        const newLevel = args[0] as number || 1;
        const modalConfig = args[1] as ModalProps || {}; // Configuración opcional
        
        openModal({
            title: `¡Nivel ${newLevel} Alcanzado! 🎉`,
            description: `¡Felicidades! Has subido al nivel ${newLevel}. Sigue reciclando para llegar al siguiente nivel.`,
            animation: jedi,
            sound: '/level-up.mp3',
            vibrate: true,
            buttonText: '¡Genial!',
            ...modalConfig, // Aplicar configuración personalizada
        });
    }, [openModal]);

    // Manejador para eventos de badge
    const handleBadgeUnlocked = useCallback((...args: unknown[]) => {
        const badgeData = args[0] as { name: string; description: string };
        const modalConfig = args[1] as ModalProps || {}; // Configuración opcional
        
        openModal({
            title: `🏆 ¡Nuevo Logro: ${badgeData.name}!`,
            description: badgeData.description,
            buttonText: '¡Genial!',
            vibrate: true,
            sound: '/level-up.mp3',
            ...modalConfig, // Aplicar configuración personalizada
        });
    }, [openModal]);

    // Manejador para eventos de misión completada
    const handleMissionCompleted = useCallback((...args: unknown[]) => {
        const missionData = args[0] as { title: string; xp: number };
        const modalConfig = args[1] as ModalProps || {}; // Configuración opcional
        
        openModal({
            title: '✅ ¡Misión Completada!',
            description: `${missionData.title}\n\n+${missionData.xp} XP ganados`,
            buttonText: 'Continuar',
            animation: celebration,
            vibrate: true,
            sound: '/level-up.mp3',
            ...modalConfig, // Aplicar configuración personalizada
        });
    }, [openModal]);

    // Hook para emitir eventos fácilmente
    const emitLevelUp = useCallback((level: number = 1, modalConfig?: ModalProps) => {
        eventBus.emit(EVENTS.LEVEL_UP, level, modalConfig);
    }, []);

    const emitBadgeUnlocked = useCallback((
        badge: { name: string; description: string }, 
        modalConfig?: ModalProps
    ) => {
        eventBus.emit(EVENTS.BADGE_UNLOCKED, badge, modalConfig);
    }, []);

    const emitMissionCompleted = useCallback((
        mission: { title: string; xp: number }, 
        modalConfig?: ModalProps
    ) => {
        eventBus.emit(EVENTS.MISSION_COMPLETED, mission, modalConfig);
    }, []);

    useEffect(() => {
        // Suscribirse a todos los eventos
        eventBus.on(EVENTS.LEVEL_UP, handleLevelUp);
        eventBus.on(EVENTS.BADGE_UNLOCKED, handleBadgeUnlocked);
        eventBus.on(EVENTS.MISSION_COMPLETED, handleMissionCompleted);

        // Limpiar suscripciones al desmontar
        return () => {
            eventBus.off(EVENTS.LEVEL_UP, handleLevelUp);
            eventBus.off(EVENTS.BADGE_UNLOCKED, handleBadgeUnlocked);
            eventBus.off(EVENTS.MISSION_COMPLETED, handleMissionCompleted);
        };
    }, [handleLevelUp, handleBadgeUnlocked, handleMissionCompleted]);

    const contextValue: EventManagerContextType = {
        openModal,
        closeModal,
        emitLevelUp,
        emitBadgeUnlocked,
        emitMissionCompleted,
    };

    return (
        <EventManagerContext.Provider value={contextValue}>
            {children}

            {/* Modal unificado */}
            <CustomModal
                show={showModal}
                onClose={closeModal}
                {...modalProps}
            />
        </EventManagerContext.Provider>
    );
};

// Hook para usar el EventManager
export const useEventManager = () => {
    const context = useContext(EventManagerContext);
    if (!context) {
        throw new Error('useEventManager debe usarse dentro de EventManager');
    }
    return context;
};

// Hook legacy para compatibilidad (opcional)
export const useEventEmitter = () => {
    const context = useContext(EventManagerContext);
    if (!context) {
        throw new Error('useEventEmitter debe usarse dentro de EventManager');
    }
    return {
        emitLevelUp: context.emitLevelUp,
        emitBadgeUnlocked: context.emitBadgeUnlocked,
        emitMissionCompleted: context.emitMissionCompleted,
    };
}; 