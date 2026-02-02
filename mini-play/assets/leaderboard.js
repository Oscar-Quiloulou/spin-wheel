/* ============================================================
   LEADERBOARD COMPLEXE — NEON GLOW (Realtime DB + dédup)
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
      device: extra.device || null,
      date: Date.now() // timestamp ms
    });
  } catch (err) {
    console.error("Erreur sauvegarde score :", err);
  }
}

async function displayScores(gameKey, containerId) {
  const box = document.getElementById(containerId);
  const loader = document.getElementById("lb-loading");
  if (!box) return;

  // Loader si dispo
  if (loader) {
    loader.style.display = "block";
    box.innerHTML = "";
  }

  let timeoutReached = false;
  let timeout;
  if (loader) {
    timeout = setTimeout(() => {
      timeoutReached = true;
      loader.innerHTML = "<span style='opacity:0.7;'>Pas de connexion...</span>";
    }, 4000);
  }

  const db = window._db;
  const helpers = window._rtdb || {};
  const { ref, query, orderByChild, get, remove } = helpers;

  if (!db || !ref || !query || !orderByChild || !get) {
    console.error("⚠️ Realtime Database pas initialisée (check le script Firebase dans JEU4.html)");
    if (loader) loader.style.display = "none";
    return;
  }

  let scores = [];
  const duplicatesKeys = []; // clés à supprimer dans la DB

  try {
    const scoresRef = ref(db, `scores/${gameKey}`);
    // On récupère TOUT, trié par score (asc)
    const q = query(scoresRef, orderByChild("score"));
    const snap = await get(q);

    if (loader) clearTimeout(timeout);
    if (timeoutReached) {
      // On abandonne l'affichage si on a déjà affiché "Pas de connexion"
      return;
    }

    if (loader) loader.style.display = "none";

    if (snap.exists()) {
      // map score -> meilleur enregistrement
      const seenByScore = new Map();

      snap.forEach(child => {
        const data = child.val();
        const key = child.key;

        if (typeof data.score !== "number") return;

        const entry = {
          key,
          score: data.score,
          mode: data.mode || null,
          duration: data.duration || null,
          device: data.device || null,
          dateValue: typeof data.date === "number" ? data.date : 0,
          dateText: data.date ? new Date(data.date).toLocaleString() : ""
        };

        if (!seenByScore.has(data.score)) {
          // premier score de cette valeur
          seenByScore.set(data.score, entry);
        } else {
          // déjà un score identique, on garde le plus récent
          const existing = seenByScore.get(data.score);
          if (entry.dateValue > existing.dateValue) {
            // le nouveau est plus récent → on supprime l'ancien
            duplicatesKeys.push(existing.key);
            seenByScore.set(data.score, entry);
          } else {
            // l'ancien est plus récent → on supprime ce nouveau
            duplicatesKeys.push(key);
          }
        }
      });

      // on récupère les valeurs uniques
      scores = Array.from(seenByScore.values());

      // tri du plus gros score au plus petit
      scores.sort((a, b) => b.score - a.score);

      // on ne garde que le top 10 pour l'affichage
      scores = scores.slice(0, 10);
    }
  } catch (err) {
    if (loader) {
      clearTimeout(timeout);
      loader.innerHTML = "<span style='opacity:0.7;'>Erreur de connexion</span>";
    }
    console.error("Erreur chargement scores :", err);
    return;
  }

  // Nettoyage des doublons dans la DB (fire-and-forget)
  try {
    const { ref, remove } = helpers;
    const scoresRefBase = ref(db, `scores/${gameKey}`);
    duplicatesKeys.forEach(key => {
      const toDeleteRef = ref(db, `scores/${gameKey}/${key}`);
      remove(toDeleteRef).catch(e => console.warn("Suppression doublon échouée :", e));
    });
  } catch (e) {
    console.warn("Erreur lors de la suppression des doublons :", e);
  }

  // === Rendu HTML ===
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
            ${s.device ? `<div>Appareil : ${s.device}</div>` : ""}
            <div class="lb-date">${s.dateText}</div>
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
