/******************************************************
 *  SANDBOX ULTRA RÉALISTE — Dimitri Edition
 *  PARTIE 1/6 : Déclarations, matériaux, constantes
 ******************************************************/

// --- CONFIG ---
const W = 260;
const H = 180;
const SCALE = 3;

const canvas = document.getElementById("canvas");
canvas.width = W * SCALE;
canvas.height = H * SCALE;
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// --- MATERIAUX ---
const Materials = {
  EMPTY: 0,
  SAND: 1,
  WATER: 2,
  LAVA: 3,
  STONE: 4,
  FIRE: 5,
  SMOKE: 6,
  STEAM: 7,
  OIL: 8,
  ACID: 9,
  METAL: 10,
  METAL_MOLTEN: 11,
  ICE: 12,
  GAS: 13,
  EXPLOSIVE: 14,
  LIFE: 15,
  PLANT: 16,
  BOMB: 17,
  NUKE: 18,
  SHOT: 19,
  WOOD: 20,
  FLAME_JET: 21,
  WIRE: 22,
  SPARK: 23,
  SWITCH: 24,
  BATTERY: 25,
};

// --- DENSITÉS ---
const density = {
  [Materials.EMPTY]: 0,
  [Materials.SAND]: 5,
  [Materials.WATER]: 3,
  [Materials.LAVA]: 6,
  [Materials.STONE]: 7,
  [Materials.FIRE]: 0.1,
  [Materials.SMOKE]: 0.05,
  [Materials.STEAM]: 0.05,
  [Materials.OIL]: 2.5,
  [Materials.ACID]: 3,
  [Materials.METAL]: 8,
  [Materials.METAL_MOLTEN]: 7,
  [Materials.ICE]: 3.2,
  [Materials.GAS]: 0.02,
  [Materials.EXPLOSIVE]: 4,
  [Materials.LIFE]: 1.5,
  [Materials.PLANT]: 2,
  [Materials.BOMB]: 4.5,
  [Materials.NUKE]: 4.5,
  [Materials.SHOT]: 6,
  [Materials.WOOD]: 3,
  [Materials.FLAME_JET]: 0.2,
  [Materials.WIRE]: 7,
  [Materials.SPARK]: 0.1,
  [Materials.SWITCH]: 7,
  [Materials.BATTERY]: 7,
};

// --- COULEURS ---
const baseColors = {
  [Materials.EMPTY]: "#000000",
  [Materials.SAND]: "#d9c074",
  [Materials.WATER]: "#2f6fff",
  [Materials.LAVA]: "#ff4500",
  [Materials.STONE]: "#777777",
  [Materials.FIRE]: "#ffdd55",
  [Materials.SMOKE]: "#555555",
  [Materials.STEAM]: "#ccccff",
  [Materials.OIL]: "#553300",
  [Materials.ACID]: "#00ff00",
  [Materials.METAL]: "#aaaaaa",
  [Materials.METAL_MOLTEN]: "#ff3300",
  [Materials.ICE]: "#88ddff",
  [Materials.GAS]: "#aa00ff",
  [Materials.EXPLOSIVE]: "#ff0000",
  [Materials.LIFE]: "#00ffff",
  [Materials.PLANT]: "#00aa00",
  [Materials.BOMB]: "#990000",
  [Materials.NUKE]: "#ffff00",
  [Materials.SHOT]: "#ffffff",
  [Materials.WOOD]: "#8b4513",
  [Materials.FLAME_JET]: "#ff8800",
  [Materials.WIRE]: "#4444aa",
  [Materials.SPARK]: "#ffffaa",
  [Materials.SWITCH]: "#8888ff",
  [Materials.BATTERY]: "#ffaa00",
};

// --- CONDUCTIVITÉ (ÉLECTRICITÉ AVANCÉE) ---
const conductivity = {
  [Materials.EMPTY]: 0,
  [Materials.SAND]: 0,
  [Materials.WATER]: 0.8,
  [Materials.LAVA]: 0.2,
  [Materials.STONE]: 0,
  [Materials.FIRE]: 0.1,
  [Materials.SMOKE]: 0.05,
  [Materials.STEAM]: 0.1,
  [Materials.OIL]: 0,
  [Materials.ACID]: 0.3,
  [Materials.METAL]: 1.0,
  [Materials.METAL_MOLTEN]: 1.0,
  [Materials.ICE]: 0.05,
  [Materials.GAS]: 0.4,
  [Materials.EXPLOSIVE]: 0,
  [Materials.LIFE]: 0.2,
  [Materials.PLANT]: 0.05,
  [Materials.BOMB]: 0,
  [Materials.NUKE]: 0,
  [Materials.SHOT]: 0,
  [Materials.WOOD]: 0.1,
  [Materials.FLAME_JET]: 0,
  [Materials.WIRE]: 1.0,
  [Materials.SPARK]: 1.0,
  [Materials.SWITCH]: 1.0,
  [Materials.BATTERY]: 1.0,
};

