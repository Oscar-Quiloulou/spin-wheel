// ===============================
// Firebase Config (Realtime DB)
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getDatabase, 
  ref, 
  get, 
  set 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- TES IDENTIFIANTS ---
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

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ===============================
// Charger paramètres admin
// ===============================
export async function loadAdminSettings() {
  const settingsRef = ref(db, "jeu4/adminSettings");
  const snap = await get(settingsRef);

  if (!snap.exists()) {
    // Valeurs par défaut si rien dans Firebase
    return {
      defaultTimeLimit: 60,
      cheatsAllowed: true,
      visibleCheats: [
        "cheatCenter",
        "cheatBallFast",
        "cheatBallSlow",
        "cheatPaddleBig",
        "cheatPaddleSmall",
        "cheatWallLeft",
        "cheatWallRight",
        "cheatZen"
      ]
    };
  }

  return snap.val();
}

// ===============================
// Sauvegarder paramètres admin
// ===============================
export async function saveAdminSettings(settings) {
  const settingsRef = ref(db, "jeu4/adminSettings");
  await set(settingsRef, settings);
}

// ===============================
// Export DB si besoin
// ===============================
export { db };
