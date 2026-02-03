// /admin/admin.js
// Gestion complète de l’interface admin : lecture + écriture Firebase.

// Références aux inputs
let maxPlayMinutesInput;
let parentalEnabledInput;
let cheatsEnabledInput;
let maintenanceModeInput;
let cheatsListAdmin;

// Objet local des cheats (sera rempli depuis Firebase)
let adminCheats = {};

// ------------------------------------------------------------
// 🔹 Initialisation
// ------------------------------------------------------------
window.addEventListener("load", () => {
  console.log("%c[ADMIN] Initialisation…", "color:#00f5ff");

  // Récupération des éléments HTML
  maxPlayMinutesInput = document.getElementById("maxPlayMinutes");
  parentalEnabledInput = document.getElementById("parentalEnabled");
  cheatsEnabledInput = document.getElementById("cheatsEnabled");
  maintenanceModeInput = document.getElementById("maintenanceMode");
  cheatsListAdmin = document.getElementById("cheatsListAdmin");

  // Charger les paramètres depuis Firebase
  loadSettingsFromFirebase();
  loadCheatsFromFirebase();

  // Attacher les listeners
  attachAdminListeners();
});

// ------------------------------------------------------------
// 🔹 Lecture Firebase (une seule fois)
// ------------------------------------------------------------
function loadSettingsFromFirebase() {
  if (!window.db) {
    console.warn("[ADMIN] Firebase non initialisé.");
    return;
  }

  db.ref("settings").once("value").then((snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    if (typeof data.maxPlayMinutes !== "undefined") {
      maxPlayMinutesInput.value = data.maxPlayMinutes;
    }
    if (typeof data.parentalEnabled !== "undefined") {
      parentalEnabledInput.checked = data.parentalEnabled;
    }
    if (typeof data.cheatsEnabled !== "undefined") {
      cheatsEnabledInput.checked = data.cheatsEnabled;
    }
    if (typeof data.maintenanceMode !== "undefined") {
      maintenanceModeInput.checked = data.maintenanceMode;
    }

    console.log("%c[ADMIN] Settings chargés", "color:#0f0");
  });
}

function loadCheatsFromFirebase() {
  db.ref("cheats").once("value").then((snapshot) => {
    const data = snapshot.val();
    if (!data) {
      cheatsListAdmin.innerHTML = "<p>Aucun cheat configuré.</p>";
      return;
    }

    adminCheats = data;
    renderCheatsAdminUI();
    console.log("%c[ADMIN] Cheats chargés", "color:#0f0");
  });
}

// ------------------------------------------------------------
// 🔹 Affichage dynamique des cheats dans l’admin
// ------------------------------------------------------------
function renderCheatsAdminUI() {
  cheatsListAdmin.innerHTML = "";

  Object.entries(adminCheats).forEach(([key, value]) => {
    const wrapper = document.createElement("label");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "space-between";
    wrapper.style.margin = "6px 0";

    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase());

    const input =
      typeof value === "boolean"
        ? createBooleanInput(key, value)
        : createNumberInput(key, value);

    wrapper.innerHTML = `<span>${label}</span>`;
    wrapper.appendChild(input);

    cheatsListAdmin.appendChild(wrapper);
  });
}

function createBooleanInput(key, value) {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = value;

  input.addEventListener("change", () => {
    adminCheats[key] = input.checked;
    saveCheatsToFirebase();
  });

  return input;
}

function createNumberInput(key, value) {
  const input = document.createElement("input");
  input.type = "number";
  input.value = value;
  input.step = "0.1";

  input.addEventListener("change", () => {
    adminCheats[key] = parseFloat(input.value);
    saveCheatsToFirebase();
  });

  return input;
}

// ------------------------------------------------------------
// 🔹 Listeners des paramètres admin
// ------------------------------------------------------------
function attachAdminListeners() {
  maxPlayMinutesInput.addEventListener("change", () => {
    saveSettingsToFirebase();
  });

  parentalEnabledInput.addEventListener("change", () => {
    saveSettingsToFirebase();
  });

  cheatsEnabledInput.addEventListener("change", () => {
    saveSettingsToFirebase();
  });

  maintenanceModeInput.addEventListener("change", () => {
    saveSettingsToFirebase();
  });
}

// ------------------------------------------------------------
// 🔹 Sauvegarde Firebase
// ------------------------------------------------------------
function saveSettingsToFirebase() {
  const settings = {
    maxPlayMinutes: parseInt(maxPlayMinutesInput.value) || 20,
    parentalEnabled: parentalEnabledInput.checked,
    cheatsEnabled: cheatsEnabledInput.checked,
    maintenanceMode: maintenanceModeInput.checked
  };

  db.ref("settings").set(settings)
    .then(() => console.log("%c[ADMIN] Settings sauvegardés", "color:#00f5ff"))
    .catch((err) => console.error("[ADMIN] Erreur settings :", err));
}

function saveCheatsToFirebase() {
  db.ref("cheats").set(adminCheats)
    .then(() => console.log("%c[ADMIN] Cheats sauvegardés", "color:#ff00ff"))
    .catch((err) => console.error("[ADMIN] Erreur cheats :", err));
}
