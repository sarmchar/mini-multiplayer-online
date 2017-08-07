'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
const socketio = require('socket.io');
const chalk = require('chalk');
const pkg = require('./package.json');
const PORT = process.env.PORT || 8081;

if (process.env.NODE_ENV !== 'production') {
  // Logging middleware (non-production only)
  app.use(require('volleyball'));
}

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets')); //use path.resolve or join

app.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, function(){
  console.log(chalk.magenta(`--- Started HTTP Server for ${pkg.name} ---`));
  console.log(chalk.cyan('Listening on port', PORT));
});

server.gameState = 'ready';
server.userID = 0;
server.lastPlayerID = 0; // all player IDs
server.starId = 0;
server.playerList = 0; //number of current players
server.spectatorList = 0;
server.time = 60;
let io  = socketio.listen(server);

io.on('connect', function(socket){
    socket.on('newplayer', function(){ //generate a new player on new connection
      console.log(chalk.cyan('A client has connected :)'));
        //emit initial gamestate to new socket
        socket.emit('gamestate', server.gameState);
        //emit player list to new socket
        socket.emit('allplayers', getAllPlayers());

        if (server.playerList < 4 && server.gameState === 'ready'){ //add new player
          server.playerList++;
          let number = (server.lastPlayerID % 4) + 1;
          let x = 200 * (number - 1) + 100;
          socket.player = {
            id: server.lastPlayerID++,
            x: x,
            y: 300,
            score: 0,
            number: number,
            // userID: server.userID++
          };
          io.emit('newplayer', socket.player);
          socket.emit('user', socket.player.id, socket.player.score);
        } else { //add new spectator
           // socket.emit('spectator', serverID++);
        }

        socket.on('toggle_game', function(){
          if (server.gameState === 'ready') {
            server.gameState = 'play';
            io.emit('toggle_game', server.gameState);
          }
           else if (server.gameState === 'play'){ server.gameState = 'pause';
            io.emit('toggle_game', server.gameState);
          }
          else if (server.gameState === 'pause'){
            server.gameState = 'play';
            io.emit('toggle_game', server.gameState);
          } else if (server.gameState === 'end'){
            server.gameState = 'ready';
            io.emit('toggle_game', server.gameState);
            io.emit('reset');
          }
        });

        socket.on('dispatch_star', function(){
          io.emit('render_star', server.starId, randomInt(0, 980), randomBounce());
          server.starId++;
        });
        socket.on('collect_star', function(star, id){
          io.emit('remove_star', star, id);
        });
        socket.on('go_left', function(){
          io.emit('move_left', socket.player.id);
        });
        socket.on('go_right', function(){
          io.emit('move_right', socket.player.id);
        });
        socket.on('go_stop', function(){
          io.emit('move_stop', socket.player.id);
        });
        socket.on('go_up', function(){
          io.emit('move_up', socket.player.id);
        });
        socket.on('go_down', function(){
          io.emit('move_down', socket.player.id);
        });

        socket.on('end_game', function(winner){
          io.emit('winner', winner);
          server.gameState = 'end';
        });

        socket.on('disconnect', function(){
          io.emit('remove', socket.player.id);
          console.log(chalk.cyan('a client has disconnected :('));
          });
      });


});



function getAllPlayers(){ //get all player objects from open sockets
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function randomBounce(){
  // return 0.7 + Math.random() * 0.2;
  return 1.0; //exteme bounce
}

