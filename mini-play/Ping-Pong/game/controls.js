// controls.js
// Gestion des touches et des boutons pour la raquette joueur.

function initControls(state) {
  const btnUp = document.getElementById("btnUp");
  const btnDown = document.getElementById("btnDown");

  // Clavier
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") state.paddle.moveUp = true;
    if (e.key === "ArrowDown") state.paddle.moveDown = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") state.paddle.moveUp = false;
    if (e.key === "ArrowDown") state.paddle.moveDown = false;
  });

  // Boutons (mobile)
  btnUp.addEventListener("touchstart", () => (state.paddle.moveUp = true));
  btnUp.addEventListener("touchend", () => (state.paddle.moveUp = false));
  btnDown.addEventListener("touchstart", () => (state.paddle.moveDown = true));
  btnDown.addEventListener("touchend", () => (state.paddle.moveDown = false));

  btnUp.addEventListener("mousedown", () => (state.paddle.moveUp = true));
  btnUp.addEventListener("mouseup", () => (state.paddle.moveUp = false));
  btnDown.addEventListener("mousedown", () => (state.paddle.moveDown = true));
  btnDown.addEventListener("mouseup", () => (state.paddle.moveDown = false));
}
