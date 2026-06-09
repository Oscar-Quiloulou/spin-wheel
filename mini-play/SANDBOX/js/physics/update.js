// js/physics/update.js

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
    // Liquides (eau, huile, lave…)
    updateLiquids();

    // Matériaux granulaires (sable…)
    updateGranular();

    // Gaz (fumée, vapeur…)
    updateGases();

    // Feu
    updateFire();

    // Acide
    updateAcid();

    // Explosifs (bombes, grenades…)
    updateExplosives();

    // Température (chauffe / vapeur…)
    updateTemperature();

    // Réactions chimiques (eau+lave, acide+métal…)
    updateReactions();

    // Objets spéciaux (torche, baril…)
    updateObjects();
}
