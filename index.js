var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/room_a', function(req, res) {
  res.sendFile(__dirname + '/room_a.html');
});

app.get('/room_b', function(req, res) {
  res.sendFile(__dirname + '/room_b.html');
});

io.on('connection', function(socket) {
  var room = socket.handshake.query.id
  console.log('join', room);
  socket.join(room);

  socket.on('disconnect', function() {
    socket.leave(room)
    console.log('leave', room);
  });

  socket.on('message', function(msg) {
    console.log('send', msg, 'to', room);
    io.to(room).emit('message', msg);
  });
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
