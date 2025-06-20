export interface ReponseInterface {
    tipo: string
    consejo: string
    success: number
    confianza?: "alta" | "media" | "baja"
    detalles?: string
}