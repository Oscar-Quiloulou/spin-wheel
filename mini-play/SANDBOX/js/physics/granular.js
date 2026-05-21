import { getCell, setCell, swap } from "../grid.js";
import { SAND, EMPTY, WATER, OIL } from "../config.js";

export function updateGranular() {
    for (let y = 148; y >= 0; y--) {
        for (let x = 0; x < 200; x++) {

            if (getCell(x, y) !== SAND) continue;

            const below = getCell(x, y + 1);

            if (below === EMPTY || below === WATER || below === OIL) {
                swap(x, y, x, y + 1);
                continue;
            }

            const dir = Math.random() < 0.5 ? -1 : 1;

            if (getCell(x + dir, y + 1) === EMPTY) {
                swap(x, y, x + dir, y + 1);
            }
        }
    }
}
