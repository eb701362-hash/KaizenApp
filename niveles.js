import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const USER_ID = "RBW5mdCSsOYvGAdZlQnzyNgQbCs1";
const USER_REF = doc(db, "usuarios", USER_ID);
async function loadStateFromFirestore() {
  try {
    const snapshot = await getDoc(USER_REF);

    if (snapshot.exists()) {
      const remoteState = snapshot.data();

      STATE = {
        ...STATE,
        ...remoteState,
        units: {
          ...STATE.units,
          ...(remoteState.units || {})
        }
      };

      localStorage.setItem(
        "kaizen_state_v2",
        JSON.stringify(STATE)
      );

      console.log("☁️ Estado cargado desde Firestore:", STATE);
    } else {
      console.log("☁️ No existe estado en Firestore, se usará el local.");
    }
  } catch (error) {
    console.error("❌ Error cargando estado desde Firestore:", error);
  }
}
const FELICITACIONES = {
    1: "¡Felicidades! Completaste el Nivel 1. Tus manos comienzan a despertar su magia.",
    2: "¡Excelente trabajo! Nivel 2 dominado. Tu camino apenas comienza.",
    3: "¡Nivel 3 completado! Tu habilidad crece como un fuego brillante.",
    4: "¡Gran avance! Nivel 4 superado. Sigue así, aprendiz.",
    5: "¡Nivel 5 terminado! Ya eres más fuerte que ayer.",
    6: "¡Perfecto! Nivel 6 completado. Tu progreso es admirable.",
    7: "¡Nivel 7 dominado! Estás muy cerca de la maestría.",
    8: "🏆 ¡Has completado el Nivel 8! La unidad está casi en tus manos."
};





// ============================================================
// DETECTAR SI VIENE DE UN NIVEL Y APLICAR PROGRESO
// ============================================================
window.addEventListener("load", () => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("done") === "1") {
        const unit = parseInt(params.get("unit"));

        // Puede venir como ?lesson= (0-based) o ?level= (1-based)
        const lessonParam = params.get("lesson");
        const levelParam = params.get("level");

        let idx = null;

        if (lessonParam !== null) {
            // Si viene como lesson, asumimos índice 0-based
            idx = parseInt(lessonParam);
        } else if (levelParam !== null) {
            // Si viene como level, es 1-based → lo convertimos a índice
            idx = parseInt(levelParam) - 1;
        }

        if (!isNaN(unit) && !isNaN(idx) && idx >= 0) {
            completeLesson(unit, idx);
        }

        // Limpia la URL para que no repita al refrescar
        history.replaceState({}, document.title, "niveles.html");
    }
});


