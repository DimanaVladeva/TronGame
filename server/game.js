'use strict';

const randomColor = require('randomcolor');
const constants = require('./constants');
const { generateNextPoint } = require('./next-point-generator')

class Game {
    constructor(createPlayer) {
        this.sockets = {};
        this.players = {};
        this.removedPlayers = false;
        this.shouldSendUpdate = false;
        this.createPlayer = createPlayer;
        setInterval(this.update.bind(this), 50);
    }

    addPlayer(socket, username) {
        let others = [];
        Object.keys(this.players).forEach(playerID => {
            const player = this.players[playerID];
            others.push(this.getState(player));
        });

        // Generate a position to start this player at.
        const x = Math.floor(constants.CANVAS_WIDTH * (0.25 + Math.random() * 0.5));
        const y = Math.floor(constants.CANVAS_HEIGHT * (0.25 + Math.random() * 0.5));

        // Generate a random color for this player.
        const color = randomColor({
            luminosity: 'bright',
            format: 'rgb'
        });

        const newPlayer = this.createPlayer(socket.id, username, { x: x, y: y }, color, generateNextPoint);

        this.sockets[socket.id] = socket;
        this.players[socket.id] = newPlayer;

        socket.emit('gameStart', { me: this.getState(newPlayer), active: others });
    }

    removePlayer(socket, id) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
        this.removedPlayers = true;
    }

    handleInput(socket, input) {
        if (this.players[socket.id]) {
            this.players[socket.id].setDirection(input);
        }
    }

    update() {
        let playersToRemove = [];
        Object.keys(this.sockets).forEach(playerID => {
            const player = this.players[playerID];
            const nextPoint = player.getNextPoint();

            if (nextPoint != null) {
                if (!this.checkPointInGameBounds(nextPoint) ||
                    this.checkPointForLineCrossing(nextPoint)) {
                    const socket = this.sockets[playerID];
                    playersToRemove.push(socket);
                    socket.emit('gameOver', { color: player.color });
                }
                else {
                    player.addPoint(nextPoint);
                }
            }
        });

        playersToRemove.forEach(playerSocket => {
            this.removePlayer(playerSocket, playerSocket.id);
        })

        // Send a game update to each player
        if (this.shouldSendUpdate) {
            this.sendUpdates();
            this.shouldSendUpdate = false;
        }
        else {
            this.shouldSendUpdate = true;
        }
    }

    sendUpdates() {
        let activePlayers = [];
        Object.keys(this.players).forEach(playerID => {
            const player = this.players[playerID];
            if (this.removedPlayers) {
                activePlayers.push(this.getState(player));
            }
            else {
                activePlayers.push(this.createUpdate(player));
            }
        });

        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            socket.emit('gameUpdate', {
                active: activePlayers,
                removed: this.removedPlayers
            });
        });
    }

    checkPointInGameBounds(point) {
        if (point.x < 0 || point.x > constants.CANVAS_WIDTH - 1 ||
            point.y < 0 || point.y > constants.CANVAS_HEIGHT - 1) {
            return false;
        }

        return true;
    }

    checkPointForLineCrossing(point) {
        if (point == null) {
            return false;
        }

        let result = false;
        Object.keys(this.players).forEach(playerID => {
            const player = this.players[playerID];

            for (let i = 0; i < player.pathLines.length; i++) {
                const line = player.pathLines[i];
                if (line.start.x === line.end.x) {
                    if (point.x === line.start.x &&
                        point.y >= Math.min(line.start.y, line.end.y) &&
                        point.y <= Math.max(line.start.y, line.end.y)) {
                        result = true;
                        break;
                    }
                }
                else if (point.y === line.start.y &&
                    point.x >= Math.min(line.start.x, line.end.x) &&
                    point.x <= Math.max(line.start.x, line.end.x)) {
                    result = true;
                    break;
                }
            }
        });

        return result;
    }

    createUpdate(player) {
        return {
            data: player.createUpdateData(),
        };
    }

    getState(player) {
        return {
            data: player.createStateData(),
        };
    }
}

module.exports = Game;