// --- SEUILS THERMIQUES ---
const ignitionTemp = {
  [Materials.WOOD]: 200,
  [Materials.PLANT]: 140,
  [Materials.OIL]: 150,
};

const meltTemp = {
  [Materials.ICE]: 0,
  [Materials.METAL]: 800,
};

const boilTemp = {
  [Materials.WATER]: 100,
  [Materials.OIL]: 300,
};

// --- CELLULE ---
function makeCell(mat = Materials.EMPTY, temp = 20, life = 0, pressure = 0, vx = 0, vy = 0) {
  return { mat, temp, life, pressure, vx, vy };
}

// --- GRILLE ---
const grid = new Array(W * H);
const nextGrid = new Array(W * H);

for (let i = 0; i < grid.length; i++) {
  grid[i] = makeCell();
  nextGrid[i] = makeCell();
}

function idx(x, y) {
  return y * W + x;
}

function inBounds(x, y) {
  return x >= 0 && x < W && y >= 0 && y < H;
}

function get(x, y) {
  if (!inBounds(x, y)) return null;
  return grid[idx(x, y)];
}

function set(x, y, cell) {
  if (!inBounds(x, y)) return;
  nextGrid[idx(x, y)] = cell;
}

// --- MOUVEMENTS ---
function swapIfLessDense(x1, y1, x2, y2) {
  if (!inBounds(x2, y2)) return false;
  const a = get(x1, y1);
  const b = get(x2, y2);
  if (!a || !b) return false;
  if (density[a.mat] > density[b.mat]) {
    set(x2, y2, a);
    set(x1, y1, b);
    return true;
  }
  return false;
}

function moveIfEmpty(x1, y1, x2, y2) {
  if (!inBounds(x2, y2)) return false;
  const a = get(x1, y1);
  const b = get(x2, y2);
  if (!a || !b) return false;
  if (b.mat === Materials.EMPTY) {
    set(x2, y2, a);
    set(x1, y1, makeCell());
    return true;
  }
  return false;
}

function thermalConduction(x, y, c) {
  const dirs = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;
    if (n.mat === Materials.EMPTY) continue;

    const avg = (c.temp + n.temp) / 2;
    c.temp += (avg - c.temp) * 0.25;
    n.temp += (avg - n.temp) * 0.25;
    set(nx, ny, n);
  }
}

/******************************************************
 *  PARTIE 2/6 : updateXXX des matériaux classiques
 ******************************************************/

function updateCell(x, y) {
  const c = get(x, y);
  if (!c) return;

  set(x, y, c);

  if (c.mat !== Materials.EMPTY) {
    thermalConduction(x, y, c);
  }

  propagateElectricity(x, y, c);

  switch (c.mat) {
    case Materials.SAND: updateSand(x, y, c); break;
    case Materials.WATER: updateWater(x, y, c); break;
    case Materials.LAVA: updateLava(x, y, c); break;
    case Materials.STONE: updateStone(x, y, c); break;
    case Materials.FIRE: updateFire(x, y, c); break;
    case Materials.SMOKE: updateSmoke(x, y, c); break;
    case Materials.STEAM: updateSteam(x, y, c); break;
    case Materials.OIL: updateOil(x, y, c); break;
    case Materials.ACID: updateAcid(x, y, c); break;
    case Materials.METAL: updateMetal(x, y, c); break;
    case Materials.METAL_MOLTEN: updateMetalMolten(x, y, c); break;
    case Materials.ICE: updateIce(x, y, c); break;
    case Materials.GAS: updateGas(x, y, c); break;
    case Materials.EXPLOSIVE: updateExplosive(x, y, c); break;
    case Materials.LIFE: updateLife(x, y, c); break;
    case Materials.PLANT: updatePlant(x, y, c); break;
    case Materials.WOOD: updateWood(x, y, c); break;
    case Materials.BOMB: updateBomb(x, y, c); break;
    case Materials.NUKE: updateNuke(x, y, c); break;

    case Materials.WIRE: updateWire(x, y, c); break;
    case Materials.SPARK: updateSpark(x, y, c); break;
    case Materials.SWITCH: updateSwitch(x, y, c); break;
    case Materials.BATTERY: updateBattery(x, y, c); break;
  }
}

/*********************** SABLE *************************/
function updateSand(x, y, c) {
  if (swapIfLessDense(x, y, x, y + 1)) return;
  if (swapIfLessDense(x, y, x + (Math.random() < 0.5 ? -1 : 1), y + 1)) return;
}

