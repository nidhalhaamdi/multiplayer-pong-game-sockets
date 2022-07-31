let readyPlayerCount = 0;

function listen(io) {
    const pongNamespace = io.of('/pong');

    pongNamespace.on('connection', (socket) => {
        let room;
        
        console.log('a user connected', socket.id);
      
        socket.on('ready', () => {
          // room name : word 'room' followed by the number of the room
          let room = 'room' + Math.floor(readyPlayerCount/2);
          socket.join(room)
          
          console.log('Player ready', socket.id, room);
      
          readyPlayerCount++;
          // we want an even amount of players
          if (readyPlayerCount % 2 === 0) {
            pongNamespace.in(room).emit('startGame', socket.id); // broadcast to all clients connected to the room
          }
        });
      
        socket.on('paddleMove', (paddleData) => {
          socket.to(room).emit('paddleMove', paddleData); // broadcast to all clients except the sender!
        });
      
        socket.on('ballMove', (ballData) => {
          socket.to(room).emit('ballMove', ballData);
        });
      
        socket.on('disconnect', (reason) => {
          console.log(`Client ${socket.id} disconnected: ${reason}`);
          socket.leave(room);
        });
    });
}

module.exports = {
    listen,
};