// ============================================================
// CONFIGURACIÓN DE UNIDADES Y LECCIONES
// ============================================================
const UNITS = [
    {
        id: 1,
        name: 'Unidad 1',
        title: 'Comunicación Básica en LSM',
        key: 'u1',
        lessons: [
            { id: 0, name: 'Abecedario I', icon: '🔤', desc: 'Aprende las 27 letras del alfabeto en señas mexicanas.', xp: 20, gems: 5, type: 'lesson' },
            { id: 1, name: 'Abecedario II', icon: '🔢', desc: 'Cuenta del 1 al 20 en LSM.', xp: 20, gems: 5, type: 'lesson' },
            { id: 2, name: 'Abecedario III', icon: '🎨', desc: 'Colores básicos en lenguaje de señas.', xp: 20, gems: 5, type: 'lesson' },
            { id: 3, name: 'Palabras', icon: '💬', desc: 'Vocabulario esencial del día a día.', xp: 25, gems: 6, type: 'lesson' },
            { id: 4, name: 'Reto 1 ⭐', icon: '⭐', desc: 'Pon a prueba lo aprendido. ¡Cuidado con las vidas!', xp: 40, gems: 10, type: 'checkpoint' },
            { id: 5, name: 'Familia', icon: '👨‍👩‍👧', desc: 'Señas para miembros de la familia.', xp: 25, gems: 6, type: 'lesson' },
            { id: 6, name: 'Saludos', icon: '👋', desc: 'Saludar y despedirte en LSM.', xp: 25, gems: 6, type: 'lesson' },
            { id: 7, name: 'Examen Final 🏆', icon: '🏆', desc: 'Demuestra todo lo que aprendiste en la unidad.', xp: 60, gems: 15, type: 'final' }
        ]
    },
    {
        id: 2,
        name: 'Unidad 2',
        title: 'Conversación Intermedia',
        key: 'u2',
        lessons: [
            { id: 0, name: 'Frases Básicas', icon: '💭', desc: 'Construye frases simples en LSM.', xp: 25, gems: 6, type: 'lesson' },
            { id: 1, name: 'Preguntas', icon: '❓', desc: 'Aprende a formular preguntas.', xp: 25, gems: 6, type: 'lesson' },
            { id: 2, name: 'Respuestas', icon: '✅', desc: 'Responde de forma clara y precisa.', xp: 25, gems: 6, type: 'lesson' },
            { id: 3, name: 'Emociones', icon: '😊', desc: 'Expresa emociones básicas en LSM.', xp: 30, gems: 7, type: 'lesson' },
            { id: 4, name: 'Reto 2 ⭐', icon: '⭐', desc: 'Reto intermedio con todo lo aprendido.', xp: 45, gems: 10, type: 'checkpoint' },
            { id: 5, name: 'Conversación Diaria', icon: '🗨️', desc: 'Simula diálogos cotidianos.', xp: 30, gems: 7, type: 'lesson' },
            { id: 6, name: 'Contexto', icon: '🌍', desc: 'Usa contexto para entender mejor.', xp: 30, gems: 7, type: 'lesson' },
            { id: 7, name: 'Examen Unidad 2 🏆', icon: '🏆', desc: 'Evalúa tu conversación intermedia.', xp: 70, gems: 18, type: 'final' }
        ]
    },
    {
        id: 3,
        name: 'Unidad 3',
        title: 'Expresión Avanzada',
        key: 'u3',
        lessons: [
            { id: 0, name: 'Narración', icon: '📖', desc: 'Cuenta historias en LSM.', xp: 30, gems: 7, type: 'lesson' },
            { id: 1, name: 'Opiniones', icon: '🧠', desc: 'Expresa opiniones complejas.', xp: 30, gems: 7, type: 'lesson' },
            { id: 2, name: 'Debate', icon: '⚖️', desc: 'Argumenta y contraargumenta.', xp: 35, gems: 8, type: 'lesson' },
            { id: 3, name: 'Matices', icon: '🌈', desc: 'Expresa matices y detalles.', xp: 35, gems: 8, type: 'lesson' },
            { id: 4, name: 'Reto 3 ⭐', icon: '⭐', desc: 'Reto avanzado de expresión.', xp: 50, gems: 12, type: 'checkpoint' },
            { id: 5, name: 'Historias Personales', icon: '👤', desc: 'Cuenta experiencias propias.', xp: 35, gems: 8, type: 'lesson' },
            { id: 6, name: 'Interpretación', icon: '🎭', desc: 'Interpreta mensajes complejos.', xp: 35, gems: 8, type: 'lesson' },
            { id: 7, name: 'Examen Final KAIZEN 🏆', icon: '🏆', desc: 'Demuestra dominio avanzado.', xp: 90, gems: 25, type: 'final' }
        ]
    }
];

// Posiciones S-curve (8 nodos)
const NODE_POSITIONS = [
    { x: 0.20, y: 80 },
    { x: 0.40, y: 190 },
    { x: 0.60, y: 300 },
    { x: 0.75, y: 410 },
    { x: 0.60, y: 520 },
    { x: 0.40, y: 630 },
    { x: 0.22, y: 740 },
    { x: 0.42, y: 860 },
];

// ============================================================
// ESTADO DEL JUEGO
// ============================================================
function loadState() {
    const def = {
        xp: 0,
        gems: 0,
        lives: 5,
        streak: 0,
        lastLogin: null,
        lastStreakUpdate: null,
        livesDepletedAt: null,
        currentUnit: 1,
        units: {
            1: { completed: [], currentLesson: 0, examDone: false, unlocked: true },
            2: { completed: [], currentLesson: 0, examDone: false, unlocked: false },
            3: { completed: [], currentLesson: 0, examDone: false, unlocked: false }
        }
    };

    try {
        const saved = JSON.parse(localStorage.getItem('kaizen_state_v2'));
        return saved ? saved : def;
    } catch {
        return def;
    }
}


