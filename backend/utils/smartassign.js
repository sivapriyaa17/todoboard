const Task = require('../models/task');
const User = require('../models/User');

module.exports = async () => {
  const users = await User.find();
  const scores = await Promise.all(users.map(async user => {
    const count = await Task.countDocuments({
      assignedTo: user._id,
      status: { $in: ['Todo', 'In Progress'] }
    });
    return { user, count };
  }));
  const min = Math.min(...scores.map(s => s.count));
  return scores.find(s => s.count === min).user;
};

