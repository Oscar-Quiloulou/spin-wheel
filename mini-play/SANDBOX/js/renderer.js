// js/renderer.js
import { WIDTH, HEIGHT, COLORS } from "./config.js";
import { grid } from "./grid.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(WIDTH, HEIGHT);

export function render() {
    const data = imageData.data;

    for (let i = 0; i < grid.length; i++) {
        const type = grid[i];
        const [r, g, b] = COLORS[type];
        const p = i * 4;

        data[p] = r;
        data[p + 1] = g;
        data[p + 2] = b;
        data[p + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
}