async function saveState(s) {
    // ==========================================
    // GUARDAR LOCALMENTE
    // ==========================================

    localStorage.setItem(
        'kaizen_state_v2',
        JSON.stringify(s)
    );

    // Datos para perfil
    localStorage.setItem('kaizen_xp', s.xp);
    localStorage.setItem('kaizen_gems', s.gems);
    localStorage.setItem('kaizen_streak', s.streak);
    localStorage.setItem('kaizen_lives', s.lives);
    localStorage.setItem(
        'kaizen_current_unit',
        s.currentUnit
    );
    localStorage.setItem(
        'kaizen_units_progress',
        JSON.stringify(s.units)
    );


    // ==========================================
    // GUARDAR EN FIRESTORE
    // ==========================================

    try {
        await setDoc(
            USER_REF,
            {
                xp: s.xp,
                gems: s.gems,
                lives: s.lives,
                streak: s.streak,
                currentUnit: s.currentUnit,
                units: s.units
            },
            { merge: true }
        );

        console.log("🔥 Kaizen sincronizado con Firestore");
    } catch (error) {
        console.error(
            "❌ Error sincronizando Kaizen con Firestore:",
            error
        );
    }
}

let STATE = loadState();
let currentUnitId = 1;
let currentLessonIndex = null;


// ============================================================
// RACHAS
// ============================================================
function checkStreak() {
    const now = Date.now();
    const MS_PER_DAY = 86400000;

    if (!STATE.lastLogin) {
        STATE.lastLogin = now;
        STATE.lastStreakUpdate = now;
        saveState(STATE);
        return;
    }

    const diffMs = now - STATE.lastLogin;

    if (diffMs > MS_PER_DAY) {
        STATE.streak = 0;
        STATE.lastLogin = now;
        STATE.lastStreakUpdate = now;
        saveState(STATE);
        updateUI();
        return;
    }

    STATE.lastLogin = now;
    saveState(STATE);
}

// ============================================================
// UI
// ============================================================
function updateUI() {
    document.getElementById('stat-streak').textContent = STATE.streak;
    document.getElementById('stat-gems').textContent = STATE.gems;
    document.getElementById('stat-xp').textContent = STATE.xp + ' XP';
    document.getElementById('stat-lives').textContent = 'x' + STATE.lives;
    document.getElementById('rank-my-xp').textContent = STATE.xp + ' XP';

    const u1 = UNITS[0];
    const u1State = STATE.units[1];
    const totalLessonsU1 = u1.lessons.length;
    const doneU1 = u1State.completed.length;
    const pct = Math.round((doneU1 / totalLessonsU1) * 100);
    document.getElementById('side-progress').style.width = pct + '%';
    document.getElementById('side-progress-text').textContent =
        `${doneU1} de ${totalLessonsU1} lecciones completadas`;

    renderAllUnits();
    updateUnitHeaders();
}

function updateUnitHeaders() {
    const u1State = STATE.units[1];
    const u2State = STATE.units[2];
    const u3State = STATE.units[3];

    const unit1Status = document.getElementById('unit1-status');
    const unit2Status = document.getElementById('unit2-status');
    const unit3Status = document.getElementById('unit3-status');

    const unit1Header = document.getElementById('unit1-header');
    const unit2Header = document.getElementById('unit2-header');
    const unit3Header = document.getElementById('unit3-header');

    // Unidad 1
    if (u1State.completed.length === UNITS[0].lessons.length) {
        unit1Status.textContent = 'Completada';
        unit1Status.className = 'unit-status status-unlocked';
    } else {
        unit1Status.textContent = 'En progreso';
        unit1Status.className = 'unit-status status-active';
    }

    // Desbloqueos
    if (u1State.completed.length === UNITS[0].lessons.length) {
        STATE.units[2].unlocked = true;
    }
    if (u2State.completed.length === UNITS[1].lessons.length) {
        STATE.units[3].unlocked = true;
    }
    saveState(STATE);

    // Unidad 2
    if (!u2State.unlocked) {
        unit2Status.textContent = 'Bloqueada';
        unit2Status.className = 'unit-status status-locked';
        unit2Header.classList.remove('active-unit');
    } else if (u2State.completed.length === UNITS[1].lessons.length) {
        unit2Status.textContent = 'Completada';
        unit2Status.className = 'unit-status status-unlocked';
    } else {
        unit2Status.textContent = 'En progreso';
        unit2Status.className = 'unit-status status-active';
    }

    // Unidad 3
    if (!u3State.unlocked) {
        unit3Status.textContent = 'Bloqueada';
        unit3Status.className = 'unit-status status-locked';
        unit3Header.classList.remove('active-unit');
    } else if (u3State.completed.length === UNITS[2].lessons.length) {
        unit3Status.textContent = 'Completada';
        unit3Status.className = 'unit-status status-unlocked';
    } else {
        unit3Status.textContent = 'En progreso';
        unit3Status.className = 'unit-status status-active';
    }
}

