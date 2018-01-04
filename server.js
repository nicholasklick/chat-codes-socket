const _ = require('underscore');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3030;

io.on('connection', function(socket) {
  const defaultRoom = 'general';
  socket.join(defaultRoom);

  socket.on('join-room', function(room, uid){
    socket.join(room);
    console.log(uid + ' joined ' + room);
  });

  socket.on('leave-room', function(room, uid){
    socket.leave(room);
    console.log(uid + ' left ' + room);
  });

  socket.on('send-message', function(room, message, event){
    socket.to(room).emit(event, message);
  });

});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});