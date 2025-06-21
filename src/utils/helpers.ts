export function extractJSONFromResponse(responseText: string): Record<string, unknown> | null {
    try {
        const cleanText = responseText
            .replace(/```json\s*/gi, '')
            .replace(/```/g, '')
            .trim();

        const match = cleanText.match(/{[\s\S]*}/);
        if (!match) return null;

        return JSON.parse(match[0]);
    } catch (error) {
        console.error('Error al parsear JSON:', error);
        return null;
    }
}
