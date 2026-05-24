// ============================================
// DOD LAB v3.0 - MOTOR RELACIONAL SEMÁNTICO
// Arquitectura basada en nodos conceptuales compartidos
// ============================================

// Estado Global de la App
let appState = {
    view: "home",
    cards: [],
    projects: [],
    locks: {},
    currentGeneration: {},
    conceptsRegistry: [], // Registry global de conceptos/nodos semánticos
    deckSearch: "",
    deckCategory: "All",
    deckSort: "recent",
    canvasZoom: 1,
    canvasCards: [],
    canvasConnections: [],
    activeConnectorSource: null,
    isCanvasPanning: false,
    panOffset: { x: -1000, y: -1000 },
    dragStart: { x: 0, y: 0 },
    graphViewMode: "cards", // 'cards' | 'concepts' | 'hybrid'
    selectedConceptFilter: null,
    networkGraph: null // Instancia de Vis.js Network
};

// Categorías actualizadas según deck-data.json
const CATEGORIES = {
    "Contexto": { id: "Contexto", color: "#1d4ed8", icon: "map-pin", num: "01", desc: "Dónde y en qué entorno ocurre la situación proyectual." },
    "Usuario": { id: "Usuario", color: "#6d28d9", icon: "user", num: "02", desc: "Quién vive la situación directamente." },
    "Interacción": { id: "Interacción", color: "#047857", icon: "activity", num: "03", desc: "Qué acción o actividad ejecuta el usuario." },
    "Necesidad": { id: "Necesidad", color: "#b45309", icon: "heart", num: "04", desc: "Qué objetivo de fondo busca satisfacer." },
    "Fricción": { id: "Fricción", color: "#b91c1c", icon: "alert-triangle", num: "05", desc: "Qué obstáculo, barrera o bloqueo encuentra." },
    "Consecuencia": { id: "Consecuencia", color: "#c2410c", icon: "trending-down", num: "06", desc: "Qué impacto secundario indeseado provoca la fricción." },
    "Tipo de Intervención": { id: "Tipo de Intervención", color: "#0369a1", icon: "rocket", num: "07", desc: "Qué tipo de artefacto, sistema o canal se diseña." },
    "Mecanismo": { id: "Mecanismo", color: "#0f766e", icon: "settings", num: "08", desc: "Cómo resuelve el problema el sistema." },
    "Lenguaje": { id: "Lenguaje", color: "#be185d", icon: "palette", num: "09", desc: "Cómo se expresa estéticamente el sistema." },
    "Formato/Medio": { id: "Formato/Medio", color: "#7e22ce", icon: "layers", num: "10", desc: "Medio o materialidad final de la solución." },
    "Valor Generado": { id: "Valor Generado", color: "#a16207", icon: "gem", num: "11", desc: "Impacto positivo generado para las personas." }
};

// ============================================
// MOTOR DE RELACIONES SEMÁNTICAS v3.0
// Basado en nodos conceptuales compartidos
// ============================================

/**
 * Obtiene el concepto por su ID desde el registry global
 */
function getConceptById(conceptId) {
    return appState.conceptsRegistry.find(c => c.id === conceptId);
}

/**
 * Calcula la afinidad entre dos cartas basada en conceptos compartidos
 * Usa Jaccard similarity sobre el array de relations
 */
function calculateConceptAffinity(card1, card2) {
    const relations1 = card1.relations || [];
    const relations2 = card2.relations || [];
    
    if (relations1.length === 0 || relations2.length === 0) {
        return 0;
    }
    
    const set1 = new Set(relations1.map(r => r.toLowerCase()));
    const set2 = new Set(relations2.map(r => r.toLowerCase()));
    
    let intersection = 0;
    set1.forEach(rel => {
        if (set2.has(rel)) intersection++;
    });
    
    const union = set1.size + set2.size - intersection;
    return union > 0 ? intersection / union : 0;
}

/**
 * Obtiene los conceptos compartidos entre dos cartas
 * @returns {Array} Array de objetos concept con label, color, description
 */
function getSharedConcepts(card1, card2) {
    const relations1 = new Set((card1.relations || []).map(r => r.toLowerCase()));
    const sharedIds = (card2.relations || []).filter(r => relations1.has(r.toLowerCase()));
    
    return sharedIds.map(id => {
        const concept = getConceptById(id);
        return concept || { id, label: id, color: "#94a3b8", description: "" };
    });
}

/**
 * Calcula el overlap de dominios entre dos cartas
 */
function calculateDomainOverlap(card1, card2) {
    if (!card1.domains || !card2.domains || card1.domains.length === 0 || card2.domains.length === 0) {
        return 0;
    }
    
    const domains1 = new Set(card1.domains.map(d => d.toLowerCase()));
    const domains2 = new Set(card2.domains.map(d => d.toLowerCase()));
    
    let intersection = 0;
    domains1.forEach(domain => {
        if (domains2.has(domain)) intersection++;
    });
    
    const minDomains = Math.min(domains1.size, domains2.size);
    return minDomains > 0 ? intersection / minDomains : 0;
}

/**
 * Evalúa compatibilidad de niveles de abstracción
 * Levels: specific, broad, abstract
 */
function calculateLevelCompatibility(card1, card2) {
    const levelOrder = { "specific": 1, "broad": 2, "abstract": 3 };
    const level1 = levelOrder[card1.level] || 2;
    const level2 = levelOrder[card2.level] || 2;
    
    const diff = Math.abs(level1 - level2);
    if (diff === 0) return 1.0;
    if (diff === 1) return 0.7;
    return 0.4;
}

/**
 * Calcula balance de weights
 */
function calculateWeightBalance(card1, card2) {
    const w1 = card1.weight || 0.5;
    const w2 = card2.weight || 0.5;
    const diff = Math.abs(w1 - w2);
    return 1 - diff;
}

/**
 * Score semántico total entre dos cartas (v3.0: prioriza conceptos)
 */
function calculateSemanticScore(card1, card2) {
    const conceptAffinity = calculateConceptAffinity(card1, card2);
    const domainOverlap = calculateDomainOverlap(card1, card2);
    const levelCompat = calculateLevelCompatibility(card1, card2);
    const weightBal = calculateWeightBalance(card1, card2);
    
    // Nuevos pesos: 50% conceptos, 30% dominios, 12% nivel, 8% weight
    return (
        conceptAffinity * 0.50 +
        domainOverlap * 0.30 +
        levelCompat * 0.12 +
        weightBal * 0.08
    );
}

/**
 * Obtiene cartas compatibles semánticamente con una carta base
 */
function getSemanticallyCompatibleCards(baseCard, targetCategory, minScore = 0.15) {
    const candidates = appState.cards.filter(c => c.category === targetCategory);
    
    const scored = candidates.map(card => ({
        card,
        score: calculateSemanticScore(baseCard, card),
        sharedConcepts: getSharedConcepts(baseCard, card)
    }));
    
    const filtered = scored.filter(s => s.score >= minScore);
    filtered.sort((a, b) => b.score - a.score);
    
    return filtered;
}

/**
 * Selección ponderada con temperatura
 */
function selectWeightedRandom(scoredCards, temperature = 0.8) {
    if (scoredCards.length === 0) return null;
    if (scoredCards.length === 1) return scoredCards[0].card;
    
    const scores = scoredCards.map(s => Math.pow(s.score, 1/temperature));
    const totalScore = scores.reduce((sum, s) => sum + s, 0);
    
    let random = Math.random() * totalScore;
    for (let i = 0; i < scoredCards.length; i++) {
        random -= scores[i];
        if (random <= 0) {
            return scoredCards[i].card;
        }
    }
    
    return scoredCards[scoredCards.length - 1].card;
}

/**
 * Genera combinación semánticamente coherente
 * Flujo: Contexto → Usuario → Interacción → Necesidad → Fricción → Consecuencia → Solución
 */
