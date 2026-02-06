// Nombre maximum d'entrées affichées
const LEADERBOARD_LIMIT = 20;

// Enregistre un score dans Firebase
function saveScore(gameKey, score, extraData = {}) {
  if (!window.db) {
    console.warn("Firebase non initialisé, impossible d'envoyer le score.");
    return;
  }

  let pseudo = localStorage.getItem("playerPseudo");
  if (!pseudo) {
    pseudo = prompt("Entre ton pseudo :") || "Joueur";
    localStorage.setItem("playerPseudo", pseudo);
  }

  const entry = {
    pseudo: pseudo,
    score: score,
    date: Date.now(),
    ...extraData
  };

  db.ref(gameKey).push(entry)
    .then(() => console.log("Score enregistré :", entry))
    .catch(err => console.error("Erreur en envoyant le score :", err));
}

// Affiche les scores dans un élément HTML
function displayScores(gameKey, elementId) {
  if (!window.db) {
    console.warn("Firebase non initialisé pour le leaderboard.");
    return;
  }

  const list = document.getElementById(elementId);
  if (!list) {
    console.warn("Élément leaderboard introuvable :", elementId);
    return;
  }

  db.ref(gameKey).once("value", snapshot => {
    const data = snapshot.val();
    if (!data) {
      list.innerHTML = "<li>Aucun score pour le moment</li>";
      return;
    }

    const entries = Object.values(data);
    entries.sort((a, b) => b.score - a.score);

    const top = entries.slice(0, LEADERBOARD_LIMIT);

    list.innerHTML = "";
    top.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${entry.pseudo} — ${entry.score}`;
      list.appendChild(li);
    });
  });
}

// Efface l'affichage du leaderboard
function hideScores(elementId) {
  const list = document.getElementById(elementId);
  if (list) list.innerHTML = "";
}
