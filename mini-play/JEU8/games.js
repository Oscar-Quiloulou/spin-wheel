const COLS = 10;
const ROWS = 20;
const BLOCK = 24;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.scale(BLOCK, BLOCK);

const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
nextCtx.scale(16, 16);

const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const statusEl = document.getElementById('status');

const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');

const COLORS = {
    I: '#00f0f0',
    J: '#0000f0',
    L: '#f0a000',
    O: '#f0f000',
    S: '#00f000',
    T: '#a000f0',
    Z: '#f00000'
};

const SHAPES = {
    I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    J: [[1,0,0],[1,1,1],[0,0,0]],
    L: [[0,0,1],[1,1,1],[0,0,0]],
    O: [[1,1],[1,1]],
    S: [[0,1,1],[1,1,0],[0,0,0]],
    T: [[0,1,0],[1,1,1],[0,0,0]],
    Z: [[1,1,0],[0,1,1],[0,0,0]]
};

function createMatrix(w, h) {
    const m = [];
    while (h--) m.push(new Array(w).fill(0));
    return m;
}

const arena = createMatrix(COLS, ROWS);

function drawCell(x, y, type, context = ctx) {
    const color = COLORS[type];
    const gradient = context.createLinearGradient(x, y, x, y + 1);
    gradient.addColorStop(0, "#ffffff33");
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, "#000000aa");
    context.fillStyle = gradient;
    context.fillRect(x, y, 1, 1);
    context.strokeStyle = "rgba(0,0,0,0.4)";
    context.strokeRect(x, y, 1, 1);
}

function drawMatrix(matrix, offset, type, context = ctx) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) drawCell(x + offset.x, y + offset.y, type, context);
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) arena[y + player.pos.y][x + player.pos.x] = player.type;
        });
    });
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] !== 0) {
                if (!arena[o.y + y] || arena[o.y + y][o.x + x] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) matrix.forEach(row => row.reverse());
    else matrix.reverse();
}

function arenaSweep() {
    let rowCount = 0;
    for (let y = arena.length - 1; y >= 0; --y) {
        if (arena[y].every(v => v !== 0)) {
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fillRect(0, y, COLS, 1);
            arena.splice(y, 1);
            arena.unshift(new Array(COLS).fill(0));
            rowCount++;
            y++;
        }
    }
    if (rowCount > 0) {
        player.score += [40, 100, 300, 1200][rowCount - 1] * player.level;
        player.lines += rowCount;
        if (player.lines >= player.level * 10) player.level++;
        updatePanel();
    }
}

function randomPiece() {
    const types = 'IJLOSTZ';
    const type = types[(types.length * Math.random()) | 0];
    return {
        matrix: SHAPES[type].map(r => r.slice()),
        type
    };
}

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    next: null,
    type: null,
    score: 0,
    level: 1,
    lines: 0
};

function playerReset() {
    if (!player.next) player.next = randomPiece();
    const piece = player.next;
    player.matrix = piece.matrix;
    player.type = piece.type;
    player.next = randomPiece();
    player.pos.y = 0;
    player.pos.x = (COLS / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        const finalScore = player.score;
        player.score = 0;
        player.level = 1;
        player.lines = 0;
        updatePanel();
        statusEl.textContent = 'Game Over';
        if (typeof showGameOver === 'function') {
            showGameOver(finalScore);
        }
    } else {
        statusEl.textContent = '';
    }

    updatePanel();
    drawNext();
}

function drawNext() {
    nextCtx.clearRect(0, 0, 5, 5);
    const m = player.next.matrix;
    const offset = { x: 2 - m[0].length / 2, y: 2 - m.length / 2 };
    drawMatrix(m, offset, player.next.type, nextCtx);
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        arenaSweep();
        playerReset();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) player.pos.x -= dir;
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function hardDrop() {
    while (!collide(arena, player)) player.pos.y++;
    player.pos.y--;
    merge(arena, player);
    arenaSweep();
    playerReset();
    dropCounter = 0;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let paused = false;

function updateSpeed() {
    dropInterval = Math.max(120, 1000 - (player.level - 1) * 80);
}

function update(time = 0) {
    const delta = time - lastTime;
    lastTime = time;

    if (!paused) {
        dropCounter += delta;
        if (dropCounter > dropInterval) playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, COLS, ROWS);

    arena.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) drawCell(x, y, value);
        });
    });

    if (player.matrix) drawMatrix(player.matrix, player.pos, player.type);
}

function updatePanel() {
    scoreEl.textContent = player.score;
    levelEl.textContent = player.level;
    linesEl.textContent = player.lines;
}

/* CLAVIER */
document.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') playerMove(-1);
    else if (e.code === 'ArrowRight') playerMove(1);
    else if (e.code === 'ArrowDown') playerDrop();
    else if (e.code === 'ArrowUp') playerRotate(1);
    else if (e.code === 'Space') { e.preventDefault(); hardDrop(); }
    else if (e.key === 'p' || e.key === 'P') togglePause();
});

/* TACTILE */
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (isTouch) {
    document.getElementById("touchControls").style.display = "flex";
    const bind = (id, action) => {
        document.getElementById(id).addEventListener("touchstart", e => {
            e.preventDefault();
            action();
        });
    };
    bind("btnLeft", () => playerMove(-1));
    bind("btnRight", () => playerMove(1));
    bind("btnRotate", () => playerRotate(1));
    bind("btnDrop", () => playerDrop());
    bind("btnHard", () => hardDrop());
}

/* START / PAUSE */
function startGame() {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    player.level = 1;
    player.lines = 0;
    updateSpeed();
    player.next = null;
    playerReset();
    paused = false;
    statusEl.textContent = '';
    updatePanel();
    if (typeof hideGameOver === 'function') hideGameOver();
}
window.startGame = startGame;

function togglePause() {
    paused = !paused;
    statusEl.textContent = paused ? 'Pause' : '';
}

btnStart.addEventListener('click', startGame);
btnPause.addEventListener('click', togglePause);

/* INIT */
playerReset();
updateSpeed();
update();
