import { setCell } from "./grid.js";
import { EMPTY, WALL, WATER, OIL, FIRE, LAVA, BOMB, GRENADE } from "./config.js";

export let currentTool = WALL;
export let brushSize = 3;

const TOOL_MAP = { EMPTY, WALL, WATER, OIL, FIRE, LAVA, BOMB, GRENADE };

let lastX = null;
let lastY = null;

export function initInput(canvas) {
    let mouseDown = false;

    canvas.addEventListener("mousedown", e => {
        mouseDown = true;
        paint(e);
    });

    canvas.addEventListener("mouseup", () => {
        mouseDown = false;
        lastX = null;
        lastY = null;
    });

    canvas.addEventListener("mousemove", e => {
        if (mouseDown) paint(e);
    });
}

export function initToolbar() {
    const buttons = document.querySelectorAll("#toolbar button");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentTool = TOOL_MAP[btn.dataset.tool];
        });
    });

    document.getElementById("brush").addEventListener("input", e => {
        brushSize = parseInt(e.target.value);
    });
}

function paint(e) {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (200 / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (150 / rect.height));

    if (lastX !== null && lastY !== null) {
        drawLine(lastX, lastY, x, y);
    } else {
        paintPoint(x, y);
    }

    lastX = x;
    lastY = y;
}

function drawLine(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    for (let i = 0; i <= steps; i++) {
        const x = Math.round(x1 + dx * (i / steps));
        const y = Math.round(y1 + dy * (i / steps));
        paintPoint(x, y);
    }
}

function paintPoint(x, y) {
    for (let dy = -brushSize; dy <= brushSize; dy++) {
        for (let dx = -brushSize; dx <= brushSize; dx++) {
            if (dx*dx + dy*dy <= brushSize*brushSize) {
                setCell(x + dx, y + dy, currentTool);
            }
        }
    }
}
