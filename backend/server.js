// server.js
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const socketSetup = require('./sockets');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://todoboard-pgz1.onrender.com", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Inject io into app
app.set('io', io);

// Setup socket events
socketSetup(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
