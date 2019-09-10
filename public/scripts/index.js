'use strict';

const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 1000;

const socket = io();

const startGameMenu = document.getElementById('start-game-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('playername-input');
const game = document.getElementById('game');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
const info = document.getElementById('game-options');
const playerInfo = document.getElementById('player-info');
const retryButton = document.getElementById('retry-button');

playButton.addEventListener("click", () => {
    gameCanvas.width = CANVAS_WIDTH;
    gameCanvas.height = CANVAS_HEIGHT;

    socket.emit("joinGame", usernameInput.value);

    socket.on('gameStart', startPlaying);
    socket.on('gameUpdate', processGameUpdate);
    socket.on('gameOver', processGameOver);
});

retryButton.addEventListener("click", () => {
    updateGameView(true);
});

const startPlaying = (state) => {
    updateGameView(false);
    updateGameInfo(state.me);

    window.addEventListener("keydown", (event) => {
        socket.emit("handleInput", { key: event.key, code: event.keyCode })
    });

    processGameUpdate(state);
    draw(state.me.data.points, state.me.data.color);
}

const processGameUpdate = (update) => {
    if (update == undefined) {
        return;
    }

    if (update.removed) {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

    if (update.active != undefined) {
        update.active.forEach(playerData => {
            draw(playerData.data.points, playerData.data.color);
        });
    }
}

const draw = (path, color) => {
    if (path.length <= 0) {
        return;
    }
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach((point) => {
        ctx.lineTo(point.x, point.y)
    })
    ctx.strokeStyle = color;
    ctx.stroke();
}

const updateGameView = (gameOver) => {
    if (gameOver) {
        game.classList.add('hidden');
        info.classList.add('hidden');
        startGameMenu.classList.remove('hidden');
    }
    else {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        game.classList.remove('hidden');
        info.classList.remove('hidden');
        startGameMenu.classList.add('hidden');
        retryButton.classList.add('hidden');
    }
}

const updateGameInfo = (state) => {
    let me = state.data;
    info.style.backgroundColor = me.color;
    playerInfo.innerHTML = `Playing as ${me.username}`;
}

const processGameOver = (state) => {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.font = '5em Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = state.color;
    ctx.fillText('GAME OVER', gameCanvas.width / 2, gameCanvas.height / 2);

    retryButton.classList.remove('hidden');
}