/*********************** EAU ***************************/
function updateWater(x, y, c) {
  if (swapIfLessDense(x, y, x, y + 1)) return;

  if (Math.random() < 0.4) {
    if (swapIfLessDense(x, y, x - 1, y)) return;
    if (swapIfLessDense(x, y, x + 1, y)) return;
  }

  if (c.temp <= meltTemp[Materials.ICE]) {
    set(x, y, makeCell(Materials.ICE, c.temp));
    return;
  }

  if (c.temp >= boilTemp[Materials.WATER]) {
    set(x, y, makeCell(Materials.STEAM, c.temp + 20, 40));
    return;
  }

  set(x, y, c);
}

/*********************** LAVE **************************/
function updateLava(x, y, c) {
  if (Math.random() < 0.3) swapIfLessDense(x, y, x, y + 1);
  if (Math.random() < 0.1) swapIfLessDense(x, y, x + (Math.random() < 0.5 ? -1 : 1), y);

  const dirs = [
    [x, y + 1], [x, y - 1],
    [x - 1, y], [x + 1, y]
  ];

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;

    if (n.mat === Materials.WATER) {
      set(nx, ny, makeCell(Materials.STONE, 200));
      set(x, y, makeCell(Materials.STEAM, 150, 40));
      return;
    }

    if (n.mat === Materials.OIL) {
      set(nx, ny, makeCell(Materials.FIRE, 400, 20));
    }

    if (n.mat === Materials.ICE) {
      set(nx, ny, makeCell(Materials.WATER, 50));
    }

    if (n.mat === Materials.METAL && n.temp < 800) {
      n.temp = 800;
      set(nx, ny, n);
    }

    if (n.mat === Materials.LIFE) {
      set(nx, ny, makeCell(Materials.FIRE, 400, 15));
    }

    if (n.mat === Materials.PLANT || n.mat === Materials.WOOD) {
      set(nx, ny, makeCell(Materials.FIRE, 350, 15));
    }
  }

  c.temp -= 0.3;
  if (c.temp <= 200) {
    set(x, y, makeCell(Materials.STONE, 150));
  } else {
    set(x, y, c);
  }
}

/*********************** PIERRE ************************/
function updateStone(x, y, c) {
  if (c.temp > 20) c.temp -= 0.05;
  set(x, y, c);
}

/*********************** FEU ***************************/
function updateFire(x, y, c) {
  c.life -= 0.4;
  if (c.life <= 0) {
    set(x, y, makeCell(Materials.SMOKE, 80, 40));
    return;
  }

  if (moveIfEmpty(x, y, x, y - 1)) return;

  if (Math.random() < 0.3) {
    moveIfEmpty(x, y, x + (Math.random() < 0.5 ? -1 : 1), y);
  }

  const dirs = [
    [x, y + 1], [x, y - 1],
    [x - 1, y], [x + 1, y]
  ];

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;

    n.temp += 20;
    set(nx, ny, n);

    if (n.mat === Materials.WOOD || n.mat === Materials.PLANT || n.mat === Materials.OIL) {
      if (Math.random() < 0.8) {
        set(nx, ny, makeCell(Materials.FIRE, 350, 25));
      }
    }

    if (ignitionTemp[n.mat] && n.temp > ignitionTemp[n.mat]) {
      set(nx, ny, makeCell(Materials.FIRE, n.temp, 20));
    }

    if (n.mat === Materials.EXPLOSIVE && Math.random() < 0.4) explode(nx, ny, 8);
    if (n.mat === Materials.BOMB && Math.random() < 0.6) explode(nx, ny, 10);
    if (n.mat === Materials.NUKE && Math.random() < 0.3) explodeNuke(nx, ny, 16);

    if (n.mat === Materials.WIRE && Math.random() < 0.3) {
      n.life = 5;
      set(nx, ny, n);
    }
  }

  if (Math.random() < 0.2) {
    set(x, y - 1, makeCell(Materials.SMOKE, c.temp, 20));
  }

  c.temp = Math.max(c.temp, 300);
  set(x, y, c);
}

/*********************** FUMÉE *************************/
function updateSmoke(x, y, c) {
  c.life--;
  if (c.life <= 0) {
    set(x, y, makeCell());
    return;
  }
  if (moveIfEmpty(x, y, x, y - 1)) return;
  if (Math.random() < 0.5) moveIfEmpty(x, y, x + (Math.random() < 0.5 ? -1 : 1), y - 1);
}

