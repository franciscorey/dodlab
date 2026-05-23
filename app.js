// 12 Categorías del Deck Modular con sus Colores, Íconos y Metadata Base
const CATEGORIES = {
    "Contexto": { id: "Contexto", color: "#1d4ed8", icon: "map-pin", num: "01", desc: "Dónde y en qué entorno ocurre la situación proyectual." },
    "Usuario": { id: "Usuario", color: "#6d28d9", icon: "user", num: "02", desc: "Quién vive la situación directamente." },
    "Interacción": { id: "Interacción", color: "#047857", icon: "activity", num: "03", desc: "Qué acción o actividad ejecuta el usuario." },
    "Necesidad": { id: "Necesidad", color: "#b45309", icon: "heart", num: "04", desc: "Qué objetivo de fondo busca satisfacer." },
    "Fricción": { id: "Fricción", color: "#b91c1c", icon: "alert-triangle", num: "05", desc: "Qué obstáculo, barrera o bloqueo encuentra." },
    "Consecuencia": { id: "Consecuencia", color: "#c2410c", icon: "trending-down", num: "06", desc: "Qué impacto secundario indeseado provoca la fricción." },
    "Tipo solución": { id: "Tipo solución", color: "#0369a1", icon: "rocket", num: "07", desc: "Qué tipo de artefacto, sistema o canal se diseña." },
    "Mecanismo": { id: "Mecanismo", color: "#0f766e", icon: "settings", num: "08", desc: "Cómo resuelve el problema el sistema." },
    "Lenguaje": { id: "Lenguaje", color: "#be185d", icon: "palette", num: "09", desc: "Cómo se expresa estéticamente el sistema." },
    "Formato": { id: "Formato", color: "#7e22ce", icon: "layers", num: "10", desc: "Medio o materialidad final de la solución." },
    "Valor": { id: "Valor", color: "#a16207", icon: "gem", num: "11", desc: "Impacto positivo generado para las personas." },
    "Problema clave": { id: "Problema clave", color: "#4f46e5", icon: "alert-circle", num: "12", desc: "Síntesis crítica del problema detectado." }
};

