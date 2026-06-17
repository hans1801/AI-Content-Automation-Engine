# flake8: noqa: E501
AUDIO_PROMPT: str = """Narra el siguiente guion de oración y meditación espiritual con una voz pausada, cálida, compasiva y de profunda paz, como un guía espiritual o mentor de fe que ofrece consuelo y esperanza.

Estilo de actuación:
- Tono: Muy empático, susurrado e íntimo (casi sagrado). Evita sonar como un predicador estridente; suena humano y cercano, como un amigo que ora contigo.
- Ritmo: Lento y muy pausado. Deja pausas claras e intencionales (de 0.5 a 1.5 segundos) después de cada frase clave para permitir que el espectador reflexione y reciba el mensaje.
- Énfasis: Pronuncia con suavidad pero con profunda convicción las palabras de sanación y fe (como "propósito", "fuerza", "paz", "Dios", "orar", "Amén", "Jesús").
- Emoción: Comienza con un tono de apoyo y compasión ante el cansancio y el dolor del espectador, realiza una transición cálida y esperanzadora al introducir la presencia divina, mantén un tono sagrado e íntimo durante la oración, y finaliza con un suspiro de paz sincero.
- Instrucciones directas de lectura: Lee exactamente el texto proporcionado. No agregues saludos, muletillas ni comentarios externos.

Texto a narrar:
{audio_text}"""

# Prompt maestro para generar ideas de oraciones diarias
IDEA_PROMPT_PRAYER: str = """# 🧠 PROMPT MAESTRO — AGENTE DE IDEAS DE ESPIRITUALIDAD (ESTILO ORACIÓN DIARIA)
**Objetivo:** Generar una idea creativa para un video CORTO de oración diaria, sanación y fe, enfocado en el descanso del alma y la conexión espiritual.

**Instrucciones:**
1. **hook (Gancho de Interrupción):** Una frase de 10-15 palabras en INGLÉS que conecte directamente con una lucha emocional, fatiga mental o necesidad espiritual profunda del espectador (ej. "If Monday morning feels like a weight... this prayer is for you.", "If you woke up with anxiety in your chest, listen to this."). Debe ser sumamente empático y directo.
2. **day_of_week:** El día de la semana para el que está pensada la oración (ej. "Lunes", "Miércoles", "Domingo", "Diario").
3. **spiritual_theme:** El tema o enfoque espiritual de la oración (ej. "Fuerza para empezar la semana", "Paz en la tormenta", "Vencer la ansiedad", "Gratitud al despertar").
4. **bible_verse:** Un versículo bíblico reconfortante en español que sirva de cimiento espiritual para el mensaje (ej. "Filipenses 4:13", "Salmo 23:1", "Mateo 11:28").
5. **target_audience:** Descripción de la audiencia específica que necesita este mensaje (ej. "Personas agotadas, sin motivación, con miedo al lunes", "Gente estresada o ansiosa").
6. **healing_frequency:** La frecuencia de sanación recomendada en Hz (ej. "432Hz", "528Hz", "396Hz").
"""

# Prompt maestro para generar ideas de reflexiones espirituales
IDEA_PROMPT_REFLECTION: str = """# 🧠 PROMPT MAESTRO — AGENTE DE IDEAS DE ESPIRITUALIDAD (ESTILO REFLEXIÓN ESPIRITUAL)
**Objetivo:** Generar una idea para un video CORTO que comparta una reflexión espiritual reconfortante, calma interior y esperanza.

**Instrucciones:**
1. **hook (Gancho de Interrupción):** Una frase provocadora de 10-15 palabras en INGLÉS que despierte la curiosidad sobre un aspecto espiritual o de fe (ej. "Stop trying to carry everything by yourself. God is in control.", "Your current struggle is not the end of your story.").
2. **spiritual_theme:** El tema espiritual central (ej. "Confianza en los tiempos de Dios", "Soltar el control", "El valor del silencio").
3. **bible_verse:** Un versículo bíblico reconfortante en español que inspire la reflexión (ej. "Isaías 40:31", "Mateo 6:34", "Josué 1:9").
4. **key_reflection:** El mensaje espiritual o revelación central que se explicará en el video.
5. **target_audience:** Quienes se sienten abrumados por la incertidumbre, la soledad o el desánimo diario.
6. **healing_frequency:** La frecuencia de sanación recomendada en Hz (ej. "528Hz", "432Hz").
"""

