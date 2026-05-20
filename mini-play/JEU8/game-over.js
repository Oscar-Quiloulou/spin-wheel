function showGameOver(score) {
    const overlay = document.getElementById('gameOverOverlay');
    const scoreSpan = document.getElementById('goScore');
    scoreSpan.textContent = score;
    overlay.style.display = 'flex';
}

function hideGameOver() {
    const overlay = document.getElementById('gameOverOverlay');
    overlay.style.display = 'none';
}

document.getElementById('goRestart').addEventListener('click', () => {
    hideGameOver();
    if (window.startGame) {
        window.startGame();
    }
});
