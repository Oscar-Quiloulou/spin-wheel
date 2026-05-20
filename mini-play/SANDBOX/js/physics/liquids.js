// js/physics/liquids.js
import { getCell, setCell, swap, inBounds } from "../grid.js";
import { WATER, OIL, LAVA, EMPTY, FIRE, WALL } from "../config.js";

export function updateLiquids() {
    // On parcourt de bas en haut pour la gravité
    for (let y = 148; y >= 0; y--) {
        for (let x = 0; x < 200; x++) {

            const cell = getCell(x, y);
            if (cell !== WATER && cell !== OIL && cell !== LAVA) continue;

            const below = getCell(x, y + 1);

            // Descente simple
            if (below === EMPTY) {
                swap(x, y, x, y + 1);
                continue;
            }

            // Eau peut passer sous l'huile
            if (cell === WATER && below === OIL) {
                swap(x, y, x, y + 1);
                continue;
            }

            // Diagonales
            const dir = Math.random() < 0.5 ? -1 : 1;
            if (getCell(x + dir, y + 1) === EMPTY) {
                swap(x, y, x + dir, y + 1);
                continue;
            }
            if (getCell(x - dir, y + 1) === EMPTY) {
                swap(x, y, x - dir, y + 1);
                continue;
            }

            // Interactions
            if (cell === OIL && hasNeighbor(x, y, FIRE)) {
                setCell(x, y, FIRE, 40);
            }

            if (cell === WATER && hasNeighbor(x, y, LAVA)) {
                setCell(x, y, WALL);
            }

            if (cell === LAVA) {
                burnNeighbors(x, y);
            }
        }
    }
}

function hasNeighbor(x, y, type) {
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            if (getCell(x + dx, y + dy) === type) return true;
        }
    }
    return false;
}

function burnNeighbors(x, y) {
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (!inBounds(nx, ny)) continue;

            const c = getCell(nx, ny);
            if (c !== EMPTY && c !== WATER && c !== OIL) {
                setCell(nx, ny, EMPTY);
            }
        }
    }
}
