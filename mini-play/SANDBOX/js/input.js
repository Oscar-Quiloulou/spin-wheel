// js/input.js
import { setCell } from "./grid.js";
import { EMPTY, WALL, WATER, OIL, FIRE, LAVA, BOMB, GRENADE } from "./config.js";

export let currentTool = WALL;
export let brushSize = 3;

export function initInput(canvas) {
    let mouseDown = false;

    canvas.addEventListener("mousedown", e => {
        mouseDown = true;
        paint(e);
    });

    canvas.addEventListener("mouseup", () => mouseDown = false);
    canvas.addEventListener("mousemove", e => {
        if (mouseDown) paint(e);
    });
}

function paint(e) {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (200 / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (150 / rect.height));

    for (let dy = -brushSize; dy <= brushSize; dy++) {
        for (let dx = -brushSize; dx <= brushSize; dx++) {
            if (dx*dx + dy*dy <= brushSize*brushSize) {
                setCell(x + dx, y + dy, currentTool);
            }
        }
    }
}
