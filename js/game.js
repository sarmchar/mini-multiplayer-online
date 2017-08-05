//Setup game

var Game = {};

var players;
var platforms;
var cursors;
var player;
var stars; //make these properties of game??
var score;

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('star', 'assets/star.png');
};

Game.create = function(){

  Game.playerMap = {};

  var map = game.add.sprite(0, 0, 'sky');
  map.inputEnabled = true;

  game.add.text(520, 500, 'Collect the Stars!', {fontSize: '32px', fill: '#FFF '});

  platforms = game.add.group();
  platforms.enableBody = true;
  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.x = 800;
  ground.scale.y = 32;
  ground.body.immovable = true;

  cursors = game.input.keyboard.createCursorKeys();

  stars = game.add.group();
  stars.enableBody = true;

  players = game.add.group();
  players.enableBody = true;
  players.physicsBodyType = Phaser.Physics.ARCADE;

  game.time.events.repeat(Phaser.Timer.SECOND, Infinity, createStar, this);


  Client.askNewPlayer();
};

Game.update = function(){
  game.physics.arcade.collide(players, platforms);
  game.physics.arcade.collide(players, players);
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.overlap(players, stars, collectStar, null, this);

  if (player) {
    player.body.velocity.x = 0;
    if (cursors.left.isDown) Client.goLeft();
    else if (cursors.right.isDown) Client.goRight();
    else Client.stop();

    if (cursors.up.isDown){ Client.goUp(); }
    else if (cursors.down.isDown){ Client.goDown(); }
  }
};

//Player handlers
Game.getPlayerId = function(id){
  player = Game.playerMap[Number(id)];
};
Game.addNewPlayer = function(id, x, y){
    let newPlayer = players.create(x, y, 'dude');
    game.physics.arcade.enable(newPlayer);
    newPlayer.body.bounce.y = 0.2;
    newPlayer.body.gravity.y = 300;
    newPlayer.body.collideWorldBounds = true;
    newPlayer.animations.add('left', [0, 1, 2, 3], 10, true);
    newPlayer.animations.add('right', [5, 6, 7, 8], 10, true);
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
  p.animations.play('left');
};
Game.moveRight = function(id){
  let p = Game.playerMap[id];
  p.body.velocity.x = 300;
  p.animations.play('right');
};
Game.stop = function(id){
  let p = Game.playerMap[id];
  p.body.velocity.x = 0;
  p.animations.stop();
  p.frame = 4;
}
Game.moveUp = function(id){
  let p = Game.playerMap[id];
  p.body.velocity.y = -250;
};
Game.moveDown = function(id){
  let p = Game.playerMap[id];
  p.body.velocity.x = 250;
};

Game.renderStar = function(x, bounce) {
  var star = stars.create(x, 0, 'star');
  game.physics.enable(star, Phaser.Physics.ARCADE);
  star.body.gravity.y = 50;
  star.body.bounce.y = bounce;
  star.body.collideWorldBounds = true;
}
Game.killStar = function(star){

}

function createStar(){
  let x = game.world.randomX;
  let bounce = 0.7 + Math.random() * 0.2;
  Client.dispatchStar(x, bounce);
}

function collectStar(player, star){

}





