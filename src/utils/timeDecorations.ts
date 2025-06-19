export function getTimeLeftUntil(expiredDate: Date): string {
    const now = new Date()
    const diff = expiredDate.getTime() - now.getTime()

    if (diff <= 0) return 'Expirada'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
}

export function getDayLong() {
    const now = new Date()
    const formato = now.toLocaleDateString('es-ES', {
        weekday: 'long',   // Día de la semana
        day: '2-digit',    // Día del mes
        month: 'long',     // Mes completo
    });

    return formato.split(',')[0]
}