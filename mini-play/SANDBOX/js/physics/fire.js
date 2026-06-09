import { getCell, setCell } from "../grid.js";
import { 
    FIRE, EMPTY, WOOD, OIL, SMOKE, STEAM
} from "../config.js";

export function updateFire() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            if (getCell(x, y) !== FIRE) continue;

            // 1) Animation du feu (scintillement)
            animateFirePixel(x, y);

            // 2) Extinction si manque d'oxygène
            if (oxygenLevel(x, y) < 1) {
                if (Math.random() < 0.2) setCell(x, y, SMOKE);
                continue;
            }

            // 3) Extinction naturelle
            if (Math.random() < 0.01) {
                setCell(x, y, SMOKE);
                continue;
            }

            // 4) Propagation réaliste
            spreadFire(x, y);
        }
    }
}

// ------------------------------------------------------------
// 🔥 OXYGÈNE = nombre de cases vides autour
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
function spreadFire(x, y) {

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
        if (cell === WOOD && Math.random() < 0.4) {
            setCell(cx, cy, FIRE);
        }

        // Huile → brûle très vite
        if (cell === OIL && Math.random() < 0.8) {
            setCell(cx, cy, FIRE);
        }

        // Fumée → peut s'enflammer si très chaud
        if (cell === SMOKE && Math.random() < 0.1) {
            setCell(cx, cy, FIRE);
        }

        // Vapeur → ne brûle pas
        if (cell === STEAM) continue;

        // Vide → feu se propage un peu (effet brasier)
        if (cell === EMPTY && Math.random() < 0.02) {
            setCell(cx, cy, FIRE);
        }
    }
}

// ------------------------------------------------------------
// 🔥 ANIMATION DU FEU (scintillement)
// ------------------------------------------------------------
function animateFirePixel(x, y) {
    // Ici on ne modifie pas la grille, juste un effet visuel
    // Ton renderer lit COLORS[FIRE], donc on peut ajouter un bruit
    // en modifiant la couleur dans config.js plus tard si tu veux
}