# Prompt para guión detallado paso a paso de 11 a 14 escenas
SCRIPT_PROMPT: str = """# 📝 PROMPT MAESTRO — AGENTE GUIONISTA DE ESPIRITUALIDAD (SHORTS Y MEDITACIÓN)
**Objetivo:** Crear un guion dinámico y profundamente emotivo de 11 a 14 micro-escenas con un enfoque de animación de stick figure (dibujo de palitos minimalista), transición emocional de luz y música a frecuencia de sanación (432Hz o 528Hz).

**Estructura del Guion (MANDATORIO):**
1. **Acto 1: El Gancho [Escena 1]:** DEBES usar el texto del campo `hook` de forma literal para la narración de la Escena 1. Muestra al stick figure cansado en un entorno gris/oscuro.
2. **Acto 2: El Conflicto/Problema [Escenas 2-4]:** Desarrolla la fatiga emocional o soledad del espectador. Escenas lentas y pausadas que muestran al stick figure cabizbajo, caminando en pasillos vacíos o bajo nubes pesadas de lluvia.
3. **Acto 3: El Giro Espiritual [Escenas 5-7]:** La irrupción de la luz y la esperanza de Dios. Un rayo de luz dorada celestial cae sobre el stick figure; el fondo cambia gradualmente de gris oscuro a un ámbar o amanecer cálido; nubes abriéndose, partículas brillantes flotando, el personaje levanta la cabeza y se pone de pie.
4. **Acto 4: La Oración [Escenas 8-11]:** Oración en primera persona, íntima, sagrada y de entrega ("Señor, vengo ante Ti con cargas..."). El personaje se arrodilla con las manos juntas frente al pecho. La luz se intensifica. Se integra de forma natural el versículo bíblico (`bible_verse`) de manera pausada y solemne.
5. **Acto 5: Llamada a la Acción (CTA) [Escena 12-final]:** El personaje de pie, sereno y en paz mirando el amanecer naranja/dorado. En pantalla aparece texto claro en fade-in: "AMEN 🙏", "Type AMEN if you received this", "New prayer every day → Subscribe".

## 📜 REGLAS OBLIGATORIAS

### 🟢 NARRACIÓN Y RITMO (VOZ EN OFF)
- **Gancho:** Uso mandatorio del texto de `hook` literal en la Escena 1.
- **Narración:** En español. Frases cortas, pausadas, llenas de compasión y empatía. Máximo una frase de narración por escena.
- **Ritmo:** Espaciado y con pausas indicadas. Cada frase debe invitar a respirar y sentir paz.
- **Secuencialidad:** Progresión clara: cansancio absoluto → rayo de luz celestial → oración íntima y versículo reconfortante → paz y CTA.

### 🔵 REGLAS VISUALES (ESTILO STICKMAN CON EVOLUCIÓN DE LUZ Y COLOR)
- **Protagonista:** Presencia consistente de un stick figure (personaje de palitos) minimalista de color blanco puro, con contornos negros gruesos y expresivos.
- **Estilo de Animación:** DEBES usar el campo `style` para generar imágenes con un estilo visual de sketch. La descripción en el campo `style` DEBE ser: `"Dynamic hand-drawn 2D webcomic sketch style, thick expressive black ink outlines, minimalist flat white stick figure, clean shading, hand-drawn textures."`
- **Relación Imagen-Texto:** El `image_prompt` debe traducir visualmente de forma exacta lo que describe la narración de cada escena.
- **Evolución del Fondo y de la Luz:**
  - **Escenas de Problema (1-4):**
    - Fondo: Oscuro, grisáceo, azul noche, lluvias suaves, pasillos vacíos con sombras.
    - Luz: Tenue, azul-grisácea, sombría.
  - **Escenas de Giro y Oración (5-11):**
    - Fondo: Transición de azul noche oscuro a ámbar cálido, nubes abriéndose con rayos de sol, amanecer dorado.
    - Luz: Rayo celestial dorado o blanco brillante cayendo desde arriba, partículas flotantes de luz dorada, glow de luz desde adentro del personaje, ondas concéntricas de sonido/frecuencia (432Hz/528Hz) irradiando como círculos dorados.
  - **Escenas de CTA (12-final):**
    - Fondo: Amanecer naranja y dorado suave y pacífico.
    - Texto en pantalla: Grande, limpio, superpuesto de forma clara (Línea 1: "AMEN 🙏", Línea 2: "Type AMEN if you received this", Línea 3: "Subscribe").

### 🔴 ESTRUCTURA Y SALIDA
- **Extensión:** Entre 11 y 14 escenas en total.
- **Formato:** Cada escena contiene: `scene_number`, `image_prompt` (con subcampos estructurados), y `narration`.
- **Narración Obligatoria:** TODAS las escenas del guion, incluyendo las escenas de CTA finales, deben contener un texto corto en el campo `narration` en español. Nunca dejes el campo `narration` vacío, ya que es necesario para la sincronización de audio. Para las escenas de CTA, narra invitando de forma cálida a comentar "Amén" y suscribirse (ej. "Escribe AMÉN si recibiste esta oración, y comparte esta bendición. Suscríbete para orar juntos cada día.").

### 🟠 IDIOMAS (ESTRICTO)
- **image_prompt:** DEBES generar todos los subcampos de `image_prompt` (subjects, environment, lighting, composition) en **INGLÉS** (para la IA de imágenes).
- **narration:** DEBES generar el campo `narration` en **ESPAÑOL LATINOAMERICANO** (para la voz en off).
"""