// Fallback robusto para evitar errores de CORS si el archivo se abre mediante file:// sin servidor
const FALLBACK_DECK = [
    { id: "c1", title: "Transporte Público Urbano", desc: "Sistemas de buses, trenes y estaciones congestionadas en horas pico.", category: "Contexto", icon: "bus", tags: ["ciudad", "movilidad", "ruido"], image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80" },
    { id: "c2", title: "Entornos de Teletrabajo", desc: "Oficinas domésticas propensas a interrupciones e hibridación laboral.", category: "Contexto", icon: "laptop", tags: ["hogar", "remoto", "digital"], image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80" },
    { id: "c3", title: "Clínicas y Consultorios", desc: "Salas de espera saturadas y espacios con altos niveles de estrés clínico.", category: "Contexto", icon: "hospital", tags: ["salud", "espera", "ansiedad"], image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80" },
    { id: "u1", title: "Adultos Mayores (65+)", desc: "Personas con baja alfabetización digital pero necesidades activas de autonomía.", category: "Usuario", icon: "accessibility", tags: ["inclusión", "salud", "edad"], image: "https://images.unsplash.com/photo-1501139083538-0139883ac06c?auto=format&fit=crop&w=300&q=80" },
    { id: "u2", title: "Estudiantes Universitarios", desc: "Jóvenes sobreestimulados gestionando múltiples entregas bajo fatiga académica.", category: "Usuario", icon: "graduation-cap", tags: ["academia", "estrés", "joven"], image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80" },
    { id: "u3", title: "Trabajadores Gig Economy", desc: "Repartidores y conductores que dependen enteramente de algoritmos de apps.", category: "Usuario", icon: "bike", tags: ["precariedad", "móvil", "calle"], image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80" },
    { id: "i1", title: "Realizar Pago de Servicios", desc: "Completar transacciones obligatorias mediante portales virtuales o presenciales.", category: "Interacción", icon: "credit-card", tags: ["dinero", "trámite"], image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80" },
    { id: "i2", title: "Sincronizar Información", desc: "Transferir reportes, archivos u horas de desarrollo a plataformas compartidas.", category: "Interacción", icon: "refresh-cw", tags: ["datos", "rutina"], image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80" },
    { id: "i3", title: "Consultar Historial Clínico", desc: "Revisar resultados, recetas y diagnósticos pasados de manera urgente.", category: "Interacción", icon: "clipboard-list", tags: ["información", "privacidad"], image: "https://images.unsplash.com/photo-1504813184591-01557010c473?auto=format&fit=crop&w=300&q=80" },
    { id: "n1", title: "Reducir el Estrés Operativo", desc: "Lograr completar tareas sin experimentar frustración o culpa cognitiva.", category: "Necesidad", icon: "heart", tags: ["paz-mental", "flujo"], image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=80" },
    { id: "n2", title: "Optimizar Tiempos de Espera", desc: "Convertir los vacíos temporales del día a día en momentos productivos o de relax.", category: "Necesidad", icon: "hourglass", tags: ["eficiencia", "tiempo"], image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&w=300&q=80" },
    { id: "f1", title: "Interfaces Oscuras", desc: "Diseño que induce con trampas a contratar seguros o suscribirse por accidente.", category: "Fricción", icon: "scale", tags: ["ética", "diseño-malo"], image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80" },
    { id: "f2", title: "Saturación de Notificaciones", desc: "Avisos constantes de aplicaciones que compiten agresivamente por la atención.", category: "Fricción", icon: "bell", tags: ["interrupción", "ruido"], image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80" },
    { id: "co1", title: "Pérdida de Enfoque Profundo", desc: "Fragmentación crónica de la atención en periodos menores de 10 minutos.", category: "Consecuencia", icon: "frown", tags: ["cognitivo", "productividad"], image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80" },
    { id: "s1", title: "Aplicación Móvil Offline First", desc: "App de alto rendimiento que opera sin internet ni recargas obligatorias.", category: "Tipo solución", icon: "smartphone", tags: ["mobile", "ligero"], image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=300&q=80" },
    { id: "s2", title: "Dispositivo IoT de Mesa", desc: "Hardware minimalista e independiente con indicadores ambientales discretos.", category: "Tipo solución", icon: "cpu", tags: ["físico", "hardware"], image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80" },
    { id: "m1", title: "Feedback Háptico Táctil", desc: "Alertas físicas por vibración progresiva para guiar sin requerir pantallas.", category: "Mecanismo", icon: "activity", tags: ["sensorial", "tacto"], image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=300&q=80" },
    { id: "l1", title: "Minimalismo Funcional", desc: "Inspirado en Linear y Notion, centrado en alto contraste e iconos finos.", category: "Lenguaje", icon: "grid", tags: ["diseño", "limpio"], image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=300&q=80" },
    { id: "fo1", title: "Extensión de Navegador Silenciosa", desc: "Complemento web invisible que actúa de filtro purificador en segundo plano.", category: "Formato", icon: "toy-brick", tags: ["navegador", "utilidad"], image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=300&q=80" },
    { id: "v1", title: "Paz Mental y Enfoque Activo", desc: "Espacio mental libre de ruidos corporativos que optimiza la tranquilidad diaria.", category: "Valor", icon: "leaf", tags: ["bienestar", "salud"], image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80" }
];

// Estado Global de la App
let appState = {
    view: "home",
    cards: [],
    projects: [],
    locks: {
        "Contexto": false, "Usuario": false, "Interacción": false, "Necesidad": false, "Fricción": false,
        "Consecuencia": false, "Tipo solución": false, "Mecanismo": false, "Lenguaje": false, "Formato": false, "Valor": false
    },
    currentGeneration: {
        "Contexto": null, "Usuario": null, "Interacción": null, "Necesidad": null, "Fricción": null,
        "Consecuencia": null, "Tipo solución": null, "Mecanismo": null, "Lenguaje": null, "Formato": null, "Valor": null
    },
    deckSearch: "",
    deckCategory: "All",
    deckSort: "recent",
    canvasZoom: 1,
    canvasCards: [],
    canvasConnections: [],
    activeConnectorSource: null,
    isCanvasPanning: false,
    panOffset: { x: -1000, y: -1000 },
    dragStart: { x: 0, y: 0 }
};

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
    if (savedCards) {
        appState.cards = JSON.parse(savedCards);
    } else {
        // Carga asíncrona inyectando JSON externo con fallback seguro
        try {
            const response = await fetch('deck-data.json');
            if (!response.ok) throw new Error('Error al cargar deck-data.json');
            appState.cards = await response.json();
            console.log("Mazo inicial cargado desde deck-data.json de forma dinámica.");
        } catch (error) {
            console.warn("No se pudo cargar deck-data.json (probablemente CORS o protocolo local file://). Cargando fallback integrado.", error);
            appState.cards = [...FALLBACK_DECK];
        }
        localStorage.setItem("ideation_deck_cards", JSON.stringify(appState.cards));
    }

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
    shuffleGeneratorDeck(true);
    renderAllViews();
    setupCanvasWorkspace();
    triggerLucide();
};

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

function shuffleGeneratorDeck(silent = false) {
    const categoriesToShuffle = Object.keys(appState.locks).filter(cat => !appState.locks[cat]);

    categoriesToShuffle.forEach(cat => {
        const candidates = appState.cards.filter(c => c.category === cat);
        if (candidates.length > 0) {
            const randomCard = candidates[Math.floor(Math.random() * candidates.length)];
            appState.currentGeneration[cat] = randomCard;
        } else {
            appState.currentGeneration[cat] = null;
        }
    });

    if (!silent) {
        categoriesToShuffle.forEach(cat => {
            const slot = document.getElementById(`slot-${cat}`);
            if (slot) {
                slot.classList.add('animate-deal');
                setTimeout(() => slot.classList.remove('animate-deal'), 450);
            }
        });
        showToast("Mazo barajado");
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
                        <p class="text-[8px] text-neutral-400 line-clamp-2 mt-0.5">${card.desc}</p>
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

    const u = gen["Usuario"] ? `<strong class="text-purple-600 dark:text-purple-400">[${gen["Usuario"].title}]</strong>` : "[Usuario]";
    const c = gen["Contexto"] ? `en <strong class="text-blue-600 dark:text-blue-400">[${gen["Contexto"].title}]</strong>` : "en [Contexto]";
    const i = gen["Interacción"] ? `realiza la acción de <strong class="text-emerald-600 dark:text-emerald-400">[${gen["Interacción"].title}]</strong>` : "realiza [Interacción]";
    const n = gen["Necesidad"] ? `para satisfacer su necesidad de <strong class="text-amber-600 dark:text-amber-400">[${gen["Necesidad"].title}]</strong>` : "para satisfacer [Necesidad]";
    const f = gen["Fricción"] ? `pero se encuentra con el obstáculo de <strong class="text-red-600 dark:text-red-400">[${gen["Fricción"].title}]</strong>` : "pero encuentra [Fricción]";
    const co = gen["Consecuencia"] ? `lo cual provoca la consecuencia de <strong class="text-orange-600 dark:text-orange-400">[${gen["Consecuencia"].title}]</strong>.` : "que provoca [Consecuencia].";

    pText.innerHTML = `El usuario ${u} ${c} ${i} ${n}, ${f} ${co}`;

    const ts = gen["Tipo solución"] ? `<strong class="text-blue-600 dark:text-blue-400">[${gen["Tipo solución"].title}]</strong>` : "[Tipo de Solución]";
    const m = gen["Mecanismo"] ? `mediante el mecanismo de <strong class="text-teal-600 dark:text-teal-400">[${gen["Mecanismo"].title}]</strong>` : "mediante [Mecanismo]";
    const l = gen["Lenguaje"] ? `con un lenguaje de expresión <strong class="text-pink-600 dark:text-pink-400">[${gen["Lenguaje"].title}]</strong>` : "con lenguaje [Lenguaje]";
    const fo = gen["Formato"] ? `<strong class="text-violet-600 dark:text-violet-400">[${gen["Formato"].title}]</strong>` : `<strong class="text-violet-600 dark:text-violet-400">[${gen["Formato"]?.title || "Mazo Físico/Digital"}]</strong>`;
    const v = gen["Valor"] ? `para generar el impacto de valor de <strong class="text-yellow-600 dark:text-yellow-400">[${gen["Valor"].title}]</strong>.` : "para generar [Valor].";

    oText.innerHTML = `Oportunidad: Diseñar un ${ts} ${m} ${l} en el formato de ${fo} ${v}`;
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
