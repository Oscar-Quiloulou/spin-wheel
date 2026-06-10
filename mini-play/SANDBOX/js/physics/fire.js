// js/physics/fire.js

import { getCell, setCell, inBounds, heat, smokeCounter } from "../grid.js";
import { 
    FIRE, EMPTY, WOOD, OIL, METAL, SAND, SMOKE, CHARCOAL
} from "../config.js";

export function updateFire() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            if (getCell(x, y) !== FIRE) continue;

            const idx = y * 200 + x;

            // 🔥 Ajout de chaleur
            heat[idx] = Math.min(200, heat[idx] + 5);

            // 🔥 Diffusion de chaleur
            spreadHeat(x, y);

            // 🔥 Extinction si pas de combustible
            if (!fuelAround(x, y)) {
                if (Math.random() < 0.2) setCell(x, y, SMOKE);
                continue;
            }

            // 🔥 Combustion
            burnFuel(x, y);

            // 🔥 Propagation
            spreadFire(x, y);
        }
    }

    // 🔥 Gestion de la fumée accumulée
    clearSmokeAtTop();
}

// ------------------------------------------------------------
// 🔥 CHALEUR
// ------------------------------------------------------------
function spreadHeat(x, y) {
    const idx = y * 200 + x;
    const h = heat[idx];

    const dirs = [
        [1,0], [-1,0], [0,1], [0,-1]
    ];

    for (const [dx, dy] of dirs) {
        const cx = x + dx;
        const cy = y + dy;
        if (!inBounds(cx, cy)) continue;

        const cidx = cy * 200 + cx;

        // diffusion douce
        heat[cidx] += (h - heat[cidx]) * 0.1;
    }

    // refroidissement naturel
    heat[idx] *= 0.98;
}

// ------------------------------------------------------------
// 🔥 COMBUSTIBLE
// ------------------------------------------------------------
function fuelAround(x, y) {
    const dirs = [
        [1,0], [-1,0], [0,1], [0,-1]
    ];

    for (const [dx, dy] of dirs) {
        const c = getCell(x+dx, y+dy);
        if (c === WOOD || c === OIL) return true;
    }
    return false;
}

// ------------------------------------------------------------
// 🔥 COMBUSTION AVANCÉE (bois → feu → charbon → cendre)
// ------------------------------------------------------------
function burnFuel(x, y) {
    const dirs = [
        [1,0], [-1,0], [0,1], [0,-1]
    ];

    for (const [dx, dy] of dirs) {
        const cx = x + dx;
        const cy = y + dy;
        if (!inBounds(cx, cy)) continue;

        const cell = getCell(cx, cy);
        const idx = cy * 200 + cx;

        // Bois → chauffe → feu → charbon → cendre
        if (cell === WOOD) {

            // chauffe
            heat[idx] += 3;

            // prend feu
            if (heat[idx] > 60 && Math.random() < 0.4) {
                setCell(cx, cy, FIRE);
                continue;
            }

            // devient charbon
            if (heat[idx] > 120 && Math.random() < 0.2) {
                setCell(cx, cy, CHARCOAL);
                continue;
            }
        }

        // Charbon → fumée → cendre
        if (cell === CHARCOAL) {
            if (Math.random() < 0.1) setCell(cx, cy, SMOKE);
            if (Math.random() < 0.05) setCell(cx, cy, EMPTY);
        }

        // Huile → brûle très vite
        if (cell === OIL) {
            if (Math.random() < 0.8) setCell(cx, cy, FIRE);
        }
    }
}

// ------------------------------------------------------------
// 🔥 PROPAGATION
// ------------------------------------------------------------
function spreadFire(x, y) {
    const dirs = [
        [1,0], [-1,0], [0,1], [0,-1]
    ];

    for (const [dx, dy] of dirs) {
        const cx = x + dx;
        const cy = y + dy;
        if (!inBounds(cx, cy)) continue;

        const cell = getCell(cx, cy);

        if (cell === WOOD && Math.random() < 0.2)
            setCell(cx, cy, FIRE);

        if (cell === OIL && Math.random() < 0.5)
            setCell(cx, cy, FIRE);
    }
}

// ------------------------------------------------------------
// ☁️ FUMÉE : ÉVITER L’ACCUMULATION EN HAUT
// ------------------------------------------------------------
function clearSmokeAtTop() {
    for (let x = 0; x < 200; x++) {

        // si fumée en haut
        if (getCell(x, 0) === SMOKE) {
            smokeCounter[x]++;
        } else {
            smokeCounter[x] = 0;
        }

        // si trop de fumée accumulée → on la dissipe
        if (smokeCounter[x] > 20) {
            setCell(x, 0, EMPTY);
            smokeCounter[x] = 0;
        }
    }
}
