import { getCell, setCell } from "../grid.js";
import { WATER, LAVA, WALL, ACID, METAL, WOOD, FIRE, OIL } from "../config.js";

export function updateReactions() {
    for (let y = 0; y < 150; y++) {
        for (let x = 0; x < 200; x++) {

            const cell = getCell(x, y);

            if (cell === WATER && hasNeighbor(x, y, LAVA)) {
                setCell(x, y, WALL);
            }

            if (cell === ACID && hasNeighbor(x, y, METAL)) {
                setCell(x, y, EMPTY);
            }

            if (cell === FIRE && hasNeighbor(x, y, OIL)) {
                setCell(x, y, FIRE);
            }

            if (cell === FIRE && hasNeighbor(x, y, WOOD)) {
                setCell(x, y, FIRE);
            }
        }
    }
}

function hasNeighbor(x, y, type) {
    return (
        getCell(x + 1, y) === type ||
        getCell(x - 1, y) === type ||
        getCell(x, y + 1) === type ||
        getCell(x, y - 1) === type
    );
}
