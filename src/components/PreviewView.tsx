import { cameraOutline, checkmarkCircle } from "ionicons/icons";
import Card from "./Card";
import Button from "./ui/Button";

interface PreviewViewProps {
    show: boolean;
    title: string;
    content: string;
    imageUrl?: string; // Nueva prop opcional para la imagen
    setShow: (show: boolean) => void;
    onSave?: () => Promise<void>;
    isSaving?: boolean;
}

export const PreviewView: React.FC<PreviewViewProps> = ({ 
    show, 
    title, 
    content, 
    imageUrl, 
    setShow, 
    onSave, 
    isSaving = false 
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
                        <span>🍶</span>
                        <span>{title}</span>
                    </div>

                    {imageUrl && (
                        <div className="w-full h-48 overflow-hidden rounded-md">
                            <img src={imageUrl} alt="Preview" className="object-contain w-full h-full" />
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
                            disabled={isSaving}
                        >
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
