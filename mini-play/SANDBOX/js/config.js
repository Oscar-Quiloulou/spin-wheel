// config.js

export const WIDTH = 200;
export const HEIGHT = 150;

// Matériaux
export const EMPTY = 0;
export const WALL = 1;
export const WATER = 2;
export const OIL = 3;
export const FIRE = 4;
export const LAVA = 5;
export const BOMB = 6;
export const GRENADE = 7;
export const SAND = 8;
export const ACID = 9;
export const SMOKE = 10;
export const STEAM = 11;
export const METAL = 12;
export const WOOD = 13;
export const TORCH = 14;
export const BARREL = 15;

// Nouveau matériau : charbon
export const CHARCOAL = 16;

// Couleurs
export const COLORS = {
    [EMPTY]:   [0, 0, 0],
    [WALL]:    [100, 100, 100],
    [WATER]:   [0, 80, 255],
    [OIL]:     [30, 30, 10],
    [FIRE]:    [255, 120, 20],
    [LAVA]:    [255, 40, 0],
    [BOMB]:    [80, 80, 80],
    [GRENADE]: [60, 120, 60],
    [SAND]:    [194, 178, 128],
    [ACID]:    [0, 255, 0],
    [SMOKE]:   [80, 80, 80],
    [STEAM]:   [200, 200, 200],
    [METAL]:   [150, 150, 160],
    [WOOD]:    [120, 70, 20],
    [TORCH]:   [200, 100, 20],
    [BARREL]:  [100, 50, 20],

    // Charbon (post-combustion)
    [CHARCOAL]: [40, 20, 10]
};
