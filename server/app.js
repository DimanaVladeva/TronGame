'use strict';

const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { envConfig } = require('./env')
const Player = require('./player');
const Game = require('./game');

app.use("/scripts", express.static(path.join(__dirname, '../public/scripts')));
app.use("/css", express.static(path.join(__dirname, '../public/css')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

http.listen(envConfig.port, () => {
	console.log(`Listening to connections on *:${envConfig.port}`);
});

io.on('connection', (socket) => {
	console.log('New player connection!', socket.id);

	socket.on('joinGame', onJoinGame(socket));
	socket.on('handleInput', onHandleInput(socket));
	socket.on('disconnect', onDisconnect(socket));
});

const createPlayer = (socketID, username, x, y, color) =>
	new Player(socketID, username, x, y, color)
const game = new Game(createPlayer);

const onJoinGame = (socket) => (username) => {
	game.addPlayer(socket, username);
}

const onHandleInput = (socket) => (input) => {
	game.handleInput(socket, input);
}

const onDisconnect = (socket) => () => {
	game.removePlayer(socket);
}