
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (err) {
      console.error('Login Error:', err.message);
      res.status(500).json({ message: 'Login failed' });
    }
  });
  
  
  router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashed });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (err) {
      console.error('Register Error:', err.message);
      res.status(500).json({ message: 'Registration failed' });
    }
  });
  

router.get('/create-test-user', async (req, res) => {
  const email = 'test@mail.com';
  const plainPassword = 'test123';

  const existing = await User.findOne({ email });
  if (existing) return res.json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(plainPassword, 10);
  const user = await User.create({ email, password: hashed });
  res.json({ message: 'Test user created', user });
});


  

module.exports = router;
