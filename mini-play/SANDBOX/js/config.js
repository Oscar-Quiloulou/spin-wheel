// js/config.js

export const WIDTH = 200;
export const HEIGHT = 150;

// Types de particules
export const EMPTY = 0;
export const WALL = 1;
export const WATER = 2;
export const OIL = 3;
export const FIRE = 4;
export const LAVA = 5;
export const BOMB = 6;
export const GRENADE = 7;

// Couleurs (rendu)
export const COLORS = {
    [EMPTY]: [0, 0, 0],
    [WALL]: [120, 120, 120],
    [WATER]: [50, 80, 200],
    [OIL]: [20, 20, 40],
    [FIRE]: [255, 120, 20],
    [LAVA]: [255, 60, 0],
    [BOMB]: [80, 80, 80],
    [GRENADE]: [40, 160, 40],
};