function generateSemanticCombination(options = {}) {
    const { 
        startFromLocked = true, 
        coherenceLevel = 'high', // 'low', 'medium', 'high'
        includeNarrative = true 
    } = options;
    
    const minScores = { 'low': 0.1, 'medium': 0.2, 'high': 0.3 };
    const minScore = minScores[coherenceLevel] || 0.2;
    
    // Orden de generación semántica lógica
    const generationOrder = [
        "Contexto", "Usuario", "Interacción", "Necesidad", 
        "Fricción", "Consecuencia", "Tipo de Intervención", 
        "Mecanismo", "Lenguaje", "Formato/Medio", "Valor Generado"
    ];
    
    const result = {};
    let lastCard = null;
    let anchorCard = null; // Carta ancla para mantener coherencia global
    
    // Primero, respetar locks
    if (startFromLocked) {
        Object.keys(appState.locks).forEach(cat => {
            if (appState.locks[cat] && appState.currentGeneration[cat]) {
                result[cat] = appState.currentGeneration[cat];
                if (!anchorCard) anchorCard = result[cat];
                lastCard = result[cat];
            }
        });
    }
    
    // Generar cada categoría no bloqueada
    for (const category of generationOrder) {
        if (result[category]) continue; // Ya está locked
        if (appState.locks[category]) continue;
        
        const candidates = appState.cards.filter(c => c.category === category);
        if (candidates.length === 0) {
            result[category] = null;
            continue;
        }
        
        // Si hay una carta ancla, usar matching semántico
        if (anchorCard) {
            const compatible = getSemanticallyCompatibleCards(anchorCard, category, minScore);
            
            if (compatible.length > 0) {
                // Combinar influencia de última carta y ancla
                const scoredWithLast = lastCard ? 
                    compatible.map(s => ({
                        card: s.card,
                        score: s.score * 0.6 + calculateSemanticScore(lastCard, s.card) * 0.4
                    })).sort((a, b) => b.score - a.score) : compatible;
                
                result[category] = selectWeightedRandom(scoredWithLast, 0.8);
            } else {
                // Fallback: seleccionar aleatoriamente si no hay compatibilidad
                result[category] = candidates[Math.floor(Math.random() * candidates.length)];
            }
        } else {
            // Sin ancla: selección aleatoria ponderada por weight
            const weighted = candidates.map(c => ({ card: c, score: c.weight || 0.5 }));
            result[category] = selectWeightedRandom(weighted, 1.0);
        }
        
        if (result[category]) {
            if (!anchorCard) anchorCard = result[category];
            lastCard = result[category];
        }
    }
    
    return result;
}

// Sistema de Toasts para prescindir de alert()
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl shadow-lg pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300 max-w-sm text-xs font-semibold ${type === 'error' ? 'text-rose-600' : 'text-emerald-600'}`;
    const icon = type === 'error' ? 'alert-triangle' : 'check-circle';
    toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i> <span>${message}</span>`;

    container.appendChild(toast);
    triggerLucide();

    // Animación Entrada
    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    // Desvanecer y remover
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Sistema de Confirmación para prescindir de confirm()
function showCustomConfirm(title, desc, callback) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-desc').textContent = desc;
    modal.classList.remove('hidden');
    triggerLucide();

    const cleanUp = () => {
        modal.classList.add('hidden');
        document.getElementById('confirm-ok-btn').removeEventListener('click', onConfirm);
        document.getElementById('confirm-cancel-btn').removeEventListener('click', onCancel);
    };

    const onConfirm = () => { callback(); cleanUp(); };
    const onCancel = () => { cleanUp(); };

    document.getElementById('confirm-ok-btn').addEventListener('click', onConfirm);
    document.getElementById('confirm-cancel-btn').addEventListener('click', onCancel);
}

// Parseador e inyector Lucide universal
function triggerLucide() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

// Carga Inicial
window.onload = async function () {
    const savedCards = localStorage.getItem("ideation_deck_cards");
    
    // Cargar concepts registry primero
    try {
        const conceptsResponse = await fetch('concepts-registry.json');
        if (conceptsResponse.ok) {
            const conceptsData = await conceptsResponse.json();
            appState.conceptsRegistry = conceptsData.concepts || [];
            console.log(`Registry de conceptos cargado: ${appState.conceptsRegistry.length} conceptos`);
        } else {
            console.warn("No se pudo cargar concepts-registry.json, usando registry vacío");
            appState.conceptsRegistry = [];
        }
    } catch (error) {
        console.error("Error al cargar concepts-registry.json:", error);
        appState.conceptsRegistry = [];
    }
    
    if (savedCards) {
        appState.cards = JSON.parse(savedCards);
    } else {
        // Carga asíncrona inyectando JSON externo con fallback seguro
        try {
            const response = await fetch('deck-data.json');
            if (!response.ok) throw new Error('Error al cargar deck-data.json');
            appState.cards = await response.json();
            console.log(`Mazo inicial cargado desde deck-data.json: ${appState.cards.length} cartas`);
        } catch (error) {
            console.warn("No se pudo cargar deck-data.json (probablemente CORS o protocolo local file://). Usando deck-data.json embebido o generando error.", error);
            appState.cards = [];
        }
        localStorage.setItem("ideation_deck_cards", JSON.stringify(appState.cards));
    }

    // Normalizar categorías legacy en las cartas cargadas
    normalizeLegacyCategories();

    // Inicializar locks y currentGeneration dinámicamente según categorías presentes
    initializeDynamicCategories();

    const savedProjects = localStorage.getItem("ideation_deck_projects");
    if (savedProjects) {
        appState.projects = JSON.parse(savedProjects);
    } else {
        appState.projects = [];
    }

    const savedCanvasCards = localStorage.getItem("ideation_deck_canvas_cards");
    const savedCanvasConns = localStorage.getItem("ideation_deck_canvas_conns");
    if (savedCanvasCards) appState.canvasCards = JSON.parse(savedCanvasCards);
    if (savedCanvasConns) appState.canvasConnections = JSON.parse(savedCanvasConns);

    populateCategorySelects();
    updateDashboardStats();
    shuffleGeneratorDeck(true, true); // Usar matching semántico por defecto
    renderAllViews();
    setupCanvasWorkspace();
    triggerLucide();
    
    console.log("DOD Lab v3.0 - Motor Relacional Semántico inicializado");
};

// Mapeo de categorías legacy para compatibilidad
const CATEGORY_LEGACY_MAP = {
    "Tipo solución": "Tipo de Intervención",
    "Formato": "Formato/Medio",
    "Valor": "Valor Generado"
};

/**
 * Normaliza categorías legacy a los nombres actuales del deck-data.json
 */
function normalizeLegacyCategories() {
    appState.cards.forEach(card => {
        if (CATEGORY_LEGACY_MAP[card.category]) {
            card.category = CATEGORY_LEGACY_MAP[card.category];
        }
        // Asegurar que description exista (fallback a desc o title)
        if (!card.description && card.desc) {
            card.description = card.desc;
        }
        if (!card.description) {
            card.description = `Carta de ${card.category}: ${card.title}`;
        }
        // Asegurar que relations exista (fallback a tags si existe)
        if (!card.relations && card.tags) {
            console.warn(`Carta ${card.id} tiene tags pero no relations. Debería haber sido migrada.`);
        }
        if (!card.relations) {
            card.relations = [];
        }
    });
}

/**
 * Inicializa dinámicamente locks y currentGeneration según las categorías presentes en el deck
 */
function initializeDynamicCategories() {
    const presentCategories = new Set(appState.cards.map(c => c.category));
    
    appState.locks = {};
    appState.currentGeneration = {};
    
    presentCategories.forEach(cat => {
        appState.locks[cat] = false;
        appState.currentGeneration[cat] = null;
    });
    
    console.log(`Categorías inicializadas: ${Array.from(presentCategories).join(', ')}`);
}

