// ==========================
// CONFIGURACIÓN DEL NIVEL
// ==========================

const XP_REWARD = 20;
const GEMS_REWARD = 3;

// ==========================
// EJERCICIOS DEL NIVEL
// ==========================

const exercises = [
  {
    image: "letraa.jpeg",
    question: "¿Qué letra representa esta seña?",
    options: [
      "Letra A Índice, medio, anular meñique cerrado pulgar extendendido",
      "Letra B Índice, medio, anular, meñique extendido, pulgar cerrado",
      "Letra C todos los dedos formando una curva",
      "Letra D "
    ],
    correct: "1"
  },
  {
    image: "letrab.jpeg",
    question: "Selecciona la opción correcta.",
    options: ["Letra X", "Letra B", "Letra T", "Letra F"],
    correct: "2"
  },
  {
    image: "letrac.jpeg",
    question: "¿Qué letra es esta?",
    options: ["Letra P", "Letra C", "Letra Y", "Letra H"],
    correct: "2"
  },
  {
    image: "letrad.jpeg",
    question: "Último ejercicio.",
    options: ["Letra G", "Letra J", "Letra D", "Letra O"],
    correct: "3"
  }
];

// ==========================
// CONTROL DE AUDIO
// ==========================

let voice2Played = false;
let voice3Played = false;
let voice4Played = false;

// ==========================
// DIÁLOGOS
// ==========================

const dialogs = [
  {
    text: "Bienvenido, aprendiz... Este es tu primer paso en el pueblo de las señas. 🌙",
    button: "Siguiente"
  },
  {
    text: "Mi nombre es Kaia soy la guardiana de este pueblo mágico y seré tu guía en este nivel",
    button: "Siguiente"
  },
  {
    text: "Observa la seña con atención, y elige la opción correcta  cada gesto tiene su propia magia, ",
    button: "Siguiente"
  },
  {
    text: "Hoy aprenderás tu primera seña. Cuando  estés listo comenzaremos con el ejercicio..",
    button: "Empezar ejercicio"
  }
];

// ==========================
// VARIABLES
// ==========================

let currentDialogIndex = 0;
let currentExercise = 0;
let vidas = 3;
let selectedOption = null;
let waitingForNextExercise = false;

// ==========================
// ELEMENTOS DOM
// ==========================

const dialogTextEl = document.getElementById("dialogText");
const dialogNextBtn = document.getElementById("dialogNextBtn");
const witchPanel = document.getElementById("witchPanel");
const exerciseCard = document.getElementById("exerciseCard");

// ==========================
// AUDIOS
// ==========================

const allVoices = [
  "kaia-voice-1",
  "kaia-voice-2",
  "kaia-voice-3",
  "kaia-voice-4",
  "kaia-voice-5",
  "kaia-voice-6",
  "kaia-voice-7"
];

function stopAllVoices() {
  allVoices.forEach(id => {
    const audio = document.getElementById(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}

function playVoice(audioId) {
  stopAllVoices();
  const audio = document.getElementById(audioId);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(err => console.log(err));
  }
}

// ==========================
// RENDER DIÁLOGO
// ==========================

function renderDialog() {
  const dialog = dialogs[currentDialogIndex];
  dialogTextEl.textContent = dialog.text;

  dialogNextBtn.innerHTML = `
    <span>▶</span>
    ${dialog.button}
  `;
}

// ==========================
// AUDIO AUTOMÁTICO AL INICIAR NIVEL
// ==========================

window.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("kaia-voice");

  if (audio) {
    // Esperamos a que la bruja aparezca visualmente
    setTimeout(() => {
      audio.muted = false;     // quitar mute
      audio.currentTime = 0;   // reiniciar
      audio.play().catch(() => {});
    }, 1200); // ajusta este tiempo según tu animación
  }
});




// ==========================
// CARGAR EJERCICIO
// ==========================

function loadExercise() {
  const exercise = exercises[currentExercise];

  document.getElementById("exerciseImg").src = exercise.image;
  document.getElementById("questionText").textContent = exercise.question;

  document.getElementById("option1").textContent = exercise.options[0];
  document.getElementById("option2").textContent = exercise.options[1];
  document.getElementById("option3").textContent = exercise.options[2];
  document.getElementById("option4").textContent = exercise.options[3];

  updateProgress();
}

// ==========================
// PROGRESO
// ==========================

function updateProgress() {
  const percent = ((currentExercise + 1) / exercises.length) * 100;

  document.getElementById("progressBar").style.width = `${percent}%`;
  document.getElementById("progressText").textContent =
    `Ejercicio ${currentExercise + 1} de ${exercises.length}`;
}

// ==========================
// CLICK EN SIGUIENTE
// ==========================

