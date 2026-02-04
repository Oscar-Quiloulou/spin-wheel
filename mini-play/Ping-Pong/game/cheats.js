// /game/cheats.js
// Version optimisée : Firebase au chargement + refresh périodique + effets cheat complets.

// Cheats locaux activés par le joueur (non sauvegardés)
let localCheats = {};

// Cheats par défaut
let currentCheats = {
  cheatsEnabled: false,

  // Ball physics
  ballSpeedMultiplier: 1,
  ballSlowMotion: false,
  ballReverse: false,
  ballTeleport: false,
  ballGhost: false,
  ballCurve: false,
  ballHuge: false,
  ballTiny: false,
  ballRandomBounce: false,

  // Paddle
  paddleSizeMultiplier: 1,
  paddleSpeedMultiplier: 1,
  autoHit: false,
  paddleTeleport: false,
  paddleInvertedControls: false,
  paddleSticky: false,
  paddleShield: false,
  paddleDouble: false,
  paddleInvisible: false,

  // AI
  aiDisabled: false,
  aiSlow: false,
  aiDrunk: false,
  aiPerfect: false,
  aiTeleport: false,

  // Score
  scorePerHitMultiplier: 1,
  scorePerSecond: 0,
  scoreNoLimit: false,
  scoreFreeze: false,
  scoreRandomBonus: false,

  // Game rules
  noGameOver: false,
  oneLifeMode: false,
  reverseGameOver: false,
  wallBounceLeft: false,
  gravityMode: false,
  antiGravity: false,
  mirrorMode: false,
  darkMode: false,
  flashMode: false,

  // WTF
  chaosMode: false,
  randomControls: false,
  randomSpeed: false,
  randomPaddleSize: false,
  randomBallSize: false,
  timeWarp: false,
  invisibleBall: false
};

// Refresh toutes les 30 minutes
const CHEATS_REFRESH_INTERVAL = 30 * 60 * 1000;

// UI
const cheatsListUI = document.getElementById("cheatsList");

// ------------------------------------------------------------
// 🔹 Initialisation
// ------------------------------------------------------------
function initCheatsListener() {
  loadCheatsFromLocalStorage();
  fetchCheatsFromFirebase();
  setInterval(fetchCheatsFromFirebase, CHEATS_REFRESH_INTERVAL);
}

// ------------------------------------------------------------
// 🔹 Boutons locaux ON/OFF (uniquement si admin a activé le cheat)
// ------------------------------------------------------------
function generateLocalCheatButtons() {
  const container = document.getElementById("localCheatsButtons");
  if (!container) return;

  container.innerHTML = "";

  Object.entries(currentCheats).forEach(([key, value]) => {
    if (value === true || (typeof value === "number" && value !== 1)) {

      localCheats[key] = false;

      const btn = document.createElement("button");
      btn.textContent = `${key} : OFF`;

      btn.addEventListener("click", () => {
        localCheats[key] = !localCheats[key];
        btn.textContent = `${key} : ${localCheats[key] ? "ON" : "OFF"}`;
      });

      container.appendChild(btn);
    }
  });
}


// ------------------------------------------------------------
// 🔹 Firebase (lecture unique)
// ------------------------------------------------------------
function fetchCheatsFromFirebase() {
  if (!window.db) return;

  db.ref("settings").once("value").then((snap) => {
    const data = snap.val();
    if (data && typeof data.cheatsEnabled !== "undefined") {
      currentCheats.cheatsEnabled = data.cheatsEnabled;
    }
    saveCheatsToLocalStorage();
    updateCheatsUI();
    generateLocalCheatButtons(); // AJOUT
  });

  db.ref("cheats").once("value").then((snap) => {
    const data = snap.val();
    if (data) Object.assign(currentCheats, data);
    saveCheatsToLocalStorage();
    updateCheatsUI();
  });
}

// ------------------------------------------------------------
// 🔹 LocalStorage
// ------------------------------------------------------------
function loadCheatsFromLocalStorage() {
  const saved = localStorage.getItem("cheats");
  if (saved) Object.assign(currentCheats, JSON.parse(saved));
}

function saveCheatsToLocalStorage() {
  localStorage.setItem("cheats", JSON.stringify(currentCheats));
}

