import { getCell, setCell, swap } from "../grid.js";
import { ACID, EMPTY, WATER, METAL, WOOD, SAND } from "../config.js";

export function updateAcid() {
    for (let y = 148; y >= 0; y--) {
        for (let x = 0; x < 200; x++) {

            if (getCell(x, y) !== ACID) continue;

            const below = getCell(x, y + 1);

            if (below === EMPTY || below === WATER) {
                swap(x, y, x, y + 1);
            }

            // corrosion
            const targets = [METAL, WOOD, SAND];
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (targets.includes(getCell(x + dx, y + dy))) {
                        setCell(x + dx, y + dy, EMPTY);
                    }
                }
            }

            // neutralisation
            if (below === WATER) {
                setCell(x, y, EMPTY);
                setCell(x, y + 1, EMPTY);
            }
        }
    }
}
