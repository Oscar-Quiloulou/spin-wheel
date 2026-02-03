// /game/leaderboard.js
// Gestion du leaderboard : lecture en temps réel + ajout de scores.

// Nombre maximum d'entrées affichées
const LEADERBOARD_LIMIT = 20;

// Référence à la liste HTML
const leaderboardList = document.getElementById("leaderboardList");

// Pseudo du joueur (stocké localement)
let playerPseudo = localStorage.getItem("playerPseudo") || null;

// Demande un pseudo si nécessaire
function askPseudoIfNeeded() {
  if (!playerPseudo) {
    playerPseudo = prompt("Entre ton pseudo :") || "Joueur";
    localStorage.setItem("playerPseudo", playerPseudo);
  }
}

// Initialise l'écoute du leaderboard
function initLeaderboardListener() {
  if (!window.db) {
    console.warn("Firebase non initialisé pour le leaderboard.");
    return;
  }

  const scoresRef = db.ref("scores");

  scoresRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      leaderboardList.innerHTML = "<li>Aucun score pour le moment</li>";
      return;
    }

    // Convertit l'objet en tableau
    const entries = Object.values(data);

    // Trie du plus grand au plus petit
    entries.sort((a, b) => b.score - a.score);

    // Limite le nombre d'entrées
    const top = entries.slice(0, LEADERBOARD_LIMIT);

    // Affichage
    leaderboardList.innerHTML = "";
    top.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${entry.pseudo} — ${entry.score}`;
      leaderboardList.appendChild(li);
    });
  });
}

// Ajoute un score dans Firebase
function pushScoreToLeaderboard(score) {
  if (!window.db) {
    console.warn("Firebase non initialisé, impossible d'envoyer le score.");
    return;
  }

  askPseudoIfNeeded();

  const scoresRef = db.ref("scores");

  const newEntry = {
    pseudo: playerPseudo,
    score: score,
    date: Date.now()
  };

  scoresRef.push(newEntry)
    .then(() => {
      console.log("Score envoyé :", newEntry);
    })
    .catch((err) => {
      console.error("Erreur en envoyant le score :", err);
    });
}
