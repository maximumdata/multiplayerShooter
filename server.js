var port = 4004,
    io = require('socket.io'),
    express = require('express'),
    shortid = require('shortid'),
    path = require('path'),
    http = require('http'),
    app = express(),
    WebSocketServer = require('ws').Server;


app.set('port', port);


app.get('/multi', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 3600000 }));



var server = http.createServer(app);
server.listen(port);

//var wss = new WebSocketServer({server: server});

var sio = io.listen(server);

var players = [];
var PlayerModel = function(id) {
  this.x = Math.floor(Math.random() * 200) + 20;
  this.y = Math.floor(Math.random() * 150) + 15;
  this.color = '#' + Math.random().toString(16).slice(2, 8); // thanks jennifer dewalt!
  this.id = id;
  this.w = 20;
  this.h = 20;
};

sio.sockets.on('connection', function (client) {
  client.userid = shortid.generate();
  console.log('\tsocket.io:: player ' + client.userid + ' connected');

  var newPlayerForClient = new PlayerModel(client.userid);

  players.push(newPlayerForClient);
  client.emit('onconnected', newPlayerForClient );

  sio.sockets.emit('getPlayersFromServer', players, getListOfUserIDsFromArray());

  client.on('disconnect', function() {
    for(var x = players.length -1; x>=0; x--) {
      if(players[x].id === client.userid) {
        players.splice(x, 1);
      }
    }
    sio.sockets.emit('getPlayersFromServer', players, getListOfUserIDsFromArray());
  });

  client.on('playerMoved', function(playerWhoMoved) {
    players[findIndexOfPlayerInArray(playerWhoMoved)] = playerWhoMoved;
    sio.sockets.emit('getPlayersFromServer', players, getListOfUserIDsFromArray());
  });
});


function findIndexOfPlayerInArray(player) {
  for(var i = players.length - 1; i>=0; i--) {
    if(players[i].id == player.id) {
      return i;
    }
  }
}

function getListOfUserIDsFromArray() {
  var array = [];
  for(var y = 0; y < players.length; y++) {
    array.push(players[y].id);
  }
  return array;
}