// ------------------------------------------------------------
// 🔹 Application des cheats
// ------------------------------------------------------------
function applyCheatsBeforeUpdate(state) {
  if (!currentCheats.cheatsEnabled) return;

  // Appliquer uniquement les cheats activés localement
  Object.entries(localCheats).forEach(([key, isOn]) => {
    if (!isOn) {
      if (typeof currentCheats[key] === "boolean") currentCheats[key] = false;
      if (typeof currentCheats[key] === "number") currentCheats[key] = 1;
    }
  });

  // 🔥 Ici tu remets TOUT ton bloc BALL / PADDLE / AI / SCORE / WTF
  // (celui que tu m’as envoyé)


  // ---------------- BALL ----------------
  if (currentCheats.ballSpeedMultiplier !== 1) {
    state.ball.vx *= currentCheats.ballSpeedMultiplier;
    state.ball.vy *= currentCheats.ballSpeedMultiplier;
  }

  if (currentCheats.ballSlowMotion) {
    state.ball.vx *= 0.95;
    state.ball.vy *= 0.95;
  }

  if (currentCheats.ballReverse && Math.random() < 0.01) {
    state.ball.vx *= -1;
    state.ball.vy *= -1;
  }

  if (currentCheats.ballTeleport && Math.random() < 0.01) {
    state.ball.x = Math.random() * canvas.width;
    state.ball.y = Math.random() * canvas.height;
  }

  if (currentCheats.ballHuge) state.ball.radius = 30;
  if (currentCheats.ballTiny) state.ball.radius = 3;

  if (currentCheats.ballRandomBounce) {
    state.ball.vx += (Math.random() - 0.5) * 0.5;
    state.ball.vy += (Math.random() - 0.5) * 0.5;
  }

  if (currentCheats.ballCurve) {
    state.ball.vy += Math.sin(Date.now() / 100) * 0.3;
  }

  // ---------------- PADDLE ----------------
  state.paddle.height = 80 * currentCheats.paddleSizeMultiplier;
  state.paddle.speed = 6 * currentCheats.paddleSpeedMultiplier;

  if (currentCheats.autoHit) {
    state.paddle.y = state.ball.y - state.paddle.height / 2;
  }

  if (currentCheats.paddleTeleport && Math.random() < 0.02) {
    state.paddle.y = state.ball.y - state.paddle.height / 2;
  }

  if (currentCheats.paddleInvertedControls) {
    const tmp = state.paddle.moveUp;
    state.paddle.moveUp = state.paddle.moveDown;
    state.paddle.moveDown = tmp;
  }

  if (currentCheats.randomPaddleSize) {
    state.paddle.height = 40 + Math.random() * 120;
  }

  // ---------------- AI ----------------
  if (currentCheats.aiDisabled) state.ai.speed = 0;
  if (currentCheats.aiSlow) state.ai.speed = 1;
  if (currentCheats.aiPerfect) state.ai.y = state.ball.y - state.ai.height / 2;
  if (currentCheats.aiDrunk) state.ai.y += (Math.random() - 0.5) * 20;
  if (currentCheats.aiTeleport && Math.random() < 0.01) {
    state.ai.y = Math.random() * canvas.height;
  }

  // ---------------- SCORE ----------------
  if (currentCheats.scoreFreeze) state.score = state.score;
  if (currentCheats.scorePerSecond > 0) state.score += Math.floor(currentCheats.scorePerSecond / 60);
  if (currentCheats.scoreRandomBonus && Math.random() < 0.01) state.score += 10;

  // ---------------- GAME RULES ----------------
  if (currentCheats.gravityMode) state.ball.vy += 0.2;
  if (currentCheats.antiGravity) state.ball.vy -= 0.2;

  if (currentCheats.mirrorMode) {
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
  }

  if (currentCheats.darkMode) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (currentCheats.flashMode && Math.random() < 0.05) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ---------------- WTF ----------------
  if (currentCheats.randomSpeed) {
    state.ball.vx *= 0.9 + Math.random() * 0.2;
    state.ball.vy *= 0.9 + Math.random() * 0.2;
  }

  if (currentCheats.randomBallSize) {
    state.ball.radius = 5 + Math.random() * 20;
  }

  if (currentCheats.timeWarp) {
    state.ball.vx *= 1.02;
    state.ball.vy *= 1.02;
  }

  if (currentCheats.invisibleBall) {
    ctx.globalAlpha = 0;
  }

  if (currentCheats.chaosMode) {
    state.ball.vx += (Math.random() - 0.5) * 2;
    state.ball.vy += (Math.random() - 0.5) * 2;
  }
}

// ------------------------------------------------------------
// 🔹 Game Over override
// ------------------------------------------------------------
function isNoGameOverCheatActive() {
  return currentCheats.cheatsEnabled && currentCheats.noGameOver;
}

// ------------------------------------------------------------
// 🔹 UI
// ------------------------------------------------------------
function updateCheatsUI() {
  if (!cheatsListUI) return;
  cheatsListUI.innerHTML = "";

  Object.entries(currentCheats).forEach(([key, value]) => {
    const li = document.createElement("li");
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
    li.textContent = `${label} : ${value}`;
    cheatsListUI.appendChild(li);
  });
}
function onBallHitPaddleCheats(state) {
  if (!currentCheats.cheatsEnabled) return;

  // Exemple : accélération progressive
  if (currentCheats.ballSpeedMultiplier > 1) {
    state.ball.vx *= currentCheats.ballSpeedMultiplier;
    state.ball.vy *= currentCheats.ballSpeedMultiplier;
  }

  // Exemple : sticky paddle
  if (currentCheats.paddleSticky) {
    state.ball.vx = 0;
    state.ball.vy = 0;
    setTimeout(() => {
      state.ball.vx = 4;
      state.ball.vy = 2;
    }, 500);
  }
  // ------------------------------------------------------------
// 🔹 Boutons locaux ON/OFF (uniquement si admin a activé le cheat)
// ------------------------------------------------------------
function generateLocalCheatButtons() {
  const container = document.getElementById("localCheatsButtons");
  if (!container) return;

  container.innerHTML = "";

  Object.entries(currentCheats).forEach(([key, value]) => {
    // On crée un bouton uniquement si l’admin a activé ce cheat
    if (value === true || (typeof value === "number" && value !== 1)) {

      // Valeur locale par défaut
      localCheats[key] = false;

      const btn = document.createElement("button");
      btn.textContent = `${key} : OFF`;

      btn.addEventListener("click", () => {
        localCheats[key] = !localCheats[key];
        btn.textContent = `${key} : ${localCheats[key] ? "ON" : "OFF"}`;
      });

      container.appendChild(btn);
    }
  });
}
}