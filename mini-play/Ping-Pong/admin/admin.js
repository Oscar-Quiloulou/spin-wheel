// ===============================
//  ADMIN PANEL - Ping Pong Neo Arcade
// ===============================

// --- Firebase init ---
const db = firebase.database();

// --- Cheats stockés localement ---
let adminCheats = {};

// --- Traductions FR ---
const cheatLabelsFR = {
  // Physique - Balle
  ballSpeedMultiplier: "Vitesse de la balle",
  ballSlowMotion: "Ralenti",
  ballReverse: "Inversion de direction",
  ballTeleport: "Téléportation de la balle",
  ballGhost: "Balle fantôme",
  ballCurve: "Effet courbé",
  ballHuge: "Balle géante",
  ballTiny: "Mini balle",
  ballRandomBounce: "Rebonds aléatoires",

  // Physique - Raquette
  paddleSizeMultiplier: "Taille de la raquette",
  paddleSpeedMultiplier: "Vitesse de la raquette",
  autoHit: "Auto-frappe",
  paddleTeleport: "Téléportation de la raquette",
  paddleInvertedControls: "Contrôles inversés",
  paddleSticky: "Raquette collante",
  paddleShield: "Bouclier",
  paddleDouble: "Double raquette",
  paddleInvisible: "Raquette invisible",

  // IA
  aiDisabled: "IA désactivée",
  aiSlow: "IA lente",
  aiDrunk: "IA ivre",
  aiPerfect: "IA parfaite",
  aiTeleport: "IA téléportée",

  // Score
  scorePerHitMultiplier: "Score par coup",
  scorePerSecond: "Score par seconde",
  scoreNoLimit: "Score illimité",
  scoreFreeze: "Score figé",
  scoreRandomBonus: "Bonus aléatoires",

  // Règles du jeu
  noGameOver: "Pas de Game Over",
  oneLifeMode: "Mode une vie",
  reverseGameOver: "Game Over inversé",
  wallBounceLeft: "Rebond mur gauche",
  gravityMode: "Gravité",
  antiGravity: "Anti-gravité",
  mirrorMode: "Mode miroir",
  darkMode: "Mode sombre",
  flashMode: "Flash lumineux",

  // WTF
  chaosMode: "Chaos total",
  randomControls: "Contrôles aléatoires",
  randomSpeed: "Vitesse aléatoire",
  randomPaddleSize: "Taille raquette aléatoire",
  randomBallSize: "Taille balle aléatoire",
  timeWarp: "Distorsion temporelle",
  invisibleBall: "Balle invisible"
};

// --- Catégories ---
const cheatCategories = {
  "Physique - Balle": [
    "ballSpeedMultiplier", "ballSlowMotion", "ballReverse", "ballTeleport",
    "ballGhost", "ballCurve", "ballHuge", "ballTiny", "ballRandomBounce"
  ],
  "Physique - Raquette": [
    "paddleSizeMultiplier", "paddleSpeedMultiplier", "autoHit", "paddleTeleport",
    "paddleInvertedControls", "paddleSticky", "paddleShield", "paddleDouble",
    "paddleInvisible"
  ],
  "IA": [
    "aiDisabled", "aiSlow", "aiDrunk", "aiPerfect", "aiTeleport"
  ],
  "Score": [
    "scorePerHitMultiplier", "scorePerSecond", "scoreNoLimit",
    "scoreFreeze", "scoreRandomBonus"
  ],
  "Règles du jeu": [
    "noGameOver", "oneLifeMode", "reverseGameOver", "wallBounceLeft",
    "gravityMode", "antiGravity", "mirrorMode", "darkMode", "flashMode"
  ],
  "WTF": [
    "chaosMode", "randomControls", "randomSpeed", "randomPaddleSize",
    "randomBallSize", "timeWarp", "invisibleBall"
  ]
};

// ===============================
//  Chargement des données Firebase
// ===============================
function loadAdminData() {
  db.ref("settings").once("value").then(snap => {
    const data = snap.val() || {};
    document.getElementById("parentalEnabled").checked = data.parentalEnabled || false;
    document.getElementById("maintenanceMode").checked = data.maintenanceMode || false;
    document.getElementById("cheatsEnabled").checked = data.cheatsEnabled || false;
    document.getElementById("maxPlayMinutes").value = data.maxPlayMinutes || 20;
  });

  db.ref("cheats").once("value").then(snap => {
    adminCheats = snap.val() || {};
    renderCheatsAdminUI();
  });
}

