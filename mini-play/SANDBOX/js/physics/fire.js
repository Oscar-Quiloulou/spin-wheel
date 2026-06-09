import { getCell, setCell } from "../grid.js";
import { 
    FIRE, EMPTY, WOOD, OIL, SMOKE, STEAM
} from "../config.js";

export function updateFire() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            if (getCell(x, y) !== FIRE) continue;

            // Animation
            animateFirePixel(x, y);

            const oxy = oxygenLevel(x, y);

            // 🔥 1) EXTINCTION SI MANQUE D’OXYGÈNE
            if (oxy === 0) {
                if (Math.random() < 0.5) setCell(x, y, SMOKE);
                continue;
            }

            // 🔥 2) EXTINCTION NATURELLE (rare)
            if (Math.random() < 0.01) {
                setCell(x, y, SMOKE);
                continue;
            }

            // 🔥 3) PROPAGATION PROPORTIONNELLE À L’OXYGÈNE
            spreadFire(x, y, oxy);
        }
    }
}

// ------------------------------------------------------------
// 🔥 OXYGÈNE = cases vides autour
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
// 🔥 PROPAGATION RÉALISTE
// ------------------------------------------------------------
function spreadFire(x, y, oxy) {

    // oxygène = facteur de propagation
    const spreadChance = oxy * 0.1; // 0.0 → 0.4

    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];

    for (const [dx, dy] of dirs) {
        const cx = x + dx;
        const cy = y + dy;

        const cell = getCell(cx, cy);

        // Bois → brûle facilement
        if (cell === WOOD && Math.random() < spreadChance + 0.2) {
            setCell(cx, cy, FIRE);
        }

        // Huile → brûle très vite
        if (cell === OIL && Math.random() < spreadChance + 0.5) {
            setCell(cx, cy, FIRE);
        }

        // Fumée → peut s’enflammer si très chaud
        if (cell === SMOKE && Math.random() < spreadChance * 0.5) {
            setCell(cx, cy, FIRE);
        }

        // Vide → feu se propage légèrement
        if (cell === EMPTY && Math.random() < spreadChance * 0.05) {
            setCell(cx, cy, FIRE);
        }
    }
}

// ------------------------------------------------------------
// 🔥 ANIMATION DU FEU (scintillement)
// ------------------------------------------------------------
function animateFirePixel(x, y) {
    // Animation simple (optionnel)
}