/*********************** VAPEUR ************************/
function updateSteam(x, y, c) {
  c.life--;
  if (c.life <= 0) {
    set(x, y, makeCell());
    return;
  }
  if (moveIfEmpty(x, y, x, y - 1)) return;
  if (Math.random() < 0.4) moveIfEmpty(x, y, x + (Math.random() < 0.5 ? -1 : 1), y - 1);

  if (c.temp < 80 && Math.random() < 0.02) {
    set(x, y, makeCell(Materials.WATER, 60));
  } else {
    set(x, y, c);
  }
}

/*********************** HUILE *************************/
function updateOil(x, y, c) {
  if (swapIfLessDense(x, y, x, y + 1)) return;
  if (Math.random() < 0.5) swapIfLessDense(x, y, x + (Math.random() < 0.5 ? -1 : 1), y);

  if (c.temp >= ignitionTemp[Materials.OIL] && Math.random() < 0.2) {
    set(x, y, makeCell(Materials.FIRE, c.temp, 20));
    return;
  }

  set(x, y, c);
}

/*********************** ACIDE *************************/
function updateAcid(x, y, c) {
  const dirs = [
    [x, y + 1], [x, y - 1],
    [x - 1, y], [x + 1, y]
  ];

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;

    if (n.mat !== Materials.EMPTY && n.mat !== Materials.ACID && n.mat !== Materials.GAS) {
      if (n.mat === Materials.METAL || n.mat === Materials.METAL_MOLTEN) {
        set(nx, ny, makeCell(Materials.GAS, 80, 50));
      } else if (n.mat === Materials.LIFE || n.mat === Materials.PLANT || n.mat === Materials.WOOD) {
        set(nx, ny, makeCell(Materials.SMOKE, 60, 30));
      } else {
        set(nx, ny, makeCell());
      }

      c.life--;
      if (c.life <= 0) {
        set(x, y, makeCell());
        return;
      }
    }
  }

  swapIfLessDense(x, y, x, y + 1);
}

/*********************** METAL *************************/
function updateMetal(x, y, c) {
  if (c.temp > meltTemp[Materials.METAL]) {
    set(x, y, makeCell(Materials.METAL_MOLTEN, c.temp + 50));
  } else {
    set(x, y, c);
  }
}

/******************* METAL FONDU **********************/
function updateMetalMolten(x, y, c) {
  if (Math.random() < 0.3) swapIfLessDense(x, y, x, y + 1);
  if (Math.random() < 0.1) swapIfLessDense(x, y, x + (Math.random() < 0.5 ? -1 : 1), y);

  c.temp -= 0.4;
  if (c.temp <= 400) {
    set(x, y, makeCell(Materials.METAL, 300));
  } else {
    set(x, y, c);
  }
}

/*********************** GLACE *************************/
function updateIce(x, y, c) {
  if (c.temp > meltTemp[Materials.ICE]) {
    set(x, y, makeCell(Materials.WATER, 10));
    return;
  }

  if (swapIfLessDense(x, y, x, y + 1)) return;

  set(x, y, c);
}

/*********************** GAZ ***************************/
function updateGas(x, y, c) {
  c.life--;
  if (c.life <= 0) {
    set(x, y, makeCell());
    return;
  }

  if (moveIfEmpty(x, y, x, y - 1)) return;

  if (Math.random() < 0.6) {
    moveIfEmpty(x, y, x + (Math.random() < 0.5 ? -1 : 1), y - 1);
  }
}

/********************* EXPLOSIF ************************/
function updateExplosive(x, y, c) {
  if (c.temp > 200 || c.life <= 0) {
    explode(x, y, 6);
    return;
  }

  set(x, y, c);
}

/*********************** VIE ***************************/
function updateLife(x, y, c) {
  c.life = (c.life || 200) - 1;

  if (c.life <= 0 || c.temp > 120) {
    set(x, y, makeCell(Materials.SMOKE, 60, 20));
    return;
  }

  const below = get(x, y + 1);

  if (below && (below.mat === Materials.LAVA || below.mat === Materials.FIRE || below.mat === Materials.ACID)) {
    moveIfEmpty(x, y, x, y - 1);
  } else {
    const dir = Math.random() < 0.5 ? -1 : 1;
    if (!moveIfEmpty(x, y, x + dir, y)) {
      moveIfEmpty(x, y, x, y + 1);
    }
  }

  if (Math.random() < 0.002) {
    const nx = x + (Math.random() < 0.5 ? -1 : 1);
    const ny = y + (Math.random() < 0.5 ? -1 : 1);

    if (inBounds(nx, ny) && get(nx, ny).mat === Materials.EMPTY) {
      set(nx, ny, makeCell(Materials.LIFE, c.temp, 200));
    }
  }

  set(x, y, c);
}

