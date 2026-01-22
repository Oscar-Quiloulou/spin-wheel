/* ============================================================
   🎮 CHEATS PING PONG — Version propre & optimisée
   Tous les cheats modifient les variables globales du jeu.
============================================================ */

/* ============================
   🟠 BALLE
============================ */

function cheatCenter() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
}

function cheatInstantGameOver() {
  window.gameOver = true;
}

function cheatBallSlow() {
  ball.speedX *= 0.5;
  ball.speedY *= 0.5;
}

function cheatBallFast() {
  ball.speedX *= 2;
  ball.speedY *= 2;
}

function cheatBallBig() {
  ball.radius = 20;
}

function cheatBallSmall() {
  ball.radius = 4;
}

function cheatMultiball() {
  for (let i = 0; i < 3; i++) {
    extraBalls.push({
      x: ball.x,
      y: ball.y,
      radius: ball.radius,
      speedX: (Math.random() * 4 + 2) * (Math.random() < 0.5 ? -1 : 1),
      speedY: (Math.random() * 4 + 2) * (Math.random() < 0.5 ? -1 : 1)
    });
  }
}

function cheatBallZigzag() {
  cheatZigzagEnabled = !cheatZigzagEnabled;
}

function cheatBallInvincible() {
  cheatInvincibleBallEnabled = !cheatInvincibleBallEnabled;
}

/* ============================
   🟦 RAQUETTE
============================ */

function cheatTurbo() {
  paddle.speed = 14;
}

function cheatPaddleBig() {
  paddle.height = 150;
}

function cheatPaddleSmall() {
  paddle.height = 40;
}

function cheatAutoPaddle() {
  cheatAutoPaddleEnabled = !cheatAutoPaddleEnabled;
}

function cheatPaddleMagnet() {
  cheatMagnetEnabled = !cheatMagnetEnabled;
}

function cheatPaddleTeleport() {
  paddle.y = Math.random() * (canvas.height - paddle.height);
}

/* ============================
   🟩 TERRAIN
============================ */

function cheatWallLeft() {
  cheatWallLeftEnabled = !cheatWallLeftEnabled;
}

function cheatWallRight() {
  cheatWallRightEnabled = !cheatWallRightEnabled;
}

function cheatFieldSmall() {
  canvas.height = 200;
}

function cheatFieldBig() {
  canvas.height = 400;
}

function cheatGravityInvert() {
  cheatGravityInverted = !cheatGravityInverted;
}

function cheatChaos() {
  cheatChaosEnabled = !cheatChaosEnabled;
}

/* ============================
   🟡 SCORE
============================ */

function cheatPlus10() {
  score += 10;
  scoreSpan.textContent = score;
}

function cheatPlus100() {
  score += 100;
  scoreSpan.textContent = score;
}

function cheatScoreX2() {
  score *= 2;
  scoreSpan.textContent = score;
}

function cheatScoreLock() {
  cheatScoreLocked = !cheatScoreLocked;
}

function cheatScoreInfinite() {
  cheatScoreInfinite = !cheatScoreInfinite;
}

/* ============================
   🟣 SPÉCIAUX
============================ */

function cheatSlowMotionGlobal() {
  cheatSlowGlobal = !cheatSlowGlobal;
  cheatFastGlobal = false;
}

function cheatFastMotionGlobal() {
  cheatFastGlobal = !cheatFastGlobal;
  cheatSlowGlobal = false;
}

function cheatMatrix() {
  cheatMatrixEnabled = !cheatMatrixEnabled;
}

function cheatBoss() {
  cheatBossEnabled = !cheatBossEnabled;
  if (cheatBossEnabled) {
    paddle.height = 200;
    ball.radius = 14;
    ball.speedX *= 1.5;
    ball.speedY *= 1.5;
  } else {
    paddle.height = paddle.baseHeight;
    ball.radius = ball.baseRadius;
  }
}

function cheatZen() {
  cheatZenEnabled = !cheatZenEnabled;
}
