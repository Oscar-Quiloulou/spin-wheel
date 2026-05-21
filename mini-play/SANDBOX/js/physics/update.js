import { updateLiquids } from "./liquids.js";
import { updateFire } from "./fire.js";
import { updateExplosives } from "./explosives.js";

export function update() {
    updateLiquids();
    updateFire();
    updateExplosives();
}