/*********************** PLANTE ************************/
function updatePlant(x, y, c) {
  const below = get(x, y + 1);

  if (below && below.mat === Materials.WATER && c.temp < 60 && Math.random() < 0.02) {
    const nx = x + (Math.random() < 0.5 ? -1 : 1);
    const ny = y - 1;

    if (inBounds(nx, ny) && get(nx, ny).mat === Materials.EMPTY) {
      set(nx, ny, makeCell(Materials.PLANT, c.temp, 300));
    }
  }

  if (c.temp > ignitionTemp[Materials.PLANT]) {
    set(x, y, makeCell(Materials.FIRE, 300, 20));
    return;
  }

  set(x, y, c);
}

/*********************** BOIS **************************/
function updateWood(x, y, c) {
  if (c.temp > ignitionTemp[Materials.WOOD]) {
    set(x, y, makeCell(Materials.FIRE, c.temp, 25));
    return;
  }

  const above = get(x, y - 1);

  if (above && above.mat === Materials.SMOKE && above.temp > 150 && Math.random() < 0.05) {
    set(x, y, makeCell(Materials.FIRE, 250, 20));
    return;
  }

  set(x, y, c);
}

/*********************** BOMBE *************************/
function updateBomb(x, y, c) {
  c.life = c.life || 999;

  if (c.temp > 150 || c.life <= 0) {
    explode(x, y, 8);
    return;
  }

  const dirs = [
    [x, y - 1], [x, y + 1],
    [x - 1, y], [x + 1, y]
  ];

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;

    if (n.mat === Materials.SPARK || (n.mat === Materials.WIRE && n.life > 0)) {
      explode(x, y, 8);
      return;
    }
  }

  set(x, y, c);
}

/*********************** NUKE **************************/
function updateNuke(x, y, c) {
  c.life = c.life || 999;

  if (c.temp > 150 || c.life <= 0) {
    explodeNuke(x, y, 16);
    return;
  }

  const dirs = [
    [x, y - 1], [x, y + 1],
    [x - 1, y], [x + 1, y]
  ];

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;

    if (n.mat === Materials.SPARK || (n.mat === Materials.WIRE && n.life > 0)) {
      explodeNuke(x, y, 16);
      return;
    }
  }

  set(x, y, c);
}
/******************************************************
 *  PARTIE 3/6 : Tir, lance-flammes, explosions
 ******************************************************/

/*********************** TIR (SHOT) ***************************/
function updateShot(x, y, c) {
  const dir = c.vx || 1;
  const nx = x + dir;
  const ny = y;

  if (!inBounds(nx, ny)) {
    set(x, y, makeCell());
    return;
  }

  const target = get(nx, ny);
  if (!target) {
    set(x, y, makeCell());
    return;
  }

  // Matériaux traversables
  const traversable =
    target.mat === Materials.EMPTY ||
    target.mat === Materials.SMOKE ||
    target.mat === Materials.STEAM ||
    target.mat === Materials.GAS;

  if (traversable) {
    set(nx, ny, makeCell(Materials.SHOT, c.temp, c.life - 1, 0, dir, 0));
    set(x, y, makeCell());
    return;
  }

  // Matériaux mous → le tir s'arrête
  const soft =
    target.mat === Materials.SAND ||
    target.mat === Materials.WATER ||
    target.mat === Materials.OIL ||
    target.mat === Materials.PLANT ||
    target.mat === Materials.LIFE ||
    target.mat === Materials.ICE ||
    target.mat === Materials.WOOD;

  if (soft) {
    set(x, y, makeCell());
    return;
  }

  // Matériaux solides → petite explosion
  const solid =
    target.mat === Materials.STONE ||
    target.mat === Materials.METAL ||
    target.mat === Materials.METAL_MOLTEN ||
    target.mat === Materials.LAVA ||
    target.mat === Materials.ACID;

  if (solid) {
    explode(x, y, 6);
    set(x, y, makeCell());
    return;
  }

  // Explosifs
  if (target.mat === Materials.EXPLOSIVE || target.mat === Materials.BOMB) {
    explode(nx, ny, 12);
    set(x, y, makeCell());
    return;
  }

  if (target.mat === Materials.NUKE) {
    explodeNuke(nx, ny, 20);
    set(x, y, makeCell());
    return;
  }

  // Par défaut : disparaît
  set(x, y, makeCell());
}

