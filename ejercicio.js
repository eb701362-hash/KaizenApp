// XP y gemas recomendadas
const XP_REWARD = 20;
const GEMS_REWARD = 3;

// Cuando el usuario termina el nivel
document.getElementById("finishBtn").addEventListener("click", () => {

    // Guardar progreso
    localStorage.setItem("levelCompleted", true);
    localStorage.setItem("lastCompletedLevel", "1");
    localStorage.setItem("xpEarned", XP_REWARD);
    localStorage.setItem("gemsEarned", GEMS_REWARD);

    // Sumar XP total
    let totalXP = parseInt(localStorage.getItem("totalXP") || 0);
    totalXP += XP_REWARD;
    localStorage.setItem("totalXP", totalXP);

    // Sumar gemas totales
    let totalGems = parseInt(localStorage.getItem("totalGems") || 0);
    totalGems += GEMS_REWARD;
    localStorage.setItem("totalGems", totalGems);

    // Redirigir a niveles.html
    window.location.href = "niveles.html";
});
