// js/physics/explosives.js
import { getCell, setCell } from "../grid.js";
import { BOMB, GRENADE, EMPTY } from "../config.js";
import { meta } from "../grid.js";

export function updateExplosives() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            const cell = getCell(x, y);
            if (cell !== BOMB && cell !== GRENADE) continue;

            // Timer
            meta[y * 200 + x]--;
            if (meta[y * 200 + x] <= 0) {
                explode(x, y, cell === GRENADE ? 10 : 6);
            }
        }
    }
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
