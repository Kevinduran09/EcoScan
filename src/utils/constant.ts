export const prompt = `Analiza cuidadosamente la imagen proporcionada y clasifica el objeto de residuo en una de las siguientes categorías específicas:

CATEGORÍAS VÁLIDAS:
- "carton": Cajas, envases de cartón, cartones de leche, etc.
- "papel": Papeles, periódicos, revistas, sobres, etc.
- "vidrio": Botellas de vidrio, frascos, vasos de vidrio, etc.
- "aluminio": Latas de aluminio, papel aluminio, etc.
- "plastico": Botellas de plástico, envases plásticos, bolsas, etc.
- "organico": Restos de comida, cáscaras, residuos biodegradables, etc.
- "electronicos": Dispositivos electrónicos, baterías, cables, etc.

INSTRUCCIONES ESPECÍFICAS:
1. Observa detalladamente el material, forma y características del objeto
2. Si el objeto no es claramente identificable como residuo reciclable, clasifica como "error"
3. Si hay múltiples objetos, identifica el principal o más visible
4. Considera el contexto y uso típico del objeto

RESPUESTA REQUERIDA EN JSON:
{
  "tipo": "categoria_identificada_o_error",
  "consejo": "Consejo específico y útil sobre cómo reciclar correctamente este tipo de residuo. Incluye pasos prácticos si es necesario.",
  "success": 200,
  "confianza": "alta|media|baja",
  "detalles": "Breve descripción de por qué se clasificó así"
}

VALIDACIONES:
- success: 200 si es válido, 400 si no aplica o hay error
- confianza: "alta" si estás muy seguro, "media" si hay dudas menores, "baja" si hay incertidumbre significativa
- Si no puedes identificar el objeto o no es un residuo reciclable, devuelve tipo: "error" y success: 400

IMPORTANTE: Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`

