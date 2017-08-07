//interface between server and game

var Client = {};
Client.socket = io.connect();

// Emit to socket from client
Client.toggleGame = function(){
  Client.socket.emit('toggle_game');
}
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
Client.dispatchStar = function(){
  Client.socket.emit('dispatch_star');
};
Client.collectStar = function(star, id){
  Client.socket.emit('collect_star', star, id);
}


/* Exec function on reception from socket */

//Send initial game state to the client
Client.socket.on('gamestate', function(state){
  Game.gameState(state);
});
//create new player
Client.socket.on('newplayer', function(player){
  Game.addNewPlayer(player.id, player.x, player.y);
});
//initial client/player info
Client.socket.on('user', function(id, score){
  Game.getPlayerId(id, score);
});
// Togle game state
Client.socket.on('toggle_game', function(state){
  Game.toggleGame(state);
});

//Stars
Client.socket.on('render_star', function(id, x, bounce){
  Game.renderStar(id, x, bounce);
});
Client.socket.on('remove_star', function(star, id){
  Game.removeStar(star, id);
});

// add players
Client.socket.on('allplayers', function(playerList){
  console.log('Player List:', playerList);
  for(let i = 0; i < playerList.length; i++){
    let player = playerList[i];
    Game.addNewPlayer(player.id, player.x, player.y);
  }
  //Player movement
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


