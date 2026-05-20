// js/physics/fire.js
import { getCell, setCell } from "../grid.js";
import { FIRE, OIL, EMPTY } from "../config.js";
import { meta } from "../grid.js";

export function updateFire() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            if (getCell(x, y) !== FIRE) continue;

            // Durée de vie
            meta[y * 200 + x]--;
            if (meta[y * 200 + x] <= 0) {
                setCell(x, y, EMPTY);
                continue;
            }

            // Propagation à l'huile
            spreadToOil(x, y);
        }
    }
}

function spreadToOil(x, y) {
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;

            if (getCell(nx, ny) === OIL) {
                setCell(nx, ny, FIRE, 40);
            }
        }
    }
}
