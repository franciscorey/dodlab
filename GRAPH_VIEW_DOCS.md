# 🚀 DOD Lab v4.0 - Graph View & Exploración Relacional

## Nueva Funcionalidad Implementada: **Semantic Graph View**

DOD Lab ha evolucionado de un generador de combinaciones a una **ontología visual interactiva** que permite explorar la red semántica completa del sistema de diseño.

---

## 📊 ¿Qué es el Graph View?

El Graph View es una visualización interactiva de la red semántica que conecta:
- **Cartas** (nodos azules): Entidades de diseño (Contexto, Usuario, Interacción, etc.)
- **Conceptos** (nodos violetas): Nodos semánticos compartidos que actúan como nexos relacionales

### Ejemplo Visual:
```
[Hospital] ─────┐
                ├──→ [orientación] ←──┐
[Adulto mayor] ─┘                     │
                                      ├──→ Red semántica emergente
[Buscar información] ─────────────────┘
```

---

## 🎯 Características Clave

### 1. **Visualización Bipartita**
- **Nodos Carta**: Tamaño fijo (25px), color azul (#3b82f6)
- **Nodos Concepto**: Tamaño dinámico según popularidad (15-37px), color violeta (#a855f7)
- **Aristas**: Conexiones semánticas transparentes que muestran relaciones

### 2. **Filtros Interactivos**
- **Por Categoría**: Filtrar cartas por tipo (Contexto, Usuario, Fricción, etc.)
- **Profundidad de Red**: Control deslizante para expandir/colapsar conexiones
  - Nivel 1: Conexiones directas
  - Nivel 2: Red expandida (default)
  - Nivel 3: Máxima exploración

### 3. **Panel de Detalles**
Al hacer clic en cualquier nodo:
- Muestra título y categoría/tipo
- Descripción completa
- Número de conexiones relacionadas
- Para conceptos: cuántas cartas conecta

### 4. **Física Interactiva**
- **Drag & Drop**: Mover nodos libremente
- **Zoom**: Scroll para acercar/alejar
- **Pan**: Arrastrar fondo para mover vista
- **Estabilización automática**: 150 iteraciones al cargar

### 5. **Exportación**
- Exportar grafo completo como imagen PNG
- Ideal para documentación, presentaciones o análisis

---

## 🛠️ Cómo Usar el Graph View

### Paso 1: Cambiar a Vista de Grafo
1. Haz clic en el botón **"Relaciones (Grafo)"** en el header
2. El sidebar cambiará a controles de grafo

### Paso 2: Explorar la Red
- **Click en nodo**: Ver detalles en panel lateral
- **Doble click**: Expandir conexiones (próximamente)
- **Arrastrar**: Reorganizar nodos manualmente
- **Scroll**: Zoom in/out

### Paso 3: Filtrar y Analizar
1. Usa el dropdown **"Filtrar por Categoría"** para aislar tipos de cartas
2. Ajusta el slider **"Profundidad de Red"** para controlar complejidad
3. Identifica **conceptos puente** (nodos grandes = altamente conectados)

### Paso 4: Exportar Hallazgos
- Click en botón de exportar (próximamente en UI)
- O usa la función `exportGraphAsImage()` desde consola

---

## 🔍 Casos de Uso para Diseñadores

### 1. **Detección de Patrones**
Identifica conceptos que aparecen recurrentemente entre diferentes categorías:
- ¿Qué conceptos conectan "Usuario" con "Fricción"?
- ¿Qué necesidades comparten múltiples contextos?

### 2. **Exploración de Oportunidades**
Encuentra cartas no obvias pero semánticamente relacionadas:
- Selecciona una carta ancla
- Explora conceptos compartidos
- Descubre intervenciones potenciales

### 3. **Validación de Coherencia**
Verifica si tu combinación generada tiene base semántica sólida:
- Cartas bien conectadas = alta coherencia
- Conceptos aislados = posibles inconsistencias

### 4. **Mapeo de Ecosistemas**
Filtra por categoría para ver sub-redes especializadas:
- Todos los "Contextos de salud" y sus conceptos
- Todas las "Fricciones digitales" y sus relaciones

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Vis.js Network**: Motor de visualización de grafos
- **Tailwind CSS**: Estilizado de UI
- **Vanilla JS**: Lógica de negocio

### Estructura de Datos
```javascript
// Nodo Carta
{
  id: "card_001",
  label: "Hospital",
  group: "card",
  value: 25,
  data: { type: "card", card: {...} }
}

// Nodo Concepto
{
  id: "concept_orientation",
  label: "Orientación",
  group: "concept",
  value: 22.5, // Dinámico según popularidad
  data: { type: "concept", concept: {...} }
}

// Arista
{
  from: "card_001",
  to: "concept_orientation",
  color: "rgba(139, 92, 246, 0.4)"
}
```

### Funciones Principales
| Función | Propósito |
|---------|-----------|
| `initGraph()` | Inicializa vis.js con configuración |
| `buildGraphData()` | Construye nodos/aristas desde deck-data |
| `handleGraphNodeClick()` | Muestra detalles de nodo seleccionado |
| `refreshGraphWithFilter()` | Aplica filtros de categoría |
| `refreshGraphWithDepth()` | Controla expansión de red |
| `exportGraphAsImage()` | Exporta canvas como PNG |

---

## 📈 Métricas de la Red (Ejemplo con 150 cartas)

- **Total Nodos**: ~450-600 (150 cartas + 300-450 conceptos únicos)
- **Total Aristas**: ~600-900 (cada carta tiene 3-6 relations promedio)
- **Conceptos Más Conectados**: Los más populares escalan a 1.5x tamaño
- **Densidad**: Alta conectividad indica ecosistema semántico rico

---

## 🚀 Próximas Mejoras (Roadmap)

### Fase 1: Interacción Avanzada
- [ ] Double-click para expandir/contraer ramas
- [ ] Búsqueda de nodos por texto
- [ ] Highlight de caminos entre dos cartas
- [ ] Botón de exportar en UI visible

### Fase 2: Análisis Semántico
- [ ] Detección automática de clusters/comunidades
- [ ] Algoritmo de centralidad para identificar conceptos clave
- [ ] Sugerencias de cartas faltantes basadas en huecos semánticos
- [ ] Heatmap de densidad conceptual

### Fase 3: Colaboración
- [ ] Guardar vistas específicas del grafo
- [ ] Compartir URLs con filtros pre-aplicados
- [ ] Anotaciones sobre nodos
- [ ] Modo presentación

---

## 💡 Consejos para Maximizar Valor

1. **Comienza con filtros estrechos**: Una categoría a la vez
2. **Busca conceptos puente**: Nodos grandes que conectan categorías distintas
3. **Identifica islas**: Cartas con pocas conexiones pueden indicar oportunidades únicas
4. **Exporta iteraciones**: Guarda versiones del grafo mientras exploras
5. **Combina con Generador**: Genera una combinación y luego explórala en el grafo

---

## 🎓 Fundamento Teórico

Este sistema implementa principios de:
- **Análisis de Redes Semánticas**: Mapeo de relaciones概念uales
- **Ontología de Diseño**: Taxonomía estructurada de entidades de diseño
- **Pensamiento Sistémico**: Visualización de interconexiones complejas
- **Detección de Patrones**: Identificación visual de regularidades

---

**DOD Lab v4.0** transforma datos semánticos en **inteligencia de diseño accionable**, permitiendo a diseñadores navegar espacios de problemas complejos con claridad estructural.

🔗 **Repositorio**: https://github.com/franciscorey/dodlab
