// /game/firebase.js
// Initialisation Firebase pour le jeu (version compat, idéale pour GitHub Pages)

const firebaseConfig = {
  apiKey: "AIzaSyAdZva6_Enq9bcWcLIqZbH4kuzCybDoOP4",
  authDomain: "leaderboard-mini-play.firebaseapp.com",
  databaseURL: "https://leaderboard-mini-play-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leaderboard-mini-play",
  storageBucket: "leaderboard-mini-play.firebasestorage.app",
  messagingSenderId: "601804859698",
  appId: "1:601804859698:web:88869d17691f8778150f2b",
  measurementId: "G-7BTGGBWD08"
};

// Vérifie que les SDK Firebase sont bien chargés
if (typeof firebase !== "undefined") {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.database();
  console.log("%cFirebase (game) initialisé", "color:#00f5ff;font-weight:bold;");
} else {
  console.warn("Firebase SDK non chargé dans /game. Vérifie les <script> dans index.html.");
}
