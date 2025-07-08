const express = require('express');
const Task = require('../models/task');
const Log = require('../models/log');
const smartAssign = require('../utils/smartassign');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  const { title, description, priority, status } = req.body;

  
  const conflict = await Task.findOne({ title });
  if (['Todo', 'In Progress', 'Done'].includes(title) || conflict) {
    return res.status(400).json({ message: 'Invalid or duplicate title' });
  }

  const assignedTo = await smartAssign();

  const task = await Task.create({ title, description, priority, status, assignedTo });
  await Log.create({ user: req.user._id, action: `Created task "${title}"`, task: task._id });

  req.io.emit('task_created', task);
  res.json(task);
});

router.get('/', async (req, res) => {
  const tasks = await Task.find().populate('assignedTo');
  res.json(tasks);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  
  if (update.updatedAt && new Date(update.updatedAt).getTime() !== task.updatedAt.getTime()) {
    return res.status(409).json({ message: 'Conflict detected', current: task });
  }

  Object.assign(task, update, { updatedAt: new Date() });
  await task.save();
  await Log.create({ user: req.user._id, action: `Updated task "${task.title}"`, task: task._id });

  req.io.emit('task_updated', task);
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    await Log.create({ user: req.user._id, action: `Deleted task "${task.title}"`, task: task._id });
    req.io.emit('task_deleted', task._id);
  }
  res.json({ success: true });
});

module.exports = router;
