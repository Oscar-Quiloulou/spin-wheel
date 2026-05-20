// js/grid.js
import { WIDTH, HEIGHT, EMPTY } from "./config.js";

export let grid = new Array(WIDTH * HEIGHT).fill(EMPTY);
export let meta  = new Array(WIDTH * HEIGHT).fill(0);

export function idx(x, y) {
    return y * WIDTH + x;
}

export function inBounds(x, y) {
    return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;
}

export function getCell(x, y) {
    if (!inBounds(x, y)) return null;
    return grid[idx(x, y)];
}

export function setCell(x, y, type, metaVal = 0) {
    if (!inBounds(x, y)) return;
    const i = idx(x, y);
    grid[i] = type;
    meta[i] = metaVal;
}

export function swap(x1, y1, x2, y2) {
    if (!inBounds(x1, y1) || !inBounds(x2, y2)) return;
    const i1 = idx(x1, y1);
    const i2 = idx(x2, y2);
    [grid[i1], grid[i2]] = [grid[i2], grid[i1]];
    [meta[i1], meta[i2]] = [meta[i2], meta[i1]];
}