/*********************** LANCE-FLAMMES ***************************/
function updateFlameJet(x, y, c) {
  c.life--;
  if (c.life <= 0) {
    set(x, y, makeCell(Materials.SMOKE, 60, 15));
    return;
  }

  const nx = x + c.vx;
  const ny = y + c.vy;

  if (!inBounds(nx, ny)) {
    set(x, y, makeCell());
    return;
  }

  const target = get(nx, ny);
  if (!target) {
    set(x, y, makeCell());
    return;
  }

  // Chauffe très fort
  target.temp = (target.temp || 20) + 80;
  set(nx, ny, target);

  // Enflamme matériaux combustibles
  if (
    target.mat === Materials.WOOD ||
    target.mat === Materials.PLANT ||
    target.mat === Materials.OIL
  ) {
    set(nx, ny, makeCell(Materials.FIRE, 350, 25));
    set(x, y, makeCell());
    return;
  }

  // Avance dans les matériaux traversables
  if (
    target.mat === Materials.EMPTY ||
    target.mat === Materials.SMOKE ||
    target.mat === Materials.STEAM ||
    target.mat === Materials.GAS
  ) {
    const jet = makeCell(Materials.FLAME_JET, c.temp, c.life, 0, c.vx, c.vy);
    jet.vy += (Math.random() - 0.5) * 0.2; // dispersion réaliste
    set(nx, ny, jet);
    set(x, y, makeCell());
    return;
  }

  // Impact sur matériau solide → mini explosion thermique
  explode(x, y, 3);
  set(x, y, makeCell());
}

/*********************** EXPLOSION SIMPLE ***************************/
function explode(cx, cy, radius) {
  const maxRadius = radius;

  for (let dy = -maxRadius; dy <= maxRadius; dy++) {
    for (let dx = -maxRadius; dx <= maxRadius; dx++) {
      const x = cx + dx;
      const y = cy + dy;

      if (!inBounds(x, y)) continue;

      const dist2 = dx * dx + dy * dy;
      if (dist2 > maxRadius * maxRadius) continue;

      const dist = Math.sqrt(dist2);
      const power = 1 - dist / maxRadius;

      if (power > 0.7) {
        set(x, y, makeCell(Materials.EMPTY));
      } else if (power > 0.3) {
        set(x, y, makeCell(Materials.FIRE, 200, 8));
      } else {
        if (Math.random() < 0.3) {
          set(x, y, makeCell(Materials.SMOKE, 80, 20));
        }
      }
    }
  }
}

/*********************** EXPLOSION NUKE ***************************/
function explodeNuke(cx, cy, radius) {
  const maxRadius = radius;

  for (let dy = -maxRadius; dy <= maxRadius; dy++) {
    for (let dx = -maxRadius; dx <= maxRadius; dx++) {
      const x = cx + dx;
      const y = cy + dy;

      if (!inBounds(x, y)) continue;

      const dist2 = dx * dx + dy * dy;
      if (dist2 > maxRadius * maxRadius) continue;

      const dist = Math.sqrt(dist2);
      const power = 1 - dist / maxRadius;

      if (power > 0.8) {
        set(x, y, makeCell(Materials.FIRE, 800, 15));
      } else if (power > 0.4) {
        set(x, y, makeCell(Materials.FIRE, 400, 10));
      } else {
        if (Math.random() < 0.4) {
          set(x, y, makeCell(Materials.GAS, 200, 40));
        }
      }
    }
  }
}
/******************************************************
 *  PARTIE 4/6 : Rendu, boucle, input, peinture
 ******************************************************/

/******************* COULEURS DYNAMIQUES **************/
function colorWithTemp(mat, temp) {
  let base = baseColors[mat] || "#000000";
  let r = parseInt(base.slice(1, 3), 16);
  let g = parseInt(base.slice(3, 5), 16);
  let b = parseInt(base.slice(5, 7), 16);

  // Chauffe → rouge/orange
  if (temp > 100) {
    const t = Math.min((temp - 100) / 800, 1);
    r = Math.min(255, r + 200 * t);
    g = Math.max(0, g - 100 * t);
    b = Math.max(0, b - 150 * t);
  }

  // Froid → bleu
  if (temp < 0) {
    const t = Math.min(-temp / 100, 1);
    b = Math.min(255, b + 150 * t);
    g = Math.min(255, g + 50 * t);
  }

  return [r, g, b];
}

/******************* RENDU *****************************/
function render() {
  const img = ctx.getImageData(0, 0, W * SCALE, H * SCALE);
  const data = img.data;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = grid[idx(x, y)];
      const [r, g, b] = colorWithTemp(c.mat, c.temp);

      for (let dy = 0; dy < SCALE; dy++) {
        for (let dx = 0; dx < SCALE; dx++) {
          const px = x * SCALE + dx;
          const py = y * SCALE + dy;
          const i = (py * W * SCALE + px) * 4;

          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(img, 0, 0);
}

/******************* BOUCLE ****************************/
function step() {
  for (let i = 0; i < nextGrid.length; i++) {
    nextGrid[i] = makeCell();
  }

  for (let y = H - 1; y >= 0; y--) {
    for (let x = 0; x < W; x++) {
      const c = get(x, y);
      if (c && c.mat !== Materials.EMPTY) {
        updateCell(x, y);
      }
    }
  }

  for (let i = 0; i < grid.length; i++) {
    grid[i] = nextGrid[i];
  }

  // Arcs électriques
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      electricArc(x, y);
    }
  }
}


