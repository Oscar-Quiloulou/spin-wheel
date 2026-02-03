// game.js
// Gestion du canvas, de la balle, de la raquette, du score, du game over.

let canvas, ctx;
let gameRunning = false;

const state = {
  score: 0,
  ball: {
    x: 400,
    y: 225,
    vx: 4,
    vy: 3,
    radius: 8
  },
  paddle: {
    x: 40,
    y: 225 - 40,
    width: 12,
    height: 80,
    speed: 6,
    moveUp: false,
    moveDown: false
  },
  ai: {
    x: 800 - 40 - 12,
    y: 225 - 40,
    width: 12,
    height: 80,
    speed: 4
  }
};

window.addEventListener("load", () => {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  initControls(state);
  initParentalControl();
  initCheatsListener();
  initLeaderboardListener();

  resetGame();
  startGameLoop();

  document.getElementById("btnRestart").addEventListener("click", () => {
    hideGameOver();
    resetGame();
  });
});

function resetGame() {
  state.score = 0;
  updateScoreUI();
  state.ball.x = canvas.width / 2;
  state.ball.y = canvas.height / 2;
  state.ball.vx = 4;
  state.ball.vy = 3;
  gameRunning = true;
  setStatus("Playing");
}

function startGameLoop() {
  function loop() {
    if (gameRunning && !isParentalBlocked()) {
      update();
      draw();
    }
    requestAnimationFrame(loop);
  }
  loop();
}

function update() {
  applyCheatsBeforeUpdate(state);

  // Déplacement raquette joueur
  if (state.paddle.moveUp) state.paddle.y -= state.paddle.speed;
  if (state.paddle.moveDown) state.paddle.y += state.paddle.speed;
  clampPaddle(state.paddle);

  // Déplacement IA simple
  updateAI(state);

  // Déplacement balle
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  // Rebond haut/bas
  if (state.ball.y - state.ball.radius < 0 || state.ball.y + state.ball.radius > canvas.height) {
    state.ball.vy *= -1;
  }

  // Rebond mur droit (toujours rebond)
  if (state.ball.x + state.ball.radius > canvas.width) {
    state.ball.vx *= -1;
  }

  // Collision raquette joueur
  if (checkCollisionWithPaddle(state.ball, state.paddle)) {
    state.ball.vx = Math.abs(state.ball.vx); // repart vers la droite

    // 🔥 Correction : scorePerHitMultiplier appliqué + arrondi entier
    const mult = currentCheats.scorePerHitMultiplier || 1;
    state.score += Math.floor(mult);

    updateScoreUI();
    onBallHitPaddleCheats(state);
  }

  // Collision raquette IA
  if (checkCollisionWithPaddle(state.ball, state.ai)) {
    state.ball.vx = -Math.abs(state.ball.vx);
  }

  // Sortie à gauche = game over (sauf cheat)
  if (state.ball.x + state.ball.radius < 0) {
    if (!isNoGameOverCheatActive()) {
      onGameOver();
    } else {
      state.ball.x = canvas.width / 2;
      state.ball.y = canvas.height / 2;
      state.ball.vx = Math.abs(state.ball.vx);
    }
  }

  // 🔥 Correction : arrondi du scorePerSecond pour éviter les virgules
  if (currentCheats.cheatsEnabled && currentCheats.scorePerSecond > 0) {
    state.score += Math.floor(currentCheats.scorePerSecond / 60);
    updateScoreUI();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fond
  ctx.fillStyle = "#050510";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // File centrale
  ctx.strokeStyle = "rgba(0,245,255,0.4)";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Balle
  ctx.fillStyle = "#00f5ff";
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // Raquette joueur
  ctx.fillStyle = "#ff00ff";
  ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);

  // Raquette IA
  ctx.fillStyle = "#8888ff";
  ctx.fillRect(state.ai.x, state.ai.y, state.ai.width, state.ai.height);
}

function clampPaddle(paddle) {
  if (paddle.y < 0) paddle.y = 0;
  if (paddle.y + paddle.height > canvas.height) {
    paddle.y = canvas.height - paddle.height;
  }
}

function updateAI(state) {
  const targetY = state.ball.y - state.ai.height / 2;
  if (state.ai.y < targetY) state.ai.y += state.ai.speed;
  else if (state.ai.y > targetY) state.ai.y -= state.ai.speed;
  clampPaddle(state.ai);
}

function checkCollisionWithPaddle(ball, paddle) {
  return (
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.x + ball.radius > paddle.x &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  );
}

function onGameOver() {
  gameRunning = false;
  setStatus("Game Over");
  document.getElementById("finalScore").textContent = state.score;
  showGameOver();
  pushScoreToLeaderboard(state.score);
}

function updateScoreUI() {
  document.getElementById("score").textContent = state.score;
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

function showGameOver() {
  document.getElementById("gameOverOverlay").classList.remove("hidden");
}

function hideGameOver() {
  document.getElementById("gameOverOverlay").classList.add("hidden");
}
