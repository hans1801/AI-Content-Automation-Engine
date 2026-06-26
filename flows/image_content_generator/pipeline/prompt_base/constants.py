# flake8: noqa: E501

# ====================================================================================
# FORM-BASED GENERATION
# ====================================================================================

STYLE_DESCRIPTIONS: dict[str, str] = {
    "stickman": "Dynamic hand-drawn 2D webcomic sketch style, thick expressive black ink outlines, vibrant minimalist color palette for highlights, clean shading, white background with glowing accents.",
    "realistic": "Photorealistic cinematic style, high-detail rendering, natural dramatic lighting, professional photography quality, sharp focus, rich cinematic color grading.",
    "anime": "Japanese anime style, bold clean outlines, vibrant saturated colors, expressive character designs, dynamic composition, cel-shading with smooth gradients.",
    "watercolor": "Soft watercolor painting style, loose expressive brushstrokes, translucent overlapping color washes, gentle pastel palette, visible paper texture, dreamy and artistic feel.",
    "flat": "Clean modern flat design style, geometric simplified shapes, bold solid colors, minimal shadows, simple iconographic characters, professional and contemporary look.",
}

TONE_DESCRIPTIONS: dict[str, str] = {
    "motivacional": "motivacional y enérgico, con urgencia y convicción, que inspire acción inmediata",
    "educativo": "educativo y claro, con explicaciones precisas y ejemplos concretos, tono de mentor experto",
    "dramatico": "dramático y tenso, con narrativa de suspenso, giros inesperados e impacto emocional fuerte",
    "entretenimiento": "entretenido y dinámico, con ritmo ágil, momentos de sorpresa y enganche constante",
    "inspiracional": "inspiracional y emotivo, con historias de superación, valores universales y mensaje poderoso",
}

CATEGORY_DESCRIPTIONS: dict[str, str] = {
    "finanzas": "finanzas personales — dinero, inversión, ahorro y libertad financiera",
    "horror": "horror psicológico — suspenso, miedos, fenómenos inexplicables e historias perturbadoras",
    "motivacion": "superación personal — mentalidad de crecimiento, disciplina y logro de metas",
    "historia": "hechos históricos — personajes y eventos fascinantes que cambiaron el mundo",
    "ciencia": "ciencia y tecnología — descubrimientos, innovación y curiosidades del universo",
}

FORM_SCRIPT_PROMPT: str = """# 🎬 GENERADOR DE SCRIPT — VIDEO SHORT

## CONTEXTO DE CREACIÓN
**Idea central:** {idea}
**Categoría:** {category_desc}
**Tono narrativo:** {tone_desc}
**Formato de video:** {aspect_ratio}

## ESTILO VISUAL (OBLIGATORIO PARA TODOS LOS image_prompt)
Usa EXACTAMENTE este estilo en el campo `style` de cada escena:
`{style_desc}`
Usa EXACTAMENTE este aspect_ratio en el campo `aspect_ratio` de cada escena:
`{aspect_ratio}`

## ESTRUCTURA DEL GUION (MANDATORIA)
1. **Acto 1 — Hook [Escenas 1-4]:** Gancho que detenga el scroll en los primeros 3 segundos. Arranca con la idea central de forma impactante.
2. **Acto 2 — Desarrollo [Escenas 5-10]:** Desarrolla la idea con información valiosa, datos o narrativa que enganchen.
3. **Acto 3 — Cierre [Escenas 11-final]:** Conclusión poderosa con llamado a la acción o reflexión final memorable.

## REGLAS OBLIGATORIAS

### NARRACIÓN
- Frases cortas, directas y con ritmo acorde al tono indicado
- Campo `narration` siempre en **ESPAÑOL LATINOAMERICANO**
- Máximo una frase de narración por escena

### IMAGEN Y VIDEO
- Campos `image_prompt` (subjects, environment, lighting, composition, style) en **INGLÉS**
- Campos `video_prompt` (motion, camera_movement, transition, duration_hint) en **INGLÉS**
- El `image_prompt` debe ilustrar visualmente lo que dice la narración
- Las imágenes deben mostrar progresión narrativa coherente

### ESTRUCTURA
- Entre **12 y 16 escenas**
- Numeración secuencial desde 1
"""

# ====================================================================================
# JSON SCHEMAS
# ====================================================================================


CHUNK_INSTRUCTIONS: str = """
---
## 🎬 INSTRUCCIONES DE CONTINUIDAD (MÓDULO DE ESCENAS)
Actualmente estás generando una sección del guion completo.

**RANGO DE ESCENAS:** DEBES generar exactamente las escenas de la **{start_scene} a la {end_scene}**.

**CONTEXTO NARRATIVO ANTERIOR:**
{context}

**REGLA DE HILACIÓN:** Asegúrate de que la transición entre la última escena conocida y la nueva escena ({start_scene}) sea fluida, lógica y mantenga la misma atmósfera cinematográfica. No repitas escenas, solo continúa la historia. Mantén la numeración secuencial.
---
"""

# ====================================================================================
# CORE PROMPTS
# ====================================================================================

AUDIO_PROMPT: str = """Narra el siguiente guion con voz clara, expresiva y envolvente. Adapta el tono al contenido: si es dramático sube la intensidad, si es educativo mantén ritmo firme y seguro, si es motivacional transmite energía y convicción. Lee exactamente el texto tal cual aparece, sin omitir ni agregar nada:

{audio_text}"""

ALIGNMENT_PROMPT: str = """# 🧠 PROMPT MAESTRO — ALINEAMIENTO DE AUDIO Y TEXTO

Eres un experto en el alineamiento de audio y texto. Tu tarea es identificar los tiempos exactos de inicio y fin para cada escena del guion basándote en los datos de Whisper.

---

## 🔹 DATOS DE WHISPER (Con timestamps)
{whisper_data}

---

## 📝 GUION ORIGINAL (Escenas)
{scenes_data}

---

## 📋 INSTRUCCIONES (CRÍTICAS)
1. Debes devolver exactamente {expected_count} escenas en el JSON.
2. Para cada escena, identifica el tiempo de inicio (`start_time`) y fin (`end_time`) en el audio.
3. El inicio de la escena 1 suele ser 0.000s.
4. El fin de una escena debe coincidir con el inicio de la siguiente.
4. Sé preciso. Ignora pequeñas diferencias de palabras entre el guion y el audio.
5. Responde exclusivamente en formato JSON.

## 📦 FORMATO DE SALIDA (JSON)
Responde exclusivamente con el siguiente esquema JSON:
```json
{{
  "alignments": [
    {{
      "scene_number": 1,
      "start_time": 0.000,
      "end_time": 5.452
    }},
    ...
  ]
}}
```
"""