// ============================================================
// RENDERIZAR TODAS LAS UNIDADES
// ============================================================
function renderAllUnits() {
    renderNodesForUnit(UNITS[0], 'u1-path', 'u1-svg', STATE.units[1], true);
    renderNodesForUnit(UNITS[1], 'u2-path', 'u2-svg', STATE.units[2], STATE.units[2].unlocked);
    renderNodesForUnit(UNITS[2], 'u3-path', 'u3-svg', STATE.units[3], STATE.units[3].unlocked);
}

// ============================================================
// RENDERIZAR NODOS PARA UNA UNIDAD
// ============================================================
function renderNodesForUnit(unit, containerId, svgId, unitState, isUnlocked) {
    const container = document.getElementById(containerId);
    const svg = document.getElementById(svgId);
    if (!container || !svg) return;

    const W = container.offsetWidth || 600;
    const H = 980;
    container.style.minHeight = H + 'px';

    container.querySelectorAll('.lesson-node').forEach(n => n.remove());

    const positions = NODE_POSITIONS.map(p => ({
        x: Math.round(p.x * W),
        y: p.y
    }));

    drawSCurve(svg, positions, W, H, unitState);

    unit.lessons.forEach((lesson, i) => {
        const pos = positions[i];
       const isDone = unitState.completed.includes(i);
const isActive = i === unitState.currentLesson && isUnlocked;
const isLocked = !isDone && !isActive && isUnlocked;


        const node = document.createElement('div');
        node.className = 'lesson-node';
        node.id = `${unit.key}-node-${i}`;
        node.style.left = (pos.x - 44) + 'px';
        node.style.top = (pos.y - 44) + 'px';

        let btnClass = 'lesson-btn ';
        if (lesson.type === 'checkpoint' || lesson.type === 'final') {
            btnClass += 'state-checkpoint';
            if (!isUnlocked || isLocked) btnClass += ' state-locked';
            else if (isDone) btnClass += ' state-done';
        } else {
           if (!isUnlocked) {
    btnClass += 'state-locked';
} 
else if (isDone) {
    btnClass += 'state-done';
} 
else if (isActive) {
    btnClass += 'state-active';
} 
else {
    btnClass += 'state-locked';
}

        }

        const lockHTML = (!isUnlocked || isLocked)
            ? `<div class="lock-overlay">🔒</div>` : '';

        const imgHTML = `<span style="font-size:2.2rem;position:relative;z-index:2">${lesson.icon}</span>`;

       const canStart = isUnlocked && (isDone || isActive);

        const doneCheck = isDone
            ? `<div class="done-check" style="position:absolute;bottom:6px;right:8px;background:#58CC02;color:#000;font-weight:900;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;z-index:4;">✓</div>` : '';

        node.innerHTML = `
            <button class="${btnClass}" ${canStart ? `onclick="openLesson(${unit.id}, ${i})"` : ''}>
                ${imgHTML}
                ${lockHTML}
                ${doneCheck}
            </button>
            <span class="lesson-label ${isActive ? 'active' : ''}">${lesson.name}</span>
        `;

        container.appendChild(node);
    });
}

