// js/physics/explosives.js

import { getCell, setCell, swap, inBounds } from "../grid.js";
import { 
    EMPTY, FIRE, SMOKE, BOMB, GRENADE, METAL, WOOD, SAND, WATER, OIL
} from "../config.js";

export function updateExplosives() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            const cell = getCell(x, y);

            // Bombe
            if (cell === BOMB) {
                if (shouldExplode(x, y)) {
                    explode(x, y, 12); // rayon 12
                }
            }

            // Grenade
            if (cell === GRENADE) {
                if (shouldExplode(x, y)) {
                    explode(x, y, 8); // rayon 8
                }
            }
        }
    }
}

// ------------------------------------------------------------
// 💥 Déclenchement de l’explosion
// ------------------------------------------------------------
function shouldExplode(x, y) {
    // Le feu déclenche l’explosion
    if (getCell(x+1, y) === FIRE) return true;
    if (getCell(x-1, y) === FIRE) return true;
    if (getCell(x, y+1) === FIRE) return true;
    if (getCell(x, y-1) === FIRE) return true;

    // Lave déclenche aussi
    if (getCell(x+1, y) === OIL) return true;
    if (getCell(x-1, y) === OIL) return true;

    return false;
}

// ------------------------------------------------------------
// 💥 Explosion réaliste
// ------------------------------------------------------------
function explode(cx, cy, radius) {

    for (let y = cy - radius; y <= cy + radius; y++) {
        for (let x = cx - radius; x <= cx + radius; x++) {

            if (!inBounds(x, y)) continue;

            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist > radius) continue;

            const cell = getCell(x, y);

            // Onde de choc : détruit tout sauf métal
            if (cell !== METAL) {
                if (Math.random() < 0.8) setCell(x, y, EMPTY);
            }

            // Métal → projeté
            if (cell === METAL && Math.random() < 0.2) {
                const tx = x + Math.sign(dx) * 2;
                const ty = y + Math.sign(dy) * 2;
                if (inBounds(tx, ty)) swap(x, y, tx, ty);
            }

            // Fumée au bord de l’explosion
            if (dist > radius * 0.7 && Math.random() < 0.3) {
                setCell(x, y, SMOKE);
            }

            // Feu au centre
            if (dist < radius * 0.4 && Math.random() < 0.5) {
                setCell(x, y, FIRE);
            }
        }
    }

    // Supprime la bombe / grenade
    setCell(cx, cy, EMPTY);
}
