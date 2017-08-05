'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const chalk = require('chalk');
const pkg = require('./package.json');

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

server.listen(8081, function(){
  console.log(chalk.magenta(`--- Started HTTP Server for ${pkg.name} ---`));
  console.log(chalk.cyan('Listening on port 8081!'));
});


server.lastPlayerID = 0;

io.on('connection', function(socket){
    socket.on('newplayer', function(){ //generate a new player on new connection
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(0, 750),
            y: 0
        };
        socket.emit('allplayers', getAllPlayers()); //emit player list to new player
        socket.emit('user', socket.player.id);


        socket.broadcast.emit('newplayer', socket.player); //emit new player to all players

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

          socket.on('disconnect', function(){
          io.emit('remove', socket.player.id);
          });
      });

    socket.on('dispatch_star', function(x, bounce){
      io.emit('render_star', x, bounce);
    })
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
