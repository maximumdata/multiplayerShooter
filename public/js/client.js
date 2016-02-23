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
      this.step = 5;
      this.w = 20;
      this.h = 20;
    },
    players = [],
    myPlayer;

canvas.height = height;
canvas.width = width;


// create a new player
function newPlayer(data) {
  myPlayer = new Player(10,30, '#00FF00', 'test', data.id);
  players.push(myPlayer);
}

// drawing functions
function drawPlayers() {
  players.forEach(function (thisPlayer) {
    context.fillStyle = thisPlayer.color;
    context.fillRect(thisPlayer.x, thisPlayer.y, thisPlayer.w, thisPlayer.h);
  });
}

(function draw() {
  context.clearRect(0,0,width,height);
  drawPlayers();
  setTimeout(draw, 10);
})();

// debug
window.addEventListener('keyup', function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  if(key === 87 || key === 38) {
    // move up if w or up arrow
    myPlayer.y -=  myPlayer.step;
  }
  if(key === 65 || key === 37) {
    //move left if a or left arrow
    myPlayer.x -=  myPlayer.step;
  }
  if(key === 83 || key === 40) {
    // move down if s or down arrow
    myPlayer.y +=  myPlayer.step;
  }
  if(key === 68 || key === 39) {
    // move right if d or right arrow
    myPlayer.x += myPlayer.step;
  }
});

/* keycodes
w = 87; upArrow = 38
a = 65; leftArrow = 37
s = 83; downArrow = 40
d = 68; rightArrow = 39
*/





var socket = io.connect('/');

socket.on('onconnected', function (data) {
  console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
  newPlayer(data);
});

socket.on('playerMovement', function (data) {
  console.log(data);
});
