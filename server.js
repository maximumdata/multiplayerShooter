var port = 4004,
    io = require('socket.io'),
    express = require('express'),
    UUID = require('node-uuid'),
    path = require('path'),
    http = require('http'),
    app = express();


app.set('port', port);


app.get('/', function (req, res) {
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

var sio = io.listen(server);



sio.sockets.on('connection', function (client) {
  client.userid = UUID();
  client.emit('onconnected', { id: client.userid } );

  console.log('\tsocket.io:: player ' + client.userid + ' connected');

  client.on('disconnect', function () {
    console.log('\tsocket.io:: client disconnected ' + client.userid );
  });
});
