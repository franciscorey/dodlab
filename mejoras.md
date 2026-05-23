DOD Lab evolucionó desde un simple deck de ideación aleatoria hacia un motor semántico de oportunidades de diseño. El cambio principal fue transformar las cartas en entidades relacionales con propiedades como tags, compatibilidades, ecosistemas, niveles de abstracción y pesos probabilísticos. Esto permite generar combinaciones coherentes y contextualizadas en vez de resultados absurdos o puramente random. El sistema ya no solo mezcla conceptos: interpreta relaciones entre usuarios, contextos, necesidades, fricciones y tipos de intervención. Así, DOD Lab pasa de ser una herramienta de brainstorming a un sistema procedural de pensamiento proyectual híbrido, capaz de detectar oportunidades reales en diseño gráfico, espacial, industrial, audiovisual y digital.


# 🧠 Arquitectura Semántica de las Cartas — DOD Lab

Cada carta funciona como una entidad semántica.
No solo contiene texto visual, sino información estructurada que ayuda al motor a generar relaciones coherentes entre:

* contextos
* usuarios
* necesidades
* fricciones
* oportunidades de diseño

El sistema deja de depender de random puro y comienza a construir combinaciones basadas en afinidad conceptual.

---

# 🧩 Propiedades Principales

| Propiedad     | Función                   | Cómo ayuda al motor                   |
| ------------- | ------------------------- | ------------------------------------- |
| `id`          | Identificador único       | Permite organizar y relacionar cartas |
| `title`       | Nombre visible            | Representación humana de la carta     |
| `category`    | Tipo de carta             | Ordena el flujo lógico del sistema    |
| `description` | Explicación breve         | Contextualiza el significado          |
| `tags`        | Conceptos semánticos      | Permite detectar afinidades           |
| `domains`     | Universos contextuales    | Evita mezclas incoherentes            |
| `level`       | Nivel de abstracción      | Balancea creatividad y realismo       |
| `weight`      | Probabilidad de aparición | Controla frecuencia procedural        |
| `color`       | Identidad visual          | Ayuda UX/UI y reconocimiento          |
| `icon`        | Representación visual     | Facilita lectura rápida               |

---

# ⚙️ Cómo piensa el motor

El motor evalúa:

## 1. Coincidencia semántica

Comparando:

```json id="uq7s8m"
tags
```

---

## 2. Compatibilidad contextual

Comparando:

```json id="sl7zk8"
domains
```

---

## 3. Nivel de abstracción

Usando:

```json id="l0wo4m"
level
```

---

## 4. Frecuencia de aparición

Controlando:

```json id="c6ntpq"
weight
```

---

# 🎯 Resultado

En vez de:

> combinaciones absurdas aleatorias

El sistema genera:

> oportunidades de diseño contextualizadas y coherentes.

---

# 🧩 Ejemplo JSON

```json id="7nryj0"
{
  "id": "ctx_001",

  "title": "Hospital",

  "category": "context",

  "description": "Espacio institucional de atención médica.",

  "tags": [
    "salud",
    "espera",
    "orientacion",
    "informacion",
    "incertidumbre"
  ],

  "domains": [
    "health",
    "service",
    "navigation"
  ],

  "level": "specific",

  "weight": 0.9,

  "color": "#2563EB",

  "icon": "hospital"
}
```

---

# 🧠 Cómo el motor usaría esta carta

El sistema buscaría otras cartas con:

* tags similares
* domains relacionados
* niveles compatibles

Por ejemplo:

* “Reducir incertidumbre”
* “Buscar información”
* “Sobrecarga cognitiva”
* “Señalética adaptativa”

---

# 🔥 Conceptualmente

DOD Lab ya no es:

> un deck random de brainstorming.

Ahora es:

> una red semántica de pensamiento proyectual híbrido.


# 🎴 DOD Lab — Starter Deck v1 (100 cartas)

Set inicial transversal para:

* diseño gráfico
* UX/UI
* industrial
* audiovisual
* espacial
* editorial
* interacción
* diseño sistémico
* experiencias híbridas

Pensado para:
✅ coherencia procedural
✅ alta reutilización
✅ ideación híbrida
✅ relaciones semánticas
✅ pensamiento proyectual

---

# 🌎 CONTEXTOS (15)

| Carta              |
| ------------------ |
| Hospital           |
| Transporte público |
| Home office        |
| Sala de clases     |
| Espacio urbano     |
| Museo              |
| Redes sociales     |
| Comercio retail    |
| Biblioteca         |
| Aeropuerto         |
| Evento masivo      |
| Gimnasio           |
| Espacio cowork     |
| Hogar doméstico    |
| Centro cultural    |

---

# 👤 USUARIOS (15)

| Carta                   |
| ----------------------- |
| Estudiante              |
| Adulto mayor            |
| Freelancer              |
| Niño                    |
| Turista                 |
| Paciente                |
| Comprador               |
| Equipo creativo         |
| Docente                 |
| Trabajador remoto       |
| Visitante ocasional     |
| Persona neurodivergente |
| Deportista amateur      |
| Familia                 |
| Usuario primerizo       |

---

# 🤝 INTERACCIONES (12)

