// js/main.js
import { render } from "./renderer.js";
import { update } from "./physics/update.js";
import { initInput } from "./input.js";

const canvas = document.getElementById("game");
initInput(canvas);

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

loop();