function loop() {
  step();
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

/******************* INPUT / TOOLBAR *******************/
let currentMat = Materials.SAND;
let drawing = false;
let lastMouseEvent = null;

const toolbar = document.getElementById("toolbar");

toolbar.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const matName = btn.dataset.mat;

  if (matName === "ERASE") {
    currentMat = "ERASE";
  } else if (Materials[matName] !== undefined) {
    currentMat = Materials[matName];
  }

  for (const b of toolbar.querySelectorAll("button[data-mat]")) {
    b.classList.toggle("active", b === btn);
  }
});

document.getElementById("clear").addEventListener("click", () => {
  for (let i = 0; i < grid.length; i++) {
    grid[i] = makeCell();
  }
});

/******************* CLIC CONTINU **********************/
setInterval(() => {
  if (drawing && lastMouseEvent) {
    paint(lastMouseEvent);
  }
}, 16); // ~60 FPS

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  lastMouseEvent = e;
  paint(e);
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mouseleave", () => {
  drawing = false;
});

canvas.addEventListener("mousemove", (e) => {
  lastMouseEvent = e;
  if (drawing) paint(e);
});

/******************* PEINTURE **************************/
function paint(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / SCALE);
  const y = Math.floor((e.clientY - rect.top) / SCALE);
  const radius = 3;

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const px = x + dx;
      const py = y + dy;

      if (!inBounds(px, py)) continue;
      if (dx * dx + dy * dy > radius * radius) continue;

      if (currentMat === "ERASE") {
        grid[idx(px, py)] = makeCell();
        continue;
      }

      let cell = makeCell(currentMat, 20, 40);

      // Températures spéciales
      if (currentMat === Materials.LAVA) cell.temp = 900;
      if (currentMat === Materials.FIRE) { cell.temp = 400; cell.life = 25; }
      if (currentMat === Materials.METAL_MOLTEN) cell.temp = 900;
      if (currentMat === Materials.ICE) cell.temp = -20;
      if (currentMat === Materials.GAS) { cell.temp = 50; cell.life = 80; }
      if (currentMat === Materials.EXPLOSIVE) cell.life = 999;
      if (currentMat === Materials.BOMB) cell.life = 999;
      if (currentMat === Materials.NUKE) cell.life = 999;
      if (currentMat === Materials.LIFE) { cell.temp = 37; cell.life = 200; }
      if (currentMat === Materials.PLANT) cell.life = 300;
      if (currentMat === Materials.WOOD) cell.life = 999;

      // Tir
      if (currentMat === Materials.SHOT) {
        cell.temp = 100;
        cell.life = 10;
        cell.vx = 1;
      }

      // Lance-flammes
      if (currentMat === Materials.FLAME_JET) {
        cell.temp = 500;
        cell.life = 8;
        cell.vx = 1;
        cell.vy = (Math.random() - 0.5) * 0.5;
      }

      // Électricité
      if (currentMat === Materials.WIRE) cell.life = 0;
      if (currentMat === Materials.SWITCH) cell.life = 0;
      if (currentMat === Materials.BATTERY) cell.life = 0;
      if (currentMat === Materials.SPARK) { cell.temp = 200; cell.life = 3; }

      grid[idx(px, py)] = cell;
    }
  }
}
/******************************************************
 *  PARTIE 5/6 : Électricité avancée
 ******************************************************/

/******************* PROPAGATION ÉLECTRIQUE ************/
function propagateElectricity(x, y, c) {
  if (conductivity[c.mat] <= 0) return;

  const dirs = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];

  let powered = false;

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;

    if (n.mat === Materials.SPARK) powered = true;
    if (n.mat === Materials.WIRE && n.life > 0) powered = true;
    if (n.mat === Materials.SWITCH && n.life > 0) powered = true;
    if (n.mat === Materials.BATTERY && n.life > 0) powered = true;
  }

  if (!powered) return;

  // Le matériau reçoit du courant
  c.temp += 5;

  // Chance de créer une étincelle (réduite pour éviter les nuages)
  if (Math.random() < conductivity[c.mat] * 0.05) {
    const [nx, ny] = dirs[Math.floor(Math.random() * 4)];
    if (inBounds(nx, ny)) {
      const n = get(nx, ny);
      if (n.mat === Materials.EMPTY || n.mat === Materials.SMOKE) {
        set(nx, ny, makeCell(Materials.SPARK, c.temp + 50, 2));
      }
    }
  }

  set(x, y, c);
}

