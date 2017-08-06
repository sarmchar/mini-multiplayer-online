// //Setup game

// var Game = {};

// var players;
// var platforms;
// var cursors;
// var player;
// var playerId;
// var stars; //make these properties of game??
// var scoreText;
// var score = 0;

// Game.init = function(){

// };

// Game.preload = function() {
//   game.stage.disableVisibilityChange = true;
//     game.load.image('sky', 'assets/sky.png');
//     game.load.image('ground', 'assets/platform.png');
//     game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
//     game.load.image('star', 'assets/star.png');
//     game.load.atlasJSONHash('redbot', 'assets/redbot.png', 'assets/running_bot.json');
//     game.load.atlasJSONHash('yellowbot', 'assets/yellowbot.png', 'assets/running_bot.json');
//     game.load.atlasJSONHash('greenbot', 'assets/greenbot.png', 'assets/running_bot.json');
//     game.load.atlasJSONHash('purplebot', 'assets/purplebot.png', 'assets/running_bot.json');
// };

// Game.create = function(){

//   Game.playerMap = {};
//   // Game.stars = game.add.group();
//   // Game.stars.enableBody = true;

//   var map = game.add.sprite(0, 0, 'sky');
//   map.inputEnabled = true;
//   map.scale.x = 1000;

//   game.add.text(700, 0, 'Collect the Stars!', {fontSize: '32px', fill: '#FFF '});

//     // s = game.add.sprite(game.world.centerX, game.world.centerY, 'bot');
//     // s.anchor.setTo(0.5, 0.5);
//     // s.scale.setTo(1, 1);
//     // // s.scale.x *= -1;
//     // // s.scale.x *= -1;
//     // // s.frame = 2;

//     // s.animations.add('run');
//     // s.animations.play()

//     // game.physics.arcade.enable(s);
//     // s.body.bounce.y = 0.2;
//     // s.body.gravity.y = 300;
//     // s.body.collideWorldBounds = true;
//     // s.animations.add('left', [0, 1, 2, 3], 10, true);
//     // s.animations.add('right', [5, 6, 7, 8], 10, true);
//     // s.animations.play('run', 10, true);

//   // platforms = game.add.group();
//   // platforms.enableBody = true;
//   // var ground = platforms.create(0, game.world.height - 64, 'ground');
//   // ground.scale.x = 800;
//   // ground.scale.y = 32;
//   // ground.body.immovable = true;

//   scoreText = game.add.text(16, 0,  'score: 0', {fontSize: '32px', fill: '#FFF '});

//   cursors = game.input.keyboard.createCursorKeys();

//   stars = game.add.group();
//   stars.enableBody = true;

//   players = game.add.group();
//   players.enableBody = true;
//   players.physicsBodyType = Phaser.Physics.ARCADE;

//   // game.time.events.repeat(Phaser.Timer.SECOND*3, Infinity, createStar, this);


//   Client.askNewPlayer();
// };

// Game.update = function(){
//   game.physics.arcade.collide(players, platforms);
//   game.physics.arcade.collide(players, players);

//   //, playerCollision, null, this)
//   game.physics.arcade.collide(stars, platforms);
//   game.physics.arcade.overlap(players, stars, collectStar, null, this);

//   if (player) {
//     player.body.velocity.x = 0;
//     if (cursors.left.isDown) Client.goLeft();
//     else if (cursors.right.isDown) Client.goRight();
//     else Client.stop();

//     if (cursors.up.isDown){ Client.goUp(); }
//     else if (cursors.down.isDown){ Client.goDown(); }
//   }
// };

// //Player handlers
// Game.getPlayerId = function(id, score){
//   player = Game.playerMap[Number(id)];
//   playerId = id;
//   console.log(score);
// };
// Game.addNewPlayer = function(id, x, y){
//     let newPlayer;
//      if ( id % 4 === 0) newPlayer = players.create(x, y, 'redbot');
//     if ( id % 4 === 1) newPlayer = players.create(x, y, 'yellowbot');
//     if ( id % 4 === 2) newPlayer = players.create(x, y, 'purplebot');
//     if ( id % 4 === 3) newPlayer = players.create(x, y, 'greenbot');
//     newPlayer.anchor.setTo(0.5, 0.5);
//     newPlayer.frame = 2;
//     game.physics.arcade.enable(newPlayer);
//     newPlayer.body.bounce.y = 0.2;
//     newPlayer.body.gravity.y = 300;
//     newPlayer.body.collideWorldBounds = true;
//     newPlayer.animations.add('run');
//     // newPlayer.animations.add('left', [0, 1, 2, 3], 10, true);
//     // newPlayer.animations.add('right', [5, 6, 7, 8], 10, true);
//     Game.playerMap[id] = newPlayer;
// };
// Game.removePlayer = function(id){
//   Game.playerMap[id].destroy(); //destroy and delete?
//   delete Game.playerMap[id];
// };

// // Movement handlers
// Game.moveLeft = function(id){
//   let p = Game.playerMap[id];
//   p.body.velocity.x = -300;
//   p.scale.x = 1;
//   p.animations.play('run', 10, true);
// };
// Game.moveRight = function(id){
//   let p = Game.playerMap[id];
//   p.body.velocity.x = 300;
//   p.scale.x = -1;
//   p.animations.play('run', 10, true);
// };
// Game.stop = function(id){
//   let p = Game.playerMap[id];
//   p.body.velocity.x = 0;
//   p.animations.stop();
//   p.frame = 2;
// }
// Game.moveUp = function(id){
//   let p = Game.playerMap[id];
//   p.body.velocity.y = -250;
// };
// Game.moveDown = function(id){
//   let p = Game.playerMap[id];
//   p.body.velocity.x = 250;
// };

// Game.renderStar = function(x, bounce) {
//   var star = stars.create(x, 0, 'star');
//   game.physics.enable(star, Phaser.Physics.ARCADE);
//   star.body.gravity.y = 50;
//   star.body.bounce.y = bounce;
//   star.body.collideWorldBounds = true;
// }
// Game.killStar = function(star){

// }

// function createStar(){
//   let x = game.world.randomX;
//   let bounce = 0.7 + Math.random() * 0.2;
//   Client.dispatchStar(x, bounce);
// }

// function collectStar(player, star){
//   star.kill();
//   score +=10;
//   scoreText.text = 'Player ' + playerId + 'score: ' + score;
// }

// // function playerCollision(p1, p2){
// //   let xdiff = p2.position.x - p1.position.x;
// //   let ydiff = p2.position.y - p1.position.y;
// //   console.log(Math.floor(xdiff), Math.floor(ydiff));

// //   p1.body.velocity.x = xdiff*10;
// //   p1.body.velocity.y = ydiff > 0 ? ydiff : 0;

// // }





