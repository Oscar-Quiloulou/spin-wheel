// admin.js
// Gestion des paramètres dans /settings et /cheats.

function saveSettingsToFirebase(settings) {
  if (!window.db) return;
  db.ref("settings").set(settings);
}

function saveCheatsToFirebase(cheats) {
  if (!window.db) return;
  db.ref("cheats").set(cheats);
}

window.addEventListener("load", () => {
  const maxPlayMinutesInput = document.getElementById("maxPlayMinutes");
  const parentalEnabledInput = document.getElementById("parentalEnabled");
  const cheatsEnabledInput = document.getElementById("cheatsEnabled");
  const maintenanceModeInput = document.getElementById("maintenanceMode");

  // TODO: lire les valeurs initiales depuis Firebase et remplir les inputs.

  // TODO: écouter les changements d’inputs et pousser dans Firebase.
});
