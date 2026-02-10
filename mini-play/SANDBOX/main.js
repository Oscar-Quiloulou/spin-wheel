// --- Config grille ---
const W = 300;
const H = 200;
const SCALE = 3; // taille pixel à l'écran

const canvas = document.getElementById("canvas");
canvas.width = W * SCALE;
canvas.height = H * SCALE;
const ctx = canvas.getContext("2d");

// --- Matériaux ---
const Materials = {
  EMPTY: 0,
  SAND: 1,
  WATER: 2,
  LAVA: 3,
  STONE: 4,
  FIRE: 5,
  SMOKE: 6,
};

const matColors = {
  [Materials.EMPTY]: "#000000",
  [Materials.SAND]: "#d9c074",
  [Materials.WATER]: "#2f6fff",
  [Materials.LAVA]: "#ff6a00",
  [Materials.STONE]: "#777777",
  [Materials.FIRE]: "#ffdd55",
  [Materials.SMOKE]: "#555555",
};

// Chaque cellule : { mat, temp, life }
const grid = new Array(W * H);
const nextGrid = new Array(W * H);

function makeCell(mat = Materials.EMPTY, temp = 20, life = 0) {
  return { mat, temp, life };
}

function idx(x, y) {
  return y * W + x;
}

function inBounds(x, y) {
  return x >= 0 && x < W && y >= 0 && y < H;
}

function get(x, y) {
  if (!inBounds(x, y)) return makeCell(Materials.STONE, 20); // bord = pierre
  return grid[idx(x, y)];
}

function set(x, y, cell) {
  if (!inBounds(x, y)) return;
  nextGrid[idx(x, y)] = cell;
}

// swap helper (pour déplacer une particule)
function move(x1, y1, x2, y2) {
  if (!inBounds(x2, y2)) return false;
  const from = get(x1, y1);
  const to = get(x2, y2);
  if (to.mat === Materials.EMPTY) {
    set(x2, y2, from);
    set(x1, y1, makeCell());
    return true;
  }
  return false;
}

// écrase la destination (utile pour réactions)
function replace(x1, y1, x2, y2, newCellAt2, newCellAt1 = makeCell()) {
  if (!inBounds(x2, y2)) return false;
  set(x2, y2, newCellAt2);
  set(x1, y1, newCellAt1);
  return true;
}

// --- Init grille ---
for (let i = 0; i < grid.length; i++) {
  grid[i] = makeCell();
  nextGrid[i] = makeCell();
}

// --- Simulation ---

function updateCell(x, y) {
  const cell = get(x, y);
  const below = get(x, y + 1);

  // Par défaut, recopier si pas modifié
  set(x, y, cell);

  switch (cell.mat) {
    case Materials.SAND:
      updateSand(x, y, cell);
      break;
    case Materials.WATER:
      updateWater(x, y, cell);
      break;
    case Materials.LAVA:
      updateLava(x, y, cell);
      break;
    case Materials.STONE:
      updateStone(x, y, cell);
      break;
    case Materials.FIRE:
      updateFire(x, y, cell);
      break;
    case Materials.SMOKE:
      updateSmoke(x, y, cell);
      break;
  }
}

function updateSand(x, y, cell) {
  if (move(x, y, x, y + 1)) return;
  if (Math.random() < 0.5) {
    if (move(x, y, x - 1, y + 1)) return;
    if (move(x, y, x + 1, y + 1)) return;
  } else {
    if (move(x, y, x + 1, y + 1)) return;
    if (move(x, y, x - 1, y + 1)) return;
  }
}

function updateWater(x, y, cell) {
  if (move(x, y, x, y + 1)) return;
  if (Math.random() < 0.5) {
    if (move(x, y, x - 1, y)) return;
    if (move(x, y, x + 1, y)) return;
  } else {
    if (move(x, y, x + 1, y)) return;
    if (move(x, y, x - 1, y)) return;
  }
  if (move(x, y, x - 1, y + 1)) return;
  if (move(x, y, x + 1, y + 1)) return;
}