function switchView(targetView) {
    appState.view = targetView;
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.add('hidden');
    });

    const activeSec = document.getElementById(`view-${targetView}`);
    if (activeSec) {
        if (targetView === 'canvas') {
            activeSec.classList.remove('hidden');
            activeSec.classList.add('flex');
        } else {
            activeSec.classList.remove('hidden');
        }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-primary', 'font-bold', 'dark:text-white', 'border-b-2', 'border-primary');
        link.classList.add('text-neutral-500');
    });
    const activeBtn = document.getElementById(`btn-nav-${targetView}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-neutral-500');
        activeBtn.classList.add('text-primary', 'font-bold', 'dark:text-white', 'border-b-2', 'border-primary');
    }

    document.querySelectorAll('.md\\:hidden nav button').forEach(btn => {
        btn.classList.remove('text-primary', 'border-t-2', 'border-primary');
        btn.classList.add('text-neutral-500');
    });
    const activeMobileBtn = document.getElementById(`btn-mobile-${targetView}`);
    if (activeMobileBtn) {
        activeMobileBtn.classList.remove('text-neutral-500');
        activeMobileBtn.classList.add('text-primary', 'border-t-2', 'border-primary');
    }

    if (targetView === 'home') {
        updateDashboardStats();
        renderHomeProjects();
    } else if (targetView === 'deck') {
        renderDeck();
        renderCategoryFilters();
    } else if (targetView === 'projects') {
        renderProjectsArchive();
    } else if (targetView === 'canvas') {
        setTimeout(drawConnections, 100);
    } else if (targetView === 'graph') {
        initializeGraphView();
    }
    triggerLucide();
}

function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    const icon = document.getElementById('theme-icon');
    if (icon) {
        if (isDark) {
            icon.setAttribute('data-lucide', 'sun');
        } else {
            icon.setAttribute('data-lucide', 'moon');
        }
    }
    triggerLucide();
}

function populateCategorySelects() {
    const select = document.getElementById('modal-card-category');
    if (!select) return;
    select.innerHTML = '';

    Object.keys(CATEGORIES).forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = `${CATEGORIES[cat].num} - ${cat.toUpperCase()}`;
        select.appendChild(opt);
    });

    updateCanvasSpawnSelector();
}

function updateCanvasSpawnSelector() {
    const selector = document.getElementById('canvas-card-spawn-selector');
    if (!selector) return;
    selector.innerHTML = '';
    appState.cards.forEach(card => {
        const opt = document.createElement('option');
        opt.value = card.id;
        opt.textContent = `[${card.category.substring(0, 4).toUpperCase()}] ${card.title}`;
        selector.appendChild(opt);
    });
}

function updateFormColorIndicator() {
    const select = document.getElementById('modal-card-category');
    if (!select) return;
    const catInfo = CATEGORIES[select.value];
    const indicator = document.getElementById('modal-color-indicator');
    const name = document.getElementById('modal-color-name');
    if (catInfo && indicator && name) {
        indicator.style.backgroundColor = catInfo.color;
        name.textContent = select.value.toUpperCase();
        name.style.color = catInfo.color;
    }
}

function updateDashboardStats() {
    const totalCards = document.getElementById('stat-total-cards');
    const savedProjects = document.getElementById('stat-saved-projects');
    if (totalCards) totalCards.textContent = appState.cards.length;
    if (savedProjects) savedProjects.textContent = appState.projects.length;
}

function renderAllViews() {
    renderHomeCategories();
    renderHomeProjects();
    renderDeck();
    renderCategoryFilters();
    renderGeneratorUI();
    renderProjectsArchive();
    renderCanvasCards();
}

function renderHomeCategories() {
    const grid = document.getElementById('home-categories-grid');
    if (!grid) return;
    grid.innerHTML = '';

    Object.keys(CATEGORIES).forEach(catKey => {
        const cat = CATEGORIES[catKey];
        const count = appState.cards.filter(c => c.category === catKey).length;

        const btn = document.createElement('button');
        btn.onclick = () => {
            appState.deckCategory = catKey;
            switchView('deck');
        };
        btn.className = "category-card bg-white border border-neutral-200 dark:bg-zinc-900 dark:border-zinc-800 p-4 rounded-2xl flex flex-col gap-3 text-left hover:border-indigo-600 dark:hover:border-zinc-500 transition-all group shadow-sm";
        btn.innerHTML = `
            <div class="w-full h-1.5 rounded-full" style="background-color: ${cat.color}"></div>
            <div class="flex justify-between items-start w-full">
                <span class="text-[10px] font-bold text-neutral-400">${cat.num}</span>
                <i data-lucide="${cat.icon}" class="w-5 h-5 text-neutral-400 group-hover:text-zinc-800 dark:group-hover:text-white" style="color: ${cat.color}"></i>
            </div>
            <div>
                <p class="font-extrabold text-xs tracking-wide uppercase">${catKey}</p>
                <p class="text-[10px] text-neutral-500 mt-0.5">${count} cartas creadas</p>
            </div>
        `;
        grid.appendChild(btn);
    });
    triggerLucide();
}

function renderHomeProjects() {
    const grid = document.getElementById('home-projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const recents = appState.projects.slice(-3).reverse();
    if (recents.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-8 text-center bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-200 dark:border-zinc-800 rounded-2xl">
                <p class="text-xs text-neutral-500">No hay hipótesis recientes creadas. ¡Empieza en el Generador!</p>
            </div>
        `;
        return;
    }

    recents.forEach(project => {
        const card = document.createElement('div');
        card.onclick = () => openProjectModal(project.id);
        card.className = "bg-white border border-neutral-200/80 dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-2xl hover:border-indigo-600 hover:shadow-md transition-all group cursor-pointer shadow-sm relative overflow-hidden";
        card.innerHTML = `
            <div class="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
            <div class="flex items-start justify-between mb-4">
                <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">${project.date}</span>
                <i data-lucide="external-link" class="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </div>
            <h3 class="font-extrabold text-sm leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">${project.title}</h3>
            <p class="text-xs text-neutral-500 line-clamp-2">${project.narrativeProblem}</p>
        `;
        grid.appendChild(card);
    });
    triggerLucide();
}

function renderCategoryFilters() {
    const container = document.getElementById('deck-category-filters');
    if (!container) return;
    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.onclick = () => { appState.deckCategory = "All"; filterDeck(); };
    allBtn.className = `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${appState.deckCategory === 'All' ? 'bg-primary text-white dark:bg-white dark:text-zinc-950' : 'bg-white border border-neutral-200 text-neutral-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'}`;
    allBtn.textContent = 'TODAS LAS CARTAS';
    container.appendChild(allBtn);

    Object.keys(CATEGORIES).forEach(cat => {
        const count = appState.cards.filter(c => c.category === cat).length;
        const btn = document.createElement('button');
        btn.onclick = () => { appState.deckCategory = cat; filterDeck(); };
        btn.className = `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 ${appState.deckCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'}`;
        btn.innerHTML = `
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${CATEGORIES[cat].color}"></span>
            ${cat} (${count})
        `;
        container.appendChild(btn);
    });
}

function renderDeck() {
    const grid = document.getElementById('deck-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let filtered = appState.cards.filter(card => {
        const matchesText = card.title.toLowerCase().includes(appState.deckSearch.toLowerCase()) ||
            card.desc.toLowerCase().includes(appState.deckSearch.toLowerCase()) ||
            card.tags.some(t => t.toLowerCase().includes(appState.deckSearch.toLowerCase()));
        const matchesCategory = appState.deckCategory === "All" || card.category === appState.deckCategory;
        return matchesText && matchesCategory;
    });

    if (appState.deckSort === 'recent') {
        filtered = [...filtered].reverse();
    } else if (appState.deckSort === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (appState.deckSort === 'category') {
        filtered.sort((a, b) => a.category.localeCompare(b.category));
    }

    const emptyState = document.getElementById('deck-empty-state');
    if (filtered.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        grid.classList.add('hidden');
        return;
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        grid.classList.remove('hidden');
    }

    filtered.forEach(card => {
        const catColor = CATEGORIES[card.category]?.color || "#76777b";
        const catIcon = CATEGORIES[card.category]?.icon || "layers";
        const cardEl = document.createElement('div');

        cardEl.className = "bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-2xl flex flex-col h-[320px] shadow-sm relative overflow-hidden group hover:border-primary dark:hover:border-zinc-600 hover:shadow-md transition-all";

        const tagsHTML = card.tags.map(t => `<span class="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[9px] font-bold rounded-md dark:bg-zinc-800 dark:text-zinc-400">#${t}</span>`).join(' ');

        const imageHTML = card.image ?
            `<img src="${card.image}" class="absolute inset-0 w-full h-full object-cover opacity-50" onerror="this.style.display='none'">` : '';

        cardEl.innerHTML = `
            <div class="h-[45%] relative p-4 flex flex-col justify-between text-white overflow-hidden" style="background-color: ${catColor}">
                ${imageHTML}
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <div class="flex justify-between items-start relative z-10 w-full">
                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/10">
                        ${card.category}
                    </span>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="editCard('${card.id}')" class="bg-white/20 hover:bg-white/40 p-1.5 rounded-lg text-white backdrop-blur-md flex items-center justify-center" title="Editar Carta">
                            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                        </button>
                        <button onclick="deleteCard('${card.id}')" class="bg-white/20 hover:bg-red-600/80 p-1.5 rounded-lg text-white backdrop-blur-md flex items-center justify-center" title="Eliminar Carta">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </div>
                <div class="relative z-10">
                    <i data-lucide="${catIcon}" class="w-6 h-6 text-white drop-shadow"></i>
                </div>
            </div>
            
            <div class="h-[55%] p-4 flex flex-col justify-between bg-white dark:bg-zinc-900 relative">
                <div class="space-y-1">
                    <h3 class="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 leading-tight">
                        ${card.title}
                    </h3>
                    <p class="text-[10px] text-neutral-500 line-clamp-3 leading-relaxed mt-1">
                        ${card.desc}
                    </p>
                </div>
                <div class="flex flex-wrap gap-1 pt-2 border-t border-neutral-100 dark:border-zinc-800">
                    ${tagsHTML}
                </div>
            </div>
        `;
        grid.appendChild(cardEl);
    });
    triggerLucide();
}

function filterDeck() {
    appState.deckSearch = document.getElementById('deck-search').value;
    appState.deckSort = document.getElementById('deck-sort').value;
    renderDeck();
}

function clearDeckFilters() {
    document.getElementById('deck-search').value = "";
    appState.deckSearch = "";
    appState.deckCategory = "All";
    renderCategoryFilters();
    renderDeck();
}

function openCardModal(cardId = null) {
    const modal = document.getElementById('card-modal');
    if (!modal) return;
    const form = document.getElementById('card-form');
    const label = document.getElementById('modal-card-title-label');
    form.reset();
    populateCategorySelects();

    if (cardId) {
        label.textContent = "Editar Carta";
        const card = appState.cards.find(c => c.id === cardId);
        if (card) {
            document.getElementById('modal-card-id').value = card.id;
            document.getElementById('modal-card-title').value = card.title;
            document.getElementById('modal-card-category').value = card.category;
            document.getElementById('modal-card-icon').value = card.icon;
            document.getElementById('modal-card-image').value = card.image || "";
            document.getElementById('modal-card-desc').value = card.desc;
            document.getElementById('modal-card-tags').value = card.tags.join(', ');
        }
    } else {
        label.textContent = "Añadir Nueva Carta";
        document.getElementById('modal-card-id').value = "";
    }
    updateFormColorIndicator();
    modal.classList.remove('hidden');
    triggerLucide();
}

