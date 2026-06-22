# flake8: noqa: E501
AUDIO_PROMPT: str = """Narra el siguiente guion de finanzas personales con voz segura, directa y motivacional, como un mentor financiero de alto impacto revelando una verdad que cambia vidas.

Estilo de actuación:
- Tono: autoritario pero cercano, como alguien que ya logró la libertad financiera y te está advirtiendo.
- Ritmo: dinámico y con urgencia. Acelera en los momentos de revelación; haz pausas cortas y deliberadas después de cada idea clave para que impacte.
- Énfasis: subraya con energía las palabras de alto impacto como "trampa", "libertad", "riqueza", "deuda", "invertir".
- Emoción: empieza con un gancho incisivo, escala la tensión en el conflicto y remata con convicción total en el cierre.
- No agregues sonidos, muletillas ni nada que no esté en el texto. Lee exactamente lo que aparece.

Texto a narrar:
{audio_text}"""

IDEA_PROMPT_MINDSET: str = """# 🧠 PROMPT MAESTRO — AGENTE DE IDEAS FINANCIERAS (ESTILO MENTALIDAD)
**Objetivo:** Generar una idea creativa para un video CORTO sobre un cambio de mentalidad financiera.

**Instrucciones:**
1. **hook (Gancho de Interrupción):** Una frase de 10-15 palabras que golpee directo a la realidad económica del espectador (ej: "Si trabajas para pagar deudas, necesitas leer esto.", "El 90% de la gente nunca aprende esto sobre el dinero.").
2. **Protagonista:** Una persona común enfrentando un dilema financiero cotidiano (deudas, salario insuficiente, miedo a invertir).
3. La historia debe mostrar una transformación de mentalidad breve y poderosa, basada en un principio financiero real.
"""

IDEA_PROMPT_ESTRATEGIA: str = """# 🧠 PROMPT MAESTRO — AGENTE DE IDEAS FINANCIERAS (ESTILO ESTRATEGIA)
**Objetivo:** Generar una idea para un video CORTO que enseñe una estrategia financiera práctica y accionable.

**Instrucciones:**
1. **hook (Gancho de Interrupción):** Una pregunta o afirmación provocadora de 10-15 palabras relacionada con un error financiero común o una oportunidad desaprovechada.
2. **Concepto central:** Una táctica financiera concreta: regla del 50/30/20, interés compuesto, fondo de emergencia, diversificación, libertad financiera.
3. Presenta el concepto de forma visual, con un antes y un después claro que motive a actuar.
"""

SCRIPT_PROMPT: str = """# 📝 PROMPT MAESTRO — AGENTE GUIONISTA FINANCIERO (STORYTELLING - SHORTS)
**Objetivo:** Crear un guion dinámico de 10 a 12 micro-escenas con un enfoque narrativo, educativo y motivacional sobre finanzas personales.

**Estructura del Guion (MANDATORIO):**
1. **Acto 1: El Hook/Conflicto [Escenas 1-4]:** DEBES usar el campo "hook" para la Escena 1. Muestra la realidad financiera dolorosa o el error común.
2. **Acto 2: La Revelación [Escenas 5-10]:** Introduce el principio, estrategia o cambio de mentalidad financiero. Usa datos, comparativas visuales o metáforas simples.
3. **Acto 3: La Transformación/Sello [Escenas 11-final]:** Muestra el resultado de aplicar el principio. Termina con un llamado a la acción claro.

## 📜 REGLAS OBLIGATORIAS

### 🟢 NARRACIÓN Y RITMO
- **Gancho:** Uso mandatorio del texto de `hook` literal en la Escena 1.
- **Diálogo/Narración:** Frases cortas, directas y motivacionales. Máximo una por escena.
- **Secuencialidad:** La historia debe tener progresión lógica: problema → concepto → solución → acción.
- **Fluidez:** Ritmo rápido y cinematográfico; evita descripciones visuales excesivamente largas.

### 🔵 REGLAS VISUALES
- **Protagonista:** Presencia consistente de un personaje principal identificable (persona común, emprendedor, joven profesional) en escenas clave.
- **Relación Imagen-Texto:** El `image_prompt` debe ilustrar visualmente el concepto financiero de la narración (gráficas, billetes, calculadoras, oficinas, crecimiento, comparativas).
- **Sincronía Narrativa:** El `image_prompt` debe ser una traducción visual exacta de la `narration`. Lo que el espectador escucha debe verse en pantalla de forma clara y cinematográfica.
- **Secuencialidad Visual:** Las imágenes deben mostrar progresión coherente (ej: de un cuarto humilde a una oficina propia, de números rojos a números verdes).
- **Estilo (Sketch Stickman):** DEBES usar el campo `style` para generar imágenes con un estilo visual de cómic/sketch. La descripción en el campo `style` DEBE ser: `"Dynamic hand-drawn 2D webcomic sketch style, thick expressive black ink outlines, vibrant minimalist color palette for highlights, clean shading, white background with glowing accents."`.
- **Uso del Color:** Utiliza el color de forma estratégica para resaltar elementos financieros clave (ej: billetes verdes, flechas de crecimiento, gráficas coloridas) y para dar vida al personaje, manteniendo siempre la estética de dibujo a mano.

### 🔴 ESTRUCTURA Y SALIDA
- **Extensión:** Entre 12 y 16 escenas.
- **Cierre:** Termina con una frase motivacional poderosa o un dato impactante que invite a actuar.

### 🟠 IDIOMAS (ESTRICTO)
- **image_prompt:** DEBES generar todos los campos de `image_prompt` (subjects, environment, lighting, composition) en **INGLÉS**.
- **video_prompt:** DEBES generar todos los campos de `video_prompt` (motion, camera_movement, transition, duration_hint) en **INGLÉS**. Describe el movimiento de los sujetos, la acción de cámara, la transición a la siguiente escena y el ritmo de duración.
- **narration:** DEBES generar el campo `narration` en **ESPAÑOL LATINOAMERICANO**.
"""
