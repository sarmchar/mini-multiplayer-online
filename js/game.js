//Setup game

var Game = {};

var gameState; //ready, play, pause
var players; //player groups
var platforms; //platform group
var cursors;
var player; //the player for this specific socket
var playerId; //that player's id
var stars; //star group
var button; //button
var buttonText; //button text
var starLoop;

Game.preload = function() {
  game.stage.disableVisibilityChange = true;
  game.load.image('sky', 'assets/sky.png');
  game.load.image('sidebar', 'assets/platform.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.image('star', 'assets/star.png');
  game.load.atlasJSONHash('redbot', 'assets/redbot.png', 'assets/running_bot.json');
  game.load.atlasJSONHash('yellowbot', 'assets/yellowbot.png', 'assets/running_bot.json');
  game.load.atlasJSONHash('greenbot', 'assets/greenbot.png', 'assets/running_bot.json');
  game.load.atlasJSONHash('purplebot', 'assets/purplebot.png', 'assets/running_bot.json');
  game.load.image('button', 'assets/play.png');
};

Game.create = function(){
  Game.playerMap = {};
  Game.playerScore = {};
  Game.starMap = {};

  //create background
  var map = game.add.sprite(0, 0, 'sky');
  map.inputEnabled = true;
  map.scale.x = 1000;

  //create sidebar
  platforms = game.add.group();
  platforms.enableBody = true;
  var sidebar = platforms.create(1000, 0, 'sidebar');
  sidebar.scale.x = 200;
  sidebar.scale.y = 600;
  sidebar.body.immovable = true;

  //create score
  scoreText = game.add.text(1010, 0,  'Score:', {fontSize: '20px', fill: '#FFF '});

  //create button
  button = game.add.button(1010, 570, 'button', toggleGame, this);
  game.add.sprite(1010, 570, 'star');
  buttonText = game.add.text(1035, 570, 'Start!', {fontSize: '20px', fill: '#FFF'});

  //Star group
  stars = game.add.group();
  stars.enableBody = true;
  // stars.physicsBodyType = Phaser.Physics.ARCADE;

  // Player group
  players = game.add.group();
  players.enableBody = true;
  // players.physicsBodyType = Phaser.Physics.ARCADE;

  Client.askNewPlayer();

  // init input keys
  cursors = game.input.keyboard.createCursorKeys();

  //unpause the game
  game.input.onDown.add(unpause, self);
  function unpause(event){
    if (game.paused) game.paused = false;
  }
};

Game.update = function(){
  game.physics.arcade.collide(players, platforms);
  game.physics.arcade.collide(players, players);

  //, playerCollision, null, this)
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.overlap(players, stars, collectStar, null, this);

  if (player && gameState === 'play') {
    player.body.velocity.x = 0;
    if (cursors.left.isDown){ Client.goLeft(); }
    else if (cursors.right.isDown) Client.goRight();
    else Client.stop();

    if (cursors.up.isDown){ Client.goUp(); }
    else if (cursors.down.isDown){ Client.goDown(); }
  }
};

// set game state
Game.gameState = function(state){
  gameState = state;
};

//Player handlers
Game.getPlayerId = function(id, score){
  player = Game.playerMap[Number(id)];
  playerId = id;
  console.log('get player by id', id);
};
Game.addNewPlayer = function(id, x, y){
    let newPlayer;
    if ( id % 4 === 0) { //Player 1
      newPlayer = players.create(x, y, 'redbot');
      Game.playerScore[id] =  game.add.text(1010, 50,  '0', {fontSize: '20px', fill: '#F00 '});
    }
    if ( id % 4 === 1){ //Player 2
      newPlayer = players.create(x, y, 'yellowbot');
      Game.playerScore[id] =  game.add.text(1010, 100,  '0', {fontSize: '20px', fill: '#FF0 '});
    }
    if ( id % 4 === 2){ //Player 3
      newPlayer = players.create(x, y, 'purplebot');
      Game.playerScore[id] =  game.add.text(1010, 150,  '0', {fontSize: '20px', fill: '#6f00ff '});
    }
    if ( id % 4 === 3) { //Player 4
      newPlayer = players.create(x, y, 'greenbot');
      Game.playerScore[id] =  game.add.text(1010, 200,  '0', {fontSize: '20px', fill: '#0F0 '});
    }
    newPlayer.anchor.setTo(0.5, 0.5);
    newPlayer.frame = 2;

    Game.playerMap[id] = newPlayer;
};

Game.removePlayer = function(id){
  Game.playerMap[id].destroy(); //destroy and delete?
  delete Game.playerMap[id];
};

// Movement handlers
Game.moveLeft = function(id){
  let p = Game.playerMap[id];
  p.body.velocity.x = -300;
  p.scale.x = 1;
  p.animations.play('run', 10, true);
};
Game.moveRight = function(id){
  let p = Game.playerMap[id];
  p.body.velocity.x = 300;
  p.scale.x = -1;
  p.animations.play('run', 10, true);
};
Game.stop = function(id){
  let p = Game.playerMap[id];
  p.body.velocity.x = 0;
  p.animations.stop();
  p.frame = 2;
}
Game.moveUp = function(id){
  let p = Game.playerMap[id];
  p.body.velocity.y = -250;
};
Game.moveDown = function(id){
  let p = Game.playerMap[id];
  p.body.velocity.x = 250;
};

// Star Handlers
Game.renderStar = function(id, x, bounce) {
  var star = stars.create(x, 0, 'star');
  star.id = id;
  game.physics.enable(star, Phaser.Physics.ARCADE);
  star.body.gravity.y = 100;
  star.body.bounce.y = bounce;
  star.body.collideWorldBounds = true;
  Game.starMap[id] = star;
};
Game.removeStar = function(starId, id){
  Game.starMap[starId].destroy();
  delete Game.starMap[starId];
  let newScore = Number(Game.playerScore[id].text) + 10;
  Game.playerScore[id].text = ''  + newScore;
};

//Start game
Game.toggleGame = function(state){
  gameState = state;
  if (state === 'play') {
    for (id in Game.playerMap){ //give each character physics properties
    let playr = Game.playerMap[id];
    game.physics.arcade.enable(playr);
    playr.body.bounce.y = 0.2;
    playr.body.gravity.y = 300;
    playr.body.collideWorldBounds = true;
    playr.animations.add('run');
  }
  starLoop = game.time.events.loop(Phaser.Timer.SECOND, createStar, this);
  buttonText.text = 'Pause';
  }
  if (state === 'pause'){
    game.time.events.remove(starLoop);
    buttonText.text = 'Play';
    game.paused = true;
  }

};

function createStar(){
  Client.dispatchStar();
}
function collectStar(player, star){
 Client.collectStar(star.id, playerId);
}
function toggleGame(){
  Client.toggleGame();
}

// function playerCollision(p1, p2){
//   let xdiff = p2.position.x - p1.position.x;
//   let ydiff = p2.position.y - p1.position.y;
//   console.log(Math.floor(xdiff), Math.floor(ydiff));

//   p1.body.velocity.x = xdiff*10;
//   p1.body.velocity.y = ydiff > 0 ? ydiff : 0;

// }