dialogNextBtn.addEventListener("click", () => {
  stopAllVoices();

  if (waitingForNextExercise) {
    waitingForNextExercise = false;

    const dialogBox = document.getElementById("dialogBox");
    dialogBox.style.display = "none";

    currentExercise++;

    if (currentExercise < exercises.length) {
      loadExercise();
      witchPanel.classList.add("exercise-mode");
    } else {
      alert("🌙 Has completado todos los ejercicios.");

      witchPanel.classList.remove("exercise-mode");

      const dialogBox = document.getElementById("dialogBox");
      dialogBox.style.display = "block";
      dialogBox.style.opacity = "1";
      dialogBox.style.transform = "translateY(0)";

      dialogTextEl.textContent =
        "¡Felicidades aprendíz! haz completado el nivel 2 con honor, continúa tu camino por este pueblo, recuerda en cada seña hubo un guerrero que dio su vida por aprender que la fuerza, honor y coraje guíen tu camino ¡NOS VEMOS PRONTO!";

      dialogNextBtn.style.display = "none";

      setTimeout(() => {
        playVoice("kaia-voice-7");
      }, 1200);

      // Restaurar botón para no romper el nivel
      setTimeout(() => {
        dialogNextBtn.style.display = "flex";
      }, 10);

      return;
    }

    return;
  }

  if (dialogs[currentDialogIndex].button === "Empezar ejercicio") {
    startExercise();
    return;
  }

  if (currentDialogIndex < dialogs.length - 1) {
    currentDialogIndex++;
    renderDialog();

    if (currentDialogIndex === 1 && !voice2Played) {
      voice2Played = true;
      setTimeout(() => playVoice("kaia-voice-2"), 250);
    }

    if (currentDialogIndex === 2 && !voice3Played) {
      voice3Played = true;
      setTimeout(() => playVoice("kaia-voice-3"), 250);
    }

    if (currentDialogIndex === 3 && !voice4Played) {
      voice4Played = true;
      setTimeout(() => playVoice("kaia-voice-4"), 250);
    }
  }
});

// ==========================
// INICIAR EJERCICIO
// ==========================

function startExercise() {
  loadExercise();

  const dialogBox = document.getElementById("dialogBox");
  dialogBox.style.opacity = "0";
  dialogBox.style.transform = "translateY(10px)";
  dialogBox.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";

  setTimeout(() => {
    dialogBox.style.display = "none";
  }, 400);

  exerciseCard.classList.add("visible");
  witchPanel.classList.add("exercise-mode");
}

// ==========================
// LÓGICA DEL EJERCICIO
// ==========================

const optionButtons = document.querySelectorAll(".option-btn");

optionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const option = btn.dataset.option;

    if (option === exercises[currentExercise].correct) {

      optionButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      selectedOption = option;

      witchPanel.classList.remove("exercise-mode");

      const dialogBox = document.getElementById("dialogBox");
      dialogBox.style.display = "block";
      dialogBox.style.opacity = "1";
      dialogBox.style.transform = "translateY(0)";

      dialogTextEl.textContent =
        "¡Excelente elección! 🌙✨ mis maestros te han dado de su sabiduría sigue así";

      dialogNextBtn.innerHTML = `
        <span>▶</span>
        Continuar al siguiente ejercicio
      `;

      waitingForNextExercise = true;

      setTimeout(() => {
        playVoice("kaia-voice-6");
      }, 1350);

      return;
    }

    // INCORRECTA
    vidas--;
    selectedOption = null;

    const dialogBox = document.getElementById("dialogBox");
    dialogBox.style.display = "block";

    requestAnimationFrame(() => {
      dialogBox.style.opacity = "1";
      dialogBox.style.transform = "translateY(0)";
      setTimeout(() => playVoice("kaia-voice-5"), 1500);
    });

    dialogTextEl.textContent =
      "Acabas de perder una vida, inténtalo nuevamente, que la magia de las señas esté a tu favor.";

    witchPanel.classList.remove("exercise-mode");

    btn.style.borderColor = "#ef4444";
    btn.style.boxShadow = "0 0 15px rgba(239,68,68,0.8)";

    setTimeout(() => {
      btn.style.borderColor = "";
      btn.style.boxShadow = "";
    }, 1500);

    if (vidas <= 0) {
      setTimeout(() => {
        alert("Te quedaste sin vidas. Reiniciando nivel…");
        location.reload();
      }, 1500);
    }
  });
});

// ==========================
// TERMINAR NIVEL
// ==========================

document.getElementById("finishBtn").addEventListener("click", () => {

  if (currentExercise < exercises.length - 1) {
    alert("Completa todos los ejercicios primero.");
    return;
  }

  const params = new URLSearchParams(window.location.search);

  const unit = params.get("unit");
  const lesson = parseInt(params.get("level"), 10) - 1;

  let currentLevel = 1;

  if (window.location.pathname.includes("nivel2")) currentLevel = 2;
  if (window.location.pathname.includes("nivel3")) currentLevel = 3;
  if (window.location.pathname.includes("nivel4")) currentLevel = 4;

  localStorage.setItem(
    `lesson_${unit}_${lesson}`,
    currentLevel.toString()
  );

  localStorage.setItem("levelCompleted", "true");
  localStorage.setItem("xpEarned", XP_REWARD.toString());
  localStorage.setItem("gemsEarned", GEMS_REWARD.toString());

  let totalXP = parseInt(localStorage.getItem("totalXP") || "0", 10);
  totalXP += XP_REWARD;
  localStorage.setItem("totalXP", totalXP.toString());

  let totalGems = parseInt(localStorage.getItem("totalGems") || "0", 10);
  totalGems += GEMS_REWARD;
  localStorage.setItem("totalGems", totalGems.toString());

  alert(`🌙 Nivel ${currentLevel} completado correctamente.`);

  window.location.href =
    `niveles.html?unit=${unit}&lesson=${lesson}&done=1`;
});

// ==========================
// MÚSICA DE FONDO
// ==========================

const music = document.getElementById("bg-music");

document.addEventListener(
  "click",
  () => {
    if (music) {
      music.play().catch(err => console.log("Error música:", err));
    }
  },
  { once: true }
);
