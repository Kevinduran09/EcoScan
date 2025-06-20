import { IonIcon } from "@ionic/react";
import { cameraOutline, checkmarkCircle, informationCircle } from "ionicons/icons";
import Card from "./Card";
import Button from "./ui/Button";
import { ReponseInterface } from "../types/responseTypes";

interface PreviewViewProps {
    show: boolean;
    title: string;
    content: string;
    imageUrl?: string;
    setShow: (show: boolean) => void;
    onSave?: () => Promise<void>;
    isSaving?: boolean;
    response?: ReponseInterface;
}

export const PreviewView: React.FC<PreviewViewProps> = ({ 
    show, 
    title, 
    content, 
    imageUrl, 
    setShow, 
    onSave, 
    isSaving = false,
    response
}) => {
    if (!show) return null;

    const handleClose = () => {
        setShow(false);
    };

    const handleSave = async () => {
        if (onSave) {
            await onSave();
        }
    };

    // Cierra al clicar fondo oscuro
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const getConfidenceColor = (confianza?: string) => {
        switch (confianza) {
            case 'alta': return 'text-green-600';
            case 'media': return 'text-yellow-600';
            case 'baja': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getConfidenceText = (confianza?: string) => {
        switch (confianza) {
            case 'alta': return 'Alta confianza';
            case 'media': return 'Confianza media';
            case 'baja': return 'Baja confianza';
            default: return 'Confianza desconocida';
        }
    };

    const getCategoryIcon = (tipo: string) => {
        const icons: Record<string, string> = {
            'carton': '📦',
            'papel': '📄',
            'vidrio': '🍶',
            'aluminio': '🥫',
            'plastico': '🥤',
            'organico': '🍎',
            'electronicos': '📱'
        };
        return icons[tipo] || '♻️';
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-3" 
            onClick={handleBackdropClick}
        >
            <Card className="w-[90%] max-w-md rounded-xl bg-white/90 shadow-lg px-6 py-5 relative">
                <div className="space-y-4">
                    <div id="preview-title" className="text-2xl font-semibold text-black border-b border-zinc-300 pb-4 flex items-center gap-2">
                        <span>{getCategoryIcon(title)}</span>
                        <span className="capitalize">{title}</span>
                    </div>

                    {imageUrl && (
                        <div className="w-full h-48 overflow-hidden rounded-md">
                            <img src={imageUrl} alt="Preview" className="object-contain w-full h-full" />
                        </div>
                    )}

                    {/* Información de confianza */}
                    {response?.confianza && (
                        <div className="flex items-center gap-2 px-2 py-2 bg-gray-50 rounded-lg">
                            <IonIcon icon={informationCircle} className={`size-5 ${getConfidenceColor(response.confianza)}`} />
                            <span className={`text-sm font-medium ${getConfidenceColor(response.confianza)}`}>
                                {getConfidenceText(response.confianza)}
                            </span>
                        </div>
                    )}

                    {/* Detalles adicionales */}
                    {response?.detalles && (
                        <div className="px-2 py-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700">{response.detalles}</p>
                        </div>
                    )}

                    <div className="px-2 py-3">
                        <span className="font-semibold text-black text-xl">Consejo de reciclaje: </span>
                        <p className="text-sm mt-2 text-zinc-700">{content}</p>
                    </div>

                    {/* botones */}
                    <div className="flex flex-row gap-4">
                        <Button
                            size="sm"
                            fullWidth
                            onClick={handleClose}
                            icon={cameraOutline}
                            variant="info"
                            className="!rounded-lg !px-3 !py-4"
                            disabled={isSaving}
                        >
                            Volver a tomar
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            icon={checkmarkCircle}
                            className="!rounded-lg"
                            onClick={handleSave}
                            disabled={isSaving || response?.success !== 200}
                        >
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