function updateLava(x, y, cell) {
  // mouvement lent
  if (Math.random() < 0.4) {
    if (move(x, y, x, y + 1)) return;
  }
  if (Math.random() < 0.3) {
    if (move(x, y, x + (Math.random() < 0.5 ? -1 : 1), y)) return;
  }

  // chauffe voisins + réactions
  const neighbors = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];
  for (const [nx, ny] of neighbors) {
    const n = get(nx, ny);
    if (n.mat === Materials.WATER) {
      // eau + lave -> pierre + fumée
      replace(x, y, nx, ny, makeCell(Materials.STONE, 200));
      // on laisse une fumée à la place de la lave
      set(x, y, makeCell(Materials.SMOKE, 150, 30));
      return;
    } else if (n.mat === Materials.SAND) {
      // sable + lave -> pierre chaude
      replace(nx, ny, nx, ny, makeCell(Materials.STONE, 300));
    } else if (n.mat === Materials.STONE) {
      // chauffe la pierre
      n.temp = Math.max(n.temp, cell.temp);
      set(nx, ny, n);
    }
  }

  // refroidissement lent -> pierre
  cell.temp -= 0.5;
  if (cell.temp <= 80) {
    set(x, y, makeCell(Materials.STONE, 80));
  } else {
    set(x, y, cell);
  }
}

function updateStone(x, y, cell) {
  // la pierre peut se refroidir
  if (cell.temp > 20) {
    cell.temp -= 0.1;
  }
  set(x, y, cell);
}

function updateFire(x, y, cell) {
  cell.life = (cell.life || 20) - 1;
  if (cell.life <= 0) {
    set(x, y, makeCell(Materials.SMOKE, 80, 30));
    return;
  }

  // se propage à matériaux combustibles (sable chaud, bois si tu ajoutes plus tard)
  const neighbors = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];
  for (const [nx, ny] of neighbors) {
    const n = get(nx, ny);
    if (n.mat === Materials.SAND && Math.random() < 0.02) {
      set(nx, ny, makeCell(Materials.FIRE, 200, 20));
    }
  }

  // monte un peu
  if (Math.random() < 0.4) {
    move(x, y, x, y - 1);
  } else {
    set(x, y, cell);
  }
}

function updateSmoke(x, y, cell) {
  cell.life = (cell.life || 40) - 1;
  if (cell.life <= 0) {
    set(x, y, makeCell());
    return;
  }
  // monte et se disperse
  if (move(x, y, x, y - 1)) return;
  if (Math.random() < 0.5) {
    if (move(x, y, x - 1, y - 1)) return;
    if (move(x, y, x + 1, y - 1)) return;
  } else {
    if (move(x, y, x + 1, y - 1)) return;
    if (move(x, y, x - 1, y - 1)) return;
  }
}

// --- Boucle principale ---
function step() {
  // reset nextGrid
  for (let i = 0; i < nextGrid.length; i++) {
    nextGrid[i] = makeCell();
  }

  // on parcourt de bas en haut pour la gravité
  for (let y = H - 1; y >= 0; y--) {
    for (let x = 0; x < W; x++) {
      const cell = get(x, y);
      if (cell.mat === Materials.EMPTY) {
        set(x, y, cell);
        continue;
      }
      updateCell(x, y);
    }
  }

  // swap
  for (let i = 0; i < grid.length; i++) {
    grid[i] = nextGrid[i];
  }
}

function render() {
  const img = ctx.getImageData(0, 0, W * SCALE, H * SCALE);
  const data = img.data;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const cell = grid[idx(x, y)];
      const color = matColors[cell.mat] || "#000000";
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

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

let last = performance.now();
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  // on peut utiliser dt plus tard pour adapter la vitesse
  step();
  render();

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// --- Input / pinceau ---
let currentMat = Materials.SAND;
let drawing = false;

const toolbar = document.getElementById("toolbar");
toolbar.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const matName = btn.dataset.mat;
  if (matName === "ERASE") {
    currentMat = "ERASE";
  } else if (matName && Materials[matName] !== undefined) {
    currentMat = Materials[matName];
  }
  // UI active
  for (const b of toolbar.querySelectorAll("button[data-mat]")) {
    b.classList.toggle("active", b === btn);
  }
});

document.getElementById("clear").addEventListener("click", () => {
  for (let i = 0; i < grid.length; i++) {
    grid[i] = makeCell();
  }
});

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  paint(e);
});
canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mouseleave", () => (drawing = false));
canvas.addEventListener("mousemove", (e) => {
  if (drawing) paint(e);
});

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
      } else {
        let cell = makeCell(currentMat, 20);
        if (currentMat === Materials.LAVA) cell.temp = 400;
        if (currentMat === Materials.FIRE) {
          cell.temp = 300;
          cell.life = 20;
        }
        if (currentMat === Materials.SMOKE) {
          cell.temp = 100;
          cell.life = 40;
        }
        grid[idx(px, py)] = cell;
      }
    }
  }
}
