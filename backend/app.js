// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Debug log
console.log("🔗 Connecting to MongoDB URI:", process.env.MONGO_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => {
  console.error("❌ MongoDB connection error:");
  console.error(err);
});

app.use(cors({
  origin: "https://todoboard-pgz1.onrender.com", // Frontend Render URL
  credentials: true
}));

app.use(express.json());

// Inject io into every request (for logs or notifications)
app.use((req, res, next) => {
  req.io = app.get('io');
  next();
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/logs', require('./routes/logs'));

// Health check
app.get('/api/ping', (req, res) => res.send('pong'));

module.exports = app;