function closeCardModal() {
    const modal = document.getElementById('card-modal');
    if (modal) modal.classList.add('hidden');
}

function handleCardSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('modal-card-id').value;
    const title = document.getElementById('modal-card-title').value;
    const category = document.getElementById('modal-card-category').value;
    const icon = document.getElementById('modal-card-icon').value || CATEGORIES[category].icon;
    const image = document.getElementById('modal-card-image').value;
    const desc = document.getElementById('modal-card-desc').value;
    const tagsInput = document.getElementById('modal-card-tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

    if (id) {
        const idx = appState.cards.findIndex(c => c.id === id);
        if (idx !== -1) {
            appState.cards[idx] = { id, title, category, icon, desc, tags, image };
        }
        showToast("Carta actualizada exitosamente");
    } else {
        const newId = 'card_' + Date.now();
        appState.cards.push({ id: newId, title, category, icon, desc, tags, image });
        showToast("Nueva carta añadida al mazo");
    }

    localStorage.setItem("ideation_deck_cards", JSON.stringify(appState.cards));
    closeCardModal();
    updateDashboardStats();
    updateCanvasSpawnSelector();
    renderAllViews();
}

function editCard(cardId) {
    openCardModal(cardId);
}

function deleteCard(cardId) {
    showCustomConfirm(
        "Eliminar Carta",
        "¿Estás seguro de que deseas eliminar esta carta del mazo? Esta acción no se puede deshacer.",
        () => {
            appState.cards = appState.cards.filter(c => c.id !== cardId);
            localStorage.setItem("ideation_deck_cards", JSON.stringify(appState.cards));

            appState.canvasCards = appState.canvasCards.filter(cc => cc.cardId !== cardId);
            localStorage.setItem("ideation_deck_canvas_cards", JSON.stringify(appState.canvasCards));

            updateDashboardStats();
            updateCanvasSpawnSelector();
            renderAllViews();
            showToast("Carta eliminada con éxito", "error");
        }
    );
}

function toggleSlotLock(category) {
    appState.locks[category] = !appState.locks[category];
    const btn = document.getElementById(`lock-${category}`);
    if (btn) {
        if (appState.locks[category]) {
            btn.innerHTML = `<i data-lucide="lock" class="w-3.5 h-3.5 text-indigo-600 font-bold"></i>`;
            btn.closest('.generator-slot').classList.add('border-indigo-600', 'ring-2', 'ring-indigo-100');
        } else {
            btn.innerHTML = `<i data-lucide="lock-keyhole-open" class="w-3.5 h-3.5 text-neutral-400"></i>`;
            btn.closest('.generator-slot').classList.remove('border-indigo-600', 'ring-2', 'ring-indigo-100');
        }
    }
    triggerLucide();
}

function shuffleGeneratorDeck(silent = false, useSemantic = true) {
    // Si useSemantic es true, usar el motor semántico; de lo contrario, random puro
    let newGeneration;
    
    if (useSemantic) {
        // Usar motor semántico para generación coherente
        newGeneration = generateSemanticCombination({
            startFromLocked: true,
            coherenceLevel: 'medium',
            includeNarrative: true
        });
    } else {
        // Fallback a random puro (comportamiento legacy)
        const categoriesToShuffle = Object.keys(appState.locks).filter(cat => !appState.locks[cat]);
        newGeneration = {};
        
        // Primero copiar locked
        Object.keys(appState.locks).forEach(cat => {
            if (appState.locks[cat] && appState.currentGeneration[cat]) {
                newGeneration[cat] = appState.currentGeneration[cat];
            }
        });
        
        // Luego random para no-locked
        categoriesToShuffle.forEach(cat => {
            const candidates = appState.cards.filter(c => c.category === cat);
            if (candidates.length > 0) {
                newGeneration[cat] = candidates[Math.floor(Math.random() * candidates.length)];
            } else {
                newGeneration[cat] = null;
            }
        });
    }
    
    // Actualizar estado
    appState.currentGeneration = newGeneration;

    if (!silent) {
        const updatedCats = Object.keys(newGeneration).filter(cat => 
            !appState.locks[cat] && newGeneration[cat] !== null
        );
        
        updatedCats.forEach(cat => {
            const slot = document.getElementById(`slot-${cat}`);
            if (slot) {
                slot.classList.add('animate-deal');
                setTimeout(() => slot.classList.remove('animate-deal'), 450);
            }
        });
        
        const message = useSemantic ? "Combinación semántica generada" : "Mazo barajado (random)";
        showToast(message);
    }

    renderGeneratorUI();
}

function renderGeneratorUI() {
    Object.keys(appState.currentGeneration).forEach(cat => {
        const slot = document.getElementById(`slot-${cat}`);
        if (!slot) return;
        slot.innerHTML = '';

        const card = appState.currentGeneration[cat];
        if (card) {
            const catColor = CATEGORIES[cat]?.color || "#76777b";
            const catIcon = CATEGORIES[cat]?.icon || "layers";
            slot.style.borderStyle = "solid";
            slot.style.borderColor = catColor;

            const imgBackground = card.image ?
                `<img src="${card.image}" class="absolute inset-0 w-full h-full object-cover opacity-50" onerror="this.style.display='none'">` : '';

            slot.innerHTML = `
                <div class="absolute inset-0 bg-white dark:bg-zinc-900 rounded-2xl flex flex-col justify-between text-left text-xs overflow-hidden">
                    <div class="h-[45%] relative p-2.5 flex flex-col justify-between text-white" style="background-color: ${catColor}">
                        ${imgBackground}
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>
                        <div class="relative z-10 flex justify-between items-center w-full">
                            <span class="text-[7px] font-extrabold tracking-widest uppercase bg-white/20 px-1 py-0.5 rounded border border-white/10">${cat}</span>
                        </div>
                        <i data-lucide="${catIcon}" class="w-4 h-4 text-white relative z-10"></i>
                    </div>
                    <div class="h-[55%] p-2.5 bg-white dark:bg-zinc-900 flex flex-col justify-between">
                        <p class="font-extrabold text-[9px] leading-tight text-zinc-900 dark:text-zinc-100 line-clamp-2">${card.title}</p>
                        <p class="text-[7px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5 italic">${card.description || card.desc || 'Sin descripción'}</p>
                        ${renderRelationsPills(card)}
                    </div>
                </div>
            `;
        } else {
            slot.style.borderStyle = "dashed";
            slot.style.borderColor = "#c7c6ca";
            slot.innerHTML = `
                <p class="text-[10px] text-neutral-400 font-bold uppercase">Vacío</p>
            `;
        }
    });

    updateNarrativeFormulas();
    triggerLucide();
}

function updateNarrativeFormulas() {
    const gen = appState.currentGeneration;
    const pText = document.getElementById('narrative-problem');
    const oText = document.getElementById('narrative-opportunity');
    if (!pText || !oText) return;

    // Usar nombres de categorías actualizados del deck-data.json
    const u = gen["Usuario"] ? `<strong class="text-purple-600 dark:text-purple-400">[${gen["Usuario"].title}]</strong>` : "[Usuario]";
    const c = gen["Contexto"] ? `en <strong class="text-blue-600 dark:text-blue-400">[${gen["Contexto"].title}]</strong>` : "en [Contexto]";
    const i = gen["Interacción"] ? `realiza la acción de <strong class="text-emerald-600 dark:text-emerald-400">[${gen["Interacción"].title}]</strong>` : "realiza [Interacción]";
    const n = gen["Necesidad"] ? `para satisfacer su necesidad de <strong class="text-amber-600 dark:text-amber-400">[${gen["Necesidad"].title}]</strong>` : "para satisfacer [Necesidad]";
    const f = gen["Fricción"] ? `pero se encuentra con el obstáculo de <strong class="text-red-600 dark:text-red-400">[${gen["Fricción"].title}]</strong>` : "pero encuentra [Fricción]";
    const co = gen["Consecuencia"] ? `lo cual provoca la consecuencia de <strong class="text-orange-600 dark:text-orange-400">[${gen["Consecuencia"].title}]</strong>.` : "que provoca [Consecuencia].";

    pText.innerHTML = `El usuario ${u} ${c} ${i} ${n}, ${f} ${co}`;

    // Actualizado a nombres de categorías del deck-data.json
    const ts = gen["Tipo de Intervención"] ? `<strong class="text-blue-600 dark:text-blue-400">[${gen["Tipo de Intervención"].title}]</strong>` : "[Tipo de Intervención]";
    const m = gen["Mecanismo"] ? `mediante el mecanismo de <strong class="text-teal-600 dark:text-teal-400">[${gen["Mecanismo"].title}]</strong>` : "mediante [Mecanismo]";
    const l = gen["Lenguaje"] ? `con un lenguaje de expresión <strong class="text-pink-600 dark:text-pink-400">[${gen["Lenguaje"].title}]</strong>` : "con lenguaje [Lenguaje]";
    const fo = gen["Formato/Medio"] ? `<strong class="text-violet-600 dark:text-violet-400">[${gen["Formato/Medio"].title}]</strong>` : "[Formato/Medio]";
    const v = gen["Valor Generado"] ? `para generar el impacto de valor de <strong class="text-yellow-600 dark:text-yellow-400">[${gen["Valor Generado"].title}]</strong>.` : "para generar [Valor Generado].";

    oText.innerHTML = `Oportunidad: Diseñar un ${ts} ${m} ${l} en el formato de ${fo} ${v}`;
    
    // Calcular y mostrar score de coherencia semántica
    updateSemanticCoherenceIndicator();
}

