// cheats.js
// Gestion des cheats côté jeu (lecture depuis Firebase + application).

let currentCheats = {
  noGameOver: false,
  ballSpeedMultiplier: 1,
  paddleSizeMultiplier: 1
  // Tu pourras en rajouter autant que tu veux ici
};

function initCheatsListener() {
  // TODO: lire les cheats depuis Firebase (settings / cheats)
  // et mettre à jour currentCheats.
  // Pour l’instant, on laisse vide.
}

function applyCheatsBeforeUpdate(state) {
  // Exemple : appliquer les multiplicateurs
  state.ball.vx *= currentCheats.ballSpeedMultiplier;
  state.ball.vy *= currentCheats.ballSpeedMultiplier;
  state.paddle.height = 80 * currentCheats.paddleSizeMultiplier;
}

function onBallHitPaddleCheats(state) {
  // Exemple : cheat qui augmente la vitesse à chaque hit, etc.
  // À définir plus tard.
}

function isNoGameOverCheatActive() {
  return currentCheats.noGameOver === true;
}
