import { getCell, setCell, swap } from "../grid.js";
import { ACID, EMPTY, WATER, METAL, WOOD, SAND } from "../config.js";

export function updateAcid() {
    for (let y = 148; y >= 0; y--) {
        for (let x = 0; x < 200; x++) {

            if (getCell(x, y) !== ACID) continue;

            // Déplacement simple (pas de scan inutile)
            const below = getCell(x, y + 1);

            if (below === EMPTY || below === WATER) {
                swap(x, y, x, y + 1);
                continue;
            }

            // Corrosion optimisée : seulement 4 directions
            const targets = [METAL, WOOD, SAND];

            const dirs = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1]
            ];

            for (const [dx, dy] of dirs) {
                const cx = x + dx;
                const cy = y + dy;

                if (targets.includes(getCell(cx, cy))) {
                    setCell(cx, cy, EMPTY);
                }
            }

            // Neutralisation eau <-> acide
            if (below === WATER) {
                setCell(x, y, EMPTY);
                setCell(x, y + 1, EMPTY);
            }
        }
    }
}