/**
 * Renderiza las relaciones/conceptos de una carta como pills de color
 */
function renderRelationsPills(card) {
    const relations = card.relations || [];
    if (relations.length === 0) return '';
    
    // Mostrar máximo 4 relations para no saturar la UI
    const visibleRelations = relations.slice(0, 4);
    const extraCount = relations.length - visibleRelations.length;
    
    const pillsHTML = visibleRelations.map(relId => {
        const concept = getConceptById(relId);
        const label = concept ? concept.label : relId;
        const color = concept ? concept.color : '#94a3b8';
        return `<span class="inline-block text-[6px] font-medium px-1.5 py-0.5 rounded-full mr-1 mb-1" style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}40">${label}</span>`;
    }).join('');
    
    const extraHTML = extraCount > 0 ? 
        `<span class="inline-block text-[6px] font-medium px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">+${extraCount}</span>` : '';
    
    return `<div class="flex flex-wrap mt-1">${pillsHTML}${extraHTML}</div>`;
}

/**
 * Calcula y muestra el score de coherencia semántica de la combinación actual
 */
function updateSemanticCoherenceIndicator() {
    const gen = appState.currentGeneration;
    const cards = Object.values(gen).filter(c => c !== null);
    
    if (cards.length < 2) return;
    
    let totalScore = 0;
    let comparisons = 0;
    let sharedConceptsCount = 0;
    
    // Comparar cada par de cartas adyacentes en el flujo lógico
    const flowOrder = ["Contexto", "Usuario", "Interacción", "Necesidad", "Fricción", "Consecuencia", "Tipo de Intervención", "Mecanismo", "Lenguaje", "Formato/Medio", "Valor Generado"];
    
    for (let i = 0; i < flowOrder.length - 1; i++) {
        const card1 = gen[flowOrder[i]];
        const card2 = gen[flowOrder[i + 1]];
        
        if (card1 && card2) {
            totalScore += calculateSemanticScore(card1, card2);
            comparisons++;
            
            // Contar conceptos compartidos
            const shared = getSharedConcepts(card1, card2);
            sharedConceptsCount += shared.length;
        }
    }
    
    const avgScore = comparisons > 0 ? totalScore / comparisons : 0;
    const coherenceLevel = avgScore >= 0.5 ? 'high' : avgScore >= 0.3 ? 'medium' : 'low';
    
    // Actualizar indicador visual si existe
    const indicator = document.getElementById('semantic-coherence-indicator');
    if (indicator) {
        const color = avgScore >= 0.5 ? '#10b981' : avgScore >= 0.3 ? '#f59e0b' : '#ef4444';
        const label = avgScore >= 0.5 ? 'Alta coherencia' : avgScore >= 0.3 ? 'Coherencia media' : 'Baja coherencia';
        const conceptsInfo = sharedConceptsCount > 0 ? `• ${sharedConceptsCount} conceptos compartidos` : '';
        indicator.innerHTML = `
            <div class="flex items-center gap-2 text-xs">
                <span class="font-bold" style="color: ${color}">●</span>
                <span class="text-neutral-500">${label}: ${(avgScore * 100).toFixed(0)}% ${conceptsInfo}</span>
            </div>
        `;
    }
    
    console.log(`Coherencia semántica: ${(avgScore * 100).toFixed(1)}% (${coherenceLevel}) • ${sharedConceptsCount} conceptos compartidos`);
}

function saveCurrentGeneration() {
    const tempTitle = `Hipótesis de Innovación #${appState.projects.length + 1}`;
    const title = prompt("Asigna un nombre para guardar esta hipótesis de diseño:", tempTitle);

    if (title === null) return;
    if (!title.trim()) {
        showToast("Debes asignar un título válido.", "error");
        return;
    }

    const pText = document.getElementById('narrative-problem').innerText;
    const oText = document.getElementById('narrative-opportunity').innerText;

    const newProject = {
        id: 'proj_' + Date.now(),
        title: title.trim(),
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
        narrativeProblem: pText,
        narrativeOpportunity: oText,
        notes: "",
        composition: JSON.parse(JSON.stringify(appState.currentGeneration))
    };

    appState.projects.push(newProject);
    localStorage.setItem("ideation_deck_projects", JSON.stringify(appState.projects));

    showToast(`Ficha "${newProject.title}" guardada con éxito`);
    updateDashboardStats();
    renderAllViews();
}

function renderProjectsArchive() {
    const grid = document.getElementById('projects-archive-grid');
    const emptyState = document.getElementById('projects-empty-state');
    if (!grid) return;
    grid.innerHTML = '';

    if (appState.projects.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        grid.classList.add('hidden');
        return;
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        grid.classList.remove('hidden');
    }

    [...appState.projects].reverse().forEach(proj => {
        const card = document.createElement('div');
        card.className = "bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-600 transition-all shadow-sm relative";

        const countCards = Object.values(proj.composition).filter(c => c !== null).length;

        card.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-[10px] font-black tracking-widest text-neutral-400 uppercase">${proj.date}</span>
                    <div class="flex gap-2">
                        <button onclick="openProjectModal('${proj.id}')" class="hover:text-indigo-600 text-neutral-400 flex items-center justify-center w-6 h-6" title="Ver Detalles">
                            <i data-lucide="external-link" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteProject('${proj.id}')" class="hover:text-red-600 text-neutral-400 flex items-center justify-center w-6 h-6" title="Eliminar del archivo">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <h3 class="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">${proj.title}</h3>
                    <div class="mt-3 space-y-2 text-xs text-neutral-500 italic line-clamp-3">
                        <p>"${proj.narrativeProblem}"</p>
                        <p>"${proj.narrativeOpportunity}"</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100 dark:border-zinc-800">
                <span class="text-[10px] bg-neutral-100 dark:bg-zinc-800 px-2 py-1 rounded text-neutral-600 dark:text-zinc-400 font-bold uppercase">${countCards} variables</span>
                <button onclick="injectProjectToCanvas('${proj.id}')" class="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5 dark:text-indigo-400">
                    <i data-lucide="layout-grid" class="w-4 h-4"></i> Enviar al Canvas
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
    triggerLucide();
}

function deleteProject(projId) {
    showCustomConfirm(
        "Eliminar Proyecto",
        "¿Estás seguro de que deseas eliminar permanentemente esta hipótesis de diseño del archivo?",
        () => {
            appState.projects = appState.projects.filter(p => p.id !== projId);
            localStorage.setItem("ideation_deck_projects", JSON.stringify(appState.projects));
            renderAllViews();
            updateDashboardStats();
            showToast("Proyecto eliminado", "error");
        }
    );
}

let activeProjectInModal = null;
function openProjectModal(projId) {
    const modal = document.getElementById('project-detail-modal');
    if (!modal) return;
    const proj = appState.projects.find(p => p.id === projId);
    if (!proj) return;

    activeProjectInModal = proj;
    document.getElementById('project-detail-title').textContent = proj.title;
    document.getElementById('project-detail-date').textContent = `CREADO EN ${proj.date}`;
    document.getElementById('project-detail-problem').innerHTML = proj.narrativeProblem;
    document.getElementById('project-detail-opportunity').innerHTML = proj.narrativeOpportunity;
    document.getElementById('project-detail-notes').value = proj.notes || "";

    const compositionGrid = document.getElementById('project-cards-composition');
    if (compositionGrid) {
        compositionGrid.innerHTML = '';

        Object.keys(proj.composition).forEach(cat => {
            const card = proj.composition[cat];
            if (card) {
                const catColor = CATEGORIES[cat]?.color || "#76777b";
                const item = document.createElement('div');
                item.className = "bg-neutral-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-neutral-200/50 dark:border-zinc-800 text-left relative overflow-hidden h-14 flex flex-col justify-end";

                const imgBkg = card.image ? `<img src="${card.image}" class="absolute inset-0 w-full h-full object-cover opacity-20" onerror="this.style.display='none'">` : '';

                item.innerHTML = `
                    <div class="w-full h-1 absolute top-0 left-0" style="background-color: ${catColor}"></div>
                    ${imgBkg}
                    <span class="text-[8px] font-black uppercase text-neutral-400 leading-none relative z-10">${cat}</span>
                    <p class="font-extrabold text-[10px] mt-1 text-zinc-900 dark:text-zinc-100 line-clamp-1 relative z-10">${card.title}</p>
                `;
                compositionGrid.appendChild(item);
            }
        });
    }

    modal.classList.remove('hidden');
    triggerLucide();
}

function closeProjectModal() {
    const modal = document.getElementById('project-detail-modal');
    if (modal) modal.classList.add('hidden');
    activeProjectInModal = null;
}

function saveProjectNotes() {
    if (!activeProjectInModal) return;
    const text = document.getElementById('project-detail-notes').value;
    activeProjectInModal.notes = text;

    const idx = appState.projects.findIndex(p => p.id === activeProjectInModal.id);
    if (idx !== -1) {
        appState.projects[idx].notes = text;
        localStorage.setItem("ideation_deck_projects", JSON.stringify(appState.projects));
        showToast("Anotaciones guardadas correctamente");
    }
}

function exportAllProjects() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.projects, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "ideationdeck_proyectos_export.json");
    dlAnchorElem.click();
    showToast("Archivo JSON exportado");
}

