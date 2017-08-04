'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socet.io').listen(server);
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
  res.sendFile(__dirname+'index.html');
});

server.listen(8081, function(){
  console.log(chalk.magenta(`--- Started HTTP Server for ${pkg.name} ---`));
  console.log(chalk.cyan('Listening on port 8081!'));
});
