import { getCell, setCell } from "../grid.js";
import { FIRE, LAVA, WATER, STEAM } from "../config.js";

export function updateTemperature() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            const cell = getCell(x, y);

            if (cell === FIRE || cell === LAVA) {
                heatNeighbors(x, y);
            }

            if (cell === WATER && isHot(x, y)) {
                setCell(x, y, STEAM);
            }
        }
    }
}

function heatNeighbors(x, y) {
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            // futur système de température
        }
    }
}

function isHot(x, y) {
    return (
        getCell(x, y - 1) === FIRE ||
        getCell(x, y + 1) === FIRE ||
        getCell(x - 1, y) === FIRE ||
        getCell(x + 1, y) === FIRE ||
        getCell(x, y - 1) === LAVA ||
        getCell(x, y + 1) === LAVA
    );
}