function setupCanvasWorkspace() {
    const workspace = document.getElementById('canvas-workspace');
    const container = document.getElementById('canvas-container');
    if (!workspace || !container) return;

    workspace.addEventListener('mousedown', function (e) {
        if (e.target.closest('.canvas-interactive-card') || e.target.closest('button')) {
            return;
        }
        appState.isCanvasPanning = true;
        workspace.style.cursor = 'grabbing';
        appState.dragStart = { x: e.clientX - appState.panOffset.x, y: e.clientY - appState.panOffset.y };
    });

    window.addEventListener('mousemove', function (e) {
        if (appState.isCanvasPanning) {
            appState.panOffset.x = e.clientX - appState.dragStart.x;
            appState.panOffset.y = e.clientY - appState.dragStart.y;
            container.style.transform = `translate(${appState.panOffset.x}px, ${appState.panOffset.y}px)`;
            drawConnections();
        }
    });

    window.addEventListener('mouseup', function () {
        if (appState.isCanvasPanning) {
            appState.isCanvasPanning = false;
            workspace.style.cursor = 'grab';
        }
    });

    workspace.addEventListener('touchstart', function (e) {
        if (e.target.closest('.canvas-interactive-card') || e.target.closest('button')) return;
        const touch = e.touches[0];
        appState.isCanvasPanning = true;
        appState.dragStart = { x: touch.clientX - appState.panOffset.x, y: touch.clientY - appState.panOffset.y };
    });

    workspace.addEventListener('touchmove', function (e) {
        if (appState.isCanvasPanning) {
            const touch = e.touches[0];
            appState.panOffset.x = touch.clientX - appState.dragStart.x;
            appState.panOffset.y = touch.clientY - appState.dragStart.y;
            container.style.transform = `translate(${appState.panOffset.x}px, ${appState.panOffset.y}px)`;
            drawConnections();
        }
    });

    workspace.addEventListener('touchend', function () {
        appState.isCanvasPanning = false;
    });
}

function spawnSelectedCardOnCanvas() {
    const selector = document.getElementById('canvas-card-spawn-selector');
    if (!selector) return;
    const cardId = selector.value;
    if (!cardId) return;

    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    const x = Math.abs(appState.panOffset.x) + (viewWidth / 2) - 112; // Centrado horizontal
    const y = Math.abs(appState.panOffset.y) + (viewHeight / 2) - 144; // Centrado vertical

    const instanceId = 'canvas_inst_' + Date.now();
    appState.canvasCards.push({ id: instanceId, cardId: cardId, x: x, y: y });

    localStorage.setItem("ideation_deck_canvas_cards", JSON.stringify(appState.canvasCards));
    renderCanvasCards();
    showToast("Carta añadida al lienzo");
}

function renderCanvasCards() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    container.querySelectorAll('.canvas-interactive-card').forEach(c => c.remove());

    appState.canvasCards.forEach(cc => {
        const cardData = appState.cards.find(c => c.id === cc.cardId);
        if (!cardData) return;

        const catColor = CATEGORIES[cardData.category]?.color || "#76777b";
        const catIcon = CATEGORIES[cardData.category]?.icon || "layers";

        const cardEl = document.createElement('div');
        cardEl.id = cc.id;
        cardEl.className = "canvas-interactive-card absolute w-56 h-72 bg-white dark:bg-zinc-900 border border-neutral-300 dark:border-zinc-800 rounded-2xl shadow-xl flex flex-col justify-between cursor-grab z-10 transition-shadow select-none overflow-hidden";
        cardEl.style.left = `${cc.x}px`;
        cardEl.style.top = `${cc.y}px`;

        const imgHTML = cardData.image ?
            `<img src="${cardData.image}" class="absolute inset-0 w-full h-full object-cover opacity-50" onerror="this.style.display='none'">` : '';

        cardEl.innerHTML = `
            <div class="h-[40%] relative p-3 flex flex-col justify-between text-white overflow-hidden" style="background-color: ${catColor}">
                ${imgHTML}
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div class="flex items-center justify-between relative z-10 w-full">
                    <span class="text-[8px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-wider bg-white/20 border border-white/10">
                        ${cardData.category}
                    </span>
                    <button onclick="deleteCanvasCard('${cc.id}')" class="bg-white/20 hover:bg-red-600/80 p-1 rounded-md text-white flex items-center justify-center">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
                <i data-lucide="${catIcon}" class="w-5 h-5 text-white relative z-10"></i>
            </div>

            <div class="h-[60%] p-3 bg-white dark:bg-zinc-900 flex flex-col justify-between relative z-10">
                <div>
                    <h4 class="font-extrabold text-[11px] text-zinc-950 dark:text-zinc-50 leading-tight">
                        ${cardData.title}
                    </h4>
                    <p class="text-[9px] text-neutral-500 mt-1 line-clamp-3 leading-relaxed">${cardData.desc}</p>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-zinc-800">
                    <button onclick="startConnectorFlow('${cc.id}')" id="conn-btn-${cc.id}" class="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 dark:text-indigo-400">
                        <i data-lucide="link-2" class="w-3 h-3"></i> CONECTAR
                    </button>
                    <span class="text-[8px] text-neutral-400 uppercase font-mono tracking-widest">id: ${cc.id.substring(12, 16)}</span>
                </div>
            </div>
        `;

        attachDragBehavior(cardEl, cc);
        container.appendChild(cardEl);
    });

    setTimeout(drawConnections, 10);
    triggerLucide();
}

function attachDragBehavior(el, cc) {
    let startX = 0;
    let startY = 0;

    const onMouseDown = function (e) {
        e.stopPropagation();
        if (e.target.closest('button')) return;

        el.classList.add('canvas-card-dragging');
        startX = e.clientX - cc.x;
        startY = e.clientY - cc.y;

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = function (e) {
        cc.x = e.clientX - startX;
        cc.y = e.clientY - startY;

        if (cc.x < 0) cc.x = 0;
        if (cc.y < 0) cc.y = 0;

        el.style.left = `${cc.x}px`;
        el.style.top = `${cc.y}px`;

        drawConnections();
    };

    const onMouseUp = function () {
        el.classList.remove('canvas-card-dragging');
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        localStorage.setItem("ideation_deck_canvas_cards", JSON.stringify(appState.canvasCards));
    };

    el.addEventListener('mousedown', onMouseDown);

    el.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        if (e.target.closest('button')) return;

        const touch = e.touches[0];
        el.classList.add('canvas-card-dragging');
        startX = touch.clientX - cc.x;
        startY = touch.clientY - cc.y;

        const onTouchMove = function (ev) {
            const t = ev.touches[0];
            cc.x = t.clientX - startX;
            cc.y = t.clientY - startY;
            if (cc.x < 0) cc.x = 0;
            if (cc.y < 0) cc.y = 0;
            el.style.left = `${cc.x}px`;
            el.style.top = `${cc.y}px`;
            drawConnections();
        };

        const onTouchEnd = function () {
            el.classList.remove('canvas-card-dragging');
            el.removeEventListener('touchmove', onTouchMove);
            localStorage.setItem("ideation_deck_canvas_cards", JSON.stringify(appState.canvasCards));
        };

        el.addEventListener('touchmove', onTouchMove);
        el.addEventListener('touchend', onTouchEnd, { once: true });
    });
}

function startConnectorFlow(instanceId) {
    const btn = document.getElementById(`conn-btn-${instanceId}`);
    if (!btn) return;

    if (appState.activeConnectorSource === null) {
        appState.activeConnectorSource = instanceId;
        btn.innerHTML = `<i data-lucide="sparkles" class="w-3 h-3 animate-spin"></i> SELECCIONA EL FIN`;
        btn.classList.add('text-rose-600', 'font-black');
        triggerLucide();
    } else {
        const source = appState.activeConnectorSource;
        if (source === instanceId) {
            appState.activeConnectorSource = null;
            renderCanvasCards();
            return;
        }

        appState.canvasConnections.push({ from: source, to: instanceId });
        localStorage.setItem("ideation_deck_canvas_conns", JSON.stringify(appState.canvasConnections));

        appState.activeConnectorSource = null;
        renderCanvasCards();
        showToast("Conexión conceptual establecida");
    }
}

