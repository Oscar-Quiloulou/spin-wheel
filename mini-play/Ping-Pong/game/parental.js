// /game/parental.js
// Version optimisée : lecture Firebase au chargement + refresh toutes les 10 minutes.

// Paramètres par défaut
let parentalSettings = {
  enabled: true,          // Active/désactive le contrôle parental
  maxPlayMinutes: 20,     // Temps max avant blocage
  maintenanceMode: false  // Bloque totalement le jeu
};

// Intervalle de rafraîchissement (10 minutes)
const PARENTAL_REFRESH_INTERVAL = 10 * 60 * 1000;

let playStartTime = null;
let parentalBlocked = false;

// Overlay HTML
const parentalOverlay = document.getElementById("parentalOverlay");

// ------------------------------------------------------------
// 🔹 Initialisation
// ------------------------------------------------------------
function initParentalControl() {
  console.log("%c[PARENTAL] Initialisation…", "color:#ff3366");

  // 1. Charger depuis localStorage si dispo
  loadParentalFromLocalStorage();

  // 2. Charger depuis Firebase (une seule fois)
  fetchParentalFromFirebase();

  // 3. Rafraîchir toutes les 10 minutes
  setInterval(fetchParentalFromFirebase, PARENTAL_REFRESH_INTERVAL);

  // 4. Démarrer le timer de jeu
  playStartTime = Date.now();
}

// ------------------------------------------------------------
// 🔹 Lecture Firebase (une seule fois)
// ------------------------------------------------------------
function fetchParentalFromFirebase() {
  if (!window.db) {
    console.warn("[PARENTAL] Firebase non initialisé.");
    return;
  }

  console.log("%c[PARENTAL] Lecture Firebase…", "color:#00f5ff");

  db.ref("settings").once("value").then((snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    if (typeof data.maxPlayMinutes !== "undefined") {
      parentalSettings.maxPlayMinutes = data.maxPlayMinutes;
    }
    if (typeof data.parentalEnabled !== "undefined") {
      parentalSettings.enabled = data.parentalEnabled;
    }
    if (typeof data.maintenanceMode !== "undefined") {
      parentalSettings.maintenanceMode = data.maintenanceMode;
    }

    saveParentalToLocalStorage();
  });
}

// ------------------------------------------------------------
// 🔹 LocalStorage
// ------------------------------------------------------------
function loadParentalFromLocalStorage() {
  const saved = localStorage.getItem("parentalSettings");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(parentalSettings, parsed);
      console.log("%c[PARENTAL] Chargé depuis localStorage", "color:#0f0");
    } catch (e) {
      console.warn("[PARENTAL] Erreur parsing localStorage");
    }
  }
}

function saveParentalToLocalStorage() {
  localStorage.setItem("parentalSettings", JSON.stringify(parentalSettings));
}

// ------------------------------------------------------------
// 🔹 Vérification du blocage
// ------------------------------------------------------------
function isParentalBlocked() {
  // Mode maintenance → blocage total
  if (parentalSettings.maintenanceMode === true) {
    showParentalOverlay("Le jeu est en maintenance.");
    return true;
  }

  // Contrôle parental désactivé
  if (!parentalSettings.enabled) return false;

  // Déjà bloqué
  if (parentalBlocked) return true;

  // Calcul du temps écoulé
  const elapsedMs = Date.now() - playStartTime;
  const elapsedMinutes = elapsedMs / 1000 / 60;

  if (elapsedMinutes >= parentalSettings.maxPlayMinutes) {
    parentalBlocked = true;
    showParentalOverlay("Temps de jeu maximum atteint.");
    return true;
  }

  return false;
}

// ------------------------------------------------------------
// 🔹 Overlay
// ------------------------------------------------------------
function showParentalOverlay(message) {
  if (!parentalOverlay) return;

  parentalOverlay.querySelector("p").textContent = message;
  parentalOverlay.classList.remove("hidden");
}
