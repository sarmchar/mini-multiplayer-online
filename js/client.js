//interface between server and game

var Client = {};
Client.socket = io.connect();

// Emit to socket from client

Client.askNewPlayer = function(){
  Client.socket.emit('newplayer');
};
Client.goLeft = function(){
  Client.socket.emit('go_left');
};
Client.goRight = function(){
  Client.socket.emit('go_right');
};
Client.stop = function(){
  Client.socket.emit('go_stop');
};
Client.goUp = function(){
  Client.socket.emit('go_up');
};
Client.goDown = function(){
  Client.socket.emit('go_down');
};
Client.dispatchStar = function(x, bounce){
  Client.socket.emit('dispatch_star', x, bounce);
};


// Exec function on reception from socket
Client.socket.on('newplayer', function(player){
  Game.addNewPlayer(player.id, player.x, player.y);
});

Client.socket.on('user', function(id){
    Game.getPlayerId(id);
});

Client.socket.on('render_star', function(x, bounce){
  Game.renderStar(x, bounce);
});

Client.socket.on('allplayers', function(playerList){
  console.log('Player List:', playerList);
  for(let i = 0; i < playerList.length; i++){
    let player = playerList[i];
    Game.addNewPlayer(player.id, player.x, player.y);
  }
  Client.socket.on('move_left', function(id){
    Game.moveLeft(id);
  });
  Client.socket.on('move_right', function(id){
    Game.moveRight(id);
  });
  Client.socket.on('move_stop', function(id){
    Game.stop(id);
  });
  Client.socket.on('move_up', function(id){
    Game.moveUp(id);
  });
  Client.socket.on('move_down', function(id){
    Game.moveDown(id);
  });
  Client.socket.on('remove', function(id){
    Game.removePlayer(id);
  });
});


