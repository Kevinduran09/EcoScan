export function extractJSONFromResponse(responseText: string): any | null {
    try {
        // Elimina etiquetas de bloque tipo ```json o ```
        const cleanText = responseText
            .replace(/```json\s*/gi, '')
            .replace(/```/g, '')
            .trim();

        // Encuentra el primer bloque de texto que parezca un JSON válido
        const match = cleanText.match(/{[\s\S]*}/);
        if (!match) return null;

        return JSON.parse(match[0]);
    } catch (error) {
        console.error('Error al parsear JSON:', error);
        return null;
    }
}