/******************* WIRE (FIL ÉLECTRIQUE) ************/
function updateWire(x, y, c) {
  c.life = Math.max(0, (c.life || 0) - 1);

  let powered = false;

  const dirs = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;

    if (n.mat === Materials.SPARK) powered = true;
    if (n.mat === Materials.SWITCH && n.life > 0) powered = true;
    if (n.mat === Materials.BATTERY && n.life > 0) powered = true;
  }

  if (powered) {
    c.life = 4; // durée courte = pas de boucle infinie
    c.temp += 3;
  }

  set(x, y, c);
}

/******************* SPARK (ÉTINCELLE) ****************/
function updateSpark(x, y, c) {
  c.life--;
  if (c.life <= 0) {
    set(x, y, makeCell());
    return;
  }

  // Déclenche bombes et explosifs
  const dirs = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;

    if (n.mat === Materials.BOMB || n.mat === Materials.EXPLOSIVE) {
      explode(nx, ny, 8);
      set(x, y, makeCell());
      return;
    }

    if (n.mat === Materials.NUKE) {
      explodeNuke(nx, ny, 16);
      set(x, y, makeCell());
      return;
    }
  }

  // Déplacement contrôlé (pas de duplication)
  const nx = x + (Math.random() < 0.5 ? -1 : 1);
  const ny = y + (Math.random() < 0.5 ? -1 : 1);

  if (inBounds(nx, ny) && get(nx, ny).mat === Materials.EMPTY) {
    set(nx, ny, makeCell(Materials.SPARK, c.temp, c.life));
    set(x, y, makeCell());
  } else {
    set(x, y, makeCell());
  }
}

/******************* SWITCH (INTERRUPTEUR) ************/
function updateSwitch(x, y, c) {
  // c.life = 0 → OFF
  // c.life = 1 → ON

  // Activation par chaleur
  if (c.temp > 50) c.life = 1;

  set(x, y, c);
}

/******************* BATTERY (BATTERIE) ***************/
function updateBattery(x, y, c) {
  // c.life = charge (0 à 100)

  const dirs = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];

  let powered = false;

  for (const [nx, ny] of dirs) {
    const n = get(nx, ny);
    if (!n) continue;

    if (n.mat === Materials.WIRE && n.life > 0) powered = true;
    if (n.mat === Materials.SPARK) powered = true;
  }

  // Recharge
  if (powered) {
    c.life = Math.min(100, c.life + 2);
    c.temp += 2;
  }

  // Décharge brutale
  if (c.life >= 100) {
    for (const [nx, ny] of dirs) {
      if (inBounds(nx, ny)) {
        set(nx, ny, makeCell(Materials.SPARK, c.temp + 100, 3));
      }
    }
    c.life = 0;
    c.temp += 50;
  }

  set(x, y, c);
}

/******************* ARCS ÉLECTRIQUES ******************/
function electricArc(x, y) {
  const left = get(x - 1, y);
  const right = get(x + 1, y);

  if (!left || !right) return;

  if (
    conductivity[left.mat] > 0.5 &&
    conductivity[right.mat] > 0.5 &&
    get(x, y).mat === Materials.EMPTY
  ) {
    if (Math.random() < 0.03) { // arcs rares
      set(x, y, makeCell(Materials.SPARK, 150, 2));
    }
  }
}
/******************************************************
 *  PARTIE 6/6 : Intégration finale du moteur électrique
 ******************************************************/

// On complète updateCell pour inclure les matériaux électriques
const oldUpdateCell = updateCell;
updateCell = function (x, y) {
  const c = get(x, y);
  if (!c) return;

  // Copie par défaut
  set(x, y, c);

  // Conduction thermique
  if (c.mat !== Materials.EMPTY) {
    thermalConduction(x, y, c);
  }

  // Propagation électrique avancée
  propagateElectricity(x, y, c);

  // Dispatch complet
  switch (c.mat) {
    case Materials.WIRE: updateWire(x, y, c); break;
    case Materials.SPARK: updateSpark(x, y, c); break;
    case Materials.SWITCH: updateSwitch(x, y, c); break;
    case Materials.BATTERY: updateBattery(x, y, c); break;

    default:
      oldUpdateCell(x, y);
      break;
  }
};

// Ajout des arcs électriques dans la boucle principale
const oldStep = step;
step = function () {
  oldStep();

  // Arcs électriques entre conducteurs
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      electricArc(x, y);
    }
  }
};
