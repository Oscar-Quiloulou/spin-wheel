// js/grid.js

import { WIDTH, HEIGHT } from "./config.js";

export const grid = new Uint8Array(WIDTH * HEIGHT);

// 🔥 FEU FORCÉ (briquet)
export const forcedFire = new Uint8Array(WIDTH * HEIGHT);

export function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT;
}

export function getCell(x, y) {
    if (!inBounds(x, y)) return 0;
    return grid[y * WIDTH + x];
}

export function setCell(x, y, type) {
    if (!inBounds(x, y)) return;
    grid[y * WIDTH + x] = type;
}

export function swap(x1, y1, x2, y2) {
    if (!inBounds(x1, y1) || !inBounds(x2, y2)) return;

    const i1 = y1 * WIDTH + x1;
    const i2 = y2 * WIDTH + x2;

    const tmp = grid[i1];
    grid[i1] = grid[i2];
    grid[i2] = tmp;
}
