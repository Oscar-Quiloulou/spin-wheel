// parental.js
// Gestion du temps de jeu max + overlay de blocage.

let parentalSettings = {
  maxPlayMinutes: 20,
  enabled: true
};

let playStartTime = null;
let parentalBlocked = false;

function initParentalControl() {
  playStartTime = Date.now();
  // TODO: écouter /settings dans Firebase pour récupérer maxPlayMinutes, etc.
}

function isParentalBlocked() {
  if (!parentalSettings.enabled) return false;
  if (parentalBlocked) return true;

  const elapsedMs = Date.now() - playStartTime;
  const elapsedMinutes = elapsedMs / 1000 / 60;

  if (elapsedMinutes >= parentalSettings.maxPlayMinutes) {
    parentalBlocked = true;
    showParentalOverlay();
  }
  return parentalBlocked;
}

function showParentalOverlay() {
  document.getElementById("parentalOverlay").classList.remove("hidden");
}
