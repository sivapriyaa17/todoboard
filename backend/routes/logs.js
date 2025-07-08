const express = require('express');
const Log = require('../models/log');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(20).populate('user', 'email');
  res.json(logs);
});

module.exports = router;
