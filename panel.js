// ===============================
// CERRAR MODAL
// ===============================
function closeModal() {
    const modal = document.getElementById("promoModal");
    if (modal) modal.style.display = "none";
}

// ===============================
// MOSTRAR PANTALLAS INTERNAS
// ===============================
function showScreen(id) {
    const modal  = document.getElementById("promoModal");
    const plans  = document.getElementById("plansScreen");
    const info   = document.getElementById("infoScreen");

    // Ocultar todo
    if (modal)  modal.style.display  = "none";
    if (plans)  plans.style.display  = "none";
    if (info)   info.style.display   = "none";

    // Mostrar el target con el display correcto
    const target = document.getElementById(id);
    if (target) {
        // plansScreen necesita flex para que funcione el layout centrado
        target.style.display = (id === "plansScreen") ? "flex" : "block";
    }
}

// ===============================
// BOTÓN: ¡COMENZAR AHORA!
// ===============================
function acceptOffer() {
    showScreen("plansScreen");
}

// ===============================
// BOTÓN: MÁS INFORMACIÓN
// ===============================
function learnMore() {
    showScreen("infoScreen");
}

// ===============================
// VOLVER AL MODAL KAIZEN
// ===============================
function goBackToModal() {
    const modal = document.getElementById("promoModal");
    const plans = document.getElementById("plansScreen");
    const info  = document.getElementById("infoScreen");

    if (plans) plans.style.display = "none";
    if (info)  info.style.display  = "none";
    if (modal) modal.style.display = "flex";
}

// ===============================
// CONTADOR REGRESIVO
// ===============================
let hours   = 3;
let minutes = 18;
let seconds = 24;

function updateCountdown() {
    if (seconds > 0) {
        seconds--;
    } else {
        seconds = 59;
        if (minutes > 0) {
            minutes--;
        } else {
            minutes = 59;
            if (hours > 0) hours--;
        }
    }

    document.getElementById("hours").textContent   = hours.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
}

setInterval(updateCountdown, 1000);

// ===============================
// SKIP → IR A INICIO
// ===============================
function skipExperience() {
    window.location.href = "info.html";
}