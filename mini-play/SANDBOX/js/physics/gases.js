import { getCell, setCell, swap } from "../grid.js";
import { SMOKE, STEAM, EMPTY } from "../config.js";

export function updateGases() {
    for (let y = 1; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            const cell = getCell(x, y);
            if (cell !== SMOKE && cell !== STEAM) continue;

            const above = getCell(x, y - 1);

            if (above === EMPTY) {
                swap(x, y, x, y - 1);
                continue;
            }

            const dir = Math.random() < 0.5 ? -1 : 1;

            if (getCell(x + dir, y - 1) === EMPTY) {
                swap(x, y, x + dir, y - 1);
            }
        }
    }
}