| Carta                |
| -------------------- |
| Buscar información   |
| Comparar opciones    |
| Aprender contenido   |
| Esperar atención     |
| Colaborar            |
| Explorar entorno     |
| Organizar tareas     |
| Compartir contenido  |
| Navegar espacio      |
| Resolver problema    |
| Tomar decisiones     |
| Seguir instrucciones |

---

# 🎯 NECESIDADES (12)

| Carta                    |
| ------------------------ |
| Reducir incertidumbre    |
| Ahorrar tiempo           |
| Mantener concentración   |
| Comprender información   |
| Sentir motivación        |
| Tomar decisiones seguras |
| Sentirse orientado       |
| Recordar información     |
| Reducir ansiedad         |
| Expresarse               |
| Participar activamente   |
| Mantener continuidad     |

---

# ⚠️ FRICCIONES (15)

| Carta                    |
| ------------------------ |
| Sobrecarga cognitiva     |
| Interfaces confusas      |
| Exceso de opciones       |
| Falta de feedback        |
| Información fragmentada  |
| Procesos repetitivos     |
| Mala jerarquía visual    |
| Distracciones constantes |
| Desorientación espacial  |
| Baja accesibilidad       |
| Tiempos de espera        |
| Lenguaje poco claro      |
| Saturación visual        |
| Mala coordinación        |
| Falta de personalización |

---

# 💥 CONSECUENCIAS (10)

| Carta                 |
| --------------------- |
| Estrés                |
| Desmotivación         |
| Pérdida de tiempo     |
| Errores frecuentes    |
| Fatiga mental         |
| Desconexión emocional |
| Abandono              |
| Frustración           |
| Baja participación    |
| Mala experiencia      |

---

# 🧩 TIPOS DE INTERVENCIÓN (15)

| Carta                 |
| --------------------- |
| Sistema visual        |
| Objeto interactivo    |
| Experiencia inmersiva |
| Dispositivo físico    |
| Instalación espacial  |
| Plataforma digital    |
| Toolkit educativo     |
| Sistema modular       |
| Narrativa audiovisual |
| Servicio híbrido      |
| Señalética adaptativa |
| Juego interactivo     |
| Mobiliario funcional  |
| Entorno responsivo    |
| Publicación editorial |

---

# ⚙️ MECANISMOS (15)

| Carta                   |
| ----------------------- |
| Gamificación            |
| Modularidad             |
| Automatización          |
| Narrativa               |
| Feedback inmediato      |
| Personalización         |
| Visualización           |
| Colaboración            |
| Sensorialidad           |
| Adaptabilidad           |
| Participación colectiva |
| IA contextual           |
| Reconocimiento visual   |
| Recompensas progresivas |
| Interacción táctil      |

---

# 📦 FORMATOS / MEDIOS (15)

| Carta                 |
| --------------------- |
| Web app               |
| App móvil             |
| Instalación física    |
| Señalética            |
| Pantalla interactiva  |
| Objeto portátil       |
| Kit tangible          |
| Sistema editorial     |
| Video interactivo     |
| Experiencia urbana    |
| Espacio expositivo    |
| Packaging             |
| Superficie proyectada |
| Entorno modular       |
| Wearable              |

---

# 🎨 LENGUAJES (15)

| Carta                |
| -------------------- |
| Editorial suizo      |
| Brutalista           |
| Orgánico             |
| Retro tecnológico    |
| Minimalista          |
| Táctico futurista    |
| Lúdico experimental  |
| Institucional        |
| Sensorial            |
| Modular geométrico   |
| Industrial funcional |
| Cinemático           |
| Escenográfico        |
| Artefacto científico |
| Digital artesanal    |

---

# 🌟 VALORES GENERADOS (11)

| Carta              |
| ------------------ |
| Claridad           |
| Eficiencia         |
| Accesibilidad      |
| Motivación         |
| Participación      |
| Comprensión        |
| Seguridad          |
| Autonomía          |
| Conexión emocional |
| Continuidad        |
| Exploración        |

---

# 🧠 Cómo está pensado este set

## Alta compatibilidad

Las cartas son:

* suficientemente abstractas
* pero aplicables

---

## Multidisciplinario

Permite generar:

* apps
* sistemas gráficos
* instalaciones
* productos físicos
* audiovisuales
* espacios
* experiencias híbridas

---

## Compatible con motor semántico

Ideal para:

* tags
* ecosystems
* levels
* compatibleTags
* pesos probabilísticos

---

# 🔥 Ejemplo coherente generado

## Usuario

Adulto mayor

## Contexto

Hospital

## Interacción

Buscar información

## Necesidad

Reducir incertidumbre

## Fricción

Sobrecarga cognitiva

## Consecuencia

Estrés

---

# Oportunidad

## Tipo de intervención

Sistema visual

## Mecanismo

Visualización + adaptabilidad

## Formato

Señalética interactiva

## Lenguaje

Institucional cálido

## Valor generado

Claridad + seguridad

---

# 🧩 Próximos sets recomendados

## DOD Health

Salud y accesibilidad

## DOD Education

Aprendizaje y atención

## DOD Urban

Movilidad y ciudad

## DOD Creative

Procesos creativos

## DOD AI

Automatización e IA

## DOD Spatial

Experiencias espaciales

## DOD Emotional

Diseño emocional

## DOD Systems

Diseño sistémico y servicios