function drawConnections() {
    const svg = document.getElementById('canvas-connections-svg');
    if (!svg) return;

    const paths = svg.querySelectorAll('path');
    paths.forEach(p => p.remove());

    appState.canvasConnections.forEach((conn, index) => {
        const nodeFrom = document.getElementById(conn.from);
        const nodeTo = document.getElementById(conn.to);

        if (nodeFrom && nodeTo) {
            const fX = parseFloat(nodeFrom.style.left) + 112;
            const fY = parseFloat(nodeFrom.style.top) + 144; // Altura centrada de 288px (h-72)
            const tX = parseFloat(nodeTo.style.left) + 112;
            const tY = parseFloat(nodeTo.style.top) + 144;

            const controlOffset = Math.abs(tX - fX) * 0.5;
            const cp1X = fX + controlOffset;
            const cp1Y = fY;
            const cp2X = tX - controlOffset;
            const cp2Y = tY;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", `M ${fX} ${fY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${tX} ${tY}`);
            path.setAttribute("stroke", "#6366f1");
            path.setAttribute("stroke-width", "3");
            path.setAttribute("fill", "none");
            path.setAttribute("marker-end", "url(#arrow)");

            path.setAttribute("class", "cursor-pointer hover:stroke-rose-600 hover:stroke-[5px] transition-all");
            path.setAttribute("title", "Haz click para romper la conexión");
            path.addEventListener('click', function () {
                showCustomConfirm(
                    "Eliminar Enlace",
                    "¿Deseas eliminar este cable de conexión conceptual?",
                    () => {
                        appState.canvasConnections.splice(index, 1);
                        localStorage.setItem("ideation_deck_canvas_conns", JSON.stringify(appState.canvasConnections));
                        drawConnections();
                        showToast("Enlace conceptual eliminado", "error");
                    }
                );
            });

            svg.appendChild(path);
        }
    });
}

function deleteCanvasCard(instId) {
    appState.canvasCards = appState.canvasCards.filter(cc => cc.id !== instId);
    appState.canvasConnections = appState.canvasConnections.filter(conn => conn.from !== instId && conn.to !== instId);

    localStorage.setItem("ideation_deck_canvas_cards", JSON.stringify(appState.canvasCards));
    localStorage.setItem("ideation_deck_canvas_conns", JSON.stringify(appState.canvasConnections));

    renderCanvasCards();
    showToast("Carta removida del lienzo", "error");
}

function clearCanvas() {
    showCustomConfirm(
        "Limpiar Canvas",
        "¿Estás seguro de que deseas limpiar la mesa de ideación al completo? Perderás todas las cartas posicionadas y sus conexiones.",
        () => {
            appState.canvasCards = [];
            appState.canvasConnections = [];
            localStorage.removeItem("ideation_deck_canvas_cards");
            localStorage.removeItem("ideation_deck_canvas_conns");
            renderCanvasCards();
            showToast("Mesa de ideación vaciada", "error");
        }
    );
}

function injectProjectToCanvas(projId) {
    const proj = appState.projects.find(p => p.id === projId);
    if (!proj) return;

    let count = 0;
    let lastId = null;

    Object.keys(proj.composition).forEach(cat => {
        const card = proj.composition[cat];
        if (card) {
            const instId = 'canvas_inst_' + Date.now() + '_' + count;
            const x = 1200 + (count * 250);
            const y = 1200 + (count * 150);

            appState.canvasCards.push({ id: instId, cardId: card.id, x: x, y: y });

            if (lastId) {
                appState.canvasConnections.push({ from: lastId, to: instId });
            }
            lastId = instId;
            count++;
        }
    });

    localStorage.setItem("ideation_deck_canvas_cards", JSON.stringify(appState.canvasCards));
    localStorage.setItem("ideation_deck_canvas_conns", JSON.stringify(appState.canvasConnections));

    showToast("Hipótesis inyectada en el lienzo secuencialmente");
    switchView('canvas');
}

function exportCanvasState() {
    const exportData = {
        cards: appState.canvasCards,
        connections: appState.canvasConnections
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "ideationdeck_canvas_export.json");
    dlAnchorElem.click();
    showToast("Lienzo exportado como JSON");
}

// ============================================
// GRAPH VIEW - MOTOR DE VISUALIZACIÓN SEMÁNTICA
// Usa Vis.js Network para mostrar relaciones
// ============================================

/**
 * Inicializa la vista de grafo semántico
 */
function initializeGraphView() {
    const container = document.getElementById('graph-container');
    if (!container) return;
    
    // Mostrar loading
    document.getElementById('graph-loading').classList.remove('hidden');
    
    // Si ya existe el grafo, solo ajustarlo
    if (appState.networkGraph) {
        appState.networkGraph.fit({ animation: { duration: 300 } });
        document.getElementById('graph-loading').classList.add('hidden');
        return;
    }
    
    // Construir nodos y aristas
    const { nodes, edges } = buildGraphData();
    
    const data = { nodes, edges };
    
    const options = {
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                color: '#1e293b',
                face: 'Plus Jakarta Sans',
                size: 14
            },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            width: 1.5,
            color: { color: '#cbd5e1', highlight: '#8b5cf6' },
            smooth: { type: 'continuous' },
            arrows: { to: { enabled: false } },
            dashes: false
        },
        groups: {
            card: {
                color: { background: '#3b82f6', border: '#1d4ed8' },
                size: 25,
                shape: 'dot',
                font: { color: '#ffffff' }
            },
            concept: {
                color: { background: '#a855f7', border: '#7e22ce' },
                size: 15,
                shape: 'dot',
                font: { color: '#ffffff' }
            }
        },
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -3000,
                centralGravity: 0.3,
                springLength: 150,
                springConstant: 0.04,
                damping: 0.09
            },
            stabilization: { iterations: 150 }
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            hideEdgesOnDrag: false,
            zoomView: true,
            dragView: true
        }
    };
    
    appState.networkGraph = new vis.Network(container, data, options);
    
    // Event Listeners
    appState.networkGraph.on("click", function(params) {
        handleGraphNodeClick(params);
    });
    
    appState.networkGraph.on("doubleClick", function(params) {
        handleGraphDoubleClick(params);
    });
    
    // Ocultar loading cuando esté estabilizado
    appState.networkGraph.once("stabilized", function() {
        document.getElementById('graph-loading').classList.add('hidden');
    });
    
    console.log("Graph View initialized with", nodes.length, "nodes and", edges.length, "edges");
}

function initGraph() {
    const container = document.getElementById('graph-container');
    if (!container) return;

    // Construir nodos y aristas
    const { nodes, edges } = buildGraphData();

    const data = { nodes, edges };
    
    const options = {
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                color: '#f8fafc',
                face: 'Inter',
                size: 14
            },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            width: 1.5,
            color: { color: '#475569', highlight: '#38bdf8' },
            smooth: { type: 'continuous' },
            arrows: { to: { enabled: false } },
            dashes: false
        },
        groups: {
            card: {
                color: { background: '#3b82f6', border: '#1d4ed8' },
                size: 25,
                shape: 'dot'
            },
            concept: {
                color: { background: '#a855f7', border: '#7e22ce' },
                size: 15,
                shape: 'dot'
            }
        },
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -3000,
                centralGravity: 0.3,
                springLength: 150,
                springConstant: 0.04,
                damping: 0.09
            },
            stabilization: { iterations: 150 }
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            hideEdgesOnDrag: false
        }
    };

    appState.networkGraph = new vis.Network(container, data, options);

    // Event Listeners
    appState.networkGraph.on("click", function(params) {
        handleGraphNodeClick(params);
    });

    appState.networkGraph.on("doubleClick", function(params) {
        handleGraphDoubleClick(params);
    });

    // Populate category filter
    populateGraphCategoryFilter();

    // Slider depth listener
    document.getElementById('graph-depth').addEventListener('input', function() {
        refreshGraphWithDepth(parseInt(this.value));
    });

    document.getElementById('graph-category-filter').addEventListener('change', function() {
        refreshGraphWithFilter(this.value);
    });

    console.log("Graph initialized with", nodes.length, "nodes and", edges.length, "edges");
}

/**
 * Construye los datos de nodos y aristas para el grafo
 */
function buildGraphData(depth = 2, categoryFilter = 'all') {
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);
    
    const addedNodes = new Set();
    const conceptUsageCount = {};

    // Filtrar cartas por categoría si es necesario
    let filteredCards = appState.cards;
    if (categoryFilter !== 'all') {
        filteredCards = appState.cards.filter(c => c.category === categoryFilter);
    }

    // Agregar nodos de cartas
    filteredCards.forEach(card => {
        nodes.add({
            id: card.id,
            label: card.title,
            group: 'card',
            title: `${card.category}\n\n${card.description || ''}`,
            value: 25,
            data: { type: 'card', card: card }
        });
        addedNodes.add(card.id);
    });

    // Agregar conceptos y conexiones
    filteredCards.forEach(card => {
        if (card.relations && Array.isArray(card.relations)) {
            card.relations.forEach(relId => {
                const concept = getConceptById(relId);
                if (concept) {
                    // Contar uso del concepto para tamaño
                    conceptUsageCount[relId] = (conceptUsageCount[relId] || 0) + 1;

                    // Agregar nodo concepto si no existe
                    if (!addedNodes.has(`concept_${relId}`)) {
                        nodes.add({
                            id: `concept_${relId}`,
                            label: concept.label,
                            group: 'concept',
                            title: `Concepto: ${concept.description || ''}`,
                            value: 15,
                            data: { type: 'concept', concept: concept }
                        });
                        addedNodes.add(`concept_${relId}`);
                    }

                    // Agregar arista carta -> concepto
                    edges.add({
                        from: card.id,
                        to: `concept_${relId}`,
                        color: { color: 'rgba(139, 92, 246, 0.4)' }
                    });
                }
            });
        }
    });

    // Ajustar tamaño de nodos concepto según popularidad
    const maxUsage = Math.max(...Object.values(conceptUsageCount), 1);
    Object.entries(conceptUsageCount).forEach(([relId, count]) => {
        const nodeId = `concept_${relId}`;
        if (addedNodes.has(nodeId)) {
            const baseSize = 15;
            const scaleFactor = 1 + (count / maxUsage) * 1.5;
            nodes.update({ id: nodeId, value: baseSize * scaleFactor });
        }
    });

    return { nodes, edges };
}