// ============================================================
// DIBUJAR CURVA S
// ============================================================
function drawSCurve(svg, positions, W, H, unitState) {
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.innerHTML = '';

    if (positions.length < 2) return;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <linearGradient id="doneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   style="stop-color:#58CC02;stop-opacity:1"/>
            <stop offset="100%" style="stop-color:#00F5FF;stop-opacity:1"/>
        </linearGradient>
    `;
    svg.appendChild(defs);

    function buildPath(pts) {
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1];
            const curr = pts[i];
            const midY = (prev.y + curr.y) / 2;
            d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
        }
        return d;
    }

    const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bgPath.setAttribute('d', buildPath(positions));
    bgPath.setAttribute('fill', 'none');
    bgPath.setAttribute('stroke', 'rgba(139,92,246,0.18)');
    bgPath.setAttribute('stroke-width', '5');
    bgPath.setAttribute('stroke-linecap', 'round');
    bgPath.setAttribute('stroke-dasharray', '12 8');
    svg.appendChild(bgPath);

    const completedCount = unitState.completed.length;
    if (completedCount > 0) {
        const endIdx = Math.min(completedCount, positions.length - 1);
        const donePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        donePath.setAttribute('d', buildPath(positions.slice(0, endIdx + 1)));
        donePath.setAttribute('fill', 'none');
        donePath.setAttribute('stroke', 'url(#doneGrad)');
        donePath.setAttribute('stroke-width', '5');
        donePath.setAttribute('stroke-linecap', 'round');
        svg.appendChild(donePath);
    }
}

// ============================================================
// ABRIR LECCIÓN (VA A OTRA PÁGINA)
// ============================================================
function openLesson(unitId, idx) {
    if (STATE.lives <= 0) {
        showNoLivesModal();
        return;
    }

    const levelNumber = (unitId - 1) * 8 + (idx + 1);

    window.location.href = "/html/nivel" + levelNumber + ".html?unit=" + unitId + "&level=" + (idx + 1);
}


// ============================================================
// CERRAR MODAL (USADO POR VIDAS)
// ============================================================
function closeModal() {
    const modal = document.getElementById('lesson-modal');
    if (modal) modal.classList.remove('active');
}

// ============================================================
// EJERCICIO (PANTALLA) – YA NO SE USA PARA NAVEGAR, PERO LO DEJO
// ============================================================
function openExercise(isNew) {
    const unit = UNITS.find(u => u.id === currentUnitId);
    const lesson = unit.lessons[currentLessonIndex];

    document.getElementById('exercise-title').textContent = `${lesson.icon} ${lesson.name}`;
    document.getElementById('exercise-desc').textContent =
        'Resuelve este ejercicio de práctica. Aquí luego puedes integrar tus actividades reales (videos, opciones, etc.).';

    const finishBtn = document.getElementById('exercise-finish-btn');
    finishBtn.onclick = () => {
        const isRisky = lesson.type === 'checkpoint' || lesson.type === 'final';
        const success = true; // placeholder: siempre éxito
        if (success) {
            completeLesson(currentUnitId, currentLessonIndex);
        } else if (isRisky) {
            loseLife(true);
        } else {
            loseLife(false);
        }
        document.getElementById('exercise-screen').classList.remove('active');
    };

    // Antes redirigías aquí, pero ahora la navegación la hace openLesson
    // window.location.href = "ejercicio.html?unit=" + currentUnitId + "&level=" + (currentLessonIndex + 1);
}

// ============================================================
// COMPLETAR LECCIÓN
// ============================================================
function completeLesson(unitId, idx) {
    const unit = UNITS.find(u => u.id === unitId);
    const lesson = unit.lessons[idx];
    const unitState = STATE.units[unitId];

    // Marcar como completado
    if (!unitState.completed.includes(idx)) {
        unitState.completed.push(idx);
    }

    // XP y gemas
    STATE.xp += lesson.xp;
    STATE.gems += lesson.gems;

    // Si es examen final
    if (lesson.type === 'final') {
        unitState.examDone = true;
    }

    // Avanzar al siguiente nivel
    if (idx + 1 < unit.lessons.length) {
        unitState.currentLesson = idx + 1;
    }

    // ⭐ DESBLOQUEAR SIGUIENTE UNIDAD SOLO SI COMPLETASTE TODA LA UNIDAD
    if (unitState.completed.length === unit.lessons.length) {
        if (STATE.units[unitId + 1]) {
            STATE.units[unitId + 1].unlocked = true;
        }
    }

    STATE.currentUnit = unitId;

    registerHistory(`${unit.name} - ${lesson.name}`, lesson.xp);
    updateAchievements();

    saveState(STATE);

    playSquaresAnimation(() => {
        const isLastLesson = idx === unit.lessons.length - 1;
        if (!isLastLesson) {
            playUnlockAnimation(unit.lessons[idx + 1].name, () => {
                showCompleteScreen(lesson, unitId, idx);
            });
        } else {
            showCompleteScreen(lesson, unitId, idx);
        }
    });

    // ⭐ Mostrar felicitación del gorrioncito
    setTimeout(() => {
        mostrarFelicitacionGorrion(unitId, idx);
    }, 1200);
}





// === POSICIÓN FIJA DEL GORRIONCITO DESPUÉS DE LA BIENVENIDA ===
window.addEventListener("load", () => {

    if (localStorage.getItem("kaizen_bienvenida_mostrada") === "1") {

        const brujita = document.getElementById("brujita");
        const panel = document.getElementById("brujita-panel");

        brujita.style.left = "auto";
        brujita.style.right = "100px";
        brujita.style.top = "40%";
        brujita.style.opacity = "1";

        panel.classList.add("oculto-panel");
    }
});

// ============================================================
// FELICITACIÓN DEL GORRIONCITO
// ============================================================
function mostrarFelicitacionGorrion(unitId, idx) {
    const brujita = document.getElementById("brujita");
    const panel = document.getElementById("brujita-panel");
    const texto = document.getElementById("brujita-texto");
    const audio = document.getElementById("audio-felicitacion");

    const nivelGlobal = idx + 1;
    const frase = FELICITACIONES[nivelGlobal] || "¡Excelente trabajo! Sigue avanzando.";

    // Mostrar gorrioncito arriba a la derecha
    brujita.style.left = "auto";
    brujita.style.right = "100px";
    brujita.style.top = "40%";
    brujita.style.opacity = "1";

    // Mostrar panel
    panel.classList.remove("oculto-panel");
    panel.style.left = "auto";
    panel.style.right = "180px";
    panel.style.top = "60%";

    texto.textContent = frase;

    // Reproducir audio
    audio.currentTime = 0;
    audio.play().catch(()=>{});

    // Ocultar panel después de 5s
    setTimeout(() => {
        panel.classList.add("oculto-panel");
    }, 5000);
}






// ============================================================
// HISTORIAL
// ============================================================
function registerHistory(lessonName, xpGained) {
    try {
        const history = JSON.parse(localStorage.getItem('kaizen_history') || '[]');
        history.unshift({
            lesson: lessonName,
            xp: xpGained,
            date: new Date().toLocaleDateString('es-MX', {
                day: '2-digit', month: 'short', year: 'numeric'
            })
        });
        localStorage.setItem('kaizen_history', JSON.stringify(history.slice(0, 20)));
    } catch (e) { }
}

// ============================================================
// LOGROS
// ============================================================
function updateAchievements() {
    const achievements = [];

    const u1 = STATE.units[1];
    const u2 = STATE.units[2];
    const u3 = STATE.units[3];

    if (u1.completed.length === UNITS[0].lessons.length) {
        achievements.push('Unidad 1 Completada');
    }
    if (u2.unlocked) {
        achievements.push('Unidad 2 Desbloqueada');
    }
    if (u2.completed.length === UNITS[1].lessons.length) {
        achievements.push('Unidad 2 Completada');
    }
    if (u3.unlocked) {
        achievements.push('Unidad 3 Desbloqueada');
    }
    if (u3.completed.length === UNITS[2].lessons.length) {
        achievements.push('Unidad 3 Completada');
    }
    if (STATE.streak >= 7) {
        achievements.push('Racha de 7 días');
    }
    if (STATE.xp >= 500) {
        achievements.push('Aprendiz Constante');
    }

    localStorage.setItem('kaizen_achievements', JSON.stringify(achievements));
}

// ============================================================
// VIDAS
// ============================================================
function loseLife(resetUnit = true) {
    STATE.lives--;
    if (STATE.lives < 0) STATE.lives = 0;

    if (STATE.lives === 0) {
        STATE.livesDepletedAt = Date.now();
    }

    saveState(STATE);
    updateUI();

    if (STATE.lives <= 0 && resetUnit) {
        setTimeout(showGameOver, 300);
    } else if (STATE.lives <= 0) {
        STATE.lives = 5;
        saveState(STATE);
        updateUI();
    } else {
        openLesson(currentUnitId, currentLessonIndex);
    }
}

function showNoLivesModal() {
    const depletedAt = STATE.livesDepletedAt || Date.now();
    const hoursLeft = Math.max(0, 30 - ((Date.now() - depletedAt) / 3600000));
    document.getElementById('modal-icon').textContent = '⏳';
    document.getElementById('modal-title').textContent = '¡Sin vidas!';
    document.getElementById('modal-desc').textContent =
        `Tus vidas se recargan en ${hoursLeft.toFixed(1)} horas. Vuelve más tarde.`;
    document.getElementById('modal-lives').innerHTML = '💔💔💔💔💔';
    const btn = document.getElementById('modal-start-btn');
    btn.textContent = 'Cerrar';
    btn.className = 'modal-btn';
    btn.onclick = closeModal;
    document.getElementById('lesson-modal').classList.add('active');
}

function showGameOver() {
    const unit = UNITS.find(u => u.id === currentUnitId);
    const lesson = unit.lessons[currentLessonIndex];
    document.getElementById('modal-icon').textContent = '💔';
    document.getElementById('modal-title').textContent = '¡Sin vidas!';
    document.getElementById('modal-desc').textContent =
        `Perdiste todas tus vidas en "${unit.name} - ${lesson.name}". El progreso de la unidad se reinicia.`;
    document.getElementById('modal-lives').innerHTML = '💔💔💔💔💔';
    const btn = document.getElementById('modal-start-btn');
    btn.textContent = 'Reiniciar Unidad';
    btn.className = 'modal-btn danger';
    btn.onclick = resetUnit;
    document.getElementById('lesson-modal').classList.add('active');
}

function resetUnit() {
    const uState = STATE.units[currentUnitId];
    uState.completed = [];
    uState.currentLesson = 0;
    uState.examDone = false;
    STATE.lives = 5;
    STATE.livesDepletedAt = null;
    saveState(STATE);
    closeModal();
    updateUI();
}

function checkLivesRecharge() {
    if (STATE.lives >= 5) return;
    if (!STATE.livesDepletedAt) return;

    const MS_PER_HALF_LIFE = 30 * 3600000;
    const elapsed = Date.now() - STATE.livesDepletedAt;
    const livesRestored = Math.floor(elapsed / MS_PER_HALF_LIFE);

    if (livesRestored > 0) {
        STATE.lives = Math.min(5, STATE.lives + livesRestored);
        if (STATE.lives >= 5) STATE.livesDepletedAt = null;
        saveState(STATE);
        updateUI();
    }
}

// ============================================================
// ANIMACIONES
// ============================================================
function playSquaresAnimation(callback) {
    const container = document.getElementById('completion-squares');
    container.innerHTML = '';
    container.classList.add('active');

    const colors = ['#8B5CF6', '#EC4899', '#00F5FF', '#58CC02', '#FFD700', '#FF9600', '#3B82F6'];
    const total = 40;
    let done = 0;

    for (let i = 0; i < total; i++) {
        setTimeout(() => {
            const sq = document.createElement('div');
            sq.className = 'sq';
            sq.style.left = Math.random() * 100 + 'vw';
            sq.style.top = Math.random() * 100 + 'vh';
            sq.style.background = colors[Math.floor(Math.random() * colors.length)];
            sq.style.animationDelay = (Math.random() * 0.3) + 's';
            sq.style.animationDuration = (0.4 + Math.random() * 0.4) + 's';
            container.appendChild(sq);
            done++;
            if (done === total) {
                setTimeout(() => {
                    container.classList.remove('active');
                    container.innerHTML = '';
                    if (callback) callback();
                }, 800);
            }
        }, i * 30);
    }
}

function playUnlockAnimation(lessonName, callback) {
    const overlay = document.getElementById('unlock-overlay');
    const lockEl = document.getElementById('unlock-lock');
    const textEl = document.getElementById('unlock-text');
    const subEl = document.getElementById('unlock-subtext');

    lockEl.style.animation = 'none';
    textEl.style.animation = 'none';
    subEl.style.animation = 'none';
    void lockEl.offsetWidth;

    lockEl.style.animation = 'lockShake 0.5s ease, lockOpen 0.8s ease 0.5s forwards';
    textEl.style.animation = 'fadeInUp 0.5s ease 0.8s forwards';
    subEl.style.animation = 'fadeInUp 0.5s ease 1s forwards';

    textEl.textContent = '¡Desbloqueado!';
    subEl.textContent = `"${lessonName}" ahora disponible`;

    overlay.classList.add('active');
    setTimeout(() => {
        overlay.classList.remove('active');
        if (callback) callback();
    }, 2200);
}

function showCompleteScreen(lesson, unitId, idx) {
    launchConfetti();

    document.getElementById('cs-xp').textContent = '+' + lesson.xp + ' XP';
    document.getElementById('cs-gems').textContent = '+' + lesson.gems + ' 💎';
    document.getElementById('cs-lives').textContent = '❤️ x' + STATE.lives;

    const unit = UNITS.find(u => u.id === unitId);
    const unitState = STATE.units[unitId];
    const isLast = idx === unit.lessons.length - 1;

    document.getElementById('complete-title').textContent =
        isLast ? `${unit.name} Completada 🎉` : '¡Lección Completada!';
    document.getElementById('complete-subtitle').textContent = isLast
        ? `¡Increíble! Completaste toda ${unit.name}.`
        : `¡Excelente! Ganaste ${lesson.xp} XP y ${lesson.gems} gemas.`;

    document.getElementById('complete-screen').classList.add('active');
    updateUI();
}

function continueAfterComplete() {
    document.getElementById('complete-screen').classList.remove('active');
    document.getElementById('confetti-container').classList.remove('active');
    updateUI();
}

function launchConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    container.classList.add('active');

    const colors = ['#8B5CF6', '#EC4899', '#00F5FF', '#58CC02', '#FFD700', '#FF9600', '#3B82F6', '#FF4B4B'];
    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (6 + Math.random() * 8) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (2 + Math.random() * 2) + 's';
        piece.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(piece);
    }
}

// ============================================================
// INIT
// ============================================================
async function init() {
  await loadStateFromFirestore();

  checkStreak();
  checkLivesRecharge();
  updateUI();

  window.addEventListener('resize', renderAllUnits);
}

document.addEventListener('DOMContentLoaded', init);




// === BRUJITA INTRO SECUENCIAL ===
window.addEventListener("load", () => {

    // 🚫 Si ya vio la bienvenida, NO mostrarla jamás
    if (localStorage.getItem("kaizen_bienvenida_mostrada") === "1") {
        return;
    }

    const panel = document.getElementById("brujita-panel");
    const texto = document.getElementById("brujita-texto");
    const audio = document.getElementById("gorrion-voice");
    const continuar = document.getElementById("brujita-continuar");
    const brujita = document.getElementById("brujita");

    setTimeout(() => {

        texto.textContent =
        "Bienvenido, aprendiz… Cada nivel te hará crecer. Observa, aprende… y deja que tus manos hablen, deja que tus manos aprendan lo que las palabras no pueden decir .";

        panel.classList.remove("oculto-panel");

        audio.currentTime = 0;
        audio.play().catch(()=>{});

    },800);

    audio.addEventListener("ended", () => {
      continuar.style.display = "block";
    });

    continuar.addEventListener("click", () => {

        // 🔥 Guardar que ya vio la bienvenida
        localStorage.setItem("kaizen_bienvenida_mostrada", "1");

        continuar.style.display = "none";
        brujita.style.transition = "all .8s ease";
        brujita.style.opacity = "0";

        setTimeout(()=>{

            const nodo = document.getElementById("u1-node-0");

            if(nodo){

                const rect = nodo.getBoundingClientRect();

                brujita.style.left = (rect.left -190) + "px";
                brujita.style.top = (rect.top +180) + "px";

                panel.style.left = (rect.left -97) + "px";
                panel.style.top = (rect.top +130) + "px";

                brujita.style.opacity = "1";
                panel.style.opacity = "1";
            }

        },700);

        setTimeout(()=>{

            texto.textContent =
            "Tu primera misión te espera… cualquier duda puedes volver al menu principal. Observa cada seña con atención. y que la magia de las señas ilumine tu camino. ¡MUCHA SUERTE!";

            audio.src = "gorrion1frase3.mp3";

            audio.currentTime = 0;
            audio.play().catch(()=>{});

        },2200);

    });

});
window.openLesson = openLesson;
window.continueAfterComplete = continueAfterComplete;
