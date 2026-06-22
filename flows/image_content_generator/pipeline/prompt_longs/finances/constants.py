# flake8: noqa: E501
IDEA_PROMPT_MINDSET: str = """# 🧠 PROMPT MAESTRO — AGENTE DE IDEAS FINANCIERAS (ESTILO MENTALIDAD - LONG)
**Objetivo:** Generar una idea profunda para un video de 10 minutos sobre una transformación de mentalidad financiera.

**Instrucciones:**
1. Protagonista: Una persona común (empleado, joven profesional, padre de familia) que atraviesa una crisis financiera real y llega a una revelación profunda.
2. Arco Narrativo: Desarrollo profundo del conflicto financiero, el proceso de aprendizaje y la transformación antes de la resolución. Incluye recaídas, dudas y victorias pequeñas.
3. El tono debe ser épico, emotivo y cinematográfico — como un documental motivacional de alto impacto.
"""

IDEA_PROMPT_ESTRATEGIA: str = """# 🧠 PROMPT MAESTRO — AGENTE DE IDEAS FINANCIERAS (ESTILO ESTRATEGIA - LONG)
**Objetivo:** Generar una idea para un video de 10 minutos que explique en profundidad una estrategia financiera poderosa.

**Instrucciones:**
1. Protagonista: Un personaje o narrador que guía al espectador a través de un sistema financiero completo.
2. Contexto Detallado: Explica la historia del concepto, sus fundamentos matemáticos o psicológicos, casos de éxito reales y cómo aplicarlo paso a paso.
3. El tono debe ser educativo, inspirador y cinematográfico — como un masterclass visual de finanzas personales.
"""

SCRIPT_PROMPT: str = """# 📝 PROMPT MAESTRO — AGENTE GUIONISTA FINANCIERO (STORYTELLING - LONG)
**Objetivo:** Crear un guion detallado de 120 escenas para un video de 10 minutos sobre finanzas personales.

## 📜 REGLAS OBLIGATORIAS

### 🟢 NARRACIÓN Y RITMO
- **Tono:** Épico, cinematográfico y motivacional. Mezcla de documental y masterclass visual.
- **Narración:** Progresión profunda del conflicto financiero, el aprendizaje y la resolución. Incluye datos concretos, comparativas y momentos de inflexión.
- **Personaje:** Mantén coherencia visual y narrativa del protagonista a lo largo de las 120 escenas.

### 🔵 REGLAS VISUALES
- **Representación Visual:** Usa metáforas visuales poderosas para conceptos abstractos (interés compuesto = bola de nieve, deuda = cadenas, libertad financiera = horizonte abierto).
- **Variedad:** Alterna entre escenas del protagonista, infografías animadas, ambientes de oficina, calles de ciudad, hogares, y momentos de superación.

### 🔴 ESTRUCTURA Y SALIDA
- **Extensión:** Exactamente 120 escenas.
- **Cierre:** Resolución épica con transformación completa del personaje y un mensaje financiero poderoso que motive al cambio inmediato.

### 🟠 IDIOMAS (ESTRICTO)
- **image_prompt:** DEBES generar todos los campos de `image_prompt` (subjects, environment, lighting, composition) en **INGLÉS**.
- **video_prompt:** DEBES generar todos los campos de `video_prompt` (motion, camera_movement, transition, duration_hint) en **INGLÉS**. Describe el movimiento de los sujetos, la acción de cámara, la transición a la siguiente escena y el ritmo de duración.
- **narration:** DEBES generar el campo `narration` en **ESPAÑOL LATINOAMERICANO**.
"""
