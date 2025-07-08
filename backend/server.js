
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); 
const socketSetup = require('./sockets');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://todoboard-pgz1.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});


app.set('io', io);


socketSetup(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
