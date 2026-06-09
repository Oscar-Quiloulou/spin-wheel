// js/grid.js

import { WIDTH, HEIGHT } from "./config.js";

export const grid = new Uint8Array(WIDTH * HEIGHT);

// 🔥 FEU FORCÉ (briquet)
// IMPORTANT : ce buffer NE DOIT PAS être modifié ailleurs que dans input.js
export const forcedFire = new Uint8Array(WIDTH * HEIGHT);

export function getCell(x, y) {
    if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return 0;
    return grid[y * WIDTH + x];
}

export function setCell(x, y, type) {
    if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
    grid[y * WIDTH + x] = type;
}

export function swap(x1, y1, x2, y2) {
    if (
        x1 < 0 || y1 < 0 || x1 >= WIDTH || y1 >= HEIGHT ||
        x2 < 0 || y2 < 0 || x2 >= WIDTH || y2 >= HEIGHT
    ) return;

    const i1 = y1 * WIDTH + x1;
    const i2 = y2 * WIDTH + x2;

    const tmp = grid[i1];
    grid[i1] = grid[i2];
    grid[i2] = tmp;
}
