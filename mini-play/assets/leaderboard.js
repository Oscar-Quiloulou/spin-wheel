/* ============================================================
   LEADERBOARD COMPLEXE — NEON GLOW
   ============================================================ */

function saveScore(gameKey, score, extra = {}) {
  let scores = JSON.parse(localStorage.getItem(gameKey)) || [];

  scores.push({
    score: score,
    date: new Date().toLocaleString(),
    mode: extra.mode || null,
    duration: extra.duration || null
  });

  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);

  localStorage.setItem(gameKey, JSON.stringify(scores));
}

function displayScores(gameKey, containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;

  let scores = JSON.parse(localStorage.getItem(gameKey)) || [];

  let html = `
    <h3>🏆 Classement</h3>
    <div class="lb-container">
      <div class="lb-header">
        <span>#</span>
        <span>Score</span>
        <span>Détails</span>
      </div>
      <div class="lb-body">
  `;

  if (!scores.length) {
    html += `<p style="opacity:0.7;">Aucun score pour l’instant.</p>`;
  } else {
    scores.forEach((s, i) => {
      html += `
        <div class="lb-row" style="animation-delay:${i * 0.08}s">
          <span class="lb-rank">${i + 1}</span>
          <span class="lb-score">${s.score}</span>
          <span class="lb-info">
            ${s.mode ? `<div>Mode : ${s.mode}</div>` : ""}
            ${s.duration ? `<div>Durée : ${s.duration}s</div>` : ""}
            <div class="lb-date">${s.date}</div>
          </span>
        </div>
      `;
    });
  }

  html += `
      </div>
    </div>
  `;

  box.innerHTML = html;

  box.classList.remove("hide");
  setTimeout(() => box.classList.add("show"), 30);
}

function hideScores(containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.classList.remove("show");
  box.classList.add("hide");
}
