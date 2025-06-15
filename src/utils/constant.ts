export const prompt = `Analiza la imagen proporcionada y clasifícala en una de las siguientes categorías: carton, papel, vidrio, aluminio, plastico, organico o electronicos.
Devuelve en json
- tipo: la categoría correspondiente o "error" si no aplica ninguna.
- consejo: una recomendación breve sobre cómo reciclar ese tipo de objeto.
- success: el estado numérico de la respuesta (200 si es válido, 400 si no aplica).
`