/**
 * Maneja click en nodo del grafo
 */
function handleGraphNodeClick(params) {
    const detailsPanel = document.getElementById('node-details');
    const noSelectionMsg = document.getElementById('no-node-selected');

    if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const nodeData = appState.networkGraph.getNodeById(nodeId);
        
        if (nodeData && nodeData.data) {
            noSelectionMsg.classList.add('hidden');
            detailsPanel.classList.remove('hidden');

            if (nodeData.data.type === 'card') {
                const card = nodeData.data.card;
                document.getElementById('selected-node-title').textContent = card.title;
                document.getElementById('selected-node-type').textContent = `${card.category} • Carta`;
                document.getElementById('selected-node-desc').textContent = card.description || 'Sin descripción';
                
                // Contar conexiones
                const connectedEdges = appState.networkGraph.getConnectedEdges(nodeId);
                document.getElementById('selected-node-connections').textContent = 
                    `${connectedEdges.length} conceptos relacionados`;
            
            } else if (nodeData.data.type === 'concept') {
                const concept = nodeData.data.concept;
                document.getElementById('selected-node-title').textContent = concept.label;
                document.getElementById('selected-node-type').textContent = `Concepto Semántico`;
                document.getElementById('selected-node-desc').textContent = concept.description || 'Nexo relacional';
                
                const connectedEdges = appState.networkGraph.getConnectedEdges(nodeId);
                const numCards = connectedEdges.length;
                document.getElementById('selected-node-connections').textContent = 
                    `Conecta ${numCards} cartas`;
            }
        }
    } else {
        detailsPanel.classList.add('hidden');
        noSelectionMsg.classList.remove('hidden');
    }
}

/**
 * Maneja double click para expandir/colapsar
 */
function handleGraphDoubleClick(params) {
    if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const nodeData = appState.networkGraph.getNodeById(nodeId);
        
        if (nodeData && nodeData.data && nodeData.data.type === 'concept') {
            // En futuro: expandir para mostrar más cartas relacionadas
            showToast(`Expandiendo red desde: ${nodeData.label}`, "info");
        }
    }
}

/**
 * Refresca el grafo con nueva profundidad
 */
function refreshGraphWithDepth(depth) {
    const { nodes, edges } = buildGraphData(depth, document.getElementById('graph-category-filter').value);
    appState.networkGraph.setData({ nodes, edges });
    appState.networkGraph.fit({ animation: { duration: 300 } });
}

/**
 * Refresca el grafo con filtro de categoría
 */
function refreshGraphWithFilter(category) {
    const depth = parseInt(document.getElementById('graph-depth').value);
    const { nodes, edges } = buildGraphData(depth, category);
    appState.networkGraph.setData({ nodes, edges });
    appState.networkGraph.fit({ animation: { duration: 300 } });
}

/**
 * Popula el dropdown de filtro de categorías
 */
function populateGraphCategoryFilter() {
    const select = document.getElementById('graph-category-filter');
    if (!select) return;

    // Limpiar opciones excepto "all"
    select.innerHTML = '<option value="all">Todas las categorías</option>';

    Object.keys(CATEGORIES).forEach(catKey => {
        const option = document.createElement('option');
        option.value = catKey;
        option.textContent = catKey;
        select.appendChild(option);
    });
}

/**
 * Exportar grafo como imagen
 */
function exportGraphAsImage() {
    if (!appState.networkGraph) return;
    
    const canvas = document.querySelector('#graph-container canvas');
    if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataUrl);
        dlAnchorElem.setAttribute("download", "dodlab_semantic_graph.png");
        dlAnchorElem.click();
        showToast("Grafo exportado como PNG");
    }
}

/**
 * Toggle panel de filtros
 */
function toggleGraphFilters() {
    const panel = document.getElementById('graph-filters-panel');
    panel.classList.toggle('hidden');
}

/**
 * Resetear vista del grafo
 */
function resetGraphView() {
    document.getElementById('graph-category-filter').value = 'all';
    document.getElementById('graph-depth-slider').value = '2';
    document.getElementById('graph-search-input').value = '';
    
    if (appState.networkGraph) {
        appState.networkGraph.destroy();
        appState.networkGraph = null;
    }
    initializeGraphView();
    showToast("Vista reiniciada");
}

/**
 * Aplicar filtros al grafo
 */
function applyGraphFilters() {
    const depth = parseInt(document.getElementById('graph-depth-slider').value);
    const category = document.getElementById('graph-category-filter').value;
    const { nodes, edges } = buildGraphData(depth, category);
    
    if (appState.networkGraph) {
        appState.networkGraph.setData({ nodes, edges });
        appState.networkGraph.fit({ animation: { duration: 300 } });
    }
}

/**
 * Buscar en el grafo
 */
function searchInGraph() {
    const query = document.getElementById('graph-search-input').value.toLowerCase().trim();
    if (!query || !appState.networkGraph) return;
    
    const allNodes = appState.networkGraph.body.nodes;
    let foundNodeId = null;
    
    for (const nodeId in allNodes) {
        const node = allNodes[nodeId];
        if (node.options.label.toLowerCase().includes(query)) {
            foundNodeId = nodeId;
            break;
        }
    }
    
    if (foundNodeId) {
        appState.networkGraph.focus(foundNodeId, {
            scale: 1.5,
            animation: { duration: 500, easingFunction: 'easeInOutQuad' }
        });
        handleGraphNodeClick({ nodes: [foundNodeId], event: {} });
    }
}

/**
 * Cerrar panel de detalles
 */
function closeGraphDetails() {
    document.getElementById('graph-details-panel').classList.add('hidden');
}

/**
 * Exportar grafo como PNG
 */
function exportGraphAsPNG() {
    if (!appState.networkGraph) return;
    
    const canvas = document.querySelector('#graph-container canvas');
    if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataUrl);
        dlAnchorElem.setAttribute("download", "dodlab_semantic_graph.png");
        dlAnchorElem.click();
        showToast("Grafo exportado como PNG");
    }
}

/**
 * Manejar click en nodo - Actualizado para Graph View
 */
function handleGraphNodeClick(params) {
    const detailsPanel = document.getElementById('graph-details-panel');
    
    if (params.nodes.length > 0 && appState.networkGraph) {
        const nodeId = params.nodes[0];
        const nodeData = appState.networkGraph.getNodeById(nodeId);
        
        if (nodeData && nodeData.data) {
            document.getElementById('graph-detail-title').textContent = nodeData.label;
            document.getElementById('graph-detail-type').textContent = nodeData.data.type === 'card' 
                ? `${nodeData.data.card.category} • Carta` 
                : 'Concepto Semántico';
            
            if (nodeData.data.type === 'card') {
                const card = nodeData.data.card;
                document.getElementById('graph-detail-description').textContent = card.description || 'Sin descripción';
                
                const relationsContainer = document.getElementById('graph-detail-relations');
                relationsContainer.innerHTML = '';
                card.relations?.forEach(relId => {
                    const concept = getConceptById(relId);
                    if (concept) {
                        const pill = document.createElement('span');
                        pill.className = 'px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-bold';
                        pill.textContent = concept.label;
                        relationsContainer.appendChild(pill);
                    }
                });
            } else if (nodeData.data.type === 'concept') {
                const concept = nodeData.data.concept;
                document.getElementById('graph-detail-description').textContent = concept.description || 'Nexo relacional';
                
                const connectedEdges = appState.networkGraph.getConnectedEdges(nodeId);
                const relationsContainer = document.getElementById('graph-detail-relations');
                relationsContainer.innerHTML = `<span class="text-xs text-neutral-500">Conecta ${connectedEdges.length} cartas</span>`;
            }
            
            detailsPanel.classList.remove('hidden');
        }
    } else {
        detailsPanel.classList.add('hidden');
    }
}

/**
 * Manejar double click en nodo
 */
function handleGraphDoubleClick(params) {
    if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const nodeData = appState.networkGraph.getNodeById(nodeId);
        
        if (nodeData && nodeData.data && nodeData.data.type === 'concept') {
            showToast(`Expandiendo red desde: ${nodeData.label}`, "info");
        }
    }
}
