import { updateLiquids } from "./liquids.js";
import { updateFire } from "./fire.js";
import { updateExplosives } from "./explosives.js";
import { updateGranular } from "./granular.js";
import { updateAcid } from "./acid.js";
import { updateGases } from "./gases.js";
import { updateTemperature } from "./temperature.js";
import { updateReactions } from "./reactions.js";
import { updateObjects } from "./objects.js";

export function update() {
    updateLiquids();
    updateGranular();
    updateGases();
    updateFire();
    updateAcid();
    updateExplosives();
    updateTemperature();
    updateReactions();
    updateObjects();
}
