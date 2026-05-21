import { getCell, setCell } from "../grid.js";
import { TORCH, FIRE, BARREL, EMPTY } from "../config.js";

export function updateObjects() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            const cell = getCell(x, y);

            if (cell === TORCH) {
                setCell(x, y - 1, FIRE, 20);
            }

            if (cell === BARREL && hasFire(x, y)) {
                explode(x, y, 12);
            }
        }
    }
}

function hasFire(x, y) {
    return (
        getCell(x + 1, y) === FIRE ||
        getCell(x - 1, y) === FIRE ||
        getCell(x, y + 1) === FIRE ||
        getCell(x, y - 1) === FIRE
    );
}

function explode(cx, cy, radius) {
    for (let y = cy - radius; y <= cy + radius; y++) {
        for (let x = cx - radius; x <= cx + radius; x++) {
            const dx = x - cx;
            const dy = y - cy;
            if (dx*dx + dy*dy <= radius*radius) {
                setCell(x, y, EMPTY);
            }
        }
    }
}
