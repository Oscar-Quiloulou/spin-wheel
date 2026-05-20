// js/main.js
import { render } from "./renderer.js";
import { update } from "./physics/update.js";
import { initInput, initToolbar } from "./input.js";

const canvas = document.getElementById("game");

initInput(canvas);
initToolbar();

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

loop();
