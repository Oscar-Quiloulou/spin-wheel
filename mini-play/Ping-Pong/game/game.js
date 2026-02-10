// /game/game.js
// Version propre et compatible avec cheats.js + leaderboard
let gameRunning = true;

// ------------------------------------------------------------
// 🔹 Canvas & contexte
// ------------------------------------------------------------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ------------------------------------------------------------
// 🔹 État du jeu
// ------------------------------------------------------------
let state = {
  ball: {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 4,
    vy: 2,
    radius: 10
  },

  paddle: {
    x: 20,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    speed: 6,
    moveUp: false,
    moveDown: false
  },

  ai: {
    x: canvas.width - 30,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    speed: 4
  },

  score: 0
};

// ------------------------------------------------------------
// 🔹 Input joueur
// ------------------------------------------------------------
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") state.paddle.moveUp = true;
  if (e.key === "ArrowDown") state.paddle.moveDown = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") state.paddle.moveUp = false;
  if (e.key === "ArrowDown") state.paddle.moveDown = false;
});

// ------------------------------------------------------------
// 🔹 Clamp paddle
// ------------------------------------------------------------
function clampPaddle(p) {
  if (p.y < 0) p.y = 0;
  if (p.y + p.height > canvas.height) p.y = canvas.height - p.height;
}

// ------------------------------------------------------------
// 🔹 IA simple
// ------------------------------------------------------------
function updateAI(state) {
  if (state.ai.y + state.ai.height / 2 < state.ball.y) {
    state.ai.y += state.ai.speed;
  } else {
    state.ai.y -= state.ai.speed;
  }
  clampPaddle(state.ai);
}

// ------------------------------------------------------------
// 🔹 Collisions balle / murs / raquettes
// ------------------------------------------------------------
function handleCollisions(state) {
  const ball = state.ball;

  // Mur haut/bas
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.vy *= -1;
  }

  // Raquette joueur
  if (
    ball.x - ball.radius < state.paddle.x + state.paddle.width &&
    ball.y > state.paddle.y &&
    ball.y < state.paddle.y + state.paddle.height
  ) {
    ball.vx *= -1;
    state.score += currentCheats.scorePerHitMultiplier || 1;

    onBallHitPaddleCheats(state);
  }

  // Raquette IA
  if (
    ball.x + ball.radius > state.ai.x &&
    ball.y > state.ai.y &&
    ball.y < state.ai.y + state.ai.height
  ) {
    ball.vx *= -1;
  }

  // Game over (si pas de cheat)
  if (ball.x < 0 && !isNoGameOverCheatActive()) {
    endGame();
  }
}

// ------------------------------------------------------------
// 🔹 Reset balle
// ------------------------------------------------------------
function resetBall() {
  state.ball.x = canvas.width / 2;
  state.ball.y = canvas.height / 2;
  state.ball.vx = 4;
  state.ball.vy = 2;
}

// ------------------------------------------------------------
// 🔹 GAME OVER
// ------------------------------------------------------------
function endGame() {
  // Affiche l’overlay Game Over
  document.getElementById("finalScore").textContent = Math.floor(state.score);
  document.getElementById("gameOverOverlay").classList.remove("hidden");

  // Enregistre le score dans Firebase
  saveScore("pong", Math.floor(state.score));

  // Met à jour le leaderboard
  displayScores("pong", "leaderboardList");
}

// Bouton Rejouer
document.getElementById("btnRestart").addEventListener("click", () => {
  state.score = 0;
  resetBall();
  document.getElementById("gameOverOverlay").classList.add("hidden");
});

// ------------------------------------------------------------
// 🔹 Update (boucle logique)
// ------------------------------------------------------------
function update() {

  // 🔥 Application des cheats AVANT la physique
  applyCheatsBeforeUpdate(state);

  // Déplacement raquette joueur
  if (state.paddle.moveUp) state.paddle.y -= state.paddle.speed;
  if (state.paddle.moveDown) state.paddle.y += state.paddle.speed;
  clampPaddle(state.paddle);

  // Déplacement IA
  updateAI(state);

  // Déplacement balle
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  // Collisions
  handleCollisions(state);

  // Score UI
  document.getElementById("score").textContent = Math.floor(state.score);
}

// ------------------------------------------------------------
// 🔹 Draw
// ------------------------------------------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Balle
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  // Raquette joueur
  ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);

  // Raquette IA
  ctx.fillRect(state.ai.x, state.ai.y, state.ai.width, state.ai.height);
}

// ------------------------------------------------------------
// 🔹 Boucle de jeu
// ------------------------------------------------------------
function startGameLoop() {
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }
  loop();
}

// ------------------------------------------------------------
// 🔹 Lancement
// ------------------------------------------------------------
initCheatsListener();

// 🔥🔥🔥 Leaderboard affiché dès le chargement
displayScores("scores/JEU4_scores", "leaderboardList");

startGameLoop();
