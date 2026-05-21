import { render } from "./renderer.js";
import { update } from "./physics/update.js";
import { initInput, initToolbar } from "./input.js";

const canvas = document.getElementById("game");

// Fix taille interne du canvas
canvas.width = 200;
canvas.height = 150;

initInput(canvas);
initToolbar();

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

loop();
