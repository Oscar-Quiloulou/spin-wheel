/* ============================================================
   LEADERBOARD COMPLEXE — NEON GLOW (Realtime Database)
   ============================================================ */

async function saveScore(gameKey, score, extra = {}) {
  const db = window._db;
  const helpers = window._rtdb || {};
  const { ref, push } = helpers;

  if (!db || !ref || !push) {
    console.error("⚠️ Realtime Database pas initialisée (check le script Firebase dans JEU4.html)");
    return;
  }

  const scoresRef = ref(db, `scores/${gameKey}`);

  try {
    await push(scoresRef, {
      score: score,
      mode: extra.mode || null,
      duration: extra.duration || null,
      date: Date.now() // timestamp ms
    });
  } catch (err) {
    console.error("Erreur sauvegarde score :", err);
  }
}

async function displayScores(gameKey, containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;

  const db = window._db;
  const helpers = window._rtdb || {};
  const { ref, query, orderByChild, limitToLast, get } = helpers;

  if (!db || !ref || !query || !orderByChild || !limitToLast || !get) {
    console.error("⚠️ Realtime Database pas initialisée (check le script Firebase dans JEU4.html)");
    return;
  }

  let scores = [];

  try {
    const scoresRef = ref(db, `scores/${gameKey}`);
    const q = query(scoresRef, orderByChild("score"), limitToLast(10));
    const snap = await get(q);

    if (snap.exists()) {
      snap.forEach(child => {
        const data = child.val();
        scores.push({
          score: data.score,
          mode: data.mode || null,
          duration: data.duration || null,
          date: data.date ? new Date(data.date).toLocaleString() : ""
        });
      });

      // On remet dans l'ordre décroissant côté client
      scores.sort((a, b) => b.score - a.score);
    }
  } catch (err) {
    console.error("Erreur chargement scores :", err);
  }

  // === Rendu HTML (style Neon) ===
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
``
