var socket = io.connect('http://localhost:4004');
// game vars
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    height = window.innerHeight,
    width = window.innerWidth,
    Player = function(x, y, color, name, id) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.name = name;
      this.id = id;

      //defaults
      this.step = 10;
      this.w = 20;
      this.h = 20;

      this.move = function(dir) {
        switch(dir) {
          case 'up':
            if(this.y > this.h - this.step) {
              this.y -= this.step;
            }
            break;
          case 'right':
            if(this.x < width - (this.w + this.step)) {
              this.x += this.step;
            }
            break;
          case 'down':
            if(this.y < width - (this.h + this.step)) {
              this.y += this.step;
            }
            break;
          case 'left':
            if(this.x > this.w - this.step) {
              this.x -= this.step;
            }
            break;
        }
        socket.emit('playerMoved', myPlayer);
      };
    },
    players = [],
    myPlayer = {};

canvas.height = height;
canvas.width = width;


// create a new player
function newPlayer(data) {

}

// drawing functions
function drawPlayers() {
  players.forEach(function (thisPlayer) {
    if(thisPlayer.id != myPlayer.id) {
      context.fillStyle = thisPlayer.color;
      context.fillRect(thisPlayer.x, thisPlayer.y, thisPlayer.w, thisPlayer.h);
    }
  });
}

function drawMe() {
  context.fillStyle = myPlayer.color;
  context.fillRect(myPlayer.x, myPlayer.y, myPlayer.w, myPlayer.h);
}

(function draw() {
  context.clearRect(0,0,width,height);
  drawMe();
  drawPlayers();
  requestAnimationFrame(draw);
})();


// debug
window.addEventListener('keydown', function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  if(key === 87 || key === 38) {
    // move up if w or up arrow
    myPlayer.move('up');
  }
  if(key === 65 || key === 37) {
    //move left if a or left arrow
    myPlayer.move('left');
  }
  if(key === 83 || key === 40) {
    // move down if s or down arrow
    myPlayer.move('down');
  }
  if(key === 68 || key === 39) {
    // move right if d or right arrow
    myPlayer.move('right');
  }

});

/* keycodes
w = 87; upArrow = 38
a = 65; leftArrow = 37
s = 83; downArrow = 40
d = 68; rightArrow = 39
*/

socket.on('onconnected', function (data) {
  console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
  myPlayer = new Player(data.x, data.y, data.color, 'test', data.id);
  socket.on('playerMovement', function (data) {
    players.find(function(player, index, array){
      if(player.id == data.id) {
        player.x = data.x;
        player.y = data.y;
      }
    });
  });

  socket.on('getPlayersFromServer', function(playersFromServer) {
    players = playersFromServer;
  });

  socket.on('updateListOfUserIDs', function(listOfIDs) {
    updateDomIDs(listOfIDs);
  });
});

function updateDomIDs(listOfIDs) {
  var outputString = '';
  for(var i = 0; i < players.length; i++) {
    outputString += 'User ID: ' + players[i].id + '\nLoc: x - '+players[i].x+', y - '+players[i].y+'\n\n';
  }
  document.getElementById('clients').innerText = outputString;
}