// ===============================
//  Sauvegarde Firebase
// ===============================
function saveSettingsToFirebase() {
  const maxPlayMinutesInput = document.getElementById("maxPlayMinutes");

  db.ref("settings").set({
    parentalEnabled: document.getElementById("parentalEnabled").checked,
    maintenanceMode: document.getElementById("maintenanceMode").checked,
    cheatsEnabled: document.getElementById("cheatsEnabled").checked,
    maxPlayMinutes: parseInt(maxPlayMinutesInput.value) || 20 // FIX NaN
  });
}

function saveCheatsToFirebase() {
  db.ref("cheats").set(adminCheats);
}

// ===============================
//  UI Cheats avec catégories
// ===============================
function renderCheatsAdminUI() {
  const container = document.getElementById("cheatsListAdmin");
  container.innerHTML = "";

  Object.entries(cheatCategories).forEach(([categoryName, keys]) => {
    const title = document.createElement("h3");
    title.textContent = categoryName;
    title.className = "cheat-category-title";
    container.appendChild(title);

    keys.forEach(key => {
      if (!(key in adminCheats)) return;

      const wrapper = document.createElement("div");
      wrapper.className = "cheat-item";

      const label = document.createElement("label");
      label.textContent = cheatLabelsFR[key] || key;

      let input;
      if (typeof adminCheats[key] === "boolean") {
        input = document.createElement("input");
        input.type = "checkbox";
        input.checked = adminCheats[key];
        input.addEventListener("change", () => {
          adminCheats[key] = input.checked;
          saveCheatsToFirebase();
        });
      } else {
        input = document.createElement("input");
        input.type = "number";
        input.value = adminCheats[key];
        input.addEventListener("input", () => {
          adminCheats[key] = parseFloat(input.value) || 0;
          saveCheatsToFirebase();
        });
      }

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      container.appendChild(wrapper);
    });
  });
}

// ===============================
//  Menu Cheats Avancé
// ===============================
window.addEventListener("load", () => {
  loadAdminData();

  const dialog = document.getElementById("cheatDialog");

  document.getElementById("btnCheatMenu").addEventListener("click", () => {
    dialog.classList.remove("hidden");
  });

  document.getElementById("btnCheatsClose").addEventListener("click", () => {
    dialog.classList.add("hidden");
  });

  // --- WTF ---
  document.getElementById("btnCheatsWTF").addEventListener("click", () => {
    cheatCategories["WTF"].forEach(key => adminCheats[key] = true);
    saveCheatsToFirebase();
    renderCheatsAdminUI();
    dialog.classList.add("hidden");
  });

  // --- IA ---
  document.getElementById("btnCheatsIA").addEventListener("click", () => {
    cheatCategories["IA"].forEach(key => adminCheats[key] = true);
    saveCheatsToFirebase();
    renderCheatsAdminUI();
    dialog.classList.add("hidden");
  });

  // --- Physique ---
  document.getElementById("btnCheatsPhysique").addEventListener("click", () => {
    [...cheatCategories["Physique - Balle"], ...cheatCategories["Physique - Raquette"]]
      .forEach(key => adminCheats[key] = true);
    saveCheatsToFirebase();
    renderCheatsAdminUI();
    dialog.classList.add("hidden");
  });

  // --- Chaos total ---
  document.getElementById("btnCheatsChaos").addEventListener("click", () => {
    const keys = Object.keys(adminCheats);
    const randomKeys = keys.sort(() => Math.random() - 0.5).slice(0, 20);
    keys.forEach(key => adminCheats[key] = randomKeys.includes(key));
    saveCheatsToFirebase();
    renderCheatsAdminUI();
    dialog.classList.add("hidden");
  });

  // --- Settings listeners ---
  document.getElementById("parentalEnabled").addEventListener("change", saveSettingsToFirebase);
  document.getElementById("maintenanceMode").addEventListener("change", saveSettingsToFirebase);
  document.getElementById("cheatsEnabled").addEventListener("change", saveSettingsToFirebase);
  document.getElementById("maxPlayMinutes").addEventListener("input", saveSettingsToFirebase);
});
