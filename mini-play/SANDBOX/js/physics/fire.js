// js/physics/fire.js

import { getCell, setCell } from "../grid.js";
import { forcedFire } from "../grid.js";
import { 
    FIRE, EMPTY, WOOD, OIL, METAL, SAND, SMOKE
} from "../config.js";

export function updateFire() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            if (getCell(x, y) !== FIRE) continue;

            const idx = y * 200 + x;

            // 🔥 0) FEU FORCÉ (briquet)
            if (forcedFire[idx] === 1) {
                burnFuel(x, y);
                spreadFire(x, y, 4); // oxygène max
                continue;
            }

            const oxy = oxygenLevel(x, y);
            const fuel = fuelAround(x, y);

            // 🔥 1) EXTINCTION SI PAS DE COMBUSTIBLE
            if (!fuel) {
                if (Math.random() < 0.3) setCell(x, y, SMOKE);
                continue;
            }

            // 🔥 2) EXTINCTION SI PAS D’OXYGÈNE
            if (oxy === 0) {
                if (Math.random() < 0.5) setCell(x, y, SMOKE);
                continue;
            }

            // 🔥 3) COMBUSTION DU COMBUSTIBLE
            burnFuel(x, y);

            // 🔥 4) PROPAGATION
            spreadFire(x, y, oxy);
        }
    }
}

// ------------------------------------------------------------
// 🔥 DÉTECTION DE COMBUSTIBLE
// ------------------------------------------------------------
function fuelAround(x, y) {
    const dirs = [
        [1, 0], [-1, 0],
        [0, 1], [0, -1]
    ];

    for (const [dx, dy] of dirs) {
        const cell = getCell(x + dx, y + dy);
        if (cell === WOOD || cell === OIL) return true;
    }
    return false;
}

// ------------------------------------------------------------
// 🔥 COMBUSTION
// ------------------------------------------------------------
function burnFuel(x, y) {
    const dirs = [
        [1, 0], [-1, 0],
        [0, 1], [0, -1]
    ];

    for (const [dx, dy] of dirs) {
        const cx = x + dx;
        const cy = y + dy;
        const cell = getCell(cx, cy);

        if (cell === WOOD) {
            if (Math.random() < 0.3) setCell(cx, cy, SMOKE);
            if (Math.random() < 0.1) setCell(cx, cy, EMPTY);
        }

        if (cell === OIL) {
            if (Math.random() < 0.8) setCell(cx, cy, FIRE);
            if (Math.random() < 0.2) setCell(cx, cy, SMOKE);
        }

        if (cell === METAL) {
            // Option : chauffe → couleur rouge plus tard
        }
    }
}

// ------------------------------------------------------------
// 🔥 OXYGÈNE
// ------------------------------------------------------------
function oxygenLevel(x, y) {
    let oxy = 0;

    if (getCell(x+1, y) === EMPTY) oxy++;
    if (getCell(x-1, y) === EMPTY) oxy++;
    if (getCell(x, y+1) === EMPTY) oxy++;
    if (getCell(x, y-1) === EMPTY) oxy++;

    return oxy; // 0 à 4
}

// ------------------------------------------------------------
// 🔥 PROPAGATION
// ------------------------------------------------------------
function spreadFire(x, y, oxy) {
    const dirs = [
        [1, 0], [-1, 0],
        [0, 1], [0, -1]
    ];

    const chance = oxy * 0.1;

    for (const [dx, dy] of dirs) {
        const cx = x + dx;
        const cy = y + dy;
        const cell = getCell(cx, cy);

        if (cell === WOOD && Math.random() < chance + 0.2)
            setCell(cx, cy, FIRE);

        if (cell === OIL && Math.random() < chance + 0.5)
            setCell(cx, cy, FIRE);
    }
}
