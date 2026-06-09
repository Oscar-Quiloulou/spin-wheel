import { getCell, setCell } from "../grid.js";
import { FIRE, EMPTY, WOOD, OIL } from "../config.js";

export function updateFire() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            if (getCell(x, y) !== FIRE) continue;

            // Animation du feu : variation de couleur
            animateFirePixel(x, y);

            // Extinction aléatoire (évite les feux éternels)
            if (Math.random() < 0.01) {
                setCell(x, y, EMPTY);
                continue;
            }

            // Propagation vers le haut
            if (getCell(x, y - 1) === WOOD || getCell(x, y - 1) === OIL) {
                setCell(x, y - 1, FIRE);
            }

            // Propagation latérale
            if (getCell(x + 1, y) === WOOD || getCell(x + 1, y) === OIL) {
                setCell(x + 1, y, FIRE);
            }
            if (getCell(x - 1, y) === WOOD || getCell(x - 1, y) === OIL) {
                setCell(x - 1, y, FIRE);
            }

            // Propagation vers le bas (rare)
            if (Math.random() < 0.1) {
                if (getCell(x, y + 1) === WOOD || getCell(x, y + 1) === OIL) {
                    setCell(x, y + 1, FIRE);
                }
            }
        }
    }
}

// Variation de couleur du feu (effet flamme)
function animateFirePixel(x, y) {
    // On stocke la couleur dans un buffer temporaire
    // (le renderer lit COLORS[type], mais on peut ajouter un bruit visuel)
    const flicker = Math.floor(Math.random() * 40);

    // On encode la couleur dans une cellule spéciale (option simple)
    // Ici on ne change pas le type, juste un effet visuel
    // Le renderer doit lire COLORS[FIRE] normalement
    // Donc on ne touche pas à la grille, juste à un buffer si tu veux plus tard